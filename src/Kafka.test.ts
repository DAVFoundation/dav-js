import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { TimeoutError } from 'promise-timeout';

describe('Kafka class', () => {
    const config: IConfig = new Config({kafkaSeedUrls: ['localhost:9092']});
    const bidParams = new BidParams({price: new Price('123', PriceType.flat)});

    const stuckSecondTimerHack = () => {
      jest.useRealTimers();
      setTimeout(() => {
        jest.useFakeTimers();
        jest.runAllTimers();
      }, 0);
    };

    beforeAll(() => { /**/ });

    describe('createTopic method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
        jest.useFakeTimers();
      });

      it('should succeed - get valid input, check return value', async () => {
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

        // Act + Assert
        await expect(kafka.createTopic(topic, config)).resolves.toBeUndefined();
      });

      it('should succeed - get valid input, check producer ready method has been called', async () => {
        // Arrange
        jest.doMock('kafka-node');
        const kafka = (await import('./Kafka')).default;
        const kafkaMock = require('kafka-node');

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

        const topic = 'topic';

        // Act
        await kafka.createTopic(topic, config);

        // Assert
        expect(onMethodVerifiable).toHaveBeenCalledWith('ready');
      });

      it('should succeed - get valid input, check producer createTopic method has been called with correct params', async () => {
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

      it('should get error from kafka in topic creation method', async () => {
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

      xit('should get timeout in topic creation method', async () => {
        // Arrange
        jest.doMock('kafka-node');
        const kafka = (await import('./Kafka')).default;

        const producer = {
          on: (state: string, cb: any) => {
            cb();
          },
          createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
            return;
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        const topic = 'topic';

        // Act
        const promise = kafka.createTopic(topic, config);
        jest.runAllTimers();
        // This hack is used because the second timer is created after the existing timers are done
        stuckSecondTimerHack();

        // Assert
        await expect(promise).rejects.toEqual(new TimeoutError());
      });
    });

    describe('sendParams method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
        jest.useFakeTimers();
      });

      it('should succeed - get valid input, check return value', async () => {
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
          send: (payloads: Array<{topic: string, messages: string}>, cb: (error: any, data: any) => any) => {
            cb(null, null);
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act + Assert
        await expect(kafka.sendParams(topic, paramsMock, config)).resolves.toBeUndefined();
      });

      it('should succeed - get valid input, check producer ready method has been called', async () => {
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
          send: (payloads: Array<{topic: string, messages: string}>, cb: (error: any, data: any) => any) => {
            cb(null, null);
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act
        await kafka.sendParams(topic, paramsMock, config);

        // Assert
        expect(producerReadyVerifiable).toHaveBeenCalledWith('ready');
      });

      it('should succeed - get valid input, check producer send method has been called with correct params', async () => {
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
          send: (payloads: Array<{topic: string, messages: string}>, cb: (error: any, data: any) => any) => {
            sendVerifiable(payloads, cb);
            cb(null, null);
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act
        await kafka.sendParams(topic, paramsMock, config);

        // Assert
        expect(sendVerifiable).toHaveBeenCalledWith([{topic, messages: paramsToJson}], expect.any(Function));
      });

      it('should get connection timeout', async () => {
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

      it('should get error from kafka in send method', async () => {
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
          send: (payloads: Array<{topic: string, messages: string}>, cb: (error: any, data: any) => any) => {
            cb('kafka error', null);
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act + Assert
        await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toBe('kafka error');
      });

      xit('should get timeout in send method', async () => {
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
          send: (payloads: Array<{topic: string, messages: string}>, cb: (error: any, data: any) => any) => {
            return;
          },
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act
        const promise = kafka.sendParams(topic, paramsMock, config);
        jest.runAllTimers();
        // This hack is used because the second timer is created after the existing timers are done
        stuckSecondTimerHack();

        // Assert
        await expect(promise).rejects.toEqual(new TimeoutError());
      });
    });

    describe('paramsStream method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
        jest.useFakeTimers();
      });

      it('should get connection timeout - check return value', async () => {
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

      it('should succeed - get valid input, check return value', async (done) => {
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
        const jsonObject = {protocol: 'drone-charging', type: 'bid', price: '3'};
        const jsonString = JSON.stringify(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(() => jsonObject);

        const consumer = {
          on: (state: string, cb: any) => {
            cb({topic, value: jsonString});
          },
        };
        require('kafka-node').Consumer.mockImplementation(() => consumer);

        // Act
        const stream = await kafka.paramsStream(topic, config);
        let message: any;
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

      it('should succeed - get valid input, check client ready method has been called', async () => {
        // Arrange
        jest.doMock('./drone-charging/BidParams');
        jest.doMock('kafka-node');
        const kafka = (await import('./Kafka')).default;

        const consumer = {
          on: (state: string, cb: any) => {
            cb({topic, value: jsonString});
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
        const jsonObject = {protocol: 'drone-charging', type: 'bid', price: '3'};
        const jsonString = JSON.stringify(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation(() => jsonObject);

        // Act
        await kafka.paramsStream(topic, config);

        // Assert
        expect(clientReadyVerifiable).toBeCalledWith('ready');
      });

      it('should succeed - get valid input, check fromJson method has been called', async (done) => {
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
        const jsonObject = {protocol: 'drone-charging', type: 'bid', price: '3'};
        const jsonString = JSON.stringify(jsonObject);
        const fromJsonVerifiable = jest.fn();
        require('./drone-charging/BidParams').default.fromJson.mockImplementation((jsonStringParam: string) => {
          fromJsonVerifiable(jsonStringParam);
          return jsonObject;
        });

        const consumer = {
          on: (state: string, cb: any) => {
            cb({topic, value: jsonString});
          },
        };
        require('kafka-node').Consumer.mockImplementation(() => consumer);

        // Act
        const stream = await kafka.paramsStream(topic, config);
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
        const jsonObject = {protocol: 'invalid-protocol', type: 'bid', price: '3'};
        const jsonString = JSON.stringify(jsonObject);
        require('./drone-charging/BidParams').default.fromJson.mockImplementation((jsonStringParam: string) => {
          return jsonObject;
        });

        const consumer = {
          on: (state: string, cb: any) => {
            cb({topic, value: jsonString});
          },
        };
        require('kafka-node').Consumer.mockImplementation(() => consumer);

        // Act
        const stream = await kafka.paramsStream(topic, config);
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
            cb({topic, value: jsonString});
          },
        };
        require('kafka-node').Consumer.mockImplementation(() => consumer);

        // Act
        const stream = await kafka.paramsStream(topic, config);
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


    // describe('some methods', () => {
    //   beforeAll(() => { /**/ });

    //   it('should success, validate kafka mock create topic', async () => {
    //     return;
    //     const topic = 'bidTest';
    //     const davId = 'davId';
    //     await Kafka.createTopic(topic, config);
    //     console.log(bidParams.price);
    //     console.log('sending bidParams');
    //     await Kafka.sendParams(topic, bidParams, config);
    //     console.log('bidParams sent');
    //     const bidStream = await Kafka.paramsStream<BidParams>(topic, davId, config);
    //     const validMessage = new Promise<boolean>((resolve, reject) => {
    //       bidStream.subscribe(
    //         (bid) => {
    //           console.log(bid);
    //           if (bidParams.equals(bid)) {
    //             resolve(true);
    //           } else {
    //             reject(false);
    //           }
    //         },
    //         (err) => reject(false),
    //       );
    //     });
    //     expect(await validMessage).toBe(true);
    //   });
    });
});
