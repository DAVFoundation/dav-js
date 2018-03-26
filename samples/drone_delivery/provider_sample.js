const davJS = require('../dav-js');
const web3 = require('../../src/web3wrapper');

process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';
process.env['NOTIFICATION_URL'] = 'https://320652be.ngrok.io'; // I used ngrok to point this to localhost:7000, I was having issues making requests to localhost from docker

let davId, wallet;
if(web3.isConnected()) {
  davId = web3.eth.accounts[1];
  wallet = web3.eth.accounts[1];
}
const dav = new davJS(davId, wallet);
dav.connect().then((res) => {
  console.log('done', res);
}).catch((err) => {
  console.log('err', err);
});


const droneDelivery = dav.needs().forType('drone_delivery', {
  longitude: 3.385038,
  latitude: 6.497752,
  radius: 10000
});

// the above line can be used to change the coordinates, it won't create multiple registrations on Mission Control. So there's no need for the .update function

droneDelivery.subscribe(
  onNeedTypeRegistered,
  err => console.log(err),
  () => console.log('completed')
);


function onNeedTypeRegistered(need) {
  const bid = dav.bid().forNeed(need.id, {
    price: '13000',
    price_type: 'flat',
    price_description: 'Flat fee',
    time_to_pickup: Date.now(),
    time_to_dropoff: Date.now() + 3600000,
    ttl: 240
  });
  bid.subscribe(
    onBidUpdated,
    err => console.log(err),
    () => console.log('Bid completed')
  );
}

function onBidUpdated(bid) {
  if (bid.status === 'awarded') {
    const contract = dav.contract().forBid(bid.id, {
      id: '0x98782738712387623876',
      ttl: 240
    });
    contract.subscribe(
      onContractUpdated,
      err => console.log(err),
      () => console.log('Contract completed')
    );
  }
}

function onContractUpdated(contract) {
  switch (contract.status) {
    case 'signed':
      beginMission(contract);
      break;
    case 'fullfilled':
      console.log('We got some money! Hurray!');
      break;
  }
}


function beginMission(contract){
  const mission = dav.mission().begin(contract.bid_id, {
    id: '0x98782738712387623876',
    longitude: 3.385038,
    latitude: 6.497752
  });
  mission.subscribe(
    onMissionUpdated,
    err => console.log(err),
    () => console.log('Mission completed')
  );
}

function onMissionUpdated(mission){
  console.log(mission);
  mission.update({
    status: 'movingToPickup',
    longitude: 3.385048,
    latitude: 6.497742
  });
}


// function onMissionUpdated(mission) {
//   let drone = {/* This is the drone API - not part of DAV-JS SDK */ };
//   switch (mission.state) {
//     case 'started':
//       drone.goto(mission.pickup.lat, mission.pickup.lng)
//         .then((pos) => {
//           mission.update({ state: 'atPickup', lat: pos.lat, lng: pos.lng });
//         });
//       drone.updatesPosition.then(pos => {
//         mission.update({ state: 'movingToPickup', lat: pos.lat, lng: pos.lng });
//       });
//       break;
//     case 'packageReady':
//       drone.goto(mission.dropoff.lat, mission.dropoff.lng)
//         .then((pos) => {
//           mission.update({ state: 'atDropoff', lat: pos.lat, lng: pos.lng });
//         });
//       drone.updatesPosition.then(pos => {
//         mission.update({ state: 'movingToDropoff', lat: pos.lat, lng: pos.lng });
//       });
//       break;
//     case 'done':
//       drone.standBy();
//       break;
//   }
// }
