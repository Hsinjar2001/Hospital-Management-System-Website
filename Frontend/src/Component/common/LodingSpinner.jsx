// Component/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ 
  size = 'default', 
  color = 'blue', 
  text = '', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'border-blue-600',
    green: 'border-green-600',
    red: 'border-red-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const spinnerClasses = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-4 
    border-t-transparent 
    rounded-full 
    animate-spin
    ${className}
  `;

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 ${fullScreen ? 'min-h-screen' : ''}`}>
      {/* Spinner */}
      <div className={spinnerClasses}></div>
      
      {/* Loading Text */}
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  // Full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// Alternative Spinner Styles
export const DotSpinner = ({ color = 'blue', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-2 h-2',
    default: 'w-3 h-3',
    large: 'w-4 h-4'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`
            ${sizeClasses[size]} 
            ${colorClasses[color]} 
            rounded-full 
            animate-bounce
          `}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s'
          }}
        ></div>
      ))}
    </div>
  );
};

// Medical themed spinner
export const MedicalSpinner = ({ size = 'default' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-10 h-10',
    large: 'w-14 h-14'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`${sizeClasses[size]} relative`}>
        {/* Medical Cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-full bg-red-500 animate-pulse"></div>
          <div className="absolute w-full h-1 bg-red-500 animate-pulse"></div>
        </div>
        {/* Rotating Ring */}
        <div className={`${sizeClasses[size]} border-4 border-red-200 border-t-red-500 rounded-full animate-spin`}></div>
      </div>
      <p className="text-red-600 text-xs font-medium">Processing...</p>
    </div>
  );
};

// Pulse Spinner
export const PulseSpinner = ({ color = 'blue', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        rounded-full 
        animate-ping
      `}></div>
    </div>
  );
};

// Card Loading Skeleton
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {/* Header skeleton */}
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      
      {/* Content lines */}
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className={`h-3 bg-gray-300 rounded ${
            index === lines - 1 ? 'w-1/2' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Usage Examples Component (for documentation)
export const SpinnerExamples = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Loading Spinner Examples</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        
        {/* Default Spinner */}
        <div className="text-center space-y-2">
          <LoadingSpinner />
          <p className="text-sm text-gray-600">Default</p>
        </div>

        {/* With Text */}
        <div className="text-center space-y-2">
          <LoadingSpinner text="Loading patients..." />
          <p className="text-sm text-gray-600">With Text</p>
        </div>

        {/* Different Sizes */}
        <div className="text-center space-y-2">
          <LoadingSpinner size="large" color="green" />
          <p className="text-sm text-gray-600">Large Green</p>
        </div>

        {/* Dot Spinner */}
        <div className="text-center space-y-2">
          <DotSpinner color="purple" />
          <p className="text-sm text-gray-600">Dot Spinner</p>
        </div>

        {/* Medical Spinner */}
        <div className="text-center space-y-2">
          <MedicalSpinner />
          <p className="text-sm text-gray-600">Medical Theme</p>
        </div>

        {/* Pulse Spinner */}
        <div className="text-center space-y-2">
          <PulseSpinner color="red" />
          <p className="text-sm text-gray-600">Pulse Effect</p>
        </div>
      </div>

      {/* Skeleton Loader */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Skeleton Loader</h3>
        <div className="max-w-md">
          <SkeletonLoader lines={4} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
