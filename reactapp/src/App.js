// App.js - Add more detailed debugging
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import MyLearning from './components/MyLearning';
import About from './components/About';
import { Login, Signup } from './components/Auth';
import AddCourse from './components/AddCourse';
import { getCoursesWithFallback } from './services/api';
import './App.css';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Role check helper for string role format
  const isInstructor = (userToCheck) => {
    console.log('=== isInstructor FUNCTION CALLED ===');
    
    if (!userToCheck) {
      console.log('No user provided to isInstructor check');
      return false;
    }
    
    console.log('User object in isInstructor:', userToCheck);
    
    // Check if user has role data
    if (!userToCheck.role) {
      console.log('User has no role property');
      return false;
    }
    
    console.log('User role:', userToCheck.role);
    console.log('Role type:', typeof userToCheck.role);
    
    // Check if role is exactly "instructor" (case insensitive)
    const isInstructorResult = userToCheck.role.toLowerCase() === "instructor";
    
    console.log('Is user instructor?', isInstructorResult);
    console.log('==================================');
    
    return isInstructorResult;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        console.log('Loaded user from localStorage:', userData);
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getCoursesWithFallback();

         if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        setCourses([]);
      }
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    console.log('Is logged in user instructor?', isInstructor(userData));
    setUser(userData);
  };

  const handleSignup = (userData) => {
    console.log('User signed up:', userData);
    console.log('Is signed up user instructor?', isInstructor(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    console.log('User logging out');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          isInstructor={() => isInstructor(user)} 
        />
        <Routes>
          <Route 
            path="/" 
            element={<Home courses={courses} loading={loading} error={error} user={user} />} 
          />
          <Route 
            path="/courses" 
            element={<Courses user={user} courses={courses} loading={loading} error={error} />} 
          />
          <Route 
            path="/mylearning" 
            element={user ? <MyLearning user={user}/> : <Navigate to="/login" />} 
          />
          <Route path="/about" element={<About />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/" /> : <Signup onSignup={handleSignup} />} 
          />
          <Route 
            path="/addcourse" 
            element={<AddCourse/>}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;