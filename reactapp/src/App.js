// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Courses from './components/Courses';
import MyLearning from './components/MyLearning';
import About from './components/About';
import { Login, Signup } from './components/Auth';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Fetch courses (mock data for demonstration)
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from an API
        const mockCourses = [
          {
            id: 1,
            title: 'Web Development Fundamentals',
            description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
            enrolledCount: 1250
          },
          {
            id: 2,
            title: 'Data Science with Python',
            description: 'Master data analysis, visualization, and machine learning with Python.',
            enrolledCount: 890
          },
          {
            id: 3,
            title: 'UX/UI Design Principles',
            description: 'Create beautiful and functional user interfaces with proven design principles.',
            enrolledCount: 745
          },
          {
            id: 4,
            title: 'Mobile App Development',
            description: 'Build cross-platform mobile applications using React Native.',
            enrolledCount: 620
          },
          {
            id: 5,
            title: 'Cloud Computing Essentials',
            description: 'Understand cloud services and deployment models for modern applications.',
            enrolledCount: 530
          },
          {
            id: 6,
            title: 'Digital Marketing Strategies',
            description: 'Learn to create effective digital marketing campaigns across platforms.',
            enrolledCount: 1100
          }
        ];
       
        setCourses(mockCourses);
        setLoading(false);
      } catch (err) {
        setError('Failed to load courses');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleSignup = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home courses={courses} loading={loading} error={error} />} />
          <Route path="/courses" element={<Courses courses={courses} loading={loading} error={error} />} />
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
    </Router>
  );
}

export default App;