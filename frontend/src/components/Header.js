import React from 'react';
import logo from '../logo.svg';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <header className='header'>
      <img className='header__logo' src={logo} alt='header-logo' />
      <div className='header__menu'>
        {props.isLoggedIn ? (
          <>
            <Link className='header__links' to=''>
              {props.values.email}
            </Link>

            <Link className='header__links' to='/login' onClick={props.handleLogOut}>
              Log Out
            </Link>
          </>
        ) : (
          <Link className='header__links' to={props.link}>
            {props.linkName}
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
