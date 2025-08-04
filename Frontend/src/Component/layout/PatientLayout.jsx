import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [userDataVersion, setUserDataVersion] = useState(0); // Force re-render when user data changes
  const location = useLocation();
  const navigate = useNavigate();

  // Get real patient user data from localStorage/sessionStorage
  const getPatientUser = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: 'Patient',
          patientId: `PAT-${userData.id.toString().padStart(4, '0')}`,
          age: userData.age || 'Not specified',
          bloodGroup: userData.bloodGroup || 'Not specified',
          avatar: userData.profileImage || null,
          lastLogin: userData.lastLoginAt || new Date().toISOString(),
          memberSince: userData.createdAt || '2024-01-01',
          insuranceProvider: userData.insuranceProvider || 'Not specified',
          primaryDoctor: userData.primaryDoctor || 'Not assigned',
          emergencyContact: userData.emergencyContact || 'Not provided',
          nextAppointment: userData.nextAppointment || null,
          healthStatus: userData.healthStatus || 'good',
          firstName: userData.firstName,
          lastName: userData.lastName
        };
      }
    } catch (error) {
      console.error('Error getting patient user data:', error);
    }
    // Fallback to sample data if no user found
    return {
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'Patient',
      patientId: 'PAT-2024-001',
      age: 34,
      bloodGroup: 'O+',
      avatar: null,
      lastLogin: '2024-01-15T09:30:00Z',
      memberSince: '2020-03-15',
      insuranceProvider: 'Blue Cross Blue Shield',
      primaryDoctor: 'Dr. Sarah Johnson',
      emergencyContact: 'Jane Doe (Wife)',
      nextAppointment: '2024-01-20T14:00:00Z',
      healthStatus: 'good'
    };
  };

  const patientUser = useMemo(() => getPatientUser(), [userDataVersion]);

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

  // Sample patient notifications
  const sampleNotifications = [
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Johnson is tomorrow at 2:00 PM',
      time: '1 hour ago',
      type: 'appointment',
      read: false,
      priority: 'high',
      appointmentId: 'APT-001'
    },
    {
      id: 2,
      title: 'Lab Results Available',
      message: 'Your blood test results are now available to view',
      time: '3 hours ago',
      type: 'lab-result',
      read: false,
      priority: 'medium',
      resultId: 'LAB-001'
    },
    {
      id: 3,
      title: 'Prescription Ready',
      message: 'Your prescription is ready for pickup at the pharmacy',
      time: '5 hours ago',
      type: 'prescription',
      read: true,
      priority: 'medium',
      prescriptionId: 'RX-001'
    },
    {
      id: 4,
      title: 'Health Checkup Due',
      message: 'It\'s time for your annual health checkup',
      time: '1 day ago',
      type: 'health-reminder',
      read: false,
      priority: 'medium'
    },
    {
      id: 5,
      title: 'Insurance Update',
      message: 'Your insurance plan has been updated successfully',
      time: '2 days ago',
      type: 'insurance',
      read: true,
      priority: 'low'
    }
  ];



  // Patient's health stats
  const healthStats = {
    upcomingAppointments: 2,
    activePrescritions: 3,
    completedAppointments: 12,
    healthScore: 85,
    lastCheckup: '2024-01-10',
    pendingBills: 1
  };

  // Initialize notifications and reminders
  useEffect(() => {
    setNotifications(sampleNotifications);

    
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
      case 'appointment':
        navigate('/patient/appointments');
        break;
      case 'lab-result':
        navigate('/patient/health-records');
        break;
      case 'prescription':
        navigate('/patient/prescriptions');
        break;
      case 'health-reminder':
        navigate('/patient/health-records');
        break;
      case 'insurance':
        navigate('/patient/settings');
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
    
    if (path.includes('/dashboard')) return 'My Health Dashboard';
    if (path.includes('/appointments')) return 'My Appointments';
    if (path.includes('/doctors')) return 'Find Doctors';
    if (path.includes('/prescriptions')) return 'My Prescriptions';
    if (path.includes('/invoices')) return 'My Bills & Invoices';
    if (path.includes('/health-records')) return 'My Health Records';
    if (path.includes('/settings')) return 'Account Settings';
    if (path.includes('/profile')) return 'My Profile';
    
    return 'Patient Portal';
  };

  // Get breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', path: '/patient/dashboard' }];
    
    pathSegments.forEach((segment, index) => {
      if (segment === 'patient') return;
      
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({ name, path });
    });
    
    return breadcrumbs;
  };

  // Get health status color
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get health status text
  const getHealthStatusText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'fair': return 'Fair';
      case 'poor': return 'Poor';
      default: return 'Unknown';
    }
  };

  // Get next appointment info
  const getNextAppointmentInfo = () => {
    if (!patientUser.nextAppointment) return null;
    
    const appointmentDate = new Date(patientUser.nextAppointment);
    const now = new Date();
    const timeDiff = appointmentDate - now;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff > 1 && daysDiff <= 7) return `In ${daysDiff} days`;
    
    return appointmentDate.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userRole="patient"
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
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
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
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-purple-600 hover:text-purple-800"
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
                            !notification.read ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'appointment' ? 'bg-purple-500' :
                              notification.type === 'lab-result' ? 'bg-blue-500' :
                              notification.type === 'prescription' ? 'bg-green-500' :
                              notification.type === 'health-reminder' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {notification.priority}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate('/patient/notifications');
                        }}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Patient Profile */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">{patientUser.name}</p>
                    <div className={`w-2 h-2 rounded-full ${getHealthStatusColor(patientUser.healthStatus)}`}></div>
                  </div>
                  <p className="text-xs text-gray-500">ID: {patientUser.patientId}</p>
                </div>
                
                <button
                  onClick={() => navigate('/patient/profile')}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {patientUser.name.split(' ').map(n => n[0]).join('')}
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
                Patient Rights
              </button>
              <span>|</span>
              <button className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </button>
              <span>|</span>
              <button className="hover:text-gray-900 transition-colors">
                Help Center
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span>Insurance: {patientUser.insuranceProvider}</span>
              <span>|</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Portal Online
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PatientLayout;
