import React from 'react';
import './Home_page.css' ;
import { useNavigate } from 'react-router-dom';




import PreclinicLogo from '../../assets/Homepage/logo.png';
import CalendarIcon from '../../assets/Homepage/Calender.png';
import ClockIcon from '../../assets/Homepage/Clock_icon.png';
import CardiologyIcon from '../../assets/Homepage/Cardiology.png';
import DentalCareIcon from '../../assets/Homepage/Dental Care.png';
import NeurologyIcon from '../../assets/Homepage/Neurology.png'; 
import GynecologyIcon from '../../assets/Homepage/Gynecology.png';
import OncologyIcon from '../../assets/Homepage/Oncology.png'; 
import UrologyIcon from '../../assets/Homepage/Urology.png';   
import DrMichael from '../../assets/Homepage/Doctor1.png';
import DrSarah from '../../assets/Homepage/Doctor2.PNG';
import DrAvan from '../../assets/Homepage/Doctor3.png'; 
import DrPatricia from '../../assets/Homepage/Doctor4.png'; 
import FacebookLogo from '../../assets/Homepage/facbook_logo.png';
import GoogleLogo from '../../assets/Homepage/google_logo.png';
import AppleLogo from '../../assets/Homepage/Apple_logo.png';


const Home_page = () => {

    const navigate = useNavigate();
  const specialties = [
    { name: 'Cardiology', doctors: 20, icon: CardiologyIcon },
    { name: 'Dental Care', doctors: 15, icon: DentalCareIcon },
    { name: 'Neurology', doctors: 12, icon: NeurologyIcon },
    { name: 'Gynecology', doctors: 10, icon: GynecologyIcon },
    { name: 'Oncology', doctors: 17, icon: OncologyIcon || 'https://via.placeholder.com/60/e0e0e0/555555?text=Oncology' },
    { name: 'Urology', doctors: 14, icon: UrologyIcon || 'https://via.placeholder.com/60/e0e0e0/555555?text=Urology' },
  ];

  const doctors = [
    {
      name: 'Dr. Michael Thompson',
      specialty: 'Cardiologist',
      appointmentsCompleted: 216,
      startsFrom: 499,
      image: DrMichael,
    },
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Orthopedic Surgeon',
      appointmentsCompleted: 137,
      startsFrom: 249,
      image: DrSarah,
    },
    {
      name: 'Dr. Avan Davis',
      specialty: 'Endocrinologist',
      appointmentsCompleted: 179,
      startsFrom: 399,
      image: DrAvan || 'https://via.placeholder.com/150/f0f0f0/808080?text=Dr+Avan',
    },
    {
      name: 'Dr. Patricia Brown',
      specialty: 'Pulmonologist',
      appointmentsCompleted: 275,
      startsFrom: 299,
      image: DrPatricia || 'https://via.placeholder.com/150/f0f0f0/808080?text=Dr+Patricia',
    },
  ];

  return (
    <div className="home-page-container">
      {/* Header Section */}
      <header className="home-header-container">
        <div className="home-header-logo-brand">
          <img src={PreclinicLogo} alt="Preclinic Logo" className="home-header-logo" />
          <span className="home-header-brand-name">Preclinic</span>
        </div>
        <nav className="home-header-nav">
          <a href="#" className="home-header-nav-link">Home</a>
          <a href="#" className="home-header-nav-link">Specialities</a>
          <a href="#" className="home-header-nav-link">Doctors</a>
        
          <a href="#" className="home-header-nav-link">Contact Us</a>
        </nav>
        <div className="home-header-auth-buttons">
          <button onClick={()=> navigate('/login')} className="home-header-signin-btn">Sign In</button>
          <button onClick ={()=>navigate('/register')}className="home-header-signup-btn">Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="home-hero-section-container">
        <div className="home-hero-background-overlay"></div>
        <div className="home-hero-content">
          <div className="home-hero-tagline">
            <span className="home-heart-icon">❤️</span>
            <p className="home-tagline-text">#1 Medical Clinic in your Location</p>
          </div>
          <h1 className="home-hero-title">
            Bringing Quality <br />
            <span className="home-hero-title-highlight">Healthcare Services</span> <br />
            To You
          </h1>
          <p className="home-hero-description">
            Delivering Comprehensive Health Support through our innovative platform that Seamlessly Connects your terms.
          </p>
          <div className="home-hero-buttons">
            <button className="home-hero-view-doctors-btn">
              View All Doctors <span className="home-arrow-icon">›</span>
            </button>
            <button className="home-hero-get-started-btn">
              Get Started <span className="home-arrow-icon">›</span>
            </button>
          </div>
        </div>

        <div className="home-hero-appointment-form-card">
          <h2 className="home-form-title">Appointment Form</h2>
          <form className="home-appointment-form">
            <div className="home-form-group">
              <label htmlFor="department">Department <span className="home-required">*</span></label>
              <select id="department">
                <option>Select</option>
              </select>
            </div>
            <div className="home-form-group">
              <label htmlFor="services">Services <span className="home-required">*</span></label>
              <select id="services">
                <option>Select</option>
              </select>
            </div>
            <div className="home-form-group">
              <label htmlFor="doctors">Doctors</label>
              <select id="doctors">
                <option>Select</option>
              </select>
            </div>
            <div className="home-form-row">
              <div className="home-form-group-half">
                <label htmlFor="date">Date <span className="home-required">*</span></label>
                <div className="home-input-with-icon">
                  <input type="text" id="date" placeholder="25 Mar 2025" />
                  {CalendarIcon && <img src={CalendarIcon} alt="Calendar" className="home-input-icon-img" />}
                </div>
              </div>
              <div className="home-form-group-half">
                <label htmlFor="time">Time</label>
                <div className="home-input-with-icon">
                  <input type="text" id="time" placeholder="-- : --" />
                  {ClockIcon && <img src={ClockIcon} alt="Clock" className="home-input-icon-img" />}
                </div>
              </div>
            </div>
            <div className="home-form-group">
              <label htmlFor="comments">Comments</label>
              <textarea id="comments" rows="3" placeholder="Description"></textarea>
            </div>
            <button type="submit" className="home-book-appointment-btn">
              Book an Appointment
            </button>
          </form>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="home-specialties-section-container">
        <div className="home-container">
          <h2 className="home-specialties-title">Trending Specialities</h2>
          <p className="home-specialties-subtitle">Explore a Wide Range of Specialities</p>

          <div className="home-specialties-grid-wrapper">
            <button className="home-specialties-arrow-button home-arrow-left">&lt;</button>
            <div className="home-specialties-grid">
              {specialties.map((specialty, index) => (
                <div
                  key={index}
                  className="home-specialty-card"
                >
                  <div className="home-specialty-icon-wrapper">
                    <img src={specialty.icon} alt={specialty.name} className="home-specialty-icon" />
                  </div>
                  <h3 className="home-specialty-name">{specialty.name}</h3>
                  <p className="home-specialty-doctors-count">{specialty.doctors} Doctors Available</p>
                </div>
              ))}
            </div>
            <button className="home-specialties-arrow-button home-arrow-right">&gt;</button>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="home-featured-doctors-section-container">
        <div className="home-container">
          <h2 className="home-featured-doctors-title">Featured Doctors</h2>
          <p className="home-featured-doctors-subtitle">Meet your trusted team of medical experts and specialists</p>

          <div className="home-doctors-grid">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="home-doctor-card"
              >
                <div className="home-doctor-image-wrapper">
                  <img src={doctor.image} alt={doctor.name} className="home-doctor-image" />
                </div>
                <div className="home-doctor-info">
                  <h3 className="home-doctor-name">{doctor.name}</h3>
                  <p className="home-doctor-specialty">{doctor.specialty}</p>
                  <p className="home-doctor-appointments">Appointments Completed: {doctor.appointmentsCompleted}</p>
                  <div className="home-doctor-footer">
                    <span className="home-doctor-price">Starts From <span className="home-price-value">${doctor.startsFrom}</span></span>
                    {CalendarIcon && <img src={CalendarIcon} alt="Schedule" className="home-schedule-icon" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer-container">
        <div className="home-container home-footer-grid">
          <div className="home-footer-section home-contact-info">
            <h3 className="home-footer-heading">Contact Info</h3>
            <div className="home-footer-logo-brand">
              <img src={PreclinicLogo} alt="Preclinic Logo" className="home-footer-logo" />
              <span className="home-footer-brand-name">Preclinic</span>
            </div>
            <p className="home-footer-contact-item">
              <span className="home-contact-icon">📍</span> 2281 Valley, Eagleville, 19403
            </p>
            <p className="home-footer-contact-item">
              <span className="home-contact-icon">📞</span> +1565465656
            </p>
            <p className="home-footer-contact-item">
              <span className="home-contact-icon">📧</span> info@example.com
            </p>
          </div>

          <div className="home-footer-section">
            <h3 className="home-footer-heading">Explore Pages</h3>
            <ul className="home-footer-links-list">
              <li><a href="#" className="home-footer-link">Home</a></li>
              <li><a href="#" className="home-footer-link">Doctors</a></li>
                 <li><a href="#" className="home-footer-link">Specialities</a></li>
              <li><a href="#" className="home-footer-link">Contact Us</a></li>
            </ul>
          </div>

          <div className="home-footer-section">
            <h3 className="home-footer-heading">Useful Links</h3>
            <ul className="home-footer-links-list">
              <li><a href="#" className="home-footer-link">Terms & Conditions</a></li>
              <li><a href="#" className="home-footer-link">Privacy Policy</a></li>
              <li><a href="#" className="home-footer-link">Refund Policy</a></li>
              <li><a href="#" className="home-footer-link">Testimonials</a></li>
              <li><a href="#" className="home-footer-link">FAQ</a></li>
              <li><a href="#" className="home-footer-link">Dashboard</a></li>
            </ul>
          </div>

          <div className="home-footer-section">
            <h3 className="home-footer-heading">Subscribe For Newsletter</h3>
            <form className="home-newsletter-form">
              <input
                type="email"
                placeholder="Enter Email"
                className="home-newsletter-input"
              />
              <button
                type="submit"
                className="home-newsletter-subscribe-btn"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="home-footer-bottom">
          <div className="home-social-icons">
            <a href="#" className="home-social-icon-link">
              <img src={FacebookLogo} alt="Facebook" className="home-social-icon" />
            </a>
            <a href="#" className="home-social-icon-link">
              <img src={GoogleLogo} alt="Google" className="home-social-icon" />
            </a>
            <a href="#" className="home-social-icon-link">
              <img src={AppleLogo} alt="Apple" className="home-social-icon" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Home_page;