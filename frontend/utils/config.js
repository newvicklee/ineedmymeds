let backEndHost;
const apiVersion= 'v1';

const hostname = window && window.location && window.location.hostname;

if (hostname === 'www.ineedmymeds.ca') {
    backEndHost = 'http://api.ineedmymeds.ca';
} else {
    backEndHost = 'http://127.0.0.1:5000';
};

export const API_ROOT = backEndHost + '/api/' + apiVersion;
