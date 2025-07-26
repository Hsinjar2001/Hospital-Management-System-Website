// pages/ErrorPage404.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage404 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);

  // Get user role from localStorage or context to provide appropriate navigation
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser') || '{}');
      return user.role || 'guest';
    } catch {
      return 'guest';
    }
  };

  const userRole = getUserRole();

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get appropriate home path based on user role
  const getHomePath = () => {
    switch (userRole) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'patient':
        return '/patient/dashboard';
      default:
        return '/';
    }
  };

  const handleGoHome = () => {
    navigate(getHomePath());
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  // Common navigation links based on user role
  const getNavigationLinks = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
          { label: 'Patients', path: '/admin/patients', icon: '👥' },
          { label: 'Doctors', path: '/admin/doctors', icon: '👨‍⚕️' },
          { label: 'Appointments', path: '/admin/appointments', icon: '📅' }
        ];
      case 'doctor':
        return [
          { label: 'Dashboard', path: '/doctor/dashboard', icon: '📊' },
          { label: 'Appointments', path: '/doctor/appointments', icon: '📅' },
          { label: 'Patients', path: '/doctor/patients', icon: '👥' },
          { label: 'Prescriptions', path: '/doctor/prescriptions', icon: '💊' }
        ];
      case 'patient':
        return [
          { label: 'Dashboard', path: '/patient/dashboard', icon: '📊' },
          { label: 'Appointments', path: '/patient/appointments', icon: '📅' },
          { label: 'Prescriptions', path: '/patient/prescriptions', icon: '💊' },
          { label: 'Invoices', path: '/patient/invoices', icon: '💳' }
        ];
      default:
        return [
          { label: 'Home', path: '/', icon: '🏠' },
          { label: 'Login', path: '/auth/login', icon: '🔑' },
          { label: 'Register', path: '/auth/register', icon: '📝' }
        ];
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        
        {/* Animated 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Hospital Building Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <svg className="w-32 h-32 text-blue-200 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {/* Red Cross Symbol */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-red-500 relative">
                    <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-2 bg-white"></div>
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-2 bg-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Large 404 Text */}
            <div className="relative">
              <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-bounce">
                404
              </h1>
              {/* Floating Elements */}
              <div className="absolute top-0 left-1/4 animate-float">
                <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
              </div>
              <div className="absolute top-1/4 right-1/4 animate-float-delayed">
                <div className="w-3 h-3 bg-purple-400 rounded-full opacity-60"></div>
              </div>
              <div className="absolute bottom-1/4 left-1/3 animate-float">
                <div className="w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for seems to have taken a medical leave.
          </p>
          <p className="text-gray-500">
            Don't worry, our medical team is on it! 🏥
          </p>
        </div>

        {/* Current Path Info */}
        <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Requested URL:</span> 
            <code className="bg-gray-100 px-2 py-1 rounded text-red-600 ml-2">
              {location.pathname}
            </code>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoBack}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Go Back
              </span>
            </button>

            <button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to {userRole === 'guest' ? 'Home' : 'Dashboard'}
              </span>
            </button>
          </div>

          {/* Auto-redirect notice */}
          <div className="text-sm text-gray-500">
            Auto-redirecting to {userRole === 'guest' ? 'home' : 'dashboard'} in {countdown} seconds...
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {navigationLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className="bg-white/80 backdrop-blur-sm hover:bg-white border border-white/20 hover:border-blue-200 p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg group"
              >
                <div className="text-2xl mb-2 group-hover:animate-pulse">{link.icon}</div>
                <div className="text-sm font-medium text-gray-700">{link.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📞</div>
              <div className="font-medium text-gray-900">Emergency</div>
              <div className="text-gray-600">+1-555-911-HELP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium text-gray-900">Support</div>
              <div className="text-gray-600">support@hospital.com</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏥</div>
              <div className="font-medium text-gray-900">Location</div>
              <div className="text-gray-600">123 Healthcare Ave</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025 Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage404;
