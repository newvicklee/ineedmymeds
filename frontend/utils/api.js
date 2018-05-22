const axios = require('axios');
import { API_ROOT } from './config.js';



function search (searchText) {
    //return axios.get('http://127.0.0.1:5000/api/v1/search?drug=' + searchText);
    return axios.get(API_ROOT + '/search?drug=' + searchText);
};

function drugRequests () {
    return axios.get(API_ROOT + '/drug/requested');
};

function setAvailability (data) {
    return axios.post(API_ROOT + '/set-available', { data });
};

function logIn (phone) {
    return axios.get(API_ROOT + '/pharmacy/' + phone);
};

module.exports = {
    search,
    drugRequests,
    setAvailability,
    logIn
};
    
