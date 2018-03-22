const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const rx = require('rx-lite');

function davJS(davId) {
  if (!process.env.MISSION_CONTROL_URL) throw new Error('MISSION_CONTROL_URL is not set');
  if (!process.env.NOTIFICATION_URL) throw new Error('NOTIFICATION_URL is not set');

  const port = process.env.WEB_SERVER_PORT || 7000;

  this.davId = davId;


  this.missionControlURL = process.env.MISSION_CONTROL_URL;
  this.notificationURL = process.env.NOTIFICATION_URL;

  this.server = express();
  this.server.use(bodyParser.json());
  this.needTypes = {};
  this.bids = {};
  this.contracts = {};
  this.missions = {};

  this.server.post('/', (req, res) => {
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
  });

  this.server.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });

  axios.post(`${this.missionControlURL}/captains`, { dav_id: davId, notification_url: this.notificationURL })
    .catch((err) => {
      console.error(err);
    });
}

const generateMissionUpdateFunction = function (mission, davContext) {
  return function ({ status, latitude, longitude }) {
    axios.put(`${davContext.missionControlURL}/missions/${mission.mission_id}`, { status, latitude, longitude })
      .then((response) => {
        davContext.missions[mission.bid_id].onNext(response.data);
      });
  };
};

davJS.prototype.needs = function () {
  let dav = this;
  return {
    forType: (needType, region) => {
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
      dav.bids[needId] = new rx.Subject;
      bid.dav_id = dav.davId;
      axios.post(`${dav.missionControlURL}/bids/${needId}`, bid)
        .then((response) => {
          dav.bids[needId].onNext(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
      return dav.bids[needId];
    }
  };
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

