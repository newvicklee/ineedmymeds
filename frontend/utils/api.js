const axios = require('axios');



function search (searchText) {
    return axios.get('http://127.0.0.1:5000/api/v1/search?drug=' + searchText);
};

function drugRequests () {
    return axios.get('http://127.0.0.1:5000/api/v1/drug/requested');
};


module.exports = {
    search,
    drugRequests
};
    
