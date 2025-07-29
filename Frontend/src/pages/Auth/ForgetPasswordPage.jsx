// pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import PreclinicLogo from '../../assets/Homepage/logo.png';
import OpenEyeIcon from '../../assets/Homepage/open_eye_icon.png';
import ClosedEyeIcon from '../../assets/Homepage/closed_eye_icon.png';
import LoginImage from '../../assets/Login_Page_Image/login.png';

const ResetPasswordPage = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Watch new password for confirmation validation
  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      console.log("Reset Password form submitted!", data);
      // Add your password reset logic here
      alert("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      alert("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleReturnToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      
      {/* Illustration Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-200 items-center justify-center relative">
        <div 
          className="w-full h-full bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: `url(${LoginImage})` }}
        />
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 lg:px-8 bg-white shadow-xl">
        
        {/* Header */}
        <div className="flex items-center mb-8 lg:mb-12">
          <img
            src={PreclinicLogo}
            alt="Preclinic Logo"
            className="h-8 w-8 lg:h-10 lg:w-10 mr-3"
          />
          <span className="text-xl lg:text-2xl font-bold text-gray-800">Preclinic</span>
        </div>

        {/* Reset Password Card */}
        <div className="w-full max-w-md bg-white p-6 lg:p-10 rounded-2xl shadow-2xl">
          
          {/* Card Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Reset Password</h2>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Your new password must be different from previous used passwords.
            </p>
          </div>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* New Password Field */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <input
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                      message: "Password must contain uppercase, lowercase, number and special character"
                    }
                  })}
                  type={showNewPassword ? "text" : "password"}
                  id="new-password"
                  placeholder="**********"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <img
                    src={showNewPassword ? OpenEyeIcon : ClosedEyeIcon}
                    alt="Toggle Password Visibility"
                    className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity duration-200"
                  />
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password Field */}
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <input
                  {...register("confirmNewPassword", {
                    required: "Please confirm your new password",
                    validate: value =>
                      value === newPassword || "Passwords do not match"
                  })}
                  type={showConfirmNewPassword ? "text" : "password"}
                  id="confirm-new-password"
                  placeholder="**********"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={toggleConfirmNewPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <img
                    src={showConfirmNewPassword ? OpenEyeIcon : ClosedEyeIcon}
                    alt="Toggle Confirm Password Visibility"
                    className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity duration-200"
                  />
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Contains at least one number</li>
                <li>• Contains at least one special character</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                "Submit"
              )}
            </button>

            {/* Return to Login Button */}
            <button
              type="button"
              onClick={handleReturnToLogin}
              className="w-full py-3 px-4 border border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Return to Login
            </button>
          </form>
        </div>

        {/* Mobile Image */}
        <div className="lg:hidden mt-8 w-full max-w-sm">
          <img
            src={LoginImage}
            alt="Reset Password Illustration"
            className="w-full h-auto object-contain opacity-50"
          />
        </div>

        {/* Copyright Text for Mobile */}
        <div className="lg:hidden mt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2025 Preclinic. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
