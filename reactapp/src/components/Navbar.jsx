import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Function to check if user is instructor based on backend roles
  const isInstructor = () => {
    if (!user) return false;
    
    // Check role based on backend structure
    // Could be user.role, user.user.role, or user.roles array
    let userRole = '';
    
    if (user.role) {
      // If role is directly on user object
      userRole = user.role;
    } else if (user.user && user.user.role) {
      // If role is nested in user object
      userRole = user.user.role;
    } else if (user.roles && user.roles.length > 0) {
      // If roles is an array (common in JWT responses)
      userRole = user.roles[0];
    }
    
    console.log('User role detected:', userRole);
    
    // Check for both possible role formats
    return userRole === 'ROLE_INSTRUCTOR' || userRole === 'INSTRUCTOR';
  };

  // Function to check if user is student
  const isStudent = () => {
    if (!user) return false;
    
    let userRole = '';
    
    if (user.role) {
      userRole = user.role;
    } else if (user.user && user.user.role) {
      userRole = user.user.role;
    } else if (user.roles && user.roles.length > 0) {
      userRole = user.roles[0];
    }
    
    console.log('User role detected:', userRole);
    
    return userRole === 'ROLE_STUDENT' || userRole === 'STUDENT';
  };

  // Detailed debugging
  useEffect(() => {
    console.log('=== NAVBAR DEBUG INFO ===');
    console.log('User object:', user);
    if (user) {
      console.log('User role property:', user.role);
      console.log('User.user role property:', user.user?.role);
      console.log('User.roles array:', user.roles);
      console.log('Is instructor:', isInstructor());
      console.log('Is student:', isStudent());
    } else {
      console.log('No user logged in');
    }
    console.log('=======================');
  }, [user]);

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
              <>
                {isInstructor() ? (
                  <>
                    <li><Link to="/addcourse" className={location.pathname === '/addcourse' ? 'active' : ''}>Add Course</Link></li>
                  </>
                ) : isStudent() ? (
                  <li><Link to="/mylearning" className={location.pathname === '/mylearning' ? 'active' : ''}>My Learning</Link></li>
                ) : null}
              </>
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
                <span className="welcome-text">Welcome, {user.name || user.user?.name}</span>
                {isInstructor() && <span className="badge instructor-badge">Instructor</span>}
                {isStudent() && <span className="badge student-badge">Student</span>}
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