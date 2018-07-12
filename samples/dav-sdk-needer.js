const {
  davId,
  walletAddress,
  walletPrivateKey,
  identityPrivateKey
} = require('./dav_identity.json');

// The storage isn't a part of the SDK, just used as an example
const myFancyShmancyStorage = {};

const {
  DAVFactory /* , DAVConfig */
} = require('dav-js');

const DAV = DAVFactory();
// Can transfer a DAVConfig object to it.
// const DAVtest = DAVFactory(new DAVConfig({ network: 'localhost' }));
// Can also receive a simple object as configuration
// const DAVtest = DAVFactory({ network: 'localhost' });

(async function init() {
  const registered = await DAV.isRegistered(davId);
  if (!registered) {
    await DAV.registerIdentity(davId, walletAddress, walletPrivateKey, identityPrivateKey);
  }
})();

// Note: The following might throw if DAV Identity is not registered. Private key doesn't match identity. Cannot reach DAV Network. etc.
const myDrone = DAV.getIdentity(davId, identityPrivateKey, {
  network: 'localhost'
});

// Publish a need of a certain type
let need = myDrone.publishNeed('route_plan', {
  start_at: '1513005534000',
  start_latitude: '38.802610',
  start_longitude: '-116.419389',
  end_latitude: '38.807643',
  end_longitude: '-116.587960',
  vehicle_type: 'drone',
  max_altitude: '400',
  ttl: 90 // in seconds. optional.
});

myFancyShmancyStorage.saveNeed(need);

// Listen for incoming bids
myFancyShmancyStorage.getNeedIds().forEach(needId => {
  myDrone.need(needId).bids().filter(bid => bid.price_type === 'flat').subscribe(
    onBid,
    err => console.log(err)
  );
});

const onBid = async bid => {
  if (bid.price < 200000) {
    bid.accept();
    const mission = await bid.signContract(walletPrivateKey);
    mission.messages().subscribe(onMissionMessage, err => console.log(err));
    myFancyShmancyStorage.saveMission(mission);
  }
};

// Subscribe to incoming messages
myFancyShmancyStorage.getMissionIds().forEach(missionId => {
  myDrone.mission(missionId).messages().subscribe(
    onMissionMessage,
    err => console.log(err)
  );
});

const onMissionMessage = (message) => {
  switch (message.type) {
    case 'status':
      console.log(message.mission().id, message);
      break;
    case 'ready':
      console.log('Yay!');
      break;
  }
};

// Pay
const missionId = '';
myDrone.mission(missionId).finalizeMission(walletPrivateKey);
