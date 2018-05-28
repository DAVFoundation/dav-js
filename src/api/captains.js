const axios = require('axios');

const MISSION_CONTROL_URL = process.env.MISSION_CONTROL_URL || 'http://localhost:8888';

const addCaptain = async (captain) => {
  return axios
    .post(`${MISSION_CONTROL_URL}/captains`, captain)
    .then(response => response.data)
    .catch(err => console.log(err));
};

const getCaptain = async (captainId) => {
  return axios
    .get(`${MISSION_CONTROL_URL}/captains/${captainId}`)
    .then(response => response.data)
    .catch(err => console.log(err));
};

const updateCaptain = async (captain) => {
  return axios
    .put(`${MISSION_CONTROL_URL}/captains/${captain.id}`, captain)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  addCaptain,
  getCaptain,
  updateCaptain
};