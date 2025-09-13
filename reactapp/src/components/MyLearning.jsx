import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MyLearning.css';

const MyLearning = ({ user }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingProgress, setUpdatingProgress] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get student email from user data or localStorage
  const studentEmail = user?.email || localStorage.getItem('userEmail') || '727823ulu214@skct.edu.in';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please log in to view your learning');
      window.location.href = '/login';
      return;
    }
    
    fetchEnrolledCourses();
  }, []);

  // Handle quiz results when returning from quiz page
  useEffect(() => {
    if (location.state && location.state.quizCompleted) {
      const { courseId, score, total, percentage } = location.state;
      
      // Update progress in backend
      updateCourseProgress(courseId, percentage, score, total);
      
      // Clear the state to prevent processing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Function to update course progress in backend
  const updateCourseProgress = async (courseId, percentage, score, total) => {
    try {
      const token = localStorage.getItem('token');
      
      // Update quiz score in backend
      const scoreResponse = await fetch('http://localhost:8080/api/courses/quiz-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseId,
          studentEmail: studentEmail,
          quizScore: score,
          totalQuestions: total
        })
      });
      
      if (!scoreResponse.ok) {
        throw new Error('Failed to update quiz score');
      }
      
      // Calculate new progress (quiz contributes 20% to overall progress)
      const newProgress = Math.min(percentage >= 70 ? 20 : 0, 100);
      
      // Update course progress in backend
      const progressResponse = await fetch('http://localhost:8080/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseId,
          studentEmail: studentEmail,
          progressPercentage: newProgress
        })
      });
      
      if (!progressResponse.ok) {
        throw new Error('Failed to update course progress');
      }
      
      // Refresh the courses to get updated data
      fetchEnrolledCourses();
      
      // Show success message
      if (percentage >= 70) {
        alert(`Quiz completed successfully! Your progress has been updated.`);
      } else {
        alert(`Quiz completed with ${percentage}% score. Try again to earn progress points!`);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  // Fetch enrolled courses from backend
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/courses/enrolled?studentEmail=${studentEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const courses = await response.json();
        setEnrolledCourses(courses);
      } else if (response.status === 404) {
        // If no enrolled courses found, use sample data
        const sampleCourses = getSampleEnrolledCourses();
        setEnrolledCourses(sampleCourses);
        setError('No enrolled courses found. Displaying sample data.');
      } else {
        throw new Error('Failed to fetch enrolled courses');
      }
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      // Fallback to sample data
      const sampleCourses = getSampleEnrolledCourses();
      setEnrolledCourses(sampleCourses);
      setError('Failed to load your courses. Displaying sample data.');
    } finally {
      setLoading(false);
    }
  };

  // Sample data with both completed and in-progress courses
  const getSampleEnrolledCourses = () => {
    return [
      {
        id: 1,
        courseName: 'Web Development Fundamentals',
        title: 'Web Development Fundamentals',
        category: 'Technology',
        progress: 100,
        completedAt: '2023-10-15T08:30:00Z',
        lastAccessed: '2023-10-15T08:30:00Z',
        duration: 30,
        instructor: 'John Doe',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.'
      },
      {
        id: 2,
        courseName: 'Data Science with Python',
        title: 'Data Science with Python',
        category: 'Science',
        progress: 45,
        lastAccessed: '2023-11-18T14:20:00Z',
        duration: 45,
        instructor: 'Jane Smith',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Master data analysis, visualization, and machine learning with Python.'
      }
    ];
  };

  const handleContinueLearning = async (courseId) => {
    try {
      setUpdatingProgress(courseId);
      
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/courses/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: courseId,
          studentEmail: studentEmail,
          progressPercentage: 10 // Increment by 10%
        })
      });
      
      if (response.ok) {
        // Refresh the courses to get updated data
        fetchEnrolledCourses();
        
        // Check if course is now completed
        const course = enrolledCourses.find(c => c.id === courseId);
        if (course && course.progress + 10 >= 100) {
          alert('Congratulations! You completed the course!');
        }
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (err) {
      alert('Failed to update progress. Please try again.');
      console.error('Progress update error:', err);
    } finally {
      setUpdatingProgress(null);
    }
  };

  const handleTakeQuiz = (courseId) => {
    navigate(`/quiz/${courseId}`);
  };

  const handleViewCertificate = (courseId) => {
    const course = enrolledCourses.find(c => c.id === courseId);
    if (course.progress === 100) {
      alert(`Certificate for "${course.courseName || course.title}" would be displayed here.\n\nCompletion Date: ${new Date(course.completedAt).toLocaleDateString()}`);
    } else {
      alert(`Complete the course to earn your certificate! Current progress: ${course.progress}%`);
    }
  };

  const handleViewDetails = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Filter courses based on active tab
  const filteredCourses = activeTab === 'all' 
    ? enrolledCourses 
    : activeTab === 'in-progress' 
      ? enrolledCourses.filter(course => (course.progress || 0) < 100) 
      : enrolledCourses.filter(course => (course.progress || 0) === 100);
  
  // Calculate statistics
  const stats = {
    total: enrolledCourses.length,
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

  const getCourseIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'technology': return 'laptop-code';
      case 'business': return 'chart-line';
      case 'design': return 'pencil-ruler';
      case 'science': return 'flask';
      default: return 'book';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return '#4CAF50'; // Green for completed
    if (progress >= 50) return '#2196F3'; // Blue for good progress
    return '#FF9800'; // Orange for beginner progress
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
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}
        
        {/* Learning Statistics */}
        {!loading && enrolledCourses.length > 0 && (
          <div className="learning-stats">
            <h2>Your Learning Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-graduation-cap"></i>
                <h3>{stats.total}</h3>
                <p>Total Courses</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-play-circle"></i>
                <h3>{stats.inProgress}</h3>
                <p>In Progress</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle"></i>
                <h3>{stats.completed}</h3>
                <p>Completed</p>
              </div>
              <div className="stat-card">
                <i className="fas fa-certificate"></i>
                <h3>{stats.certificates}</h3>
                <p>Certificates</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="learning-tabs">
          <button 
            className={activeTab === 'all' ? 'active' : ''} 
            onClick={() => setActiveTab('all')}
          >
            All Courses ({enrolledCourses.length})
          </button>
          <button 
            className={activeTab === 'in-progress' ? 'active' : ''} 
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress ({stats.inProgress})
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''} 
            onClick={() => setActiveTab('completed')}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            Loading your courses...
          </div>
        )}
        
        {/* Courses List */}
        {!loading && (
          <div className="learning-courses">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <div key={course.id} className="learning-course-card">
                  <div className="course-thumbnail">
                    <i className={`fas fa-${getCourseIcon(course.category)}`}></i>
                    <div className="progress-circle" style={{borderColor: getProgressColor(course.progress)}}>
                      <div 
                        className="progress-circle-value"
                        style={{color: getProgressColor(course.progress)}}
                      >
                        {course.progress || 0}%
                      </div>
                    </div>
                    {course.progress === 100 && (
                      <div className="completed-badge">
                        <i className="fas fa-check"></i>
                        Completed
                      </div>
                    )}
                  </div>
                  
                  <div className="course-details">
                    <h3>{course.courseName || course.title}</h3>
                    <p className="course-category">
                      <i className={`fas fa-${getCourseIcon(course.category)}`}></i>
                      {course.category || 'General'}
                    </p>
                    <p className="course-description">
                      {course.description || 'No description available.'}
                    </p>
                    
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{
                            width: `${course.progress || 0}%`,
                            backgroundColor: getProgressColor(course.progress)
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress || 0}% complete</span>
                    </div>
                    
                    <div className="course-meta">
                      <span><i className="fas fa-clock"></i> {course.duration || 0} hours</span>
                      <span><i className="fas fa-user"></i> {course.instructor || 'Unknown Instructor'}</span>
                    </div>
                    
                    <p className="last-accessed">
                      <i className="fas fa-history"></i>
                      Last accessed: {formatLastAccessed(course.lastAccessed)}
                    </p>
                    
                    {course.completedAt && (
                      <p className="completed-date">
                        <i className="fas fa-calendar-check"></i>
                        Completed on: {new Date(course.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="course-actions">
                    {(course.progress || 0) === 100 ? (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleViewCertificate(course.id)}
                      >
                        <i className="fas fa-certificate"></i>
                        View Certificate
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleContinueLearning(course.id)}
                        disabled={updatingProgress === course.id}
                      >
                        {updatingProgress === course.id ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-play"></i>
                            Continue Learning
                          </>
                        )}
                      </button>
                    )}
                    
                    {/* Quiz Button */}
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleTakeQuiz(course.id)}
                    >
                      <i className="fas fa-question-circle"></i>
                      Take Quiz
                    </button>
                    
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      <i className="fas fa-info-circle"></i>
                      Details
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
                  <i className="fas fa-search"></i>
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
