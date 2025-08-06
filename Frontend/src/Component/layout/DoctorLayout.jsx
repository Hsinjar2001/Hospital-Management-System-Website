import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const DoctorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDataVersion, setUserDataVersion] = useState(0); // Force re-render when user data updates
  const location = useLocation();
  const navigate = useNavigate();

  // Get real doctor user data from localStorage/sessionStorage
  const getDoctorUser = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.first_name} ${userData.last_name}`,
          email: userData.email,
          role: userData.specialty || 'General Practitioner',
          department: userData.department || 'General Medicine',
          employeeId: `DOC-${userData.id.toString().padStart(3, '0')}`,
          avatar: userData.profile_image || null,
          lastLogin: userData.lastLoginAt || new Date().toISOString(),
          licenseNumber: userData.licenseNumber || 'Not specified',
          yearsOfExperience: userData.yearsOfExperience || 'Not specified',
          currentShift: userData.currentShift || '09:00 - 17:00',
          status: userData.status || 'available',
          firstName: userData.first_name,
          lastName: userData.last_name
        };
      }
    } catch (error) {
      console.error('Error getting doctor user data:', error);
    }
    // Return null if no user found - require login
    return null;
  };

  // Get doctor user data (re-computed when userDataVersion changes)
  const doctorUser = React.useMemo(() => getDoctorUser(), [userDataVersion]);

  // Redirect to login if no user found
  useEffect(() => {
    if (!doctorUser) {
      navigate('/auth/login');
    }
  }, [doctorUser, navigate]);

  // Logout function
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('hospitalUser');
    localStorage.removeItem('hospitalToken');
    localStorage.removeItem('token');
    sessionStorage.removeItem('hospitalUser');
    sessionStorage.removeItem('hospitalToken');
    sessionStorage.removeItem('token');

    alert('✅ Logged out successfully!');
    window.location.href = '/auth/login';
  };





  // Initialize time
  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
    setShowNotifications(false);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'urgent':
      case 'appointment':
        navigate('/doctor/appointments');
        break;
      case 'lab-result':
        navigate('/doctor/patients');
        break;
      case 'prescription':
        navigate('/doctor/prescriptions');
        break;

      default:
        break;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/dashboard')) return 'Doctor Dashboard';
    if (path.includes('/appointments')) return 'My Appointments';
    if (path.includes('/patients')) return 'My Patients';

    if (path.includes('/prescriptions')) return 'Prescriptions';
    if (path.includes('/reviews')) return 'Patient Reviews';
    if (path.includes('/profile')) return 'My Profile';
    
    return 'Doctor Portal';
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Dashboard', path: '/doctor/dashboard' }];
    
    pathSegments.forEach((segment, index) => {
      if (segment === 'doctor') return;
      
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ name, path });
    });
    
    return breadcrumbs;
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-500';
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'in-surgery': return 'bg-red-500';
      case 'off-duty': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'in-surgery': return 'In Surgery';
      case 'off-duty': return 'Off Duty';
      default: return 'Unknown';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => !n.read && n.priority === 'high').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole="doctor"
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col layout-transition sidebar-content-gap ${
        sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'
      }`}>
        
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                
                {/* Breadcrumbs */}
                <nav className="hidden sm:flex space-x-2 text-sm text-gray-500">
                  {getBreadcrumbs().map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                      {index > 0 && <span className="mx-2">/</span>}
                      <button
                        onClick={() => navigate(crumb.path)}
                        className={`hover:text-gray-700 transition-colors ${
                          index === getBreadcrumbs().length - 1 
                            ? 'text-gray-900 font-medium' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              






              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium ${
                      urgentCount > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                    }`}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-green-600 hover:text-green-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 6).map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                            !notification.read ? 'bg-green-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'urgent' ? 'bg-red-500 animate-pulse' :
                              notification.priority === 'high' ? 'bg-red-500' :
                              notification.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                {notification.room && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    Room {notification.room}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/doctor/notifications');
                        }}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Doctor Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{doctorUser.name}</p>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(doctorUser.status)}`}></div>
                  </div>
                  <p className="text-xs text-gray-500">{doctorUser.role}</p>
                </div>
                
                <button
                  onClick={() => navigate('/doctor/profile')}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {doctorUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </button>


              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="layout-main">





          {/* Page Content */}
          <div className="content-padding">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>© 2025 Hospital Management System</span>
              <span>|</span>
              <button className="hover:text-gray-900 transition-colors">
                Medical Guidelines
              </button>

            </div>
            
            <div className="flex items-center space-x-4">
              <span>Experience: {doctorUser.yearsOfExperience} years</span>
              <span>|</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Hospital Systems Online
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DoctorLayout;
