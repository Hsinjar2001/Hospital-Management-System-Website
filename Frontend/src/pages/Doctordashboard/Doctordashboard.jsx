// pages/Doctordashboard/DoctorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../Component/common/StatCard';
import { dashboardAPI, appointmentsAPI, patientsAPI } from '../../services/api';

const Doctordashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Get real doctor info from localStorage/sessionStorage
  const getDoctorInfo = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.firstName} ${userData.lastName}`,
          id: `DOC-${userData.id.toString().padStart(3, '0')}`,
          department: userData.department || 'General Medicine',
          specialty: userData.specialty || 'General Practice',
          avatar: userData.profileImage || null,
          status: 'available',
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        };
      }
    } catch (error) {
      console.error('Error getting doctor info:', error);
    }
    // Return null if no user found - require login
    return null;
  };

  const doctorInfo = getDoctorInfo();

  // Redirect to login if no user found
  useEffect(() => {
    if (!doctorInfo) {
      navigate('/auth/login');
    }
  }, [doctorInfo, navigate]);

  // Empty fallback data - prefer API data
  const emptyDashboardData = {
    stats: {
      totalPatients: 0,
      todayAppointments: 0,
      completedAppointments: 0,
      pendingPrescriptions: 0,
      avgRating: 0,
      totalReviews: 0
    },
    todaySchedule: [],
    recentPatients: [],
    upcomingTasks: []
  };

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      // Use empty data - no dummy data
      setDashboardData(emptyDashboardData);
      setLoading(false);
    };

    loadDashboardData();
  }, [selectedPeriod]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {doctorInfo.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {doctorInfo.department} • Today is {new Date().toLocaleDateString()} • {currentTime}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => navigate('/doctor/appointments/new')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Appointment
          </button>
          <button
            onClick={() => navigate('/doctor/prescriptions/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            New Prescription
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={dashboardData.stats?.totalPatients || 0}
          icon="👥"
          color="green"
          loading={loading}
          actionText="View All"
          actionLink="/doctor/patients"
        />
        <StatCard
          title="Today's Appointments"
          value={dashboardData.stats?.todayAppointments || 0}
          icon="📅"
          color="blue"
          loading={loading}
          actionText="View Schedule"
          actionLink="/doctor/appointments"
        />
        <StatCard
          title="Pending Prescriptions"
          value={dashboardData.stats?.pendingPrescriptions || 0}
          icon="💊"
          color="orange"
          loading={loading}
          actionText="Manage"
          actionLink="/doctor/prescriptions"
        />
        <StatCard
          title="Average Rating"
          value={`${dashboardData.stats?.avgRating || 0}/5`}
          icon="⭐"
          color="yellow"
          loading={loading}
          actionText="View Reviews"
          actionLink="/doctor/reviews"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <button 
              onClick={() => navigate('/doctor/schedule')}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              View Full Schedule
            </button>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.todaySchedule?.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {appointment.time}
                    </span>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{appointment.patientName}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.reason}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">{appointment.type}</span>
                      <span className="text-xs text-gray-500">{appointment.duration}</span>
                      <span className="text-xs text-gray-500">ID: {appointment.patientId}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <button 
                      onClick={() => navigate(`/doctor/patients/${appointment.patientId}`)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {dashboardData.todaySchedule?.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                  </svg>
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
              <button 
                onClick={() => navigate('/doctor/patients')}
                className="text-sm text-green-600 hover:text-green-800"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3">
              {dashboardData.recentPatients?.map((patient, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.condition}</p>
                    <p className="text-xs text-gray-400">{patient.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            
            <div className="space-y-3">
              {dashboardData.upcomingTasks?.map((task, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{task.task}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-500">Due: {task.due}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">This Week</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Appointments</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span>Prescriptions</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Rating</span>
                <span className="font-semibold">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctordashboard;
