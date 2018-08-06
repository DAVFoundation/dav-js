import Config from './Config';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { TimeoutError } from 'promise-timeout';

describe('Kafka class', () => {
  const config: IConfig = new Config({ });

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

      const streamPromise = kafka.paramsStream('topic', config);
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

      const stream = await kafka.paramsStream('topic', config);
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

      const stream = await kafka.paramsStream(topic, config);
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
      expect(errorMessage).toBe(`unrecognized message type, topic: ${topic}, message: ${jsonString}`);
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

      const stream = await kafka.paramsStream(topic, config);
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
});
