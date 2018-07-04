const { davId, walletAddress, walletPrivateKey, identityPrivateKey } = require('./dav_identity.json');

// The storage isn't a part of the SDK, just used as an example
const myFancyShmancyStorage = {};

const { DAVFactory, DAVConfig } = require('dav-js');
const DAV = DAVFactory();
const DAV = require('dav-js')();

// Note: The following might throw if DAV Identity is not registered. Cannot reach DAV Network. etc.
const myRoutingService = DAV.getIdentity(davId, identityPrivateKey);

// Subscribe to receive route_plan needs
myRoutingService.needs().forType('route_plan', {
  ttl: 120, // TTL in seconds
  lat: 38.802610,
  long: -116.419389,
  radius: 4000
}).filter(
  need => need.max_height < 1000
).subscribe(
  onNeed,
  err => console.log(err)
);

// When a need is received, create a bid for it
const onNeed = need => {
  let bid = need.createBid(
    // Price object. Can also receive a numeric string instead of object (in that case, flat price_type is assumed)
    // Note that price is in Vinci, a BigNumber. We use string for convenience, but it can also receive BigNumber
    { price: '152000000000000000000', price_type: 'flat', price_description: 'Flat fee' },
    // Bid TTL in seconds:
    120,
    // Extra arguments to describe the bid:
    {
      name: 'Nevada Route Planners Inc.',
      eta: 15 // Time from contract signing to delivery in seconds
    }
  );
  myFancyShmancyStorage.saveNeed(need);
  myFancyShmancyStorage.saveBid(bid);
}

// Subscribe to accepted bids
myFancyShmancyStorage.getBidIds().forEach(bidId => {
  myRoutingService.bid(bidId).messages().subscribe(
    messages => console.log('Bid message received', message.bid),
    err => console.log(err)
  );
  myRoutingService.bid(bidId).messages().filter(message => message.status == 'accepted').subscribe(
    message => console.log('Bid accepted. It should be signed soon, get ready!'),
    err => console.log(err)
  );
  myRoutingService.bid(bidId).messages().filter(message => message.status == 'contract_signed').subscribe(
    message => {
      const mission = message.mission;
      myFancyShmancyStorage.saveMission(mission);
      mission.sendMessage('starting', { eta: 1541402984 }, { recipients: [mission.needer.davId] });
    },
    err => console.log(err)
  );
});

// Subscribe to incoming messages
myRoutingService.messages().subscribe(
  message => {
    switch (message.domain) {
      case 'mission':
        console.log('message received for mission', message.mission.id);
        message.respond('status', { eta: 1541402984 });
        break;
      case 'bid':
        console.log('message received for bid', message.bid.id);
        break;
    }
  },
  err => console.log(err)
);
