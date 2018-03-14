const davJS = require('../index');

process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';
process.env['NOTIFICATION_URL'] = 'https://9991eaca.ngrok.io'; // I used ngrok to point this to localhost:7000, I was having issues making requests to localhost from docker


const dav = new davJS('12345');


const droneDelivery = dav.needs().forType('drone_delivery', {
  longitude: 3.385038,
  latitude: 6.497752,
  radius: 10000
});

// the above line can be used to change the coordinates, it won't create multiple registrations on Mission Control. So there's no need for the .update function

droneDelivery.subscribe(
  needOnNext,
  () => console.log('completed'),
  err => console.log(err)
);


function needOnNext(need) {
  const bid = dav.bid().forNeed(need.id, {
    price: '13000',
    price_type: 'flat',
    price_description: 'Flat fee',
    time_to_pickup: Date.now(),
    time_to_dropoff: Date.now() + 3600000,
  });
  bid.subscribe(
    bidOnNext,
    () => console.log('Bid completed'),
    err => console.log(err)
  );


}

function bidOnNext(bid) {
  console.log(bid);

  if (bid.stage === 'awarded') {
    console.log('Yay, we have been awarded');
  } else if (bid.stage == 'signed') {
    // do stuff
  }
}