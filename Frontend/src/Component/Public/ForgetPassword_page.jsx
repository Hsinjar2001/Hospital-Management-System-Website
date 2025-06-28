import React, { useState } from 'react'; // Import useState for managing password visibility
import './ForgetPassword_page.css'; 


import PreclinicLogo from '../../assets/Homepage/logo.png'; 
import OpenEyeIcon from '../../assets/Homepage/open_eye_icon.png';
import ClosedEyeIcon from '../../assets/Homepage/closed_eye_icon.png';
const ResetPasswordPage = () => {
  
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    // Function to toggle visibility for New Password
    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(prevState => !prevState);
    };

    // Function to toggle visibility for Confirm New Password
    const toggleConfirmNewPasswordVisibility = () => {
        setShowConfirmNewPassword(prevState => !prevState);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); 
        console.log("Reset Password form submitted!");
      
    };

   
    const handleReturnToLogin = () => {
        console.log("Return to Login button clicked (no navigation implemented without react-router-dom)");
    };

    return (
        <div className="reset-password-page-container">
            <div className="reset-password-illustration-section">
                {/* Illustration is handled via CSS background-image */}
            </div>
            <div className="reset-password-form-section">
                <div className="reset-password-header">
                    <img src={PreclinicLogo} alt="Preclinic Logo" className="preclinic-logo-small" />
                    <span>Preclinic</span>
                </div>
                <div className="reset-password-card">
                    <h2>Reset Password</h2>
                    <p className="reset-password-instruction">
                        Your new password must be different from previous used passwords.
                    </p>

                    <form className="reset-password-form" onSubmit={handleSubmit}>
                        {/* New Password Field */}
                        <div className="form-group">
                            <label htmlFor="new-password">New Password</label>
                            <div className="input-with-icon">
                                <span className="password-lock-icon">🔒</span>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="new-password"
                                    placeholder="**********"
                                    required
                                />
                                <img
                                src={showNewPassword ? OpenEyeIcon : ClosedEyeIcon}
                                alt="Toggle New Password Visibility"
                                className="password-toggle-icon"
                                onClick={toggleNewPasswordVisibility}
                            />
                            </div>
                        </div>

                        {/* Confirm New Password Field */}
                        <div className="form-group">
                            <label htmlFor="confirm-new-password">Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="password-lock-icon">🔒</span>
                                <input
                                    type={showConfirmNewPassword ? "text" : "password"}
                                    id="confirm-new-password"
                                    placeholder="**********"
                                    required
                                />
                                 <img
                                    src={showConfirmNewPassword ? OpenEyeIcon : ClosedEyeIcon}
                                    alt="Toggle Confirm Password Visibility"
                                    className="password-toggle-icon"
                                    onClick={toggleConfirmNewPasswordVisibility}
                                />
                            </div>
                        </div>

                        <button type="submit" className="reset-password-button">Submit</button>

                        <button type="button" className="return-to-login-button" onClick={handleReturnToLogin}>
                            Return to Login
                        </button>
                    </form>
                </div>
             
            </div>
        </div>
    );
};

export default ResetPasswordPage;