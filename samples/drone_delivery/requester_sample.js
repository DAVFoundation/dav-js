const axios = require('axios');
const davJS = require('../dav-js');
const web3 = require('../../src/web3wrapper');

process.env['MISSION_CONTROL_URL'] = 'http://localhost:8888';

var accounts = web3.eth.accounts;
const dav = new davJS(accounts[2], accounts[2]);
dav
  .register()
  .then(res => {
    console.log('done', res);
  })
  .catch(err => {
    console.log('err', err);
  });

axios
  .post(process.env.MISSION_CONTROL_URL + '/needs', {
    // create a need so that captains subscribed to these needs and region can get notified
    pickup_longitude: 3.385038,
    pickup_latitude: 6.497752,
    dropoff_longitude: 3.385038,
    dropoff_latitude: 6.497752,
    pickup_at: new Date(),
    cargo_type: 1,
  })
  .then(response => {
    const needId = response.data.needId;
    setTimeout(async () => {
      const bidsForNeedResponse = await axios.get(
        process.env.MISSION_CONTROL_URL + `/bids/${needId}`,
      ); // gets all bids for need
      const bid = bidsForNeedResponse.data[0];
      axios.put(
        process.env.MISSION_CONTROL_URL +
          `/bids/${bid.id}/choose?requester_id=3`,
      ); // award the bid the mission
    }, 10000);
  })
  .catch(err => console.error(err));
