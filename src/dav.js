const axios = require('axios');
// const express = require('express');
// const bodyParser = require('body-parser');
const rx = require('rx-lite');
const web3 = require('./web3wrapper');
const davContracts = require('./dav-contracts');


function davJS(davId, wallet) {
  if (!process.env.MISSION_CONTROL_URL) throw new Error('MISSION_CONTROL_URL is not set');
  if (!process.env.NOTIFICATION_URL) throw new Error('NOTIFICATION_URL is not set');

  // const port = process.env.WEB_SERVER_PORT || 7000;

  this.davId = davId;
  this.wallet = wallet;
  this.web3 = web3;

  this.missionControlURL = process.env.MISSION_CONTROL_URL;
  this.notificationURL = process.env.NOTIFICATION_URL;

  // this.server = express();
  // this.server.use(bodyParser.json());
  this.needTypes = {};
  this.bids = {};
  this.contracts = {};
  this.missions = {};

  setInterval(this.getUpdate.bind(this), 1000);

  axios.post(`${this.missionControlURL}/captains`, { dav_id: davId, notification_url: this.notificationURL })
    .catch((err) => {
      console.error(err);
    });

  /* this.server.post('/', (req, res) => {
    const params = req.body;
    switch (params.notification_type) {
      case 'new_need':
        var need = params.data.need;
        this.needTypes[need.need_type].onNext(need);
        break;
      case 'bid':
        var bid = params.data.bid;
        this.bids[bid.need_id].onNext(bid);
        break;
      case 'contract':
        var contract = params.data.contract;
        this.contracts[contract.bid_id].onNext(contract);
        break;
      case 'mission':
        var mission = params.data.mission;
        mission.update = generateMissionUpdateFunction(mission, this);
        this.missions[mission.bid_id].onNext(mission);
        break;
    }
    res.sendStatus(200);
  }); */

  /*   this.listener = this.server.listen(port, function () {
      console.log(`Listening on port ${port}`);
    }); */
}

davJS.prototype.isRegistered = () => {
  let dav = this;
  return davContracts.getInstace('identity')
    .then(function (instance) {
      const isRegistered = instance.isRegistered.call(dav.davId);
      return isRegistered;
    });
};

davJS.prototype.connect = function () {
  let dav = this;
  if (process.env.NODE_ENV === 'development' && !web3.isConnected()) {
    return Promise.resolve({});
  }

  return new Promise(function (resolve, reject) {
    // console.log(dav.wallet);
    var identityContractInstance;
    return davContracts.getInstance('identity')
      .then(function (instance) {
        identityContractInstance = instance;
        const isRegistered = instance.isRegistered.call(dav.davId);
        return isRegistered;
      })
      .then(function (isRegistered) {
        if (isRegistered === false) {
          const msg = 'DAV Identity Registration';
          const hash = web3.sha3(msg);
          let signature = web3.eth.sign(dav.davId, hash).substr(2);
          const r = '0x' + signature.slice(0, 64);
          const s = '0x' + signature.slice(64, 128);
          const v = web3.toDecimal(signature.slice(128, 130)) + 27;
          // console.log('r', r);
          // console.log('s', s);
          // console.log('v', v);

          return identityContractInstance
            .register(dav.davId, v, r, s, { from: dav.wallet })
            .then(function (res) {
              console.log(res);
              resolve({});
            })
            .catch(function (err) {
              reject(err);
            });
        } else {
          resolve({});
        }
      }).catch(function (err) {
        reject(err);
      });
  });
};

const generateMissionUpdateFunction = function (mission, davContext) {
  return function ({ status, latitude, longitude }) {
    axios.put(`${davContext.missionControlURL}/missions/${mission.mission_id}`, { status, latitude, longitude, dav_id: davContext.davId })
      .then((response) => {
        davContext.missions[mission.bid_id].onNext(response.data);
      });
  };
};

davJS.prototype.getUpdate = function () {
  let dav = this;
  axios.get(`${this.missionControlURL}/needs/${this.davId}`, {})
    .then(({ data }) => {
      data.forEach(need => {
        if (!dav.bids[need.id]) {
          dav.needTypes[need.need_type].onNext(need);
        }
      });
      // console.log(data);
    })
    .catch(e =>
      console.log(e)
    );
  axios.get(`${this.missionControlURL}/bids/${this.davId}/chosen`, {})
    .then(({ data }) => {
      data.forEach(bid => {
        dav.bids[bid.need_id].onNext(bid);
      });
      // console.log(data);
    })
    .catch(e =>
      console.log(e)
    );
};

davJS.prototype.needs = function () {
  let dav = this;
  return {
    forType: (needType, region) => {
      if (!region.global) {
        if (!region.latitude) throw new Error('region latitude is not set');
        if (!region.longitude) throw new Error('region longitude is not set');
        if (!region.radius) throw new Error('region radius is not set');
      }
      region.ttl = region.ttl || 120;
      axios.post(`${dav.missionControlURL}/captains/${dav.davId}`, { need_type: needType, region })
        .catch((err) => {
          console.error(err);
        });
      dav.needTypes[needType] = new rx.Subject();
      return dav.needTypes[needType];
    }
  };
};

davJS.prototype.bid = function () {
  let dav = this;
  return {
    forNeed: (needId, bid) => {
      if (!dav.bids[needId]) {
        dav.bids[needId] = new rx.Subject;
        bid.dav_id = dav.davId;
        axios.post(`${dav.missionControlURL}/bids/${needId}`, bid)
          .catch((err) => {
            console.error(err);
          });
      }
      return dav.bids[needId];
    }
  };
};

davJS.prototype.createMissionContract = function (vehicleId, missionCost) {
  let dav = this;
  if (process.env.NODE_ENV === 'development' && !web3.isConnected()) {
    return Promise.resolve({});
  }

  return new Promise(function (resolve, reject) {
    var tokenContractInstance;
    var missionContractInstance;
    return davContracts.getInstance('token')
      .then(function (instance) {
        tokenContractInstance = instance;
        return davContracts.getInstance('mission')
          .then((instance) => {
            missionContractInstance = instance;
            return tokenContractInstance.approve(missionContractInstance.address, missionCost, { from: dav.wallet });
          })
          .then(() => {
            return missionContractInstance.create(vehicleId, dav.davId, missionCost, { from: dav.wallet });
          });
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

davJS.prototype.contract = function () {
  let dav = this;
  return {
    forBid: (bidId, contract) => {
      dav.contracts[bidId] = new rx.Subject;
      contract.dav_id = dav.davId;
      axios.post(`${dav.missionControlURL}/contracts/${bidId}`, contract)
        .catch((err) => {
          console.error(err);
        });
      return dav.contracts[bidId];
    }
  };
};

davJS.prototype.mission = function () {
  let dav = this;
  return {
    begin: (bidId, missionParams) => {
      dav.missions[bidId] = new rx.Subject;
      missionParams.dav_id = dav.davId;
      axios.post(`${dav.missionControlURL}/missions/${bidId}`, missionParams)
        .then((response) => {
          const mission = response.data;
          mission.update = generateMissionUpdateFunction(mission, this);
          dav.missions[bidId].onNext(mission);
        }).catch((err) => {
          console.error(err);
        });
      return dav.missions[bidId];
    }
  };
};

module.exports = davJS;

