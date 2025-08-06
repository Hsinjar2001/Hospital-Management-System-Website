// Component/common/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  isOpen, 
  setIsOpen, 
  userRole = 'admin',
  collapsed = false,
  onCollapse 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [userDataVersion, setUserDataVersion] = useState(0); // Force re-render when user data updates

  // Get real user data from localStorage/sessionStorage
  const getUser = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role,
          avatar: userData.profileImage || null,
          firstName: userData.firstName,
          lastName: userData.lastName
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    // Fallback to sample data if no user found
    return {
      name: 'John Doe',
      email: 'john@example.com',
      role: userRole,
      avatar: null
    };
  };

  // Get user data (re-computed when userDataVersion changes)
  const user = React.useMemo(() => getUser(), [userDataVersion]);

  // Listen for user data updates
  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      // Force re-render by updating version
      setUserDataVersion(prev => prev + 1);
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  // Navigation configuration based on role
  const getNavigationConfig = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Panel',
          logo: 'A',
          color: 'blue',
          menuItems: [
            {
              id: 'dashboard',
              name: 'Dashboard',
              icon: '📊',
              path: '/admin/dashboard',
              badge: null
            },
            {
              id: 'patients',
              name: 'Patients',
              icon: '👥',
              path: '/admin/patients',
              badge: null,
              subItems: [
                { name: 'All Patients', path: '/admin/patients/list', icon: '📋' },
                { name: 'Add Patient', path: '/admin/patients/add', icon: '➕' }
              ]
            },
            {
              id: 'doctors',
              name: 'Doctors',
              icon: '👨‍⚕️',
              path: '/admin/doctors',
              badge: null,
              subItems: [
                { name: 'All Doctors', path: '/admin/doctors/list', icon: '📋' },
                { name: 'Add Doctor', path: '/admin/doctors/add', icon: '➕' },
                { name: 'Doctor Schedules', path: '/admin/doctors/schedules', icon: '🗓️' }
              ]
            },
            {
              id: 'appointments',
              name: 'Appointments',
              icon: '📅',
              path: '/admin/appointments',
              badge: '12',
              subItems: [
                { name: 'All Appointments', path: '/admin/appointments/list', icon: '📋' },
                { name: 'Calendar View', path: '/admin/appointments/calendar', icon: '📅' }
              ]
            },
            {
              id: 'departments',
              name: 'Departments',
              icon: '🏢',
              path: '/admin/departments',
              badge: null
            },
            {
              id: 'roles',
              name: 'Roles & Permissions',
              icon: '🔐',
              path: '/admin/roles',
              badge: null
            },
            {
              id: 'reports',
              name: 'Reports',
              icon: '📈',
              path: '/admin/reports',
              badge: null,
              subItems: [
                { name: 'Patient Reports', path: '/admin/reports/patients', icon: '👥' },
                { name: 'Financial Reports', path: '/admin/reports/financial', icon: '💰' },
                { name: 'Appointment Reports', path: '/admin/reports/appointments', icon: '📅' }
              ]
            },
            {
              id: 'settings',
              name: 'Settings',
              icon: '⚙️',
              path: '/admin/settings',
              badge: null
            }
          ]
        };

      case 'doctor':
        return {
          title: 'Doctor Portal',
          logo: 'D',
          color: 'green',
          menuItems: [
            {
              id: 'dashboard',
              name: 'Dashboard',
              icon: '📊',
              path: '/doctor/dashboard',
              badge: null
            },
            {
              id: 'appointments',
              name: 'Appointments',
              icon: '📅',
              path: '/doctor/appointments',
              badge: '8',
              subItems: [
                { name: 'Manage Appointments', path: '/doctor/appointments/manage', icon: '📋' },
                { name: 'Today\'s Appointments', path: '/doctor/appointments/today', icon: '🗓️' },
                { name: 'Upcoming', path: '/doctor/appointments/upcoming', icon: '⏰' },
                { name: 'Completed', path: '/doctor/appointments/completed', icon: '✅' }
              ]
            },
            {
              id: 'patients',
              name: 'My Patients',
              icon: '👥',
              path: '/doctor/patients',
              badge: null
            },

            {
              id: 'prescriptions',
              name: 'Prescriptions',
              icon: '💊',
              path: '/doctor/prescriptions',
              badge: null
            },
            {
              id: 'reviews',
              name: 'Reviews',
              icon: '⭐',
              path: '/doctor/reviews',
              badge: null
            },
            {
              id: 'profile',
              name: 'Profile',
              icon: '👤',
              path: '/doctor/profile',
              badge: null
            }
          ]
        };

      case 'patient':
        return {
          title: 'Patient Portal',
          logo: 'P',
          color: 'purple',
          menuItems: [
            {
              id: 'dashboard',
              name: 'Dashboard',
              icon: '🏠',
              path: '/patient/dashboard',
              badge: null
            },
            {
              id: 'appointments',
              name: 'Appointments',
              icon: '📅',
              path: '/patient/appointments',
              badge: '3',
              subItems: [
                { name: 'Book Appointment', path: '/patient/appointments/book', icon: '➕' },
                { name: 'My Appointments', path: '/patient/appointments/list', icon: '📋' },
                { name: 'Appointment History', path: '/patient/appointments/history', icon: '📜' }
              ]
            },
            {
              id: 'doctors',
              name: 'Find Doctors',
              icon: '👨‍⚕️',
              path: '/patient/doctors',
              badge: null
            },
            {
              id: 'prescriptions',
              name: 'Prescriptions',
              icon: '💊',
              path: '/patient/prescriptions',
              badge: null
            },
            {
              id: 'invoices',
              name: 'Invoices',
              icon: '💳',
              path: '/patient/invoices',
              badge: null
            },
            {
              id: 'health-records',
              name: 'Health Records',
              icon: '📋',
              path: '/patient/health-records',
              badge: null
            },
            {
              id: 'settings',
              name: 'Settings',
              icon: '⚙️',
              path: '/patient/settings',
              badge: null
            }
          ]
        };

      default:
        return { title: 'Menu', logo: 'M', color: 'gray', menuItems: [] };
    }
  };

  const config = getNavigationConfig();

  // Color configurations
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-600',
      hover: 'hover:bg-blue-100',
      badge: 'bg-blue-100 text-blue-800'
    },
    green: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      border: 'border-green-600',
      hover: 'hover:bg-green-100',
      badge: 'bg-green-100 text-green-800'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-purple-600',
      hover: 'hover:bg-purple-100',
      badge: 'bg-purple-100 text-purple-800'
    }
  };

  const colors = colorConfig[config.color];

  // Check if menu item is active
  const isActiveMenuItem = (path, subItems = []) => {
    if (location.pathname === path) return true;
    if (subItems.some(item => location.pathname === item.path)) return true;
    return location.pathname.startsWith(path + '/');
  };

  // Toggle submenu
  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Auto-expand active menus
  useEffect(() => {
    const activeMenu = config.menuItems.find(item => 
      isActiveMenuItem(item.path, item.subItems)
    );
    if (activeMenu && activeMenu.subItems) {
      setExpandedMenus(prev => ({
        ...prev,
        [activeMenu.id]: true
      }));
    }
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
        ${collapsed ? 'lg:w-16' : 'lg:w-64'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <span className={`${colors.text} font-bold text-lg`}>{config.logo}</span>
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold text-gray-800">{config.title}</span>
            )}
          </div>
          
          {/* Collapse Button (Desktop) */}
          <button
            onClick={onCollapse}
            className="hidden lg:flex p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className={`w-4 h-4 transform transition-transform ${collapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {config.menuItems.map((item) => (
              <div key={item.id}>
                {/* Main Menu Item */}
                <div className="relative">
                  {item.subItems ? (
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActiveMenuItem(item.path, item.subItems)
                          ? `${colors.bg} ${colors.text} border-r-2 ${colors.border}`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && <span className="font-medium">{item.name}</span>}
                      </div>
                      {!collapsed && (
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.badge === 'new' ? 'bg-blue-100 text-blue-800' : `${colors.badge}`
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <svg 
                            className={`w-4 h-4 transform transition-transform ${
                              expandedMenus[item.id] ? 'rotate-90' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActiveMenuItem(item.path)
                          ? `${colors.bg} ${colors.text} border-r-2 ${colors.border}`
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon}</span>
                        {!collapsed && <span className="font-medium">{item.name}</span>}
                      </div>
                      {!collapsed && item.badge && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.badge === 'new' ? 'bg-blue-100 text-blue-800' : `${colors.badge}`
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                {/* Submenu Items */}
                {item.subItems && expandedMenus[item.id] && !collapsed && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                          location.pathname === subItem.path
                            ? `${colors.bg} ${colors.text}`
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-base">{subItem.icon}</span>
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        {!collapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center`}>
                <span className={`${colors.text} font-semibold text-sm`}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{user.role}</p>
              </div>
              <button
                onClick={() => {
                  // Clear all stored data
                  localStorage.removeItem('hospitalUser');
                  localStorage.removeItem('hospitalToken');
                  localStorage.removeItem('token');
                  sessionStorage.removeItem('hospitalUser');
                  sessionStorage.removeItem('hospitalToken');
                  sessionStorage.removeItem('token');

                  alert('✅ Logged out successfully!');
                  window.location.href = '/auth/login';
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
