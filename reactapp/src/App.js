import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import MyLearning from './components/MyLearning';
import About from './components/About';
import { Login, Signup } from './components/Auth';
import { getCoursesWithFallback } from './services/api';
import './App.css';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
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
      
      // Ensure we always set an array
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        console.warn('API returned non-array data, setting empty array');
        setCourses([]);
      }
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

    return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                courses={courses} 
                loading={loading} 
                error={error} 
              />
            } 
          />
          <Route 
            path="/courses" 
            element={
              <Courses 
              user={user}
                courses={courses} 
                loading={loading} 
                error={error} 
              />
            } 
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
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;