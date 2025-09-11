// components/About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="page-header">
          <h1>About LMS Lite</h1>
          <p>Empowering learners worldwide</p>
        </div>

        {/* Mission Section */}
        <div className="about-section">
          <div className="about-content">
            <h2>Our Mission</h2>
            <p>
              At LMS Lite, our mission is to make high-quality education accessible and affordable for everyone, 
              everywhere. We believe that learning has the power to transform lives and societies, and we're 
              committed to providing the tools and platform that enable anyone to learn without limits.
            </p>
            <p>
              Since our founding in 2020, we've helped over 100,000 students advance their careers, learn new skills, 
              and pursue their passions through our curated course catalog and innovative learning platform.
            </p>
          </div>
          <div className="about-image">
            <i className="fas fa-graduation-cap"></i>
          </div>
        </div>
        {/* Values Section */}
        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-globe"></i>
              <h3>Accessibility</h3>
              <p>We believe education should be accessible to everyone, regardless of location or background.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-medal"></i>
              <h3>Quality</h3>
              <p>We maintain high standards for all our courses and learning materials.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h3>Community</h3>
              <p>We foster a supportive learning community where students can grow together.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-lightbulb"></i>
              <h3>Innovation</h3>
              <p>We continuously improve our platform to enhance the learning experience.</p>
            </div>
          </div>
        </div>
        {/* Team Section */}
        <div className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">CEO & Founder</p>
              <p>Education technology expert with 10+ years of experience</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">CTO</p>
              <p>Software engineer passionate about building scalable learning platforms</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>Emily Rodriguez</h3>
              <p className="member-role">Head of Content</p>
              <p>Curriculum developer with background in instructional design</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <i className="fas fa-user"></i>
              </div>
              <h3>David Kim</h3>
              <p className="member-role">Lead Instructor</p>
              <p>Industry expert with passion for teaching and mentorship</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="about-stats">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Active Learners</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Courses Available</p>
            </div>
            <div className="stat-item">
              <h3>200+</h3>
              <p>Expert Instructors</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Student Satisfaction</p>
            </div>
          </div>
        </div>
        {/* CTA Section */}
        <div className="about-cta">
          <h2>Ready to start your learning journey?</h2>
          <p>Join thousands of students who are advancing their careers with our courses</p>
          <button className="btn btn-primary">Browse Courses</button>
        </div>
      </div>
    </div>
  );
};

export default About;