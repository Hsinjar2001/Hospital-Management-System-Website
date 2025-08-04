// Component/common/SpecialtyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SpecialtyCard = ({ 
  specialty, 
  onClick, 
  className = '', 
  variant = 'default',
  showStats = true,
  interactive = true 
}) => {
  const {
    id,
    name,
    description,
    icon,
    doctorCount = 0,
    patientCount = 0,
    availableSlots = 0,
    rating = 0,
    image,
    color = 'blue',
    path
  } = specialty;

  // Color configurations
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
      gradient: 'from-blue-400 to-blue-600',
      icon: 'text-blue-500'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
      gradient: 'from-green-400 to-green-600',
      icon: 'text-green-500'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-100',
      gradient: 'from-purple-400 to-purple-600',
      icon: 'text-purple-500'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      border: 'border-red-200',
      hover: 'hover:bg-red-100',
      gradient: 'from-red-400 to-red-600',
      icon: 'text-red-500'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-100',
      gradient: 'from-orange-400 to-orange-600',
      icon: 'text-orange-500'
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-100',
      gradient: 'from-cyan-400 to-cyan-600',
      icon: 'text-cyan-500'
    }
  };

  const colors = colorConfig[color] || colorConfig.blue;

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(specialty);
    }
  };

  // Default variant
  const DefaultCard = () => (
    <div className={`
      bg-white rounded-xl shadow-md border ${colors.border} p-6 
      ${interactive ? `cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:scale-105 ${colors.hover}` : ''} 
      ${className}
    `}>
      
      {/* Icon/Image */}
      <div className="flex items-center justify-center mb-4">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center`}>
            {icon ? (
              typeof icon === 'string' ? (
                <span className="text-2xl">{icon}</span>
              ) : (
                <div className={`${colors.icon}`}>{icon}</div>
              )
            ) : (
              <div className={`w-8 h-8 bg-gradient-to-br ${colors.gradient} rounded-full`}></div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}
        
        {/* Stats */}
        {showStats && (
          <div className="space-y-1 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Doctors:</span>
              <span className={`font-medium ${colors.text}`}>{doctorCount}</span>
            </div>
            {availableSlots > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Available Slots:</span>
                <span className="font-medium text-green-600">{availableSlots}</span>
              </div>
            )}
            {rating > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Rating:</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{rating}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action Button */}
        <button 
          onClick={handleClick}
          className={`w-full px-4 py-2 ${colors.bg} ${colors.text} rounded-lg font-medium transition-colors hover:opacity-80`}
        >
          View Doctors
        </button>
      </div>
    </div>
  );

  // Compact variant
  const CompactCard = () => (
    <div className={`
      bg-white rounded-lg shadow-sm border ${colors.border} p-4 
      ${interactive ? `cursor-pointer transform transition-all duration-300 hover:shadow-md hover:scale-105 ${colors.hover}` : ''} 
      ${className}
    `}>
      <div className="flex items-center space-x-3">
        
        {/* Icon */}
        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          {icon ? (
            typeof icon === 'string' ? (
              <span className="text-xl">{icon}</span>
            ) : (
              <div className={`${colors.icon}`}>{icon}</div>
            )
          ) : (
            <div className={`w-6 h-6 bg-gradient-to-br ${colors.gradient} rounded-full`}></div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
          <p className="text-xs text-gray-500">{doctorCount} Doctors</p>
        </div>

        {/* Arrow */}
        <div className={`${colors.text}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );

  // Featured variant
  const FeaturedCard = () => (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 ${colors.border} overflow-hidden
      ${interactive ? `cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105` : ''} 
      ${className}
    `}>
      
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-6 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-sm opacity-90">{doctorCount} Specialists Available</p>
          </div>
          <div className="text-4xl opacity-80">
            {typeof icon === 'string' ? icon : '🏥'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
        )}
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{doctorCount}</div>
            <div className="text-xs text-gray-500">Doctors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{availableSlots}</div>
            <div className="text-xs text-gray-500">Available Today</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={handleClick}
            className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.gradient} text-white rounded-lg font-medium transition-all hover:opacity-90`}
          >
            Book Appointment
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );

  // Render appropriate variant
  const renderCard = () => {
    switch (variant) {
      case 'compact':
        return <CompactCard />;
      case 'featured':
        return <FeaturedCard />;
      default:
        return <DefaultCard />;
    }
  };

  // Wrap with Link if path is provided
  if (path && !onClick) {
    return (
      <Link to={path} className="block">
        {renderCard()}
      </Link>
    );
  }

  return (
    <div onClick={handleClick}>
      {renderCard()}
    </div>
  );
};

// No sample data - specialties will come from real API data

// Examples component removed - use real specialty data from API

export default SpecialtyCard;
