import Config from './Config';
import BidParams from './drone-charging/BidParams';
import Kafka from './Kafka';
import Price from './Price';
import { PriceType } from './common-enums';
import { registerHelper } from 'handlebars';

describe('Kafka class', () => {
    const config = new Config({});
    const bidParams = new BidParams({price: new Price('123', PriceType.flat)});
    // bidParams.price = new Price('123', PriceType.flat);

    beforeAll(() => { /**/ });

    describe('some methods', () => {
      beforeAll(() => { /**/ });

      it('should success, validate kafka mock create topic', async () => {
        // jest.setTimeout(15000);
        const topic = 'bidTest';
        const davId = 'davId';
        await Kafka.createTopic(topic, config);
        console.log(bidParams.price);
        console.log('sending bidParams');
        await Kafka.sendParams(topic, bidParams, config);
        console.log('bidParams sent');
        const bidStream = await Kafka.paramsStream<BidParams>(topic, davId, config);
        const validMessage = new Promise<boolean>((resolve, reject) => {
          bidStream.subscribe(
            (bid) => {
              console.log(bid);
              if (bidParams.equals(bid)) {
                resolve(true);
              } else {
                reject(false);
              }
            },
            (err) => reject(false),
          );
        });
        expect(await validMessage).toBe(true);
      });
    });
});
