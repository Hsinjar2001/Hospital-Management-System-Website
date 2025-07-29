// Component/common/StatCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'percentage', // 'percentage', 'number', 'none'
  icon, 
  color = 'blue', 
  trend = 'up', // 'up', 'down', 'neutral'
  description,
  actionText,
  actionLink,
  onClick,
  loading = false,
  className = '',
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  // Color configurations
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: 'text-blue-500',
      gradient: 'from-blue-400 to-blue-600',
      ring: 'ring-blue-500/20'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500',
      gradient: 'from-green-400 to-green-600',
      ring: 'ring-green-500/20'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: 'text-purple-500',
      gradient: 'from-purple-400 to-purple-600',
      ring: 'ring-purple-500/20'
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-500',
      gradient: 'from-red-400 to-red-600',
      ring: 'ring-red-500/20'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      icon: 'text-orange-500',
      gradient: 'from-orange-400 to-orange-600',
      ring: 'ring-orange-500/20'
    },
    cyan: {
      bg: 'bg-cyan-50',
      text: 'text-cyan-600',
      icon: 'text-cyan-500',
      gradient: 'from-cyan-400 to-cyan-600',
      ring: 'ring-cyan-500/20'
    },
    gray: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'text-gray-500',
      gradient: 'from-gray-400 to-gray-600',
      ring: 'ring-gray-500/20'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      icon: 'text-indigo-500',
      gradient: 'from-indigo-400 to-indigo-600',
      ring: 'ring-indigo-500/20'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      icon: 'text-emerald-500',
      gradient: 'from-emerald-400 to-emerald-600',
      ring: 'ring-emerald-500/20'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      icon: 'text-rose-500',
      gradient: 'from-rose-400 to-rose-600',
      ring: 'ring-rose-500/20'
    }
  };

  const colors = colorConfig[color] || colorConfig.blue;

  // Trend configurations
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7m0 10H7" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10m0-10h10" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      );
    }
  };

  const getTrendColor = () => {
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600';
  };

  // Format change value
  const formatChange = () => {
    if (changeType === 'percentage') {
      return `${change > 0 ? '+' : ''}${change}%`;
    } else if (changeType === 'number') {
      return `${change > 0 ? '+' : ''}${change}`;
    }
    return change;
  };

  // Default variant
  const DefaultCard = () => (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-100 p-6 
      ${onClick ? 'cursor-pointer hover:shadow-md transform hover:scale-105' : ''} 
      transition-all duration-200 
      ${colors.ring} 
      ${className}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            )}
            {change !== undefined && changeType !== 'none' && !loading && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                  {formatChange()}
                </span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        
        {/* Icon */}
        <div className={`${colors.bg} p-3 rounded-lg`}>
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
      </div>
      
      {/* Action Link */}
      {actionText && actionLink && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link 
            to={actionLink} 
            className={`text-sm font-medium ${colors.text} hover:opacity-80 transition-opacity`}
          >
            {actionText} →
          </Link>
        </div>
      )}
    </div>
  );

  // Compact variant
  const CompactCard = () => (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-100 p-4 
      ${onClick ? 'cursor-pointer hover:shadow-md' : ''} 
      transition-all duration-200 
      ${className}
    `}>
      <div className="flex items-center space-x-3">
        <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0`}>
          {icon ? (
            typeof icon === 'string' ? (
              <span className="text-lg">{icon}</span>
            ) : (
              <div className={`${colors.icon}`}>{icon}</div>
            )
          ) : (
            <div className={`w-5 h-5 bg-gradient-to-br ${colors.gradient} rounded-full`}></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 truncate">{title}</p>
          {loading ? (
            <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
          ) : (
            <p className="text-lg font-bold text-gray-900">{value}</p>
          )}
        </div>
        
        {change !== undefined && changeType !== 'none' && !loading && (
          <div className="flex items-center space-x-1 flex-shrink-0">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {formatChange()}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Detailed variant
  const DetailedCard = () => (
    <div className={`
      bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden
      ${onClick ? 'cursor-pointer hover:shadow-xl transform hover:scale-105' : ''} 
      transition-all duration-300 
      ${className}
    `}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-4`}>
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            {loading ? (
              <div className="h-8 w-24 bg-white/20 animate-pulse rounded mt-1"></div>
            ) : (
              <p className="text-3xl font-bold">{value}</p>
            )}
          </div>
          <div className="text-3xl opacity-80">
            {typeof icon === 'string' ? icon : '📊'}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {change !== undefined && changeType !== 'none' && !loading && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Change from last period</span>
            <div className="flex items-center space-x-2">
              {getTrendIcon()}
              <span className={`text-sm font-semibold ${getTrendColor()}`}>
                {formatChange()}
              </span>
            </div>
          </div>
        )}
        
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        
        {actionText && actionLink && (
          <Link 
            to={actionLink} 
            className={`inline-flex items-center text-sm font-medium ${colors.text} hover:opacity-80 transition-opacity`}
          >
            {actionText}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );

  // Render appropriate variant
  const renderCard = () => {
    switch (variant) {
      case 'compact':
        return <CompactCard />;
      case 'detailed':
        return <DetailedCard />;
      default:
        return <DefaultCard />;
    }
  };

  return (
    <div onClick={onClick}>
      {renderCard()}
    </div>
  );
};

// Sample stats data for testing
export const sampleStats = [
  {
    title: 'Total Patients',
    value: '2,847',
    change: 12,
    changeType: 'percentage',
    trend: 'up',
    icon: '👥',
    color: 'blue',
    description: 'Active patients this month',
    actionText: 'View all patients',
    actionLink: '/patients'
  },
  {
    title: 'Appointments Today',
    value: '47',
    change: 8,
    changeType: 'number',
    trend: 'up',
    icon: '📅',
    color: 'green',
    description: 'Scheduled for today',
    actionText: 'Manage appointments',
    actionLink: '/appointments'
  },
  {
    title: 'Available Doctors',
    value: '23',
    change: -2,
    changeType: 'number',
    trend: 'down',
    icon: '👨‍⚕️',
    color: 'purple',
    description: 'Currently on duty',
    actionText: 'View schedule',
    actionLink: '/doctors'
  },
  {
    title: 'Revenue',
    value: '$48,250',
    change: 22.5,
    changeType: 'percentage',
    trend: 'up',
    icon: '💰',
    color: 'emerald',
    description: 'This month\'s earnings',
    actionText: 'View reports',
    actionLink: '/reports'
  },
  {
    title: 'Satisfaction Rate',
    value: '94.8%',
    change: 0,
    changeType: 'none',
    trend: 'neutral',
    icon: '⭐',
    color: 'orange',
    description: 'Patient satisfaction score'
  },
  {
    title: 'Bed Occupancy',
    value: '78%',
    change: -5.2,
    changeType: 'percentage',
    trend: 'down',
    icon: '🏥',
    color: 'cyan',
    description: 'Current bed utilization'
  }
];

// Usage Examples Component
export const StatCardExamples = () => {
  const handleCardClick = (stat) => {
    console.log('Stat card clicked:', stat);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Stat Card Examples</h2>
      
      {/* Default Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Default Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleStats.slice(0, 4).map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              onClick={() => handleCardClick(stat)}
            />
          ))}
        </div>
      </div>

      {/* Compact Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleStats.slice(0, 6).map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              variant="compact"
              onClick={() => handleCardClick(stat)}
            />
          ))}
        </div>
      </div>

      {/* Detailed Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleStats.slice(0, 3).map((stat, index) => (
            <StatCard
              key={index}
              {...stat}
              variant="detailed"
              onClick={() => handleCardClick(stat)}
            />
          ))}
        </div>
      </div>

      {/* Loading State */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Loading State</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <StatCard
              key={index}
              title="Loading..."
              value="---"
              icon="📊"
              loading={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
