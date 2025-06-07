import React, { useState } from 'react';


import preclinicLogo from '../../assets/Preclinic Logo.png'; 
import illustrationRegister from '../../assets/register.png'; 
import facebookIcon from '../../assets/facebook-icon.png'; 
import googleIcon from '../../assets/google-icon.png'; 
import appleIcon from '../../assets/apple-icon.png'; 

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const styles = {
    registerPageContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      alignItems: 'stretch',
    },
    illustrationSection: {
      flex: window.innerWidth <= 768 ? 'none' : '0 0 60%', 
      backgroundColor: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url("${illustrationRegister}")`, 
      backgroundSize: '80%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: window.innerWidth <= 768 ? '250px' : 'auto',
      height: '100vh',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    registerFormSection: {
      flex: window.innerWidth <= 768 ? '1' : '0 0 40%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: window.innerWidth <= 768 ? '20px' : '40px',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      borderRadius: window.innerWidth <= 768 ? '0' : '8px',
      margin: window.innerWidth <= 768 ? '0' : '20px',
      boxSizing: 'border-box',
    },
    header: {
      marginBottom: '30px',
      textAlign: 'center',
      display:'flex',
    },
    preclinicLogo: {
      maxWidth: '150px',
      height: 'auto',
    },
    pageTitle: {
      fontSize: '2em',
      marginBottom: '10px',
      color: '#333',
    },
    pageDescription: {
      color: '#666',
      marginBottom: '30px',
    },
    registerForm: {
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      textAlign: 'left',
      position: 'relative',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold',
      color: '#555',
    },
    formInput: {
      width: '100%',
      padding: '12px 15px',
      paddingLeft: '40px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      boxSizing: 'border-box',
      outline: 'none',
    },
    inputIcon: {
      position: 'absolute',
      left: '15px',
      top: '65%',
      transform: 'translateY(-50%)',
      color: '#888',
    },
    passwordInputContainer: {
      position: 'relative',
      width: '100%',
    },
    passwordToggleButton: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#777',
      cursor: 'pointer',
      fontSize: '0.9em',
      padding: '5px',
    },
    termsCheckboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#666',
      marginBottom: '15px',
    },
    checkboxInput: {
      width: '16px',
      height: '16px',
      accentColor: '#5b45c3',
    },
    termsLink: {
      color: '#5b45c3',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    registerButton: {
      width: '100%',
      padding: '15px',
      backgroundColor: '#5b45c3',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1em',
      fontWeight: 'bold',
      cursor: 'pointer',
      textTransform: 'capitalize',
    },
    separator: {
      margin: '30px 0',
      textAlign: 'center',
      color: '#999',
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
    },
    socialLoginButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '30px',
      width: '100%',
      maxWidth: '400px',
    },
    socialButton: {
      flex: '1',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: 'white',
      color: '#555',
      fontSize: '1em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      textTransform: 'capitalize',
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      marginRight: '5px',
    },
    loginLink: {
      fontSize: '0.95em',
      color: '#666',
    },
    loginLinkAnchor: {
      color: '#5b45c3',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agreeToTerms) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Agree to Terms:', agreeToTerms);
    alert('Registration attempted for: ' + email);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Registering with ${provider}`);
    alert(`Registering with ${provider}`);
  };

  return (
    <div style={styles.registerPageContainer}>
      <div style={styles.illustrationSection}>
      </div>

      <div style={styles.registerFormSection}>
        <div style={styles.header}>
          <img src={preclinicLogo} alt="Preclinic Logo" style={styles.preclinicLogo} />
          <h2>Preclinic</h2>
        </div>
        <h2 style={styles.pageTitle}>Register</h2>
        <p style={styles.pageDescription}>Please enter your details to create account</p>

        <form onSubmit={handleSubmit} style={styles.registerForm}>
          <div style={styles.formGroup}>
            <label htmlFor="fullName" style={styles.label}>Full Name</label>
            <i className="fa fa-user" style={styles.inputIcon}></i> {/* Icon for Full Name */}
            <input
              type="text"
              id="fullName"
              style={styles.formInput}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
            <i className="fa fa-envelope" style={styles.inputIcon}></i> {/* Icon for Email */}
            <input
              type="email"
              id="email"
              style={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.passwordInputContainer}>
              <i className="fa fa-lock" style={{...styles.inputIcon, left: '15px'}}></i> {/* Icon for Password */}
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                style={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
              />
              <button
                type="button"
                style={styles.passwordToggleButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
            <div style={styles.passwordInputContainer}>
              <i className="fa fa-lock" style={{...styles.inputIcon, left: '15px'}}></i> {/* Icon for Confirm Password */}
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                style={styles.formInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
              <button
                type="button"
                style={styles.passwordToggleButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={styles.termsCheckboxContainer}>
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              style={styles.checkboxInput}
              required
            />
            <label htmlFor="agreeToTerms">
              I agree to the <a href="#" style={styles.termsLink}>Terms of Service</a> & <a href="#" style={styles.termsLink}>Privacy Policy</a>
            </label>
          </div>

          <button type="submit" style={styles.registerButton}>
            Register
          </button>
        </form>

        <div style={styles.separator}>OR</div>

        <div style={styles.socialLoginButtons}>
          <button style={styles.socialButton} onClick={() => handleSocialLogin('Facebook')}>
            <img src={facebookIcon} alt="Facebook" style={styles.socialIcon} /> Facebook
          </button>
          <button style={styles.socialButton} onClick={() => handleSocialLogin('Google')}>
            <img src={googleIcon} alt="Google" style={styles.socialIcon} /> Google
          </button>
          <button style={styles.socialButton} onClick={() => handleSocialLogin('Apple')}>
            <img src={appleIcon} alt="Apple" style={styles.socialIcon} /> Apple
          </button>
        </div>

        <p style={styles.loginLink}>
          Already have an account yet? <a href="#" style={styles.loginLinkAnchor}>Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;