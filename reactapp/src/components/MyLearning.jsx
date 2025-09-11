// components/MyLearning.js
import React, { useState } from 'react';
import './MyLearning.css';

const MyLearning = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Sample enrolled courses data
  const enrolledCourses = [
    {
      id: 1,
      title: 'Java Programming Masterclass',
      progress: 75,
      category: 'Technology',
      lastAccessed: '2 days ago',
      thumbnail: 'java'
    },
    {
      id: 2,
      title: 'React JS Complete Guide',
      progress: 45,
      category: 'Technology',
      lastAccessed: '5 days ago',
      thumbnail: 'react'
    },
    {
      id: 3,
      title: 'Data Science Fundamentals',
      progress: 30,
      category: 'Science',
      lastAccessed: '1 week ago',
      thumbnail: 'data-science'
    },
    {
      id: 4,
      title: 'UX Design Principles',
      progress: 90,
      category: 'Design',
      lastAccessed: 'Yesterday',
      thumbnail: 'design'
    },
    {
      id: 5,
      title: 'Business Management',
      progress: 100,
      category: 'Business',
      lastAccessed: '2 weeks ago',
      thumbnail: 'business',
      completed: true
    },
    {
      id: 6,
      title: 'Advanced Python Programming',
      progress: 60,
      category: 'Technology',
      lastAccessed: '3 days ago',
      thumbnail: 'python'
    }
  ];

  // Filter courses based on active tab
  const filteredCourses = activeTab === 'all' 
    ? enrolledCourses 
    : activeTab === 'in-progress' 
      ? enrolledCourses.filter(course => course.progress < 100) 
      : enrolledCourses.filter(course => course.completed);
  return (
    <div className="mylearning-page">
      <div className="container">
        <div className="page-header">
          <h1>My Learning</h1>
          <p>Continue your learning journey</p>
        </div>

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
                {/* Courses List */}
        <div className="learning-courses">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div key={course.id} className="learning-course-card">
                <div className="course-thumbnail">
                  <i className={`fas fa-${course.thumbnail === 'java' ? 'coffee' : 
                                  course.thumbnail === 'react' ? 'atom' : 
                                  course.thumbnail === 'data-science' ? 'chart-bar' : 
                                  course.thumbnail === 'design' ? 'pencil-ruler' : 
                                  course.thumbnail === 'business' ? 'briefcase' : 'code'}`}></i>
                </div>
                <div className="course-details">
                  <h3>{course.title}</h3>
                  <p className="course-category">{course.category}</p>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{width: `${course.progress}%`}}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress}% complete</span>
                  </div>
                  <p className="last-accessed">Last accessed: {course.lastAccessed}</p>
                </div>
                <div className="course-actions">
                  {course.completed ? (
                    <button className="btn btn-primary">View Certificate</button>
                  ) : (
                    <button className="btn btn-primary">Continue Learning</button>
                  )}
                  <button className="btn btn-outline">Course Details</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-book-open"></i>
              <h3>No courses found</h3>
              <p>You don't have any {activeTab === 'completed' ? 'completed' : 'in progress'} courses yet.</p>
              <button className="btn btn-primary">Browse Courses</button>
            </div>
          )}
        </div>
        {/* Learning Statistics */}
        <div className="learning-stats">
          <h2>Your Learning Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <i className="fas fa-play-circle"></i>
              <h3>{enrolledCourses.filter(c => !c.completed).length}</h3>
              <p>Courses in Progress</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-check-circle"></i>
              <h3>{enrolledCourses.filter(c => c.completed).length}</h3>
              <p>Courses Completed</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-clock"></i>
              <h3>42</h3>
              <p>Learning Hours</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-certificate"></i>
              <h3>5</h3>
              <p>Certificates Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyLearning;