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
            <NavLink to='/pharmacy' className="menu-login">Log In</NavLink>
        </div>
    </nav>
  )
}

module.exports = Nav;
