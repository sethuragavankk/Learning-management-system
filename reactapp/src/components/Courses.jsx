import React, { useState, useEffect } from 'react';
import { getCoursesWithFallback, enrollInCourse } from '../services/api';
import './Courses.css';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const coursesData = await getCoursesWithFallback();
      
      // Ensure coursesData is always an array
      const coursesArray = Array.isArray(coursesData) ? coursesData : [];
      
      setCourses(coursesArray);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error fetching courses:', err);
      // Set empty array as fallback
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

    const handleEnroll = async (courseId) => {
  try {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('Please log in to enroll in courses');
      window.location.href = '/login';
      return;
    }
    
    const user = JSON.parse(userStr);
    setEnrollingCourse(courseId);
    
    // Call the enrollment API
    const enrolledCourse = await enrollInCourse(courseId);
    
    alert('Successfully enrolled in the course!');
    
    // Update local state to reflect enrollment
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { 
              ...course, 
              enrolled: true, 
              enrolledStudents: [...(course.enrolledStudents || []), user.email],
              enrolledCount: (course.enrolledCount || 0) + 1,
              progress: 0 // Initialize progress
            }
          : course
      )
    );
  } catch (err) {
    alert(err.message || 'Failed to enroll in the course. Please try again.');
    console.error('Enrollment error:', err);
  } finally {
    setEnrollingCourse(null);
  }
};

  // Filter courses by category - ensure it always returns an array
  const filteredCourses = React.useMemo(() => {
    if (!Array.isArray(courses)) return [];
    
    return selectedCategory === 'All' 
      ? courses 
      : courses.filter(course => course.category === selectedCategory);
  }, [courses, selectedCategory]);
  // Sort courses - ensure it always returns an array
  const sortedCourses = React.useMemo(() => {
    if (!Array.isArray(filteredCourses)) return [];
    
    return [...filteredCourses].sort((a, b) => {
      if (sortBy === 'popularity') return (b.enrolledCount || 0) - (a.enrolledCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
  }, [filteredCourses, sortBy]);

  // Get current courses
  const currentCourses = React.useMemo(() => {
    if (!Array.isArray(sortedCourses)) return [];
    
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [sortedCourses, currentPage, coursesPerPage]);

  // Page numbers
  const pageNumbers = React.useMemo(() => {
    if (!Array.isArray(sortedCourses)) return [];
    
    const numbers = [];
    const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [sortedCourses, coursesPerPage]);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Helper function for course icons
  const getCourseIcon = (category) => {
    switch(category) {
      case 'Technology': return 'laptop-code';
      case 'Business': return 'chart-line';
      case 'Design': return 'pencil-ruler';
      case 'Science': return 'flask';
      default: return 'book';
    }
  };

  const formatPrice = (price) => {
    return price !== undefined && price !== null 
      ? `$${price.toFixed(2)}` 
      : 'Free';
  };
  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <h1>All Courses</h1>
          <p>Discover your perfect course from our catalog</p>
        </div>

        {/* Filters and Sorting */}
        <div className="filters-container">
          <div className="category-filters">
            <button 
              className={selectedCategory === 'All' ? 'active' : ''} 
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            <button 
              className={selectedCategory === 'Technology' ? 'active' : ''} 
              onClick={() => setSelectedCategory('Technology')}
            >
              Technology
            </button>
            <button 
              className={selectedCategory === 'Business' ? 'active' : ''} 
              onClick={() => setSelectedCategory('Business')}
            >
              Business
            </button>
            <button 
              className={selectedCategory === 'Design' ? 'active' : ''} 
              onClick={() => setSelectedCategory('Design')}
            >
              Design
            </button>
            <button 
              className={selectedCategory === 'Science' ? 'active' : ''} 
              onClick={() => setSelectedCategory('Science')}
            >
              Science
            </button>
          </div>
          <div className="sorting">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popularity">Popularity</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

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
          <>
            <div className="courses-grid">
              {currentCourses.map(course => (
                <div key={course.id} className="course-card">
                  <div 
                    className={`course-image ${(course.category || 'technology').toLowerCase()}`}
                  >
                    <i className={`fas fa-${getCourseIcon(course.category)}`}></i>
                    <div className="course-category">{course.category || 'Technology'}</div>
                    {course.enrolled && <div className="enrolled-badge">Enrolled</div>}
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">{course.courseName || course.title || 'Unnamed Course'}</h3>
                    <p className="course-instructor">By {course.instructor || 'Expert Instructor'}</p>
                    <p className="course-description">
                      {course.description || 'Comprehensive course covering essential topics and skills.'}
                    </p>
                    <div className="course-meta">
                      <span><i className="fas fa-users"></i> {course.enrolledCount || 0} students</span>
                      <span><i className="fas fa-star"></i> {course.rating || '4.8'} ({course.reviewCount || 120} reviews)</span>
                    </div>
                    <div className="course-price">
                      {formatPrice(course.price)}
                      {course.originalPrice && course.originalPrice > course.price && (
                        <span className="original-price">${course.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="course-actions">
                      <button className="btn btn-outline">View Details</button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleEnroll(course.id)}
                        disabled={course.enrolled || enrollingCourse === course.id}
                      >
                        {enrollingCourse === course.id ? 'Enrolling...' : course.enrolled ? 'Enrolled' : 'Enroll Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pageNumbers.length > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={currentPage === number ? 'pagination-btn active' : 'pagination-btn'}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === pageNumbers.length}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="results-count">
              Showing {Math.min((currentPage - 1) * coursesPerPage + 1, sortedCourses.length)}-
              {Math.min(currentPage * coursesPerPage, sortedCourses.length)} of {sortedCourses.length} courses
            </div>
          </>
        )}
        {/* Empty state */}
        {!loading && !error && sortedCourses.length === 0 && (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <h3>No courses found</h3>
            <p>Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;