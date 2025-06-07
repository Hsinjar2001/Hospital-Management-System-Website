import React, { useState } from 'react';

import preclinicLogo from '../../assets/Preclinic Logo.png';
import illustration from '../../assets/illustration.png'; // Changed to Image (5).png as per request
import facebookIcon from '../../assets/facebook-icon.png';
import googleIcon from '../../assets/google-icon.png';
import appleIcon from '../../assets/apple-icon.png';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const styles = {
    loginPageContainer: {
      display: 'flex',
      minHeight: '100vh',

      fontFamily: 'Arial, sans-serif',
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
      alignItems: 'stretch', // Ensure both children stretch to fill height
    },
    loginIllustrationSection: {
      flex: window.innerWidth <= 768 ? 'none' : '0 0 60%', // Takes 60% width on desktop, none on mobile
      backgroundColor: '#ffffff', // Background color for the left side
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url("${illustration}")`,
      backgroundSize: '80%', // Adjusted for better visibility of the illustration
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: window.innerWidth <= 768 ? '250px' : 'auto',
      height: '100vh', // Ensures it takes full viewport height on desktop
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
      width:'500px',
    },
    loginFormSection: {
      flex: window.innerWidth <= 768 ? '1' : '0 0 40%', // Takes 40% width on desktop, full on mobile
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: window.innerWidth <= 768 ? '20px' : '40px',
      backgroundColor: '#ffffff',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Shadow for the card effect
      textAlign: 'center',
      borderRadius: window.innerWidth <= 768 ? '0' : '8px', // Rounded corners on desktop
      margin: window.innerWidth <= 768 ? '0' : '20px', // Margin on desktop to create space around the card
      boxSizing: 'border-box', // Include padding in the element's total width and height
    },
    loginHeader: {
      marginBottom: '30px',
      textAlign: 'center',
      display:'flex',
      margin:'10px',
      padding:'10px',
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
    loginForm: {
      width: '100%',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      textAlign: 'left',
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
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '1em',
      boxSizing: 'border-box',
      outline: 'none',
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
    loginOptions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '5px',
      marginBottom: '15px',
      width: '100%',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#666',
      cursor: 'pointer',
    },
    checkboxInput: {
      width: '16px',
      height: '16px',
      accentColor: '#5b45c3',
    },
    forgotPasswordLink: {
      color: '#5b45c3',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
    loginButton: {
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
    loginSeparator: {
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
    facebookIcon: { color: '#3b5998' },
    googleIcon: { color: '#DB4437' },
    appleIcon: { color: '#000000' },
    signupLink: {
      fontSize: '0.95em',
      color: '#666',
    },
    signupLinkAnchor: {
      color: '#5b45c3',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
    alert('Login attempted with: ' + email);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    alert(`Logging in with ${provider}`);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.loginPageContainer}>
      <div style={styles.loginIllustrationSection}>
      </div>

      <div style={styles.loginFormSection}>
        <div style={styles.loginHeader}>
          <img src={preclinicLogo} alt="Preclinic Logo" style={styles.preclinicLogo} />
          <h2>Preclinic</h2>
        </div>
        <h2 style={styles.pageTitle}>Sign In</h2>
        <p style={styles.pageDescription}>Please enter below details to access the dashboard</p>

        <form onSubmit={handleSubmit} style={styles.loginForm}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email Address</label>
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
                onClick={handleClickShowPassword}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={styles.loginOptions}>
            <label style={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                name="rememberMe"
                style={styles.checkboxInput}
              />
              Remember Me
            </label>
            <a href="#" style={styles.forgotPasswordLink}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={styles.loginButton}>
            Login
          </button>
        </form>

        <div style={styles.loginSeparator}>OR</div>

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

        <p style={styles.signupLink}>
          Don't have an account yet? <a href="#" style={styles.signupLinkAnchor}>Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;