import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';

describe('Kafka class', () => {
    const config: IConfig = new Config({kafkaSeedUrls: ['localhost:9092']});
    const bidParams = new BidParams({price: new Price('123', PriceType.flat)});

    beforeAll(() => { /**/ });

    describe('createTopic method', () => {

      beforeEach(() => {
        jest.resetAllMocks();
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
        on.mockReturnValue(Promise.resolve(new kafkaMock.Producer()));
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
          console.log(error);
          fail();
        }

        // Assert
        expect(producer.on).toHaveBeenCalled();
      });

      it('should succeed - get valid input, check producer createTopic method has been called', async () => {
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
        expect(producer.createTopics).toHaveBeenCalled();
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
        await expect(kafka.createTopic(topic, config)).rejects.toEqual('connection timeout');
      });

      it('should get error from kafka in topic creation action', async () => {
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
        await expect(kafka.createTopic(topic, config)).rejects.toEqual(kafkaError);
      });
    });

    // describe('sendParams method', () => {

    //   let kafkaNodeMock: any;

    //   beforeEach(() => {
    //     kafkaNodeMock = require('./__mocks__/kafka-node');
    //   });

    //   it('should success', async () => {
    //     // Arrange
    //     const topic = 'topic';
    //     const producer = {
    //       on: (state: string, cb: any) => {
    //         cb();
    //       },
    //       send: (payloads: Array<{topic: string, messeages: string}>, cb: (error: any, data: any) => any) => {
    //         cb(null, null);
    //       },
    //     };
    //     kafkaNodeMock.Producer.mockImplementation(() => producer);

    //     //Act + Assert
    //     await expect(Kafka.sendParams(topic, ))
    //   });
    // });

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
