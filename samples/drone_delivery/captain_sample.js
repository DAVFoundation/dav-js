const davJS = require('../dav-js');

process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';
process.env['NOTIFICATION_URL'] = 'https://8c68cd34.ngrok.io'; // I used ngrok to point this to localhost:7000, I was having issues making requests to localhost from docker


const dav = new davJS('12345');


const droneDelivery = dav.needs().forType('drone_delivery', {
  longitude: 3.385038,
  latitude: 6.497752,
  radius: 10000
});

// the above line can be used to change the coordinates, it won't create multiple registrations on Mission Control. So there's no need for the .update function

droneDelivery.subscribe(
  onNeedTypeRegistered,
  () => console.log('completed'),
  err => console.log(err)
);


function onNeedTypeRegistered(need) {
  const bid = dav.bid().forNeed(need.id, {
    price: '13000',
    price_type: 'flat',
    price_description: 'Flat fee',
    time_to_pickup: Date.now(),
    time_to_dropoff: Date.now() + 3600000,
  });
  bid.subscribe(
    onBidUpdated,
    () => console.log('Bid completed'),
    err => console.log(err)
  );
};

function onBidUpdated(bid) {
  if (bid.stage === 'awarded') {
    const contract = dav.contract().forBid(bid.id, {
      id: '0x98782738712387623876',
      ttl: 240
    });
    contract.subscribe(
      onContractUpdated,
      () => console.log('Contract completed'),
      err => console.log(err)
    );
  }
};

function onContractUpdated(contract) {
  switch (contract.state) {
    case 'signed':
      console.log('contract signed');
      break;
    case 'fullfilled':
      console.log('We got some money! Hurray!');
      break;
  }
};
