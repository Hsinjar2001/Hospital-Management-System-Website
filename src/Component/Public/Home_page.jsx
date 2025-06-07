import React, { useState } from 'react';

// Importing assets from the specified path
import preclinicLogo from '../../assets/Preclinic Logo.png'; //



function HomePage() {
  const [department, setDepartment] = useState('');
  const [services, setServices] = useState('');
  const [doctors, setDoctors] = useState('');
  const [date, setDate] = useState('25 Mar 2025'); // Initial date based on image
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');

  const styles = {
    homePageContainer: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    navbar: {
      width: '100%',
      backgroundColor: 'white',
      padding: '15px 5%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      flexWrap: 'wrap',
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    preclinicLogo: {
      width: '120px',
      height: 'auto',
    },
    navLinks: {
      display: 'flex',
      gap: '25px',
      flexWrap: 'wrap',
      marginTop: window.innerWidth <= 768 ? '10px' : '0',
    },
    navLink: {
      textDecoration: 'none',
      color: '#333',
      fontWeight: '600',
      fontSize: '1em',
    },
    navRight: {
      display: 'flex',
      gap: '10px',
      marginTop: window.innerWidth <= 768 ? '10px' : '0',
    },
    signInButton: {
      backgroundColor: '#5b45c3',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9em',
    },
    signUpButton: {
      backgroundColor: '#333',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '0.9em',
    },
    mainContent: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '90%',
      maxWidth: '1200px',
      padding: '60px 0',
      flexDirection: window.innerWidth <= 992 ? 'column' : 'row',
      gap: '40px',
    },
    leftSection: {
      flex: '1',
      textAlign: window.innerWidth <= 992 ? 'center' : 'left',
      padding: '20px',
    },
    tagline: {
      color: '#e74c3c',
      fontWeight: 'bold',
      marginBottom: '10px',
      display: 'inline-block',
      padding: '5px 15px',
      backgroundColor: '#ffebeb',
      borderRadius: '20px',
      fontSize: '0.9em',
    },
    heroTitle: {
      fontSize: window.innerWidth <= 768 ? '2.5em' : '3.5em',
      color: '#333',
      marginBottom: '20px',
      lineHeight: '1.2',
      fontWeight: 'bold',
    },
    heroTitleHighlight: {
      color: '#5b45c3',
    },
    heroDescription: {
      fontSize: '1.1em',
      color: '#666',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    actionButtons: {
      display: 'flex',
      gap: '15px',
      justifyContent: window.innerWidth <= 992 ? 'center' : 'flex-start',
    },
    viewDoctorsButton: {
      backgroundColor: '#333',
      color: 'white',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1em',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textTransform: 'capitalize',
    },
    getStartedButton: {
      backgroundColor: 'white',
      color: '#333',
      padding: '15px 30px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
      textTransform: 'capitalize',
    },
    rightSection: {
      flex: '1',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      width: window.innerWidth <= 992 ? '90%' : 'auto',
      maxWidth: '500px',
    },
    formTitle: {
      fontSize: '1.8em',
      color: '#333',
      marginBottom: '25px',
      textAlign: 'center',
    },
    appointmentForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formRow: {
      display: 'flex',
      gap: '20px',
      flexDirection: window.innerWidth <= 500 ? 'column' : 'row',
    },
    formGroup: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
      fontSize: '0.9em',
    },
    selectInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      backgroundColor: 'white',
      appearance: 'none', // Remove default arrow
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      backgroundSize: '20px',
      cursor: 'pointer',
    },
    textInput: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      boxSizing: 'border-box',
    },
    dateInputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '0 12px',
      backgroundColor: 'white',
    },
    dateInput: {
      flex: '1',
      padding: '12px 0',
      border: 'none',
      outline: 'none',
      fontSize: '1em',
      backgroundColor: 'transparent',
    },
    dateIcon: {
      color: '#666',
      marginLeft: '10px',
      cursor: 'pointer',
    },
    textArea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    bookAppointmentButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#333',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      textTransform: 'capitalize',
      marginTop: '10px',
    },
  };

  const handleAppointmentSubmit = (event) => {
    event.preventDefault();
    console.log({ department, services, doctors, date, time, comments });
    alert('Appointment Booked!');
  };

  return (
    <div style={styles.homePageContainer}>
      {/* Navbar Section */}
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <img src={preclinicLogo} alt="Preclinic Logo" style={styles.preclinicLogo} />
          <div style={styles.navLinks}>
            <a href="#" style={styles.navLink}>Home</a>
            <a href="#" style={styles.navLink}>Specialities</a>
            <a href="#" style={styles.navLink}>Doctors</a>
            <a href="#" style={styles.navLink}>Blogs</a>
            <a href="#" style={styles.navLink}>Testimonials</a>
            <a href="#" style={styles.navLink}>FAQ</a>
            <a href="#" style={styles.navLink}>Contact Us</a>
          </div>
        </div>
        <div style={styles.navRight}>
          <button style={styles.signInButton}>Sign In</button>
          <button style={styles.signUpButton}>Sign Up</button>
        </div>
      </nav>

      {/* Main Content Section */}
      <div style={styles.mainContent}>
        {/* Left Section - Hero Text */}
        <div style={styles.leftSection}>
          <span style={styles.tagline}>❤️ #1 Medical Clinic in your Location</span>
          <h1 style={styles.heroTitle}>
            Bringing Quality <br />
            <span style={styles.heroTitleHighlight}>Healthcare Services</span> <br />
            To You
          </h1>
          <p style={styles.heroDescription}>
            Delivering Comprehensive Health Support through our innovative platform that Seamlessly
            Connects your terms
          </p>
          <div style={styles.actionButtons}>
            <button style={styles.viewDoctorsButton}>View All Doctors</button>
            <button style={styles.getStartedButton}>Get Started</button>
          </div>
        </div>

        {/* Right Section - Appointment Form */}
        <div style={styles.rightSection}>
          <h3 style={styles.formTitle}>Appointment Form</h3>
          <form style={styles.appointmentForm} onSubmit={handleAppointmentSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="department" style={styles.label}>Department *</label>
                <select
                  id="department"
                  style={styles.selectInput}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="services" style={styles.label}>Services *</label>
                <select
                  id="services"
                  style={styles.selectInput}
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Check-up">Check-up</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Vaccination">Vaccination</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="doctors" style={styles.label}>Doctors *</label>
              <select
                id="doctors"
                style={styles.selectInput}
                value={doctors}
                onChange={(e) => setDoctors(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="Dr. John Doe">Dr. John Doe</option>
                <option value="Dr. Jane Smith">Dr. Jane Smith</option>
              </select>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label htmlFor="date" style={styles.label}>Date *</label>
                <div style={styles.dateInputContainer}>
                  <input
                    type="text" // Keep as text to show '25 Mar 2025' like the image
                    id="date"
                    style={styles.dateInput}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <i className="fa fa-calendar-alt" style={styles.dateIcon}></i>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="time" style={styles.label}>Time *</label>
                <div style={styles.dateInputContainer}> {/* Reusing dateInputContainer for time */}
                  <input
                    type="text" // Keep as text or change to time if actual input is desired
                    id="time"
                    style={styles.dateInput}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="-- : -- --"
                    required
                  />
                  <i className="fa fa-clock" style={styles.dateIcon}></i>
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="comments" style={styles.label}>Comments *</label>
              <textarea
                id="comments"
                style={styles.textArea}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Description"
                required
              ></textarea>
            </div>

            <button type="submit" style={styles.bookAppointmentButton}>
              Book an Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;