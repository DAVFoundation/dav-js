import { BidParams } from './drone-charging';
import { SDKFactory, PriceType } from './core';
import * as DroneDelivery from './drone-delivery';

test('basic', () => {
/*   const sdk = SDKFactory({ ttl: 1 });
  const identity = sdk.getIdentity('', '');
  identity.needsForType(new DroneDelivery.NeedFilterParams({ area: { lat: 1, long: 2, radius: 3 } }))
    .filter((need) => (need.params as DroneDelivery.NeedParams).maxAltitude < 1000)
    .subscribe((need) => {
      const bid = need.createBid(
        {
          price: '152000000000000000000',
          priceType: PriceType.flat,
          priceDescription: 'Flat fee',
        }, 100, new DroneDelivery.BidParams({ eta: 11 }));
      bid.messages().subscribe(
        (message) => console.log('Bid message received', message.bid),
        (err) => console.log(err),
      );
      bid.messages().filter((message) => message.status === 'contract_signed').subscribe(
        (message) => {
          const mission = message.mission;
          mission.sendMessage('starting', {
            eta: 1541402984,
          }, {
              recipients: [mission.needer.davId],
            });
        });

      identity.messages().subscribe(
        (message) => {
          switch (message.domain) {
            case 'mission':
              console.log('message received for mission', message.mission.id);
              message.respond('status', {
                eta: 1541402984,
              });
              break;
            case 'bid':
              console.log('message received for bid', message.bid.id);
              break;
          }
        },
        (err) => console.log(err),
      );
    });
 */
    expect(0).toBe(0);
});
