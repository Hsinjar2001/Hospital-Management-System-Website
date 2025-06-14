import React from 'react';
import './Login_page.css';
import { useNavigate } from 'react-router-dom';


import PreclinicLogo from '../../assets/Homepage/logo.png';
import FacebookLogo from '../../assets/Homepage/facbook_logo.png';
import GoogleLogo from '../../assets/Homepage/google_logo.png';
import AppleLogo from '../../assets/Homepage/Apple_logo.png';
import MailIcon from '../../assets/Homepage/Message_logo.png';
// import Login from '../../assets/Login_Page_Image/login.png';

const LoginPage = () => {


    const navigate = useNavigate();
   
    return (
        <div className="login-page-container">
            <div className="login-illustration-section">
                {/* Illustration is handled via CSS background-image */}
            </div>
            <div className="login-form-section">
                <div className="login-header">
                    <img src={PreclinicLogo} alt="Preclinic Logo" className="preclinic-logo-small" />
                    <span>Preclinic</span>
                </div>
                <div className="login-card">
                    <h2>Sign In</h2>
                    <p className="login-instruction">Please enter below details to access the dashboard</p>

                    <form className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <img src={MailIcon} alt="Mail Icon" className="input-icon" />
                                <input type="email" id="email" placeholder="Enter Email Address" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <span className="password-lock-icon">🔒</span>
                                <input type="password" id="password" placeholder="**********" />
                                <span className="password-toggle-icon">👁️</span>
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember-me" />
                                <label htmlFor="remember-me">Remember Me</label>
                            </div>
                            <a href="#" className="forgot-password">Forgot Password?</a>
                        </div>

                        <button type="submit" className="login-button">Login</button>

                        <p className="or-divider">OR</p>

                        <div className="social-login-buttons">
                            <button className="social-button facebook">
                                <img src={FacebookLogo} alt="Facebook" />
                            </button>
                            <button className="social-button google">
                                <img src={GoogleLogo} alt="Google" />
                            </button>
                            <button className="social-button apple">
                                <img src={AppleLogo} alt="Apple" />
                            </button>
                        </div>

                        <p className="register-link">
                            Don't have an account, yet?<a href="#" onClick={()=>navigate('/register')}>Register</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default LoginPage;