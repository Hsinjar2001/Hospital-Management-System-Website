// pages/Patientdashboard/PatientDashboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, appointmentsAPI, prescriptionsAPI, invoicesAPI } from '../../services/api';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  // Get real patient info from localStorage/sessionStorage
  const getPatientInfo = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return {
          name: `${userData.firstName} ${userData.lastName}`,
          id: `PAT-${userData.id.toString().padStart(4, '0')}`,
          email: userData.email,
          phone: userData.phone || 'Not provided',
          bloodGroup: userData.bloodGroup || 'Not specified',
          age: userData.age || 'Not specified',
          avatar: userData.profileImage || null,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        };
      }
    } catch (error) {
      console.error('Error getting patient info:', error);
    }
    // Return null if no user found - require login
    return null;
  };

  const patientInfo = getPatientInfo();

  // Empty fallback data - prefer API data
  const emptyDashboardData = useMemo(() => ({
    stats: {
      upcomingAppointments: 0,
      completedAppointments: 0,
      pendingPrescriptions: 0,
      outstandingBills: 0
    },
    upcomingAppointments: [],
    recentPrescriptions: [],
    healthMetrics: {
      lastCheckup: 'No data',
      bloodPressure: 'Not recorded',
      weight: 'Not recorded',
      height: 'Not recorded',
      bmi: 'Not calculated'
    },
    recentActivity: []
  }), []);

  // Redirect to login if no user found
  useEffect(() => {
    if (!patientInfo) {
      navigate('/auth/login');
    }
  }, [patientInfo, navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!patientInfo) return;

      setLoading(true);

      try {
        // Fetch real data from API
        const response = await dashboardAPI.getPatientStats();
        setDashboardData(response.data || emptyDashboardData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty data on error
        setDashboardData(emptyDashboardData);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [patientInfo, emptyDashboardData]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'appointment':
        return '📅';
      case 'prescription':
        return '💊';
      case 'payment':
        return '💳';
      default:
        return '📋';
    }
  };

  return (
    <div className="space-y-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {patientInfo.name}!</h1>
            <p className="text-blue-100 mt-1">
              Patient ID: {patientInfo.id} • {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              {patientInfo.avatar ? (
                <img src={patientInfo.avatar} alt={patientInfo.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-lg font-bold">
                  {patientInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-xl font-bold text-gray-900">{dashboardData.stats?.upcomingAppointments || 0}</p>
              <p className="text-xs text-gray-500">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-900">{dashboardData.stats?.completedAppointments || 0}</p>
              <p className="text-xs text-gray-500">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-xl font-bold text-gray-900">{dashboardData.stats?.pendingPrescriptions || 0}</p>
              <p className="text-xs text-gray-500">Prescriptions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-xl font-bold text-gray-900">${dashboardData.stats?.outstandingBills || 0}</p>
              <p className="text-xs text-gray-500">Bills</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            <button 
              onClick={() => navigate('/patient/appointments')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData.upcomingAppointments?.map((appointment, index) => (
              <div key={`upcoming-appointment-${index}-${appointment.id || 'no-id'}`} className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                  <p className="text-sm text-gray-600">{appointment.department} • {appointment.type}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-blue-600 font-medium">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </span>
                    <span className="text-xs text-gray-500">{appointment.location}</span>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-800">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}

            {dashboardData.upcomingAppointments?.length === 0 && (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                </svg>
                <p className="text-gray-500 mb-2">No upcoming appointments</p>
                <button 
                  onClick={() => navigate('/patient/appointments/book')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Book an appointment
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Health Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Blood Pressure</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.healthMetrics?.bloodPressure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Weight</span>
                <span className="text-sm font-medium text-gray-900">{dashboardData.healthMetrics?.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">BMI</span>
                <span className="text-sm font-medium text-green-600">{dashboardData.healthMetrics?.bmi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Last Checkup</span>
                <span className="text-sm font-medium text-gray-900">
                  {dashboardData.healthMetrics?.lastCheckup ? new Date(dashboardData.healthMetrics.lastCheckup).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h3>
              <button 
                onClick={() => navigate('/patient/prescriptions')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {dashboardData.recentPrescriptions?.map((prescription, index) => (
                <div key={`recent-prescription-${index}-${prescription.id || 'no-id'}`} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 text-sm">{prescription.medicationName}</h4>
                  <p className="text-xs text-gray-600">Prescribed by {prescription.prescribedBy}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{new Date(prescription.date).toLocaleDateString()}</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      {prescription.refillsLeft} refills left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/patient/appointments/book')}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Book Appointment
              </button>
              <button 
                onClick={() => navigate('/patient/invoices')}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                View Bills
              </button>
              <button 
                onClick={() => navigate('/patient/prescriptions')}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                My Prescriptions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {dashboardData.recentActivity?.map((activity, index) => (
            <div key={`recent-activity-${index}-${activity.id || 'no-id'}`} className="flex items-center space-x-3">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
