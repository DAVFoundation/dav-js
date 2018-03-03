const axios = require('axios')


async function MissionControl(needTypes, notificationURL, missionControlURL = "https://ctrl.missions.io") {
  if (!notificationURL) throw "notificationURL is not set";
  this.missionControlURL = missionControlURL;
  this.notificationURL = notificationURL;

  const registrationResponse = await axios.post(this.missionControlURL + '/needs/register', {need_types: needTypes, notification_url: this.notificationURL});

  this.davId = registrationResponse.dav_id;
}

MissionControl.prototype.bid = async function (needId, bids){

}
