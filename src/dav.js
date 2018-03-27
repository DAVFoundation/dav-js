const axios = require('axios');
const rx = require('rx-lite');
const web3 = require('./web3wrapper');
const davContracts = require('./dav-contracts');


function davJS(davId, wallet) {
  if (!process.env.MISSION_CONTROL_URL) throw new Error('MISSION_CONTROL_URL is not set');

  this.davId = davId;
  this.wallet = wallet;

  this.missionControlURL = process.env.MISSION_CONTROL_URL;

  this.needTypes = {};
  this.bids = {};
  this.contracts = {};
  this.missions = {};

  setInterval(this.getUpdate.bind(this), 1000);

  axios.post(`${this.missionControlURL}/captains`, { dav_id: davId })
    .catch((err) => {
      console.error(err);
    });

}

davJS.prototype.isRegistered = function () {
  let dav = this;
  return davContracts.getInstance('identity')
    .then(function (instance) {
      return instance.isRegistered.call(dav.davId);
    });
};

davJS.prototype.registerSimple = function () {
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
        return instance.isRegistered.call(dav.davId);
      })
      .then(function (isRegistered) {
        if (isRegistered === false) {
          return identityContractInstance
            .registerSimple({ from: dav.wallet })
            .then(function (res) {
              console.log(res);
              resolve(true);
            })
            .catch(function (err) {
              reject(err);
            });
        } else {
          resolve(true);
        }
      }).catch(function (err) {
        reject(err);
      });
  });
};
      

davJS.prototype.register = function () {
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
        return instance.isRegistered.call(dav.davId);
      })
      .then(function (isRegistered) {
        if (isRegistered === false) {
          const msg = 'DAV Identity Registration';
          const hash = web3.sha3(msg);
          web3.eth.sign(dav.davId, hash, (error, signature) => {
            if(error) {
              reject(error);
            }
            signature = signature.substr(2);
            const v_hex = signature.slice(128, 130);
            const r = '0x' + signature.slice(0, 64);
            const s = '0x' + signature.slice(64, 128);
            const v = web3.toDecimal(v_hex) + 27;
            // console.log('r', r);
            // console.log('s', s);
            // console.log('v', v);

            identityContractInstance
              .register(dav.davId, v, r, s, { from: dav.wallet })
              .then(function (res) {
                console.log(res);
                resolve(true);
              })
              .catch(function (err) {
                reject(err);
              });
          });
        } else {
          resolve(true);
        }
      }).catch(function (err) {
        reject(err);
      });
  });
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
    })
    .catch(e =>
      console.error(e)
    );
  axios.get(`${this.missionControlURL}/bids/${this.davId}/chosen`, {})
    .then(({ data }) => {
      data.forEach(bidid => {
        let bid = dav.bids[bidid];
        if (bid) {
          bid.onNext(bidid);
        }
      });
    })
    .catch(e =>
      console.error(e)
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

      const observable = new rx.Subject();
      dav.needTypes[needType] = observable;

      observable.update = async () => {
        await axios.put(`${dav.missionControlURL}/captains/${dav.davId}`, { need_type: needType, region });
      };

      return observable;
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
    return Promise.resolve(true);
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
      missionParams.bid_id = bidId;
      axios.post(`${dav.missionControlURL}/missions/${bidId}`, missionParams)
        .then((response) => {
          const mission = response.data;
          mission.update = () => {
            axios.put(`${dav.missionControlURL}/missions/${mission.mission_id}`,
              { status, latitude: 1, longitude: 1, dav_id: dav.davId })
              .then((response) => {
                dav.missions[mission.bid_id].onNext(response.data);
              });
          };
          dav.missions[bidId].onNext(mission);
        }).catch((err) => {
          console.error(err);
        });
      return dav.missions[bidId];
    }
  };
};

module.exports = davJS;

