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

  this.server.post('/', (req, res) => {
    const params = req.body;
    switch (params.notification_type) {
      case 'new_need':
        const need = params.data.need;
        this.needTypes[need.need_type].onNext(need);
        break;
      case 'bid':
        const bid = params.data.bid;
        this.bids[bid.need_id].onNext(bid);
        break;
      case 'contract':
        const contract = params.data.contract;
        this.contracts[contract.bid_id].onNext(contract);
        break;
    }
    res.sendStatus(200);
  });

  this.server.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });

  axios.post(this.missionControlURL + '/captains', {dav_id: davId, notification_url: this.notificationURL})
    .catch((err) => {
      console.error(err);
    });

}

davJS.prototype.needs = function () {
  return {
    forType: (needType, region) => {
      axios.post(this.missionControlURL + `/captains/${this.davId}`, {need_type: needType, region})
        .catch((err) => {
          console.error(err);
        });
      this.needTypes[needType] = new rx.Subject();
      return this.needTypes[needType];
    }
  };
};

davJS.prototype.bid = function () {
  return {
    forNeed: (needId, bid) => {
      this.bids[needId] = new rx.Subject;
      bid.dav_id = this.davId;
      axios.post(this.missionControlURL + `/bids/${needId}`, bid)
        .then((response) => {
          this.bids[needId].onNext(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
      return this.bids[needId];
    }
  };
};

davJS.prototype.contract = function () {
  return {
    forBid: (bidId, contract) => {
      this.contracts[bidId] = new rx.Subject;
      contract.dav_id = this.davId;
      axios.post(this.missionControlURL + `/contracts/${bidId}`, contract)
        .catch((err) => {
          console.error(err);
        })
      return this.contracts[bidId];
    }
  }
}

module.exports = davJS;

