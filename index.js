const axios = require('axios')


async function MissionControl(needTypes, notificationURL, missionControlURL = "https://ctrl.missions.io") {
  if (!notificationURL) throw "notificationURL is not set";
  this.missionControlURL = missionControlURL;

  const registrationResponse = await axios.post(this.missionControlURL + '/needs/register', {need_types: needTypes, notification_url: notificationURL});

  this.davId = registrationResponse.dav_id;
  this.notificationURL = notificationURL;
}




