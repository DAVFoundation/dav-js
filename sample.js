const davJS = require('./index');
const axios = require('axios');


process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';
process.env['NOTIFICATION_URL'] = 'http://9d04cda1.ngrok.io'; // I used ngrok to point this to localhost:7000, I was having issues making requests to localhost from docker


const dav = new davJS('12345');


const droneDelivery = dav.needs().forType('drone_delivery', {
  longitude: 3.2345,
  latitude: 3.2345,
  radius: 5000
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

  if (bid.stage === 'awaiting_award') {
    // award bid for testing purposes
    axios.put(process.env.MISSION_CONTROL_URL + `/bids/${bid.id}/choose?user_id=3`);
  }

  if (bid.stage === 'awarded') {
    console.log('Yay, we have been awarded');
  } else if (bid.stage == 'signed') {
    // do stuff
  }
}


// create test need to test rx subscription
axios.post(process.env.MISSION_CONTROL_URL + '/needs', {
  pickup_latitude: 3.2345,
  pickup_longitude: 3.2345,
  dropoff_longitude: 4.2345,
  dropoff_latitude: 4.2345,
  cargo_type: 1
}).catch((err) => console.error(err));