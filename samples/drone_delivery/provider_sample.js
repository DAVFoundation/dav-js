const davJS = require('../dav-js');

process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';
process.env['NOTIFICATION_URL'] = 'https://9991eaca.ngrok.io'; // I used ngrok to point this to localhost:7000, I was having issues making requests to localhost from docker


const dav = new davJS('12345');


const droneDelivery = dav.needs().forType('drone_delivery', {
  longitude: 3.385038,
  latitude: 6.497752,
  radius: 10000,
  ttl: 120 // TTL in seconds
});

// the above line can be used to change the coordinates, it won't create multiple registrations on Mission Control. So there's no need for the .update function

droneDelivery.subscibe(
  need => onNeed(need),
  err => console.log(err),
  () => console.log('')
);


function onNeed(need) {
  const bid = dav.bid().forNeed(need.id, {
    price: '13000',
    price_type: 'flat',
    price_description: 'Flat fee',
    time_to_pickup: Date.now(),
    time_to_dropoff: Date.now() + 3600000,
    ttl: 120 // TTL in seconds
  });
  bid.subscribe(
    onBidAccepted(bid),
    () => console.log('Bid completed'),
    err => console.log(err)
  );
}

function onBidAccepted(bid) {
  console.log(bid);
  const contract = dav.contract().forBid(bid.id, {
    id: '0x98782738712387623876', // Ethereum Smart Contract
    ttl: 120 // TTL in seconds
  });
  contract.subscribe(
    onContractUpdated(contract),
    () => console.log('Contract completed'),
    err => console.log(err)
  );
}

function onContractUpdated(contract) {
  console.log(contract);
  switch (contract.state) {
    case 'signed':
      beginMission(contract);
      break;
    case 'fullfilled':
      console.log('We got some money! Hurray!');
      break;
  }
}

function beginMission(contract) {
  const mission = dav.mission().begin(contract.id, {
    id: '0x98782738712387623876', // Etherum Smart Contract
    ttl: 120 // TTL in seconds
  });
  mission.subscribe(
    onMissionUpdated(mission),
    () => console.log('Mission completed'),
    err => console.log(err)
  );
}

function onMissionUpdated(mission) {
  let drone = {/* This is the drone API - not part of DAV-JS SDK */ };
  switch (mission.state) {
    case 'started':
      drone.goto(mission.pickup.lat, mission.pickup.lng)
        .then((pos) => {
          mission.update({ state: 'atPickup', lat: pos.lat, lng: pos.lng });
        });
      drone.updatesPosition.then(pos => {
        mission.update({ state: 'movingToPickup', lat: pos.lat, lng: pos.lng });
      });
      break;
    case 'packageReady':
      drone.goto(mission.dropoff.lat, mission.dropoff.lng)
        .then((pos) => {
          mission.update({ state: 'atDropoff', lat: pos.lat, lng: pos.lng });
        });
      drone.updatesPosition.then(pos => {
        mission.update({ state: 'movingToDropoff', lat: pos.lat, lng: pos.lng });
      });
      break;
    case 'done':
      drone.standBy();
      break;
  }
}
