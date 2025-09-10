// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchCourses, addCourse, enrollInCourse, updateProgress, getQuiz, submitQuiz } from './api';

function App() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollStudentName, setEnrollStudentName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses on component mount
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await fetchCourses();
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission for adding a new course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.target);
    const courseData = {
      title: formData.get('courseTitle'),
      description: formData.get('courseDescription'),
      quizQuestions: formData.get('quizQuestions')
    };

    try {
      await addCourse(courseData);
      alert('Course added successfully!');
      e.target.reset();
      // Reload the courses list
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle enrollment in a course
  const handleEnroll = async (courseId) => {
    if (!enrollStudentName.trim()) {
      alert('Please enter your name to enroll');
      return;
    }

    try {
      await enrollInCourse(courseId, enrollStudentName);
      alert(`Successfully enrolled ${enrollStudentName} in the course!`);
      setEnrollStudentName('');
      // Reload the courses list to show updated enrollment
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle viewing quiz for a course
  const handleViewQuiz = async (courseId) => {
    try {
      const quiz = await getQuiz(courseId);
      alert(`Quiz for course: ${JSON.stringify(quiz, null, 2)}`);
    } catch (err) {
      setError(err.message);
    }
  };
   	return (
    <div className="App">
      {/* Header with Navigation */}
      <header>
        <div className="container">
          <div className="header-content">
            <a href="#" className="logo">
              <i className="fas fa-graduation-cap"></i> LMS Lite
            </a>
        
            <ul className="nav-links">
              <li><a href="#" className="active">Home</a></li>
              <li><a href="#">Courses</a></li>
              <li><a href="#">My Learning</a></li>
              <li><a href="#">About</a></li>
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

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Learn Without Limits</h1>
          <p>Start, switch, or advance your career with our courses, certificates, and degrees from world-class universities and companies.</p>
          <button className="btn btn-primary">Join for Free</button>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        <h2 className="section-title">Popular Courses</h2>
        
        {/* Error message display */}
        {error && (
          <div className="error-message" style={{color: 'red', padding: '10px', margin: '10px 0', border: '1px solid red'}}>
            Error: [Error - You need to specify the message]
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && <div>Loading courses...</div>}
        
        <div className="courses-grid">
          {/* Course Cards */}
          {courses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span><i className="fas fa-users"></i> {course.enrolledCount || 0} students</span>
                </div>
                                {/* Enrollment input for this course */}
                <div style={{margin: '10px 0'}}>
                  <input 
                    type="text" 
                    placeholder="Your name" 
                    value={enrollStudentName}
                    onChange={(e) => setEnrollStudentName(e.target.value)}
                    style={{padding: '8px', width: '100%', marginBottom: '10px'}}
                  />
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn btn-outline" 
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleViewQuiz(course.id)}
                  >
                    View Quiz
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
               {/* Add Course Form */}
        <div className="form-container">
          <h2 className="form-title">Add New Course</h2>
          <form id="courseForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="courseTitle">Course Title</label>
              <input 
                type="text" 
                id="courseTitle" 
                name="courseTitle"
                className="form-control" 
                placeholder="Enter course title" 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="courseDescription">Course Description</label>
              <textarea 
                id="courseDescription" 
                name="courseDescription"
                className="form-control" 
                placeholder="Describe the course content"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="quizQuestions">Quiz Questions (format: question*answer)</label>
              <textarea 
                id="quizQuestions" 
                name="quizQuestions"
                className="form-control" 
                placeholder="Enter each question and answer in the format: question*answer (one per line)"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary">Add Course</button>
          </form>
        </div>
      </main>
            {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>LMS Lite</h3>
              <p>Empowering learners to achieve their personal and professional goals through high-quality education.</p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Courses</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; 2023 LMS Lite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
