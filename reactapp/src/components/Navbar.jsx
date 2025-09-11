// components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

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
            {user && (
              <li><Link to="/mylearning" className={location.pathname === '/mylearning' ? 'active' : ''}>My Learning</Link></li>
            )}
            <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link></li>
          </ul>
          
          <div className="user-actions">
            <form className="search-bar" onSubmit={handleSearch}>
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {user ? (
              <div className="user-menu">
                <span className="welcome-text">Welcome, {user.name}</span>
                <button className="btn btn-outline" onClick={handleLogout}>Log Out</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline">Log In</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;