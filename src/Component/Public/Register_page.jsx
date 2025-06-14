import React from 'react';
import './Register_page.css';
import { useNavigate } from 'react-router-dom';



import PreclinicLogo from '../../assets/Homepage/logo.png';
import FacebookLogo from '../../assets/Homepage/facbook_logo.png';
import GoogleLogo from '../../assets/Homepage/google_logo.png';
import AppleLogo from '../../assets/Homepage/Apple_logo.png';
import MailIcon from '../../assets/Homepage/Message_logo.png';





const RegisterPage = () => {
    const navigate = useNavigate();
   
    return (
        <div className="register-page-container">
            <div className="register-illustration-section"></div>
            <div className="register-form-section">
                <div className="register-header">
                    <img src={PreclinicLogo} alt="Preclinic Logo" className="preclinic-logo-small" />
                    <span>Preclinic</span>
                </div>
                <div className="register-card">
                    <h2>Register</h2>
                    <p className="register-instruction">Please enter your details to create account</p>

                    <form className="register-form">
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
                            <div className="input-with-icon">
                                <span className="input-icon">👤</span>
                                <input type="text" id="fullName" placeholder="Enter Name" />
                            </div>
                        </div>

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

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="password-lock-icon">🔒</span>
                                <input type="password" id="confirmPassword" placeholder="**********" />
                                <span className="password-toggle-icon">👁️</span>
                            </div>
                        </div>

                        <div className="terms-checkbox">
                            <input type="checkbox" id="terms-agree" />
                            <label htmlFor="terms-agree">
                                I agree to the <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" className="register-button">Register</button>

                        <p className="or-divider">OR</p>

                        <div className="social-register-buttons">
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

                        <p className="login-link">
                            Already have an account, yet? <a href="#"  onClick={() => navigate('/login')}>Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};


export default RegisterPage;