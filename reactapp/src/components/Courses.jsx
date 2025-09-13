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

 // Courses.js - Fix the fetchCourses function
const fetchCourses = async () => {
  try {
    setLoading(true);
    setError(null);

    const coursesData = await getCoursesWithFallback();
    
    console.log('Fetched courses:', coursesData); // Debug log
    
    if (!coursesData || coursesData.length === 0) {
      setError('No courses found.');
      setCourses([]);
      return;
    }

    setCourses(coursesData);

  } catch (err) {
    console.error('Error fetching courses:', err);
    setError('Failed to load courses. Please try again later.');
    setCourses([]);
  } finally {
    setLoading(false);
  }
};


const handleEnroll = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      alert('Please log in to enroll in courses');
      window.location.href = '/login';
      return;
    }
    
    const user = JSON.parse(userStr);
    setEnrollingCourse(courseId);
    
    // Call the API to enroll
    await enrollInCourse(courseId);
    
    // Update localStorage to track enrolled courses
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const courseToEnroll = courses.find(course => course.id === courseId);
    
    if (courseToEnroll && !enrolledCourses.some(c => c.id === courseId)) {
      const enrolledCourse = {
        ...courseToEnroll,
        enrolled: true,
        progress: 0,
        enrolledDate: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      enrolledCourses.push(enrolledCourse);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
    
    alert('Successfully enrolled in the course!');
    
    // Update the UI
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? {
              ...course,
              enrolled: true,
              enrolledStudents: [...(course.enrolledStudents || []), user.email],
              enrolledCount: (course.enrolledCount || 0) + 1,
              progress: 0
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
  // Filter by category
  const filteredCourses = React.useMemo(() => {
    if (!Array.isArray(courses)) return [];
    return selectedCategory === 'All'
      ? courses
      : courses.filter(
          course => course.type?.toLowerCase() === selectedCategory.toLowerCase()
        );
  }, [courses, selectedCategory]);

  // Sort courses
  const sortedCourses = React.useMemo(() => {
    if (!Array.isArray(filteredCourses)) return [];
    return [...filteredCourses].sort((a, b) => {
      if (sortBy === 'popularity') return (b.enrolledCount || 0) - (a.enrolledCount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
  }, [filteredCourses, sortBy]);

  // Pagination
  const currentCourses = React.useMemo(() => {
    if (!Array.isArray(sortedCourses)) return [];
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    return sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [sortedCourses, currentPage, coursesPerPage]);

  const pageNumbers = React.useMemo(() => {
    if (!Array.isArray(sortedCourses)) return [];
    const totalPages = Math.ceil(sortedCourses.length / coursesPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [sortedCourses, coursesPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCourseIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'technology': return 'laptop-code';
      case 'business': return 'chart-line';
      case 'design': return 'pencil-ruler';
      case 'science': return 'flask';
      default: return 'book';
    }
  };

  const formatPrice = (price) =>
    price !== undefined && price !== null ? `₹${price}` : 'Free';
  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <h1>All Courses</h1>
          <p>Discover your perfect course from our catalog</p>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="category-filters">
            {['All', 'Technology', 'Business', 'Design', 'Science'].map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
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

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading">Loading courses...</div>}

        {!loading && !error && (
          <>
            <div className="courses-grid">
              {currentCourses.map(course => (
                <div key={course.id} className="course-card">
                  {/* Badge top right */}
                  <div className="course-type-badge">{course.type}</div>
                  <div className={`course-image ${course.type?.toLowerCase() || 'technology'}`}>
                    <i className={`fas fa-${getCourseIcon(course.type)}`}></i>
                    {course.enrolled && <div className="enrolled-badge">Enrolled</div>}
                  </div>

                  <div className="course-content">
                    <h3 className="course-title">{course.title || course.courseName}</h3>
                    <p className="course-instructor">By {course.instructor}</p>
                    <p className="course-description">{course.description}</p>

                    <div className="course-meta">
                      <span><i className="fas fa-users"></i> {course.enrolledCount || 0} students</span>
                      <span><i className="fas fa-star"></i> {course.rating || '4.5'} ({course.reviewCount || 50} reviews)</span>
                    </div>
                    <div className="course-price">{formatPrice(course.price)}</div>
                    <div className="course-actions">
                      <button className="btn btn-outline">View Details</button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEnroll(course.id)}
                        disabled={course.enrolled || enrollingCourse === course.id}
                      >
                        {enrollingCourse === course.id
                          ? 'Enrolling...'
                          : course.enrolled
                          ? 'Enrolled'
                          : 'Enroll Now'}
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

            <div className="results-count">
              Showing {Math.min((currentPage - 1) * coursesPerPage + 1, sortedCourses.length)}-
              {Math.min(currentPage * coursesPerPage, sortedCourses.length)} of {sortedCourses.length} courses
            </div>
          </>
        )}

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
