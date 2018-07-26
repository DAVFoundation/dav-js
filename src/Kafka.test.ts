import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Kafka from './Kafka';
import Price from './Price';
import { PriceType } from './common-enums';
import IConfig from './IConfig';

describe('Kafka class', () => {
    const config: IConfig = new Config({kafkaSeedUrls: ['localhost:9092']});
    const bidParams = new BidParams({price: new Price('123', PriceType.flat)});

    beforeAll(() => { /**/ });

    describe('createTopic method', () => {

      let kafkaNodeMock: any;

      beforeEach(() => {
        kafkaNodeMock = require('./__mocks__/kafka-node');
      });

      it('should success', async () => {
        // Arrange
        const topic = 'topic';
        const producer = {
          on: (state: string, cb: any) => {
            cb();
          },
          createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
            cb(null, null);
          },
        };
        kafkaNodeMock.Producer.mockImplementation(() => producer);

        // Act + Assert
        await expect(Kafka.createTopic(topic, config)).resolves.toBeUndefined();
      });

      it('should get connection timeout', async () => {
        // Arrange
        const topic = 'topic';
        const producer = {
          on: (state: string, cb: any) => {
            return;
          },
        };
        kafkaNodeMock.Producer.mockImplementation(() => producer);

        // Act + Assert
        await expect(Kafka.createTopic(topic, config)).rejects.toEqual('connection timeout');
      });

      it('should get error from kafka in topic creation action', async () => {
        // Arrange
        const topic = 'topic';
        const kafkaError = 'kafka error';
        const producer = {
          on: (state: string, cb: any) => {
            cb();
          },
          createTopics: (topics: string[], async: boolean, cb: (error: any, data: any) => any) => {
            cb(kafkaError, null);
          },
        };
        kafkaNodeMock.Producer.mockImplementation(() => producer);

        // Act + Assert
        await expect(Kafka.createTopic(topic, config)).rejects.toEqual(kafkaError);
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
