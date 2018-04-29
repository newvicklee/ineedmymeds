const React = require('react');
const ReactRouter = require('react-router-dom');
const BrowserRouter = ReactRouter.BrowserRouter;
const Route = ReactRouter.Route;
const Switch = ReactRouter.Switch;
require('../style.scss');
const Nav = require('./Nav');
const Home = require('./Home');
const Pharmacy = require('./Pharmacy');





class App extends React.Component {

    render () {
        return (
          <BrowserRouter>
            <div>
                <Nav />
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/pharmacy' component={Pharmacy} />
                </Switch>
            </div>
          </BrowserRouter>
        )
    };
};

module.exports = App;


