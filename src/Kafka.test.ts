import Config from './Config';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { Observable } from './common-types';
import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import BidParams from './BidParams';
import DroneChargingBidParams from './drone-charging/BidParams';

describe('Kafka class', () => {
  let config: IConfig = new Config({ /*kafkaBrowserPollingInterval: 3000, kafkaBrowserRequestTimeout: 1000,
  kafkaSeedUrls: ['localhost:9092'], apiSeedUrls: ['localhost']*/ });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.useFakeTimers();
  });

  describe('createTopic method', () => {
    it('should create topic without errors when input is valid and no errors from kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const clientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], cb: (error: any, data: any) => any) => cb(null, null)),
        connect: jest.fn(),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);

      await expect(kafka.createTopic('topic', config)).resolves.toBeUndefined();

      expect(clientMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(clientMock.createTopics).toHaveBeenCalledWith(
        [{ topic: 'topic', partitions: 1, replicationFactor: 1 }], expect.any(Function));
      expect(clientMock.connect).toHaveBeenCalledTimes(1);
    });

    xit('should get error from client while trying to connect to kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const clientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb('Client got error in connection');
          }
        }),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);

      await expect(kafka.createTopic('topic', config)).rejects.toBe('Client got error in connection');
      expect(clientMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should get error from kafka in topic creation method', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaError = 'kafka error';
      const clientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], cb: (error: any, data: any) => any) => cb(kafkaError, null)),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);

      await expect(kafka.createTopic('topic', config)).rejects.toBe(kafkaError);
      expect(clientMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(clientMock.createTopics).toHaveBeenCalledWith(
        [{ topic: 'topic', partitions: 1, replicationFactor: 1 }], expect.any(Function));
    });
  });

  describe('sendParams method', () => {

    it('should send message to kafka without errors when input is valid and no errors from kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const content: any = {
        id: 1,
        price: 3,
        serialize: jest.fn(() => content),
      };
      const paramsMockType = jest.fn<BasicParams>(() => (content));
      const paramsMock = new paramsMockType();

      const clientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => cb()),
      };
      const producerMock = {
        send: jest.fn((payloads: Array<{ 'topic': string, messages: string }>, cb: (error: any, data: any) => any) => cb(null, null)),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).resolves.toBeUndefined();
      expect(clientMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{ topic: 'topic', messages: JSON.stringify(content) }], expect.any(Function));
    });

    xit('should get error from producer while trying to connect to kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        serialize: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const clientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb('Client got error in connection');
          }
        }),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).rejects.toBe('Client got error in connection');
      expect(clientMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should get error from kafka in send method', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const content: any = {
        id: 1,
        price: 3,
        serialize: jest.fn(() => content),
      };
      const paramsMockType = jest.fn<BasicParams>(() => (content));
      const paramsMock = new paramsMockType();

      const clientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => cb()),
      };
      const producerMock = {
        send: jest.fn((payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => cb('kafka error', null)),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => clientMock);
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).rejects.toBe('kafka error');
      expect(clientMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{ topic: 'topic', messages: JSON.stringify(content) }], expect.anything());
    });
  });

  describe('messages method', () => {

    xit('should get error from kafka client while trying to connect', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb('client got error in connection');
          }
        }),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      await expect(kafka.messages('topic', config)).rejects.toBe('client got error in connection');
      expect(kafkaClientMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    xit('should get message stream with one message when get valid input and no errors from kafka', async (done) => {
      jest.doMock('kafka-node');

      const kafkaClientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => cb()),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation((messageStream: Observable<IKafkaMessage>) => messageStream.subscribe((bid) => {
          expect(bid).toEqual({ type: 'bid', protocol: 'drone-charging', contents: jsonString });
          expect(kafkaClientMock.on).toBeCalledWith('ready', expect.anything());
          expect(consumerMock.on).toHaveBeenCalledWith('message', expect.anything());
          done();
          return {};
        })),
      }));

      const consumerMock = {
        on: jest.fn((state: string, cb: any) => {
          cb({ topic: 'topic', value: jsonString });
        }),
      };
      require('kafka-node').Consumer.mockImplementation(() => consumerMock);
      const kafka = (await import('./Kafka')).default;

      await kafka.messages('topic', config);
    });

    xit('should throw error due to parsing error', async (done) => {
      jest.doMock('kafka-node');

      const kafkaClientMock = {
        connect: jest.fn(),
        on: jest.fn((state: string, cb: any) => cb()),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const topic = 'topic';
      const jsonString = '{bad format}}';
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation((messageStream: Observable<IKafkaMessage>) => messageStream.subscribe(
          (bid) => {
            fail();
            done();
          },
          (error) => {
            const correctError = error.startsWith('error while trying to parse message.');
            expect(correctError).toBe(true);
            expect(kafkaClientMock.on).toHaveBeenCalledWith('ready', expect.anything());
            expect(consumerMock.on).toHaveBeenCalledWith('message', expect.anything());
            done();
          },
        )),
      }));

      const consumerMock = {
        on: jest.fn((state: string, cb: any) => cb({ topic, value: jsonString })),
      };
      require('kafka-node').Consumer.mockImplementation(() => consumerMock);
      const kafka = (await import('./Kafka')).default;

      await kafka.messages(topic, config);
    });
  });

  describe('browser implementation', () => {

    beforeAll(() => {
      config = { apiSeedUrls: ['testUrl'] };
      process.env = { BROWSER: 'true' };
    });

    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    describe('createTopic method', () => {

      it('should create topic without errors when input is valid', async () => {
        const postMock = jest.fn((url: string) => Promise.resolve({ status: 200 }));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.createTopic('testTopic', config)).resolves.toBeUndefined();
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/create/testTopic');
      });

      it('should fail to create topic due to error from api', async () => {
        const postMock = jest.fn((url: string) => Promise.resolve({ status: 500, data: { error: 'kafka error' } }));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.createTopic('testTopic', config)).rejects.toEqual('kafka error');
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/create/testTopic');
      });

      it('should fail to create topic due to network error', async () => {
        const postMock = jest.fn((url: string) => Promise.reject('net::ERR_CONNECTION_REFUSED'));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.createTopic('testTopic', config)).rejects.toEqual('net::ERR_CONNECTION_REFUSED');
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/create/testTopic');
      });
    });

    describe('sendParams method', () => {

      it('should send params without errors when input is valid', async () => {
        const paramsObject: any = {
          id: 1,
          price: 3,
          serialize: jest.fn(() => paramsObject),
        };
        const paramsMockType = jest.fn<BasicParams>(() => (paramsObject));
        const paramsMock = new paramsMockType();

        const postMock = jest.fn((url: string, content: string, conf: any) => Promise.resolve({ status: 200 }));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).resolves.toBeUndefined();
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/publish/testTopic', JSON.stringify(paramsObject), expect.anything());
      });

      it('should fail to send params due to error from api', async () => {
        const paramsObject: any = {
          id: 1,
          price: 3,
          serialize: jest.fn(() => paramsObject),
        };
        const paramsMockType = jest.fn<BasicParams>(() => (paramsObject));
        const paramsMock = new paramsMockType();

        const postMock = jest.fn((url: string, conf: any) => Promise.resolve({ status: 500, data: { error: 'kafka error' } }));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).rejects.toBe('kafka error');
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/publish/testTopic', JSON.stringify(paramsObject), expect.anything());
      });

      it('should fail to send params due to network error', async () => {
        const paramsObject: any = {
          id: 1,
          price: 3,
          serialize: jest.fn(() => paramsObject),
        };
        const paramsMockType = jest.fn<BasicParams>(() => (paramsObject));
        const paramsMock = new paramsMockType();

        const postMock = jest.fn((url: string, conf: any) => Promise.reject('net::ERR_CONNECTION_REFUSED'));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).rejects.toBe('net::ERR_CONNECTION_REFUSED');
        expect(postMock).toHaveBeenCalledWith('http://testUrl/topic/publish/testTopic', JSON.stringify(paramsObject), expect.anything());
      });
    });

    describe('messages method', () => {

      it('should get message stream with one message when get valid input and no errors', async (done) => {
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const jsonString = JSON.stringify(jsonObject);

        const getMock = jest.fn((url: string, conf: any) => Promise.resolve({ status: 200, data: [jsonString] }));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));

        jest.doMock('./KafkaMessageStream', () => ({
          default: jest.fn().mockImplementation((messageStream: Observable<IKafkaMessage>) => messageStream.subscribe((bid) => {
            expect(bid).toEqual({ type: 'bid', protocol: 'drone-charging', contents: jsonString });
            expect(getMock).toHaveBeenCalledTimes(1);
            done();
            return {};
          })),
        }));

        const kafka = (await import('./Kafka')).default;

        await kafka.messages('testTopic', config);
      });

      xit('should get message stream with two messages in one get call when get valid input and no errors', async () => {
        jest.doMock('./drone-charging/BidParams');
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const secondJsonObject = { protocol: 'drone-charging', type: 'bid', price: '62' };
        const jsonString = JSON.stringify([jsonObject, secondJsonObject]);

        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => secondJsonObject).mockReturnValueOnce(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({ status: 200, data: jsonString }));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const observable: Observable<BasicParams> = null; // await kafka.messages('testTopic', config);
        const messageArray: any[] = [];
        let counter = 0;
        const messages = await new Promise((resolve, reject) => {
          observable.subscribe(
            (next) => {
              messageArray.push(next);
              counter++;
              if (counter === 2) {
                resolve(messageArray);
              }
            },
            (error) => reject(error),
          );
        });
        expect(messages).toEqual([jsonObject, secondJsonObject]);
        expect(getMock).toHaveBeenCalledWith('http://testUrl/topic/consume/testTopic');
      });

      xit('should get message stream with two messages in two get calls when get valid input and no errors', async () => {
        jest.useRealTimers();
        jest.doMock('./drone-charging/BidParams');
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const secondJsonObject = { protocol: 'drone-charging', type: 'bid', price: '62' };
        const secondJsonString = JSON.stringify([secondJsonObject]);
        const jsonString = JSON.stringify([jsonObject]);

        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => secondJsonObject).mockReturnValueOnce(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({ status: 200, data: secondJsonString }))
          .mockReturnValueOnce(Promise.resolve({ status: 200, data: jsonString }));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const observable: Observable<BasicParams> = null; // await kafka.paramsStream('testTopic', config);
        const messageArray: any[] = [];
        let counter = 0;
        const messages = await new Promise((resolve, reject) => {
          observable.subscribe(
            (next) => {
              messageArray.push(next);
              counter++;
              if (counter === 2) {
                resolve(messageArray);
              }
            },
            (error) => reject(error),
          );
        });
        expect(messages).toEqual([jsonObject, secondJsonObject]);
        expect(getMock).toHaveBeenCalledWith('http://testUrl/topic/consume/testTopic');
        expect(getMock).toHaveBeenCalledTimes(2);
      });

      it('should throw error due to network error', async (done) => {
        jest.doMock('./KafkaMessageStream', () => ({
          default: jest.fn().mockImplementation((messageStream: Observable<IKafkaMessage>) => messageStream.subscribe(
            (bid) => {
              fail();
              done();
            },
            (error) => {
              expect(error).toBe('net::ERR_CONNECTION_REFUSED');
              done();
            },
          )),
        }));

        const getMock = jest.fn((url: string, content: string) => Promise.reject('net::ERR_CONNECTION_REFUSED'));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await kafka.messages('testTopic', config);
      });

      it('should throw error due to bad response from api', async (done) => {

        jest.doMock('./KafkaMessageStream', () => ({
          default: jest.fn().mockImplementation((messageStream: Observable<IKafkaMessage>) => messageStream.subscribe(
            (bid) => {
              fail();
              done();
            },
            (error) => {
              expect(error).toBe('internal error');
              done();
            },
          )),
        }));

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({ status: 500, data: { error: 'internal error' } }));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await kafka.messages('testTopic', config);
      });
    });
  });
});
