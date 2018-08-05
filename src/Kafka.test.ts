import Config from './Config';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { TimeoutError } from 'promise-timeout';

describe('Kafka class', () => {
  // TODO: Why do we need to put a URL here?
  const config: IConfig = new Config({ kafkaSeedUrls: ['localhost:9092'] });

  beforeAll(() => { /**/ });

  describe('createTopic method', () => {

    // TODO: move the duplicated beforeEach in internal suites to containing suite
    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.useFakeTimers();
    });

    // TODO: move the duplicated afterEach in internal suites to containing suite
    afterEach(() => {
      jest.unmock('promise-timeout');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          cb(null, null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // TODO: remove unnecessary comments (also applies to other tests below!)
      // Act + Assert
      await expect(kafka.createTopic(topic, config)).resolves.toBeUndefined();
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check producer ready method has been called', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const kafkaMock = require('kafka-node');

      // TODO: A cleaner solution would be: (also applies to other tests below!)
      //    const onMethodVerifiable = jest.fn((state: string, cb: any) => { cb(); });
      //    const producer = {
      //      on: onMethodVerifiable,

      const onMethodVerifiable = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          cb();
          onMethodVerifiable(state);
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          cb(null, null);
        },
      };
      kafkaMock.Producer.mockImplementation(() => producer);

      // TODO: Is this really necessary? (also applies to other tests below!)
      const topic = 'topic';

      // TODO: remove unnecessary comments (also applies to other tests below!)
      // Act
      await kafka.createTopic(topic, config);

      // TODO: A cleaner solution would be:
      //    expect(onMethodVerifiable).toHaveBeenCalledWith('ready',expect.anything());
      // TODO: remove unnecessary comments (also applies to other tests below!)
      // Assert
      expect(onMethodVerifiable).toHaveBeenCalledWith('ready');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check producer createTopic method has been called with correct params', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const createTopicMethodVerifiable = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          cb(null, null);
          createTopicMethodVerifiable(topics, async, cb);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // Act
      await kafka.createTopic(topic, config);

      // Assert
      expect(createTopicMethodVerifiable).toHaveBeenCalledWith([topic], expect.any(Boolean), expect.any(Function));
    });

    it('should get connection timeout', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producer = {
        on: (state: string, cb: any) => {
          return;
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // Act
      const promise = kafka.createTopic(topic, config);
      jest.runAllTimers();

      // Assert
      await expect(promise).rejects.toEqual(new TimeoutError());
    });

    it('should get error from producer while trying to connect to kafka, check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const producer = {
        on: (state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // Act + Assert
      await expect(kafka.createTopic(topic, config)).rejects.toBe('Producer got error in connection');
    });

    it('should get error from producer while trying to connect to kafka, check method call', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const onMock = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          onMock(state);
          cb();
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // Don't do empty catch  - prefer 'expect to reject'. You can merge with similar test in this case.
      // Act + Assert
      try {
        await expect(kafka.createTopic(topic, config));
      } catch (error) {
        /** */
      }

      // Assert
      expect(onMock).toHaveBeenCalledWith('error');
    });

    it('should get error from kafka in topic creation method', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaError = 'kafka error';
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          cb(kafkaError, null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      const topic = 'topic';

      // Act + Assert
      await expect(kafka.createTopic(topic, config)).rejects.toBe(kafkaError);
    });

    it('should get timeout in topic creation method - check promise was rejected', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          return;
        },
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producer);

      const timeoutMock = jest.fn();
      timeoutMock.mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const topic = 'topic';
      const kafka = (await import('./Kafka')).default;

      // Act + Assert
      await expect(kafka.createTopic(topic, config)).rejects.toEqual(new TimeoutError());
    });

    it('should get timeout in topic creation method - check timeout was called twice', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
          return;
        },
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producer);

      // TODO: Could use fluent syntax:
      //    const timeoutMock = jest.fn().mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      const timeoutMock = jest.fn();
      timeoutMock.mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const topic = 'topic';
      const kafka = (await import('./Kafka')).default;

      // Act
      try {
        await kafka.createTopic(topic, config);
      } catch (error) {
        /** */
      }

      // Assert
      expect(timeoutMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendParams method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.unmock('promise-timeout');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          cb(null, null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act + Assert
      await expect(kafka.sendParams(topic, paramsMock, config)).resolves.toBeUndefined();
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check producer ready method has been called', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producerReadyVerifiable = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          cb();
          producerReadyVerifiable(state);
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          cb(null, null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act
      await kafka.sendParams(topic, paramsMock, config);

      // Assert
      expect(producerReadyVerifiable).toHaveBeenCalledWith('ready');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check producer send method has been called with correct params', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsToJson = 'basic params mock content';
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return paramsToJson;
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const sendVerifiable = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          sendVerifiable(payloads, cb);
          cb(null, null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act
      await kafka.sendParams(topic, paramsMock, config);

      // Assert
      expect(sendVerifiable).toHaveBeenCalledWith([{ topic, messages: paramsToJson }], expect.any(Function));
    });

    it('should get connection timeout', async () => {
      // TODO: remove unnecessary comments
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          return;
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act
      const promise = kafka.sendParams(topic, paramsMock, config);
      jest.runAllTimers();

      // Assert
      await expect(promise).rejects.toEqual(new TimeoutError());
    });

    it('should get error from producer while trying to connect to kafka - check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act + Assert
      await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toBe('Producer got error in connection');
    });

    it('should get error from producer while trying to connect to kafka, check method call', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const onMock = jest.fn();
      const producer = {
        on: (state: string, cb: any) => {
          onMock(state);
          cb();
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act
      try {
        await kafka.sendParams(topic, paramsMock, config);
      } catch (error) {
        /** */
      }
      expect(onMock).toHaveBeenCalledWith('error');
    });

    it('should get error from kafka in send method', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          cb('kafka error', null);
        },
      };
      require('kafka-node').Producer.mockImplementation(() => producer);

      // Act + Assert
      await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toBe('kafka error');
    });

    it('should get timeout in send method - check promise was rejected', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          return;
        },
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producer);

      const timeoutMock = jest.fn();
      timeoutMock.mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const kafka = (await import('./Kafka')).default;

      // Act + Assert
      await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toEqual(new TimeoutError());
    });

    it('should get timeout in send method - check timeout was called twice', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const paramsMockType = jest.fn<BasicParams>(() => ({
        toJson: () => {
          return 'basic params mock content';
        },
      }));
      const paramsMock = new paramsMockType();

      const topic = 'topic';
      const producer = {
        on: (state: string, cb: any) => {
          cb();
        },
        send: (payloads: Array<{ topic: string, messages: string }>, cb: (error: any, data: any) => any) => {
          return;
        },
      };
      const kafkaNode = require('kafka-node');
      kafkaNode.Producer.mockImplementation(() => producer);

      const timeoutMock = jest.fn();
      timeoutMock.mockResolvedValueOnce(new kafkaNode.Producer()).mockRejectedValue(new TimeoutError());
      jest.doMock('promise-timeout', () => ({
        timeout: timeoutMock,
      }));

      const kafka = (await import('./Kafka')).default;

      // Act
      try {
        await kafka.sendParams(topic, paramsMock, config);
      } catch (error) {
        /** */
      }

      // Assert
      expect(timeoutMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('paramsStream method', () => {

    beforeEach(() => {
      jest.resetAllMocks();
      jest.resetModules();
      jest.useFakeTimers();
    });

    it('should get connection timeout - check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          return;
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);
      const topic = 'topic';

      // Act
      const streamPromise = kafka.paramsStream(topic, config);
      jest.runAllTimers();

      // Assert
      await expect(streamPromise).rejects.toEqual(new TimeoutError());
    });

    it('should get connection timeout - check ready method has been called', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const clientReadyVerifiable = jest.fn();
      const kafkaClient = {
        on: (state: string, cb: any) => {
          clientReadyVerifiable(state);
          return;
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);
      const topic = 'topic';

      // Act
      const streamPromise = kafka.paramsStream(topic, config);
      jest.runAllTimers();
      try {
        await streamPromise;
      } catch (error) {
        /** */
      }

      // Assert
      expect(clientReadyVerifiable).toHaveBeenCalledWith('ready');
    });

    it('should get error from kafka client while trying to connect - check return value', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          if (state === 'error') {
            cb();
          }
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);
      const topic = 'topic';

      // Act + Assert
      await expect(kafka.paramsStream(topic, config)).rejects.toBe('client got error in connection');
    });

    it('should get error from kafka client while trying to connect - check method call', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const onMock = jest.fn();
      const kafkaClient = {
        on: (state: string, cb: any) => {
          onMock(state);
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);
      const topic = 'topic';

      // Act
      try {
        await kafka.paramsStream(topic, config);
      } catch (error) {
        /** */
      }

      // Assert
      expect(onMock).toHaveBeenCalledWith('error');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check return value', async (done) => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      const topic = 'topic';
      const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      require('./drone-charging/BidParams').default.fromJson.mockImplementation(() => jsonObject);

      const consumer = {
        on: (state: string, cb: any) => {
          cb({ topic, value: jsonString });
        },
      };
      require('kafka-node').Consumer.mockImplementation(() => consumer);

      // Act
      const stream = await kafka.paramsStream(topic, config);
      let message: any;
      // TODO: Implement this with Promise rather then 'done'
      stream.subscribe(
        (next) => {
          message = next;
          // Assert
          expect(message).toBe(jsonObject);
          done();
        },
        // Assert
        (error) => {
          fail(error);
          done();
        },
      );
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check client ready method has been called', async () => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const consumer = {
        on: (state: string, cb: any) => {
          cb({ topic, value: jsonString });
        },
      };
      require('kafka-node').Consumer.mockImplementation(() => consumer);

      const clientReadyVerifiable = jest.fn();
      const kafkaClient = {
        on: (state: string, cb: any) => {
          clientReadyVerifiable(state);
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      const topic = 'topic';
      const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      require('./drone-charging/BidParams').default.fromJson.mockImplementation(() => jsonObject);

      // Act
      await kafka.paramsStream(topic, config);

      // Assert
      expect(clientReadyVerifiable).toBeCalledWith('ready');
    });

    // TODO: change 'should succeed' to something meaningful
    it('should succeed - get valid input, check fromJson method has been called', async (done) => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      const topic = 'topic';
      const jsonObject = { protocol: 'drone-charging', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      const fromJsonVerifiable = jest.fn();
      require('./drone-charging/BidParams').default.fromJson.mockImplementation((jsonStringParam: string) => {
        fromJsonVerifiable(jsonStringParam);
        return jsonObject;
      });

      const consumer = {
        on: (state: string, cb: any) => {
          cb({ topic, value: jsonString });
        },
      };
      require('kafka-node').Consumer.mockImplementation(() => consumer);

      // Act
      const stream = await kafka.paramsStream(topic, config);
      // TODO: Implement this with Promise rather then 'done'
      stream.subscribe(
        (next) => {
          // Assert
          expect(fromJsonVerifiable).toBeCalledWith(jsonString);
          done();
        },
        // Assert
        (error) => {
          fail(error);
          done();
        },
      );
    });

    it('should throw error due to invalid params in message', async (done) => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('./drone-charging/BidParams');
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      const topic = 'topic';
      const jsonObject = { protocol: 'invalid-protocol', type: 'bid', price: '3' };
      const jsonString = JSON.stringify(jsonObject);
      require('./drone-charging/BidParams').default.fromJson.mockImplementation((jsonStringParam: string) => {
        return jsonObject;
      });

      const consumer = {
        on: (state: string, cb: any) => {
          cb({ topic, value: jsonString });
        },
      };
      require('kafka-node').Consumer.mockImplementation(() => consumer);

      // Act
      const stream = await kafka.paramsStream(topic, config);
      // TODO: Implement this with Promise rather then 'done'
      stream.subscribe(
        (next) => {
          // Assert
          fail();
          done();
        },
        // Assert
        (error) => {
          expect(error).toBe(`unrecognized message type, topic: ${topic}, message: ${jsonString}`);
          done();
        },
      );
    });

    it('should throw error due to parsing error', async (done) => {
      // TODO: remove unnecessary comments
      // Arrange
      jest.doMock('kafka-node');
      const kafka = (await import('./Kafka')).default;

      const kafkaClient = {
        on: (state: string, cb: any) => {
          cb();
        },
      };
      require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      const topic = 'topic';
      const jsonString = '{bad format}}';

      const consumer = {
        on: (state: string, cb: any) => {
          cb({ topic, value: jsonString });
        },
      };
      require('kafka-node').Consumer.mockImplementation(() => consumer);

      // Act
      const stream = await kafka.paramsStream(topic, config);
      // TODO: Implement this with Promise rather then 'done'
      stream.subscribe(
        (next) => {
          // Assert
          fail();
          done();
        },
        // Assert
        (error) => {
          const correctMessage = error.startsWith(`error while trying to parse message.`);
          expect(correctMessage).toBeTruthy();
          done();
        },
      );
    });
  });
});
