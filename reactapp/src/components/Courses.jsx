// components/Courses.js
import React, { useState } from 'react';
import './Courses.css';

const Courses = ({ courses, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');

  // Filter courses by category
  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popularity') return b.enrolledCount - a.enrolledCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  // Get current courses
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = sortedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedCourses.length / coursesPerPage); i++) {
    pageNumbers.push(i);
  }

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
            Error: [Error - You need to specify the message]
          </div>
        )}
        
        {/* Loading indicator */}
        {loading && <div className="loading">Loading courses...</div>}
        <div className="courses-grid">
          {currentCourses.map(course => (
            <div key={course.id} className="course-card">
              <div 
                className={`course-image ${(course.category || 'technology').toLowerCase()}`}
              >
                <i className={`fas fa-${getCourseIcon(course.category)}`}></i>
                <div className="course-category">{course.category || 'Technology'}</div>
              </div>
              <div className="course-content">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">By Instructor Name</p>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span><i className="fas fa-users"></i> {course.enrolledCount || 0} students</span>
                  <span><i className="fas fa-star"></i> 4.8 (120 reviews)</span>
                </div>
                <div className="course-price">$49.99</div>
                <div className="course-actions">
                  <button className="btn btn-outline">Add to Cart</button>
                  <button className="btn btn-primary">Enroll Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
          Showing {indexOfFirstCourse + 1}-{Math.min(indexOfLastCourse, sortedCourses.length)} of {sortedCourses.length} courses
        </div>
      </div>
    </div>
  );
};
export default Courses;