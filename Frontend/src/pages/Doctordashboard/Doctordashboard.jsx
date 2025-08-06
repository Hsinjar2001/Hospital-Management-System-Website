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
          name: `${userData.first_name} ${userData.last_name}`,
          id: `DOC-${userData.id.toString().padStart(3, '0')}`,
          department: userData.department || 'General Medicine',
          specialty: userData.specialty || 'General Practice',
          avatar: userData.profile_image || null,
          status: 'available',
          firstName: userData.first_name,
          lastName: userData.last_name,
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
    if (!status) return 'bg-gray-100 text-gray-800';
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
      <div className="grid grid-cols-1 gap-4">

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
