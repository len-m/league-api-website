import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

/**
 * Navigation bar
 */
function Nav() {
  return (
    <nav className="navBar">
      <ul className="navLinks">
        <Link to="/" className="navButton">
            <li>Home</li>
        </Link>
        <Link to="/myslibros" className="navButton">
            <li>µslibros</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;