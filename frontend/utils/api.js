const axios = require('axios');



function search (searchText) {
    return axios.get('http://127.0.0.1:5000/api/v1/search?drug=' + searchText);
};

function drugRequests () {
    return axios.get('http://127.0.0.1:5000/api/v1/drug/requested');
};

function setAvailability (data) {
    return axios.post('http://127.0.0.1:5000/api/v1/set-available', { data });
};

function logIn (phone) {
    return axios.get('http://127.0.0.1:5000/api/v1/pharmacy/' + phone);
};

module.exports = {
    search,
    drugRequests,
    setAvailability,
    logIn
};
    
