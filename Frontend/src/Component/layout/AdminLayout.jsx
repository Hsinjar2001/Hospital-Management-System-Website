import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Sample admin user data (replace with actual user context)
  const adminUser = {
    name: 'John Anderson',
    email: 'john.anderson@hospital.com',
    role: 'Administrator',
    avatar: null,
    lastLogin: '2024-01-15T10:30:00Z',
    permissions: ['all']
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('hospitalUser');
    sessionStorage.removeItem('hospitalUser');
    alert('✅ Logged out successfully!');
    window.location.href = '/auth/login';
  };

  // Sample notifications
  const sampleNotifications = [
    {
      id: 1,
      title: 'New Doctor Application',
      message: 'Dr. Sarah Wilson has submitted an application',
      time: '5 minutes ago',
      type: 'application',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight at 2:00 AM',
      time: '1 hour ago',
      type: 'system',
      read: false,
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Department Budget Alert',
      message: 'Cardiology department exceeded monthly budget',
      time: '2 hours ago',
      type: 'alert',
      read: true,
      priority: 'high'
    },
    {
      id: 4,
      title: 'Staff Meeting Reminder',
      message: 'Weekly admin meeting scheduled for tomorrow',
      time: '3 hours ago',
      type: 'reminder',
      read: true,
      priority: 'low'
    }
  ];

  // Initialize notifications
  useEffect(() => {
    setNotifications(sampleNotifications);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
    <div className="min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[auto_1fr]">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole="admin"
        collapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Container */}
      <div className="grid grid-rows-[auto_auto_1fr_auto] min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 grid grid-cols-[1fr_auto] items-center gap-4">
            
            {/* Left Side */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-4">
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
                    <span key={crumb.path} className="inline-block">
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
              
              {/* Quick Actions */}
              <div className="hidden md:grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/admin/patients/add')}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap"
                >
                  + Add Patient
                </button>
                <button
                  onClick={() => navigate('/admin/appointments/add')}
                  className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors whitespace-nowrap"
                >
                  + New Appointment
                </button>
              </div>

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
                  className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v10z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 grid place-items-center">
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

              {/* Admin Profile with Logout Button */}
              <div className="grid grid-cols-[auto_auto_auto] items-center gap-3">
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

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Status Bar */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2">
          <div className="grid grid-cols-[1fr_auto] items-center text-sm">
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-4 text-gray-600">
              <span className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                System Status: Online
              </span>
              <span>|</span>
              <span>Last Login: {new Date(adminUser.lastLogin).toLocaleDateString()}</span>
            </div>
            
            <div className="text-gray-600">
              <span>Server Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="overflow-auto">
          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-[1fr_auto] items-center text-sm text-gray-600">
            <div className="grid grid-cols-[auto_auto_auto_auto_auto] items-center gap-4">
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
            
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-4">
              <span>Version 2.1.0</span>
              <span>|</span>
              <span className="grid grid-cols-[auto_1fr] items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                All Systems Operational
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
