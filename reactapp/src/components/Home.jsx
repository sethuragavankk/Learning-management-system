import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCoursesWithFallback, userAPI } from '../services/api'; 
import './Home.css';

const Home = ({ user = null }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(user?.role || ['student']);

  // Check if user is an instructor
  const isInstructor = userRole.includes('instructor') || userRole.includes('ROLE_INSTRUCTOR');

  // Fetch user profile if not provided
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && !user) {
          const profile = await userAPI.getProfile();
          setUserRole(profile.role || ['student']);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getCoursesWithFallback();
        setCourses(coursesData);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error('Course fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Ensure courses is always an array and get featured courses
  const featuredCourses = React.useMemo(() => {
    if (!Array.isArray(courses)) {
      return [];
    }
    return courses.slice(0, 3);
  }, [courses]);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Learn Without Limits</h1>
          <p>Start, switch, or advance your career with our courses, certificates, and degrees from world-class universities and companies.</p>
          {isInstructor ? (
            <Link to="/add-course" className="btn btn-primary">Add New Course</Link>
          ) : (
            <Link to="/courses" className="btn btn-primary">Browse All Courses</Link>
          )}
        </div>
      </section>
      {/* Main Content */}
      <main className="container">
        <h2 className="section-title">Featured Courses</h2>
        
        {/* Error message display */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && <div className="loading">Loading courses...</div>}
        
        {/* Courses Grid */}
        {!loading && !error && (
          <div className="courses-grid">
            {featuredCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.courseName || course.title || 'Unnamed Course'}</h3>
                  <p className="course-description">
                    {course.description || 'Comprehensive course covering essential topics and skills.'}
                  </p>
                  <div className="course-meta">
                    <span><i className="fas fa-users"></i> {course.enrolledCount || 50} students</span>
                    <span><i className="fas fa-star"></i> {course.rating || '4.8'}</span>
                  </div>
                  <div className="course-actions">
                    {isInstructor ? (
                      <Link to={`/edit-course/${course.id}`} className="btn btn-primary">Manage Course</Link>
                    ) : (
                      <Link to={`/courses/${course.id}`} className="btn btn-primary">View Details</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Empty state when no courses available */}
        {!loading && !error && featuredCourses.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-book-open"></i>
            <h3>No courses available</h3>
            <p>Check back later for new courses.</p>
            {isInstructor && (
              <Link to="/add-course" className="btn btn-primary">Create Your First Course</Link>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-section">
          <h2>Start Your Learning Journey Today</h2>
          <p>Join thousands of students who are advancing their careers with our courses</p>
          {isInstructor ? (
            <Link to="/add-course" className="btn btn-accent">Create New Course</Link>
          ) : (
            <Link to="/courses" className="btn btn-accent">Explore All Courses</Link>
          )}
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