import React, { useState, useEffect } from 'react';
import { userAPI, coursesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './MyLearning.css';

const MyLearning = ({ user }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingProgress, setUpdatingProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const courses = await userAPI.getEnrolledCourses();
      setEnrolledCourses(courses);
    } catch (err) {
      setError('Failed to load your courses. Please try again later.');
      console.error('Error fetching enrolled courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = async (courseId) => {
    try {
      setUpdatingProgress(courseId);
      
      // Get current progress and increment by 10%
      const currentCourse = enrolledCourses.find(c => c.id === courseId);
      const currentProgress = currentCourse.progress || 0;
      const newProgress = Math.min(currentProgress + 10, 100);
      
      await coursesAPI.updateProgress(courseId, newProgress);
      
      // Update local state
      setEnrolledCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === courseId
            ? { ...course, progress: newProgress, lastAccessed: new Date().toISOString() }
            : course
        )
      );
      
      // Navigate to course content (simulated)
      alert(`Continuing with ${currentCourse.courseName || currentCourse.title}. Progress updated to ${newProgress}%`);
      
    } catch (err) {
      alert('Failed to update progress. Please try again.');
      console.error('Progress update error:', err);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleViewCertificate = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    alert(`Certificate for ${course.courseName || course.title} would be displayed here.`);
  };

  const handleViewDetails = (courseId) => {
    navigate(`/courses?course=${courseId}`);
  };
  // Filter courses based on active tab
  const filteredCourses = activeTab === 'all' 
    ? enrolledCourses 
    : activeTab === 'in-progress' 
      ? enrolledCourses.filter(course => (course.progress || 0) < 100) 
      : enrolledCourses.filter(course => (course.progress || 0) === 100);

  // Calculate statistics
  const stats = {
    inProgress: enrolledCourses.filter(c => (c.progress || 0) < 100).length,
    completed: enrolledCourses.filter(c => (c.progress || 0) === 100).length,
    totalHours: enrolledCourses.reduce((total, course) => total + (course.duration || 0), 0),
    certificates: enrolledCourses.filter(c => (c.progress || 0) === 100).length
  };

  const formatLastAccessed = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getCourseThumbnailIcon = (category) => {
    switch(category) {
      case 'Technology': return 'laptop-code';
      case 'Business': return 'chart-line';
      case 'Design': return 'pencil-ruler';
      case 'Science': return 'flask';
      default: return 'book';
    }
  };
  return (
    <div className="mylearning-page">
      <div className="container">
        <div className="page-header">
          <h1>My Learning</h1>
          <p>Continue your learning journey</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="learning-tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => setActiveTab('all')}
          >
            All Courses
          </button>
          <button 
            className={activeTab === 'in-progress' ? 'active' : ''} 
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''} 
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        {/* Loading indicator */}
        {loading && <div className="loading">Loading your courses...</div>}

        {/* Courses List */}
        {!loading && !error && (
          <div className="learning-courses">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <div key={course.id} className="learning-course-card">
                  <div className="course-thumbnail">
                    <i className={`fas fa-${getCourseThumbnailIcon(course.category)}`}></i>
                  </div>
                             <div className="course-details">
                    <h3>{course.courseName || course.title}</h3>
                    <p className="course-category">{course.category || 'General'}</p>
                    
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${course.progress || 0}%`}}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress || 0}% complete</span>
                    </div>
                    
                    <p className="last-accessed">
                      Last accessed: {formatLastAccessed(course.lastAccessed)}
                    </p>
                    
                    {course.completedAt && (
                      <p className="completed-date">
                        Completed on: {new Date(course.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="course-actions">
                    {(course.progress || 0) === 100 ? (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleViewCertificate(course.id)}
                      >
                        View Certificate
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleContinueLearning(course.id)}
                        disabled={updatingProgress === course.id}
                      >
                        {updatingProgress === course.id ? 'Updating...' : 'Continue Learning'}
                      </button>
                    )}
                                      <button 
                      className="btn btn-outline"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      Course Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-book-open"></i>
                <h3>No courses found</h3>
                <p>
                  {activeTab === 'completed' 
                    ? "You haven't completed any courses yet." 
                    : "You don't have any courses in progress yet."
                  }
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/courses')}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        )}

        {/* Learning Statistics */}
        {!loading && !error && enrolledCourses.length > 0 && (
          <div className="learning-stats">
            <h2>Your Learning Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-play-circle"></i>
                <h3>{stats.inProgress}</h3>
                <p>Courses in Progress</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle"></i>
                <h3>{stats.completed}</h3>
                <p>Courses Completed</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <h3>{stats.totalHours}</h3>
                <p>Learning Hours</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-certificate"></i>
                <h3>{stats.certificates}</h3>
                <p>Certificates Earned</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;