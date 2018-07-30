import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import { Observable } from 'rxjs';
import { PromiseObservable } from 'rxjs/observable/PromiseObservable';

describe('Kafka class', () => {
    const config: IConfig = new Config({kafkaSeedUrls: ['localhost:9092']});
    const bidParams = new BidParams({price: new Price('123', PriceType.flat)});

    beforeAll(() => { /**/ });

    describe('createTopic method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
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

        const on = jest.fn();
        const producer = {
          on,
          createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
            cb(null, null);
          },
        };
        kafkaMock.Producer.mockImplementation(() => producer);

        const topic = 'topic';

        // Act
        try {
          await kafka.createTopic(topic, config);
        } catch (error) {
          /** */
        }

        // Assert
        expect(producer.on).toHaveBeenCalled();
      });

      it('should succeed - get valid input, check producer createTopic method has been called with correct params', async () => {
        // Arrange
        jest.doMock('kafka-node');
        const kafka = (await import('./Kafka')).default;

        const producer = {
          on: (state: string, cb: any) => {
            cb();
          },
          createTopics: jest.fn(),
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        const topic = 'topic';

        // Act
        try {
          await kafka.createTopic(topic, config);
        } catch (error) {
          /** */
        }

        // Assert
        expect(producer.createTopics).toHaveBeenCalledWith([topic], expect.any(Boolean), expect.any(Function));
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

        // Act + Assert
        await expect(kafka.createTopic(topic, config)).rejects.toBe('connection timeout');
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

      it('should get timeout in topic creation method', async () => {
        // Arrange
        jest.doMock('kafka-node');
        const kafka = (await import('./Kafka')).default;

        const kafkaError = 'kafka error';
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

        // Act + Assert
        await expect(kafka.createTopic(topic, config)).rejects.toBe('kafka request timeout');
      });
    });

    describe('sendParams method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
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
        const producer = {
          on: jest.fn(),
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act
        try {
          await kafka.sendParams(topic, paramsMock, config);
        } catch (error) {
          /** */
        }

        // Assert
        expect(producer.on).toHaveBeenCalled();
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
        const producer = {
          on: (state: string, cb: any) => {
            cb();
          },
          send: jest.fn(),
        };
        require('kafka-node').Producer.mockImplementation(() => producer);

        // Act
        try {
          await kafka.sendParams(topic, paramsMock, config);
        } catch (error) {
          /** */
        }

        // Assert
        expect(producer.send).toHaveBeenCalledWith([{topic, messages: paramsToJson}], expect.any(Function));
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

        // Act + Assert
        await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toBe('connection timeout');
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

      it('should get timeout in send method', async () => {
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

        // Act + Assert
        await expect(kafka.sendParams(topic, paramsMock, config)).rejects.toBe('kafka request timeout');
      });
    });

    describe('paramsStream method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
        jest.resetModules();
      });

      it('should get connection timeout', async () => {
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

        // Act + Assert
        await expect(kafka.paramsStream(topic, config)).rejects.toBe('connection timeout');
      });

      // it('should succeed - get valid input, check return value', async () => {
      //   // Arrange
      //   jest.doMock('./drone-charging/BidParams');
      //   jest.doMock('kafka-node');
      //   const kafka = (await import('./Kafka')).default;

      //   const kafkaClient = {
      //     on: (state: string, cb: any) => {
      //       cb();
      //     },
      //   };
      //   require('kafka-node').KafkaClient.mockImplementation(() => kafkaClient);

      //   const topic = 'topic';
      //   const jsonObject = {protocol: 'drone-charging', type: 'bid', price: '3'};
      //   const jsonString = JSON.stringify(jsonObject);
      //   const bidParamsClass = {
      //     fromJson: (json: string) => {
      //       console.log('mock');
      //       return jsonObject;
      //     },
      //   };
      //   require('./drone-charging/BidParams').default.mockImplementation(() => bidParamsClass);

      //   const consumer = {
      //     on: (state: string, cb: any) => {
      //       cb({topic, value: jsonString});
      //     },
      //   };
      //   require('kafka-node').Consumer.mockImplementation(() => consumer);

      //   // Act + Assert
      //   await expect(kafka.paramsStream(topic, config)).resolves.toBeInstanceOf(PromiseObservable);
      // });
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
    // });
});
