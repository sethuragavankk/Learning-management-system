import React, { useState, useEffect } from 'react';
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
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert('Please log in to view your learning');
      window.location.href = '/login';
      return;
    }
    
    fetchEnrolledCourses();
  }, []);

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
        image: '/api/placeholder/300/200', // Optional image URL
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
      },
      {
        id: 3,
        courseName: 'UX/UI Design Principles',
        title: 'UX/UI Design Principles',
        category: 'Design',
        progress: 75,
        lastAccessed: '2023-11-20T14:45:00Z',
        duration: 25,
        instructor: 'Mike Johnson',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Create beautiful and functional user interfaces with proven design principles.'
      },
           {
        id: 4,
        courseName: 'Mobile App Development',
        title: 'Mobile App Development',
        category: 'Technology',
        progress: 20,
        lastAccessed: '2023-11-22T10:15:00Z',
        duration: 40,
        instructor: 'Sarah Wilson',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Build cross-platform mobile applications using React Native.'
      },
      {
        id: 5,
        courseName: 'Business Management',
        title: 'Business Management',
        category: 'Business',
        progress: 30,
        lastAccessed: '2023-11-25T09:15:00Z',
        duration: 35,
        instructor: 'Robert Brown',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Learn essential business management skills and strategies.'
      },
      {
        id: 6,
        courseName: 'Digital Marketing Mastery',
        title: 'Digital Marketing Mastery',
        category: 'Business',
        progress: 100,
        completedAt: '2023-09-10T16:30:00Z',
        lastAccessed: '2023-09-10T16:30:00Z',
        duration: 28,
        instructor: 'Lisa Thompson',
        enrolled: true,
        image: '/api/placeholder/300/200',
        description: 'Learn to create effective digital marketing campaigns across platforms.'
      }
    ];
  };
  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use sample data directly since enrollment API might not be ready
      const sampleCourses = getSampleEnrolledCourses();
      setEnrolledCourses(sampleCourses);
      
      // If you want to try API later, you can uncomment this:
      /*
      try {
        const response = await fetch('/api/courses/enrolled', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const courses = await response.json();
          setEnrolledCourses(courses);
        } else {
          throw new Error('API returned error status');
        }
      } catch (apiError) {
        // Fallback to sample data if API fails
        setEnrolledCourses(sampleCourses);
        setError('Failed to load your courses. Displaying sample data.');
      }
      */
      
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      setEnrolledCourses(getSampleEnrolledCourses());
      setError('Failed to load your courses. Displaying sample data.');
    } finally {
      setLoading(false);
    }
  };
  const handleContinueLearning = async (courseId) => {
    try {
      setUpdatingProgress(courseId);
      
      // Simulate progress update (replace with actual API call later)
      setTimeout(() => {
        setEnrolledCourses(prevCourses =>
          prevCourses.map(course =>
            course.id === courseId
              ? { 
                  ...course, 
                  progress: Math.min(course.progress + 10, 100),
                  lastAccessed: new Date().toISOString(),
                  completedAt: course.progress + 10 >= 100 ? new Date().toISOString() : course.completedAt
                }
              : course
          )
        );
        setUpdatingProgress(null);
        
        // Show success message
        if (enrolledCourses.find(c => c.id === courseId).progress + 10 >= 100) {
          alert('Congratulations! You completed the course!');
        }
      }, 1000);
      
    } catch (err) {
      alert('Failed to update progress. Please try again.');
      console.error('Progress update error:', err);
      setUpdatingProgress(null);
    }
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