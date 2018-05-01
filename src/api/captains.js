const axios = require('axios');

const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'http://localhost:8888';

const addCaptain = async (captain) => {
  return axios
    .post(`${MISSION_CONTROL_URL}/captains`, captain)
    .then(response => response.data)
    .catch(err => console.log(err));
};