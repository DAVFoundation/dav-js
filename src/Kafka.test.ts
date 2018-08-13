import Config from './Config';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { TimeoutError } from 'promise-timeout';
import { Observable } from './common-types';

describe('Kafka class', () => {
  let config: IConfig = new Config({ kafkaPollingInterval: 1000 });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.unmock('promise-timeout');
  });

  describe('createTopic method', () => {

    it('should create topic without errors when input is valid and no errors from kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => cb(null, null)),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.createTopic('topic', config)).resolves.toBeUndefined();

      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.createTopics).toHaveBeenCalledWith(['topic'], expect.any(Boolean), expect.any(Function));
    });

    it('should get connection timeout', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producerMock = {
        on: jest.fn((state: string, cb: any) => {
          return;
        }),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      const promise = kafka.createTopic('topic', config);
      jest.runAllTimers();

      await expect(promise).rejects.toEqual(new TimeoutError());
      expect(producerMock.on).toHaveBeenCalled();
    });

    it('should get error from producer while trying to connect to kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producerMock = {
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        }),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.createTopic('topic', config)).rejects.toBe('Producer got error in connection');
      expect(producerMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should get error from kafka in topic creation method', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaError = 'kafka error';
      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => cb(kafkaError, null)),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.createTopic('topic', config)).rejects.toBe(kafkaError);
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.createTopics).toHaveBeenCalledWith(['topic'], expect.any(Boolean), expect.any(Function));
    });

    it('should get timeout in topic creation method', async () => {
      jest.doMock('kafka-node');
      const producer = {
        on: jest.fn((state: string, cb: any) => cb()),
        createTopics: jest.fn((topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          return;
        }),
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producer);

      const timeoutMock = jest.fn().mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const kafka = (await import('./Kafka')).default;

      await expect(kafka.createTopic('topic', config)).rejects.toEqual(new TimeoutError());
      expect(timeoutMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendParams method', () => {

    it('should send message to kafka without errors when input is valid and no errors from kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ 'topic': string, messages: string }>, cb: (error: any, data: any) => any) => cb(null, null)),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).resolves.toBeUndefined();
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{ topic: 'topic', messages: 'basic params mock content' }], expect.any(Function));
    });

    it('should get connection timeout', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producerMock = {
        on: jest.fn((state: string, cb: any) => {
          return;
        }),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      const promise = kafka.sendParams(topic, paramsMock, config);
      jest.runAllTimers();

      await expect(promise).rejects.toEqual(new TimeoutError());
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
    });

    it('should get error from producer while trying to connect to kafka', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const producerMock = {
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        }),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).rejects.toBe('Producer got error in connection');
      expect(producerMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should get error from kafka in send method', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => cb('kafka error', null)),
      };
      require('kafka-node').Producer.mockImplementation(() => producerMock);

      await expect(kafka.sendParams('topic', paramsMock, config)).rejects.toBe('kafka error');
      expect(producerMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(producerMock.send).toHaveBeenCalledWith([{topic: 'topic', messages: 'basic params mock content'}], expect.anything());
    });

    it('should get timeout in send method', async () => {
      jest.doMock('kafka-node');
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const producerMock = {
        on: jest.fn((state: string, cb: any) => cb()),
        send: jest.fn((payloads: Array<{ 'topic': string, messages: string }>, cb: (error: any, data: any) => any) => {
          return;
        }),
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producerMock);

      const timeoutMock = jest.fn().mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const kafka = (await import('./Kafka')).default;

      await expect(kafka.sendParams('topic', paramsMock, config)).rejects.toEqual(new TimeoutError());
      expect(timeoutMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('paramsStream method', () => {

    it('should get connection timeout', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        on: jest.fn((state: string, cb: any) => {
          return;
        }),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const streamPromise: Observable<BasicParams> = kafka.paramsStream('topic', config);
      jest.runAllTimers();

      await expect(streamPromise).rejects.toEqual(new TimeoutError());
      expect(kafkaClientMock.on).toHaveBeenCalledWith('ready', expect.anything());
    });

    it('should get error from kafka client while trying to connect', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        on: jest.fn((state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        }),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      await expect(kafka.paramsStream('topic', config)).rejects.toBe('client got error in connection');
      expect(kafkaClientMock.on).toHaveBeenCalledWith('error', expect.anything());
    });

    it('should get message stream with one message when get valid input and no errors from kafka', async () => {
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      const fromJsonVerifiable = jest.fn((jsonStringParam: string) => jsonObject);
      require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

      const consumerMock = {
        on: jest.fn((state: string, cb: any) => {
          cb({ topic: 'topic', value: jsonString });
        }),
      };
      require('kafka-node').Consumer.mockImplementation(() => consumerMock);

      const stream: Observable<BasicParams> = await kafka.paramsStream('topic', config);
      const message = await new Promise<any> ((resolve, reject) => {
        stream.subscribe(
          (next) => {
            resolve(next);
          },
          (error) => {
            reject(error);
          },
        );
      });
      expect(message).toBe(jsonObject);
      expect(kafkaClientMock.on).toBeCalledWith('ready', expect.anything());
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.anything());
      expect(fromJsonVerifiable).toHaveBeenCalledWith(jsonString);
    });

    it('should throw error due to invalid params in message', async () => {
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const topic = 'topic';
      const jsonObject = { protocol: 'invalid-protocol', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      const fromJsonVerifiable = jest.fn((jsonStringParam: string) => jsonObject);
      require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

      const consumerMock = {
        on: jest.fn((state: string, cb: any) => cb({ topic, value: jsonString })),
      };
      require('kafka-node').Consumer.mockImplementation(() => consumerMock);

      const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
      const errorMessage = await new Promise<any> ((resolve, reject) => {
        stream.subscribe(
          (next) => {
            reject(next);
          },
          (error) => {
            resolve(error);
          },
        );
      });
      const containsValidMessage = errorMessage.includes(`unrecognized message type`);
      expect(containsValidMessage).toBe(true);
      expect(kafkaClientMock.on).toBeCalledWith('ready', expect.anything());
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.anything());
      expect(fromJsonVerifiable).toHaveBeenCalledTimes(0);
    });

    it('should throw error due to parsing error', async () => {
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClientMock = {
        on: jest.fn((state: string, cb: any) => cb()),
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClientMock);

      const topic = 'topic';
      const jsonString = '{bad format}}';

      const consumerMock = {
        on: jest.fn((state: string, cb: any) => cb({ topic, value: jsonString })),
      };
      require('kafka-node').Consumer.mockImplementation(() => consumerMock);

      const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
      const errorMessage = await new Promise<any> ((resolve, reject) => {
        stream.subscribe(
          (next) => {
            reject(next);
          },
          (error) => {
            resolve(error);
          },
        );
      });
      const correctMessage = errorMessage.startsWith(`error while trying to parse message.`);
      expect(correctMessage).toBe(true);
      expect(kafkaClientMock.on).toHaveBeenCalledWith('ready', expect.anything());
      expect(consumerMock.on).toHaveBeenCalledWith('message', expect.anything());
    });
  });

  describe('browser implementation', () => {

    beforeAll(() => {
      config = { apiSeedUrls: ['testUrl'] };
      process.env = {BROWSER: 'true'};
    });

    beforeEach(() => {
      jest.resetModules();
      jest.resetAllMocks();
    });

    describe ('createTopic method', () => {

      it('should create topic without errors when input is valid', async () => {
        const postMock = jest.fn((url: string) => Promise.resolve({status: 200}));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.createTopic('testTopic', config)).resolves.toBeUndefined();
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/create/testTopic');
      });

      it('should fail to create topic due to error from api', async () => {
        const postMock = jest.fn((url: string) => Promise.resolve({status: 500, data: {error: 'kafka error'}}));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.createTopic('testTopic', config)).rejects.toEqual('kafka error');
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/create/testTopic');
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
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/create/testTopic');
      });
    });

    describe ('sendParams method', () => {

      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      it('should send params without errors when input is valid', async () => {
        const postMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200}));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).resolves.toBeUndefined();
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/publish/testTopic', 'basic params mock content');
      });

      it('should fail to send params due to error from api', async () => {
        const postMock = jest.fn((url: string) => Promise.resolve({status: 500, data: {error: 'kafka error'}}));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).rejects.toBe('kafka error');
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/publish/testTopic', 'basic params mock content');
      });

      it('should fail to send params due to network error', async () => {
        const postMock = jest.fn((url: string) => Promise.reject('net::ERR_CONNECTION_REFUSED'));
        jest.doMock('axios', () => ({
          default: {
            post: postMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        await expect(kafka.sendParams('testTopic', paramsMock, config)).rejects.toBe('net::ERR_CONNECTION_REFUSED');
        expect(postMock).toHaveBeenCalledWith('testUrl/topic/publish/testTopic', 'basic params mock content');
      });
    });

    describe('paramsStream method', () => {
      it('should get message stream with one message when get valid input and no errors', async () => {
        jest.doMock('./drone-charging/BidParams');
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const jsonString = JSON.stringify([jsonObject]);

        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200, data: jsonString}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const observable: Observable<BasicParams> = await kafka.paramsStream('testTopic', config);
        const messages = await new Promise((resolve, reject) => {
          observable.subscribe(
            (next) => resolve(next),
            (error) => reject(error),
          );
        });
        expect(messages).toEqual(jsonObject);
        expect(getMock).toHaveBeenCalledWith('testUrl/topic/consume/testTopic');
      });

      it('should get message stream with two messages in one get call when get valid input and no errors', async () => {
        jest.doMock('./drone-charging/BidParams');
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const secondJsonObject = { protocol: 'drone-charging', type: 'bid', price: '62' };
        const jsonString = JSON.stringify([jsonObject, secondJsonObject]);

        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => secondJsonObject).mockReturnValueOnce(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200, data: jsonString}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const observable: Observable<BasicParams> = await kafka.paramsStream('testTopic', config);
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
        expect(getMock).toHaveBeenCalledWith('testUrl/topic/consume/testTopic');
      });

      it('should get message stream with two messages in two get calls when get valid input and no errors', async () => {
        jest.useRealTimers();
        jest.doMock('./drone-charging/BidParams');
        const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
        const secondJsonObject = { protocol: 'drone-charging', type: 'bid', price: '62' };
        const secondJsonString = JSON.stringify([secondJsonObject]);
        const jsonString = JSON.stringify([jsonObject]);

        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => secondJsonObject).mockReturnValueOnce(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200, data: secondJsonString}))
        .mockReturnValueOnce(Promise.resolve({status: 200, data: jsonString}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const observable: Observable<BasicParams> = await kafka.paramsStream('testTopic', config);
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
        expect(getMock).toHaveBeenCalledWith('testUrl/topic/consume/testTopic');
        expect(getMock).toHaveBeenCalledTimes(2);
      });

      it('should throw error due to invalid params in message', async () => {
        jest.doMock('./drone-charging/BidParams');
        jest.doMock('kafka-node');

        const topic = 'testTopic';
        const jsonObject = { protocol: 'invalid-protocol', type: 'bid', price: '3' };
        const jsonString = JSON.stringify([jsonObject]);
        const fromJsonVerifiable = jest.fn((jsonStringParam: string) => jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(fromJsonVerifiable);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200, data: jsonString}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
        const errorMessage = await new Promise<any> ((resolve, reject) => {
          stream.subscribe(
            (next) => {
              reject(next);
            },
            (error) => {
              resolve(error);
            },
          );
        });
        const containsValidMessage = errorMessage.message.includes(`unrecognized message type`);
        expect(containsValidMessage).toBe(true);
        expect(getMock).toHaveBeenCalledWith('testUrl/topic/consume/testTopic');
        expect(fromJsonVerifiable).toHaveBeenCalledTimes(0);
      });

      it('should throw error due to parsing error', async () => {
        jest.doMock('./drone-charging/BidParams');
        jest.doMock('kafka-node');

        const topic = 'testTopic';
        const jsonString = JSON.stringify(['{{bad format}']);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 200, data: jsonString}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
        await expect(new Promise<any> ((resolve, reject) => {
          stream.subscribe(
            (next) => {
              reject(next);
            },
            (error) => {
              resolve(error);
            },
          );
        })).resolves.toBeTruthy();
      });

      it('should throw error due to network error', async () => {
        jest.doMock('./drone-charging/BidParams');
        jest.doMock('kafka-node');

        const topic = 'testTopic';

        const getMock = jest.fn((url: string, content: string) => Promise.reject('net::ERR_CONNECTION_REFUSED'));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
        await expect(new Promise<any> ((resolve, reject) => {
          stream.subscribe(
            (next) => {
              reject(next);
            },
            (error) => {
              resolve(error);
            },
          );
        })).resolves.toBe('net::ERR_CONNECTION_REFUSED');
      });

      it('should throw error due to bad response from api', async () => {
        jest.doMock('./drone-charging/BidParams');
        jest.doMock('kafka-node');

        const topic = 'testTopic';
        const jsonString = JSON.stringify(['{{bad format}']);

        const getMock = jest.fn((url: string, content: string) => Promise.resolve({status: 500, data: {error: 'internal error'}}));
        jest.doMock('axios', () => ({
          default: {
            get: getMock,
          },
        }));
        const kafka = (await import('./Kafka')).default;

        const stream: Observable<BasicParams> = await kafka.paramsStream(topic, config);
        await expect(new Promise<any> ((resolve, reject) => {
          stream.subscribe(
            (next) => {
              reject(next);
            },
            (error) => {
              resolve(error);
            },
          );
        })).resolves.toEqual('internal error');
      });
    });
  });
});
