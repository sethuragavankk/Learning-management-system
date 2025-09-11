import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ courses, loading, error }) => {
  const featuredCourses = courses.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Learn Without Limits</h1>
          <p>Start, switch, or advance your career with our courses, certificates, and degrees from world-class universities and companies.</p>
          <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">
        <h2 className="section-title">Featured Courses</h2>
        
        {/* Error message display */}
        {error && (
          <div className="error-message">
            Error: [Error - You need to specify the message]
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && <div className="loading">Loading courses...</div>}
        
        <div className="courses-grid">
          {/* Course Cards */}
          {featuredCourses.map(course => (
            <div key={course.id} className="course-card">
              <div className="course-image">
                <i className="fas fa-laptop-code"></i>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span><i className="fas fa-users"></i> {course.enrolledCount || 50} students</span>
                  <span><i className="fas fa-star"></i> 4.8</span>
                </div>
                <div className="course-actions">
                  <Link to="/courses" className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Call to Action */}
        <div className="cta-section">
          <h2>Start Your Learning Journey Today</h2>
          <p>Join thousands of students who are advancing their careers with our courses</p>
          <Link to="/courses" className="btn btn-accent">Explore All Courses</Link>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Courses Available</p>
          </div>
          <div className="stat-item">
            <h3>50,000+</h3>
            <p>Active Learners</p>
          </div>
          <div className="stat-item">
            <h3>200+</h3>
            <p>Expert Instructors</p>
          </div>
          <div className="stat-item">
            <h3>95%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;