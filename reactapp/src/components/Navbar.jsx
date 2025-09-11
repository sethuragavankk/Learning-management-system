// components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <i className="fas fa-graduation-cap"></i> LMS Lite
          </Link>
          
          <ul className="nav-links">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/courses" className={location.pathname === '/courses' ? 'active' : ''}>Courses</Link></li>
            <li><Link to="/mylearning" className={location.pathname === '/mylearning' ? 'active' : ''}>My Learning</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
          </ul>
          
          <div className="user-actions">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Search courses..." />
            </div>
            <button className="btn btn-outline">Log In</button>
            <button className="btn btn-primary">Sign Up</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;