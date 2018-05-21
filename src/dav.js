const axios = require('axios');
const uuid = require('uuid/v4');
const rx = require('rx-lite');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const DavContracts = require('./dav-contracts');
const { updateMission, getMissionByBidId } = require('./api/missions');

const ETH_NODE_URL = process.env.ETH_NODE_URL || 'http://localhost:8545';
const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'http://localhost:8888';

class DavSDK {
  constructor(davId, wallet, mnemonic = null) {
    let web3Provider;
    if(mnemonic) {
      web3Provider = new HDWalletProvider(mnemonic, ETH_NODE_URL);
    } else {
      web3Provider = window.web3.currentProvider;
    }
    this.web3 = new Web3(web3Provider);

    this.davContracts = new DavContracts(this.web3);
    this.davId = davId;
    this.wallet = wallet;

    this.missionControlURL = MISSION_CONTROL_URL;

    this.needTypes = {};
    this.bids = {};
    this.needArray = {};
    this.contracts = {};
    this.missions = {};
  }

  initCaptain(captain) {
    setInterval(this.getUpdate.bind(this), 1000);

    axios.post(`${this.missionControlURL}/captains`, captain)
      .catch((err) => {
        console.error(err);
      });
  }

  isRegistered() {
    let dav = this;
    return this.davContracts.getInstance('identity')
      .then(function (instance) {
        return instance.isRegistered.call(dav.davId);
      });
  }

  registerSimple() {
    let dav = this;
    if (process.env.NODE_ENV === 'development' && dav.web3.isConnected()) {
      return Promise.resolve({});
    }

    return new Promise(function (resolve, reject) {
      // console.log(dav.wallet);
      var identityContractInstance;
      return this.davContracts.getInstance('identity')
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
  }

  register() {
    let dav = this;
    if (process.env.NODE_ENV === 'development' && dav.web3.isConnected()) {
      return Promise.resolve({});
    }

    return new Promise(function (resolve, reject) {
      // console.log(dav.wallet);
      var identityContractInstance;
      return this.davContracts.getInstance('identity')
        .then(function (instance) {
          identityContractInstance = instance;
          return instance.isRegistered.call(dav.davId);
        })
        .then(function (isRegistered) {
          if (isRegistered === false) {
            const msg = 'DAV Identity Registration';
            const hash = dav.web3.sha3(msg);
            dav.web3.eth.sign(dav.davId, hash, (error, signature) => {
              if(error) {
                reject(error);
              }
              signature = signature.substr(2);
              const v_hex = signature.slice(128, 130);
              const r = '0x' + signature.slice(0, 64);
              const s = '0x' + signature.slice(64, 128);
              const v = dav.web3.toDecimal(v_hex) + 27;
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
  }

  getUpdate() {
    let dav = this;
    axios.get(`${this.missionControlURL}/needs/${this.davId}`, {})
      .then(({ data }) => {
        data.forEach(need => {
          if (!dav.needArray[need.id] && dav.needTypes[need.need_type]) {
            dav.needArray[need.id] = true;
            dav.needTypes[need.need_type].onNext(need);
          }
        });
      })
      .catch(e =>
        console.error(e)
      );

    axios.get(`${this.missionControlURL}/bids/${this.davId}/chosen`, {})
      .then(({ data }) => {
        data.forEach((bid) => {
          // let bid = dav.bids[bid.id];
          if (bid && dav.bids[bid.need_id]) {
            dav.bids[bid.need_id].onNext(bid);
          }
        });
      })
      .catch(e =>
        console.error(e)
      );
  }

  needs() {
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
          await axios.put(`${dav.missionControlURL}/captains/${dav.davId}/needs`, { need_type: needType, region });
        };

        return observable;
      }
    };
  }

  bid() {
    let dav = this;
    return {
      forNeed: async (needId, bid) => {
        // generate new unique 128bit id for bid
        let binaryId = new Array(16);
        uuid(null, binaryId, 0);
        bid.id = Buffer.from(binaryId).toString('hex');

        dav.bids[bid.id] = new rx.Subject;
        bid.captain_id = dav.davId;
        await axios.post(`${dav.missionControlURL}/bids/${needId}`, bid);
        return dav.bids[bid.id];
      }
    };
  }

  createMissionTransaction(vehicleId, missionCost) {
    let dav = this;
    if (process.env.NODE_ENV === 'development' && dav.web3.isConnected()) {
      return Promise.resolve(true);
    }

    return new Promise(function (resolve, reject) {
      var tokenContractInstance;
      var missionContractInstance;
      return this.davContracts.getInstance('token')
        .then(function (instance) {
          tokenContractInstance = instance;
          return this.davContracts.getInstance('mission')
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
  }

  contract() {
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
  }

  mission() {
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
      },
      contract: () => {
        this.missionContract = new rx.Subject;
        this.subscribeToMissionContract().catch(err => console.log(err));
        return this.missionContract;
      }
    };
  }

  async subscribeToMissionContract() {
    let basicMissionContractInstance = await this.davContracts.getInstance('mission');
    this.createMissionEvent = basicMissionContractInstance.Create();
    this.createMissionEvent.watch(
      async (error, response) => {
        if (error) {
          console.error(error);
        } else {
          let bidId = Buffer.from(response.args.id.substr(2), 'hex').toString();
          let userId = response.args.buyerId.toLowerCase();
          let vehicleId = response.args.sellerId.toLowerCase();
          if(vehicleId === this.davId) {
            let mission = null;
            mission = await getMissionByBidId(bidId);
            if (mission && mission.status === 'awaiting_signatures') {
              if(mission.user_id === userId
                || mission.contract_id == null) {
                console.log(mission);
                await updateMission(mission.mission_id, {
                  'captain_id': this.davId,
                  'bid_id': bidId,
                  'status': 'in_progress',
                });
                this.missionContract.onNext(mission);
              }
            }
          }
        }
      }
    );
  }
  async dispose() {
    this.contractUpdates.unsubscribe();
  }
}

module.exports = DavSDK;

