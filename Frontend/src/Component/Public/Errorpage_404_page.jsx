import React from 'react';
import './Errorpage_404_page.css'; 

// Import the assets based on your file structure
import PreclinicLogo from '../../assets/Homepage/logo.png'; // Assuming your logo is here
import ErrorIllustration from '../../assets/Error_Page_Image/Error.png'; // Assuming the illustration 'Error.png' is here

const ErrorPage = () => {
    // Function to handle the "Back to Dashboard" button click
    const handleBackToDashboard = () => {
        // In a real application, you would use React Router's `useNavigate` hook
        // to programmatically navigate back to the dashboard.
        // For example:
        // import { useNavigate } from 'react-router-dom';
        // const navigate = useNavigate();
        // navigate('/dashboard'); // Or wherever your dashboard route is
        console.log("Navigating back to Dashboard...");
        alert("This would navigate to the dashboard!");
    };

    return (
        <div className="error-page-container">
            <div className="error-header">
                <img src={PreclinicLogo} alt="Preclinic Logo" className="preclinic-logo-error" />
                <span>Preclinic</span> {/* The text "Preclinic" next to the logo */}
            </div>

            <div className="error-content">
                <p className="page-not-found-text">PAGE NOT FOUND</p> {/* Text "PAGE NOT FOUND" */}
                <img
                    src={ErrorIllustration}
                    alt="404 Error Illustration"
                    className="error-illustration"
                />
                <h1 className="error-title">Oops, something went wrong</h1> {/* Heading "Oops, something went wrong" */}
                <p className="error-message">
                    Error 404 Page not found. Sorry the page you looking for doesn't exist or has been moved. {/* Detailed error message */}
                </p>
                <button className="back-to-dashboard-button" onClick={handleBackToDashboard}>
                    <span className="arrow-icon">←</span> Back to Dashboard {/* Button text and arrow */}
                </button>
            </div>

            {/* No explicit copyright text in the "Error 404 Page.jpg" image, but you could add one here if desired */}
            {/* <p className="error-copyright">Copyright © 2025 · Preclinic.</p> */}
        </div>
    );
};

export default ErrorPage;