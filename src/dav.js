const axios = require('axios');
const uuid = require('uuid/v4');
const Rx = require('rxjs/Rx');

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const DavContracts = require('./dav-contracts');
const ETH_NODE_URL = process.env.ETH_NODE_URL || 'http://52.71.196.240:8545';
const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'http://localhost:8888';
const BLOCKCHAIN_TYPE = process.env.BLOCKCHAIN_TYPE || 'DAVTESTNET';

class DavSDK {
  constructor(davId, wallet, mnemonic = null) {
    if (BLOCKCHAIN_TYPE !== 'NONE') {
      const web3Provider = mnemonic ? new HDWalletProvider(mnemonic, ETH_NODE_URL) : window.web3.currentProvider;
      this.web3 = new Web3(web3Provider);
      this.davContracts = new DavContracts(this.web3);
    }

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
    try {
      axios.post(`${this.missionControlURL}/captains`, captain);
    } catch (err) {
      console.error(err);
    }
  }

  async isRegistered() {
    if (BLOCKCHAIN_TYPE === 'NONE') {
      return true;
    }
    const dav = this;
    const instance = await dav.davContracts.getInstance('identity');
    return await instance.isRegistered.call(dav.davId);
  }

  async registerSimple() {
    const dav = this;
    if (BLOCKCHAIN_TYPE === 'NONE') return true;

    try {
      const identityContractInstance = await this.davContracts.getInstance('identity');
      const isRegistered = await identityContractInstance.isRegistered.call(dav.davId);
      if (isRegistered) return true;

      await identityContractInstance.registerSimple({ from: dav.wallet });
      return true;  
    } catch (err) {
      return err;
    }
  }

  register() {
    const dav = this;
    if (BLOCKCHAIN_TYPE === 'NONE') {
      return Promise.resolve(true);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const identityContractInstance = await this.davContracts.getInstance('identity');
        const isRegistered = await identityContractInstance.isRegistered.call(dav.davId);
        if (isRegistered) {
          resolve(true);
        }
        const msg = 'DAV Identity Registration';
        const hash = dav.web3.sha3(msg);
        dav.web3.eth.sign(dav.davId, hash, async (error, signature) => {
          if(error) {
            reject(error);
          }
          signature = signature.substr(2);
          const v_hex = signature.slice(128, 130);
          const r = '0x' + signature.slice(0, 64);
          const s = '0x' + signature.slice(64, 128);
          const v = dav.web3.toDecimal(v_hex) + 27;

          await identityContractInstance.register(dav.davId, v, r, s, { from: dav.wallet });
          //should resolve after registerSimple is done
          resolve(true);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  async getUpdate() {
    const dav = this;
    try {
      const response = await axios.get(`${this.missionControlURL}/needs/${this.davId}`, {});
      response.data.forEach(need => {
        if (!dav.needArray[need.id] && dav.needTypes[need.need_type]) {
          dav.needArray[need.id] = true;
          dav.needTypes[need.need_type].next(need);
        }
      });
    } catch(e) {
      console.error(e);
    }
  }

  needs() {
    const dav = this;
    return {
      forType: (needType, region) => {
        if (!region.global) {
          if (!region.latitude) throw new Error('region latitude is not set');
          if (!region.longitude) throw new Error('region longitude is not set');
          if (!region.radius) throw new Error('region radius is not set');
        }
        region.ttl = region.ttl || 120;

        const registerNeedTypeForCaptain = () => axios.post(`${dav.missionControlURL}/captains/${dav.davId}`, { need_type: needType, region })
          .catch((err) => {
            console.error(err);
          });

        registerNeedTypeForCaptain();

        Rx.Observable.interval(90000 /*1.5m*/).subscribe(
          registerNeedTypeForCaptain,
          (err) => console.log('Error: ' + err),
          () => console.log(''));

        const observable = new Rx.Subject();
        dav.needTypes[needType] = observable;

        observable.update = async () => await axios.put(`${dav.missionControlURL}/captains/${dav.davId}/needs`, { need_type: needType, region });

        return observable;
      }
    };
  }

  bid() {
    const dav = this;
    return {
      forNeed: (needId, bid) => {
        // generate new unique 128bit id for bid
        const binaryId = new Array(16);
        uuid(null, binaryId, 0);
        bid.id = Buffer.from(binaryId).toString('hex');

        dav.bids[bid.id] = new Rx.Subject;
        Rx.Observable.interval(1000).take(120).subscribe(
          async ()=>{
            try {
              const response = await axios.get(`${this.missionControlURL}/bids/${needId}/chosen`, {});
              response.data.forEach((bid) => {
                if (bid && dav.bids[bid.id]) {
                  dav.bids[bid.id].next(bid);
                  if (BLOCKCHAIN_TYPE === 'NONE') {
                    this.startMission(bid.id);
                  }
                }
              });
            } catch(e) {
              console.error(e);
            }
          },
          (err) => console.log('Error: ' + err),
          () => console.log('')
        );
        axios.post(`${dav.missionControlURL}/bids/${needId}`, bid);
        return dav.bids[bid.id];
      }
    };
  }

  async createMissionTransaction(vehicleId, missionCost) {
    const dav = this;
    if (BLOCKCHAIN_TYPE === 'NONE') return true;

    try {
      const tokenContractInstance = await this.davContracts.getInstance('token');
      const missionContractInstance = await this.davContracts.getInstance('mission');
      await tokenContractInstance.approve(missionContractInstance.address, missionCost, { from: dav.wallet });
      return await missionContractInstance.create(vehicleId, dav.davId, missionCost, { from: dav.wallet });
    } catch (err) {
      throw err;
    }
  }

  contract() {
    let dav = this;
    return {
      forBid: (bidId, contract) => {
        dav.contracts[bidId] = new Rx.Subject;
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
      begin: async (bidId, missionParams) => {
        dav.missions[bidId] = new Rx.Subject;
        missionParams.dav_id = dav.davId;
        missionParams.bid_id = bidId;
        try {
          const response = await axios.post(`${dav.missionControlURL}/missions/${bidId}`, missionParams);
          const mission = response.data;
          mission.update = async () => {
            const putResponse = await axios.put(`${dav.missionControlURL}/missions/${mission.mission_id}`,
              { status, latitude: 1, longitude: 1, dav_id: dav.davId });
            dav.missions[mission.bid_id].next(putResponse.data);
          };
          dav.missions[bidId].next(mission);
        } catch (err) {
          console.log(err);
        }

        return dav.missions[bidId];
      },
      contract: () => {
        this.missionContract = new Rx.Subject;
        if (BLOCKCHAIN_TYPE !== 'NONE') {
          this.subscribeToMissionContract().catch(err => console.log(err));
        }
        return this.missionContract;
      }
    };
  }

  async getMission(missionId) {
    try {
      const response = await axios.get(`${MISSION_CONTROL_URL}/missions/${missionId}`, {json: true});
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
  
  async updateMission(missionId, missionUpdate) {
    try {
      return axios.put(`${MISSION_CONTROL_URL}/missions/${missionId}`, missionUpdate);
    } catch (err) {
      console.log(err);
    }
  }
  
  async getCaptain(captainId) {
    try {
      const response = await axios.get(`${MISSION_CONTROL_URL}/captains/${captainId}`);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
  
  async updateCaptain(captain) {
    try {
      const response = await axios.put(`${MISSION_CONTROL_URL}/captains/${captain.id}`, captain);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }

  async subscribeToMissionContract() {
    const basicMissionContractInstance = await this.davContracts.getInstance('mission');
    this.createMissionEvent = basicMissionContractInstance.Create();
    this.createMissionEvent.watch(
      (error, response) => {
        if (error) {
          return console.error(error);
        } 
        let bidId = Buffer.from(response.args.id.substr(2), 'hex').toString();
        let userId = response.args.buyerId.toLowerCase();
        let vehicleId = response.args.sellerId.toLowerCase();
        if(vehicleId === this.davId) {
          this.startMission(bidId, userId);
        }
      }
    );
  }

  async startMission(bidId, userId=null) {
    let mission = await axios.get(`${MISSION_CONTROL_URL}/bids/${bidId}/mission`, {json: true});
    mission = mission.data;
    if (!mission || mission.status !== 'awaiting_signatures') return;

    if((mission.user_id === userId && BLOCKCHAIN_TYPE === 'NONE') || mission.contract_id == null) {
      // console.log(mission);
      await this.updateMission(mission.mission_id, {
        'captain_id': mission.captain_id,
        'bid_id': bidId,
        'status': 'in_progress',
      });
      this.missionContract.next(mission);
    }
    
  }

  async dispose() {
    this.contractUpdates.unsubscribe();
  }
}

module.exports = DavSDK;
