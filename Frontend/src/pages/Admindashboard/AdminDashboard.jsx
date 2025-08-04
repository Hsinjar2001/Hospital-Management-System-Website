import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import StatCard from '../../Component/common/StatCard';
import { dashboardAPI, patientsAPI, doctorsAPI, appointmentsAPI } from '../../services/api';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      try {
        // Fetch real data from API
        const response = await dashboardAPI.getAdminDashboard();
        setDashboardData({
          stats: response.data || {},
          recentAppointments: response.data?.recentAppointments || []
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Set empty data on error
        setDashboardData({
          stats: {
            totalPatients: 0,
            totalDoctors: 0,
            totalAppointments: 0,
            totalDepartments: 0,
            totalRevenue: 0,
            patientsChange: 0,
            doctorsChange: 0,
            appointmentsChange: 0,
            monthlyAppointments: 0,
            monthlyPatients: 0
          },
          recentAppointments: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [selectedPeriod]);

  // Dashboard statistics - using only real API data
  const stats = [
    {
      title: 'Total Patients',
      value: loading ? '...' : (dashboardData.stats?.totalPatients?.toLocaleString() || '0'),
      change: dashboardData.stats?.patientsChange || 0,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      title: 'Total Doctors',
      value: loading ? '...' : (dashboardData.stats?.totalDoctors?.toLocaleString() || '0'),
      change: dashboardData.stats?.doctorsChange || 0,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      title: 'Total Appointments',
      value: loading ? '...' : (dashboardData.stats?.totalAppointments?.toLocaleString() || '0'),
      change: dashboardData.stats?.appointmentsChange || 0,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-100'
    },
    {
      title: 'Total Revenue',
      value: loading ? '...' : (dashboardData.stats?.totalRevenue ? `$${dashboardData.stats.totalRevenue.toLocaleString()}` : '$0'),
      change: dashboardData.stats?.revenueChange || 0,
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-orange-100'
    }
  ];

  // Recent appointments data - using only real API data
  const recentAppointments = dashboardData.recentAppointments || [];

  // Top doctors data - using only real API data
  const topDoctors = dashboardData.topDoctors || [];

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Administrator</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Active Users</span>
              </div>
              <span className="text-sm font-bold text-blue-600">{(dashboardData.stats?.totalPatients || 0) + (dashboardData.stats?.totalDoctors || 0)}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Departments</span>
              </div>
              <span className="text-sm font-bold text-green-600">{dashboardData.stats?.totalDepartments || 0}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                  </svg>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">Total Appointments</span>
              </div>
              <span className="text-sm font-bold text-purple-600">{dashboardData.stats?.totalAppointments || 0}</span>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading appointments...</p>
              </div>
            ) : recentAppointments.length > 0 ? (
              recentAppointments.map((appointment) => (
                <div key={appointment.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    appointment.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No recent appointments found</p>
                <p className="text-sm text-gray-400 mt-1">Appointments will appear here once scheduled</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Doctors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Performing Doctors</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading doctors...</p>
              </div>
            ) : topDoctors.length > 0 ? (
              topDoctors.map((doctor, index) => (
                <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full grid place-items-center">
                    <span className="text-blue-600 font-semibold">{doctor.name?.charAt(0) || 'D'}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{doctor.patients} patients</p>
                    <div className="grid grid-cols-[auto_auto] items-center gap-1 justify-end">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-gray-500">No doctors found</p>
                <p className="text-sm text-gray-400 mt-1">Doctor performance data will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Search
              </label>
              <input
                {...register('search', { required: 'Search term is required' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search patients, doctors, appointments..."
              />
              {errors.search && (
                <p className="text-red-500 text-sm mt-1">{errors.search.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-green-600 font-medium text-sm">Add Doctor</span>
              </button>
              
              <button
                type="button"
                className="grid grid-cols-[auto_1fr] items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-blue-600 font-medium text-sm">Schedule</span>
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;