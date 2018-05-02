var React = require('react');
var NavLink = require('react-router-dom').NavLink;
import logo from '../imgs/logo.png';

function Nav () {
  return (
    <nav className='menu-container'>
        <div className="menu">
            <NavLink exact to='/' className="navbar-brand">
                <span className="navbar-logo"><img className="logo" src={logo}/></span>
            </NavLink>
            <div>
                <NavLink to='/pharmacy' className="login">Pharmacy &rarr; Log In</NavLink>
            </div>
        </div>
    </nav>
  )
}

module.exports = Nav;
