const React = require('react');
const ReactDOM = require('react-dom');
const api = require('./utils/api');
require('./style.scss');
const App = require('./components/App');


ReactDOM.render(
  <App />, 
  document.getElementById('app')
);
