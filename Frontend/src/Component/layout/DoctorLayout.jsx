import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

const DoctorLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  // Sample doctor user data (replace with actual user context)
  const doctorUser = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'Cardiologist',
    department: 'Cardiology',
    employeeId: 'DOC-001',
    avatar: null,
    lastLogin: '2024-01-15T08:30:00Z',
    licenseNumber: 'MD123456',
    yearsOfExperience: 12,
    currentShift: '08:00 - 16:00',
    status: 'available' // available, busy, in-surgery, off-duty
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('hospitalUser');
    sessionStorage.removeItem('hospitalUser');
    alert('✅ Logged out successfully!');
    window.location.href = '/auth/login';
  };

  // Sample doctor notifications
  const sampleNotifications = [
    {
      id: 1,
      title: 'Urgent: Patient Consultation',
      message: 'Room 205 - Patient requires immediate attention',
      time: '2 minutes ago',
      type: 'urgent',
      read: false,
      priority: 'high',
      patientId: 'PAT-001',
      room: '205'
    },
    {
      id: 2,
      title: 'Lab Results Available',
      message: 'Blood work results for John Doe are ready',
      time: '15 minutes ago',
      type: 'lab-result',
      read: false,
      priority: 'medium',
      patientId: 'PAT-002'
    },
    {
      id: 3,
      title: 'Appointment Reminder',
      message: 'Next appointment in 30 minutes - Room 301',
      time: '30 minutes ago',
      type: 'appointment',
      read: true,
      priority: 'medium',
      patientId: 'PAT-003',
      room: '301'
    },
    {
      id: 4,
      title: 'Surgery Schedule Update',
      message: 'Tomorrow\'s surgery moved to 10:00 AM',
      time: '1 hour ago',
      type: 'schedule',
      read: true,
      priority: 'high'
    },
    {
      id: 5,
      title: 'Prescription Alert',
      message: 'Drug interaction alert for patient in Room 150',
      time: '2 hours ago',
      type: 'prescription',
      read: false,
      priority: 'high',
      patientId: 'PAT-004',
      room: '150'
    }
  ];

  // Today's statistics
  const todayStats = {
    appointmentsToday: 8,
    appointmentsCompleted: 5,
    patientsWaiting: 3,
    emergencyCalls: 1,
    surgeries: 2,
    consultations: 6
  };

  // Initialize notifications and time
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
      case 'schedule':
        navigate('/doctor/schedule');
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
    if (path.includes('/schedule')) return 'My Schedule';
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
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
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
              
              {/* Today's Stats (Desktop) */}
              <div className="hidden xl:flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Today: {todayStats.appointmentsCompleted}/{todayStats.appointmentsToday}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Waiting: {todayStats.patientsWaiting}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => navigate('/doctor/appointments')}
                  className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                >
                  View Appointments
                </button>
                <button
                  onClick={() => navigate('/doctor/prescriptions')}
                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Write Prescription
                </button>
              </div>

              {/* Emergency Button */}
              <button
                onClick={() => navigate('/doctor/emergency')}
                className="p-2 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                title="Emergency"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5v10z" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${
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

              {/* Doctor Profile with Logout Button */}
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {/* Status Bar */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6 text-gray-600">
                <span className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(doctorUser.status)}`}></div>
                  Status: {getStatusText(doctorUser.status)}
                </span>
                <span>|</span>
                <span>Shift: {doctorUser.currentShift}</span>
                <span>|</span>
                <span>Department: {doctorUser.department}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-gray-600">
                <span>Current Time: {currentTime.toLocaleTimeString()}</span>
                <span>|</span>
                <span>License: {doctorUser.licenseNumber}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar (Mobile) */}
          <div className="xl:hidden bg-green-50 border-b border-green-200 px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-around text-sm">
              <div className="text-center">
                <span className="block font-semibold text-green-900">{todayStats.appointmentsCompleted}</span>
                <span className="text-green-700">Completed</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold text-orange-900">{todayStats.patientsWaiting}</span>
                <span className="text-orange-700">Waiting</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold text-blue-900">{todayStats.appointmentsToday}</span>
                <span className="text-blue-700">Total Today</span>
              </div>
              <div className="text-center">
                <span className="block font-semibold text-purple-900">{todayStats.surgeries}</span>
                <span className="text-purple-700">Surgeries</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
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
              <span>|</span>
              <button className="hover:text-gray-900 transition-colors">
                Emergency Protocols
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
