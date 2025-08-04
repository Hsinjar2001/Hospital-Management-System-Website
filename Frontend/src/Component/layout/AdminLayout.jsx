import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userDataVersion, setUserDataVersion] = useState(0); // Force re-render when user data updates
  const location = useLocation();
  const navigate = useNavigate();

  // Get real admin user data from localStorage/sessionStorage
  const getAdminUser = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role,
          avatar: userData.profileImage || null,
          lastLogin: userData.lastLoginAt || new Date().toISOString(),
          permissions: userData.permissions || ['all'],
          firstName: userData.firstName,
          lastName: userData.lastName
        };
      }
    } catch (error) {
      console.error('Error getting admin user data:', error);
    }
    // Fallback to default admin data if no user found
    return {
      name: 'Administrator',
      email: 'admin@hospital.com',
      role: 'Administrator',
      avatar: null,
      lastLogin: new Date().toISOString(),
      permissions: ['all']
    };
  };

  // Get admin user data (re-computed when userDataVersion changes)
  const adminUser = useMemo(() => getAdminUser(), [userDataVersion]);

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

  // Load notifications from API (placeholder for future implementation)
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // TODO: Implement notifications API
        // For now, keep notifications empty until backend is ready
        setNotifications([]);
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    };

    loadNotifications();
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
      case 'application':
        navigate('/admin/doctors');
        break;
      case 'alert':
        navigate('/admin/reports');
        break;
      case 'system':
        navigate('/admin/settings');
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
    
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/patients')) return 'Patient Management';
    if (path.includes('/doctors')) return 'Doctor Management';
    if (path.includes('/appointments')) return 'Appointments';
    if (path.includes('/departments')) return 'Departments';
    if (path.includes('/roles')) return 'Roles & Permissions';
    if (path.includes('/reports')) return 'Reports';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/profile')) return 'Profile Settings';
    
    return 'Admin Panel';
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', path: '/admin/dashboard' }];

    pathSegments.forEach((segment, index) => {
      if (segment === 'admin') return;
      
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ name, path });
    });
    
    return breadcrumbs;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole="admin"
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Container */}
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
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Page Title */}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                
                {/* Breadcrumbs */}
                <nav className="hidden sm:block text-sm text-gray-500">
                  {getBreadcrumbs().map((crumb, index) => (
                    <span key={`${crumb.path}-${index}`} className="inline-block">
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
                    </span>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Side */}
            <div className="grid grid-cols-[auto_auto_auto_auto] items-center gap-4">
              
              {/* Quick Actions - Removed Add Patient and New Appointment buttons */}

              {/* Search Button (Mobile) */}
              <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 grid grid-cols-[1fr_auto] items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.priority === 'high' ? 'bg-red-500' :
                              notification.priority === 'medium' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/admin/notifications');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile */}
              <div className="grid grid-cols-[auto_auto] items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{adminUser.name}</p>
                  <p className="text-xs text-gray-500">{adminUser.role}</p>
                </div>
                
                <button
                  onClick={() => navigate('/admin/profile')}
                  className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 grid place-items-center">
                    <span className="text-white font-medium text-sm">
                      {adminUser.name.split(' ').map(n => n[0]).join('')}
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
                Help & Support
              </button>
              <span>|</span>
              <button className="hover:text-gray-900 transition-colors">
                Documentation
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <span>Version 2.1.0</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
