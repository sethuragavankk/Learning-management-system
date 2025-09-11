import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>LMS Lite</h3>
            <p>Empowering learners to achieve their personal and professional goals through high-quality education.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
                   <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/courses">Courses</a></li>
              <li><a href="/mylearning">My Learning</a></li>
              <li><a href="/about">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Categories</h4>
            <ul className="footer-links">
              <li><a href="#">Technology</a></li>
              <li><a href="#">Business</a></li>
              <li><a href="#">Design</a></li>
              <li><a href="#">Science</a></li>
              <li><a href="#">Health & Wellness</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter for the latest updates and course offerings.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; 2023 LMS Lite. All rights reserved.</p>
          </div>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;