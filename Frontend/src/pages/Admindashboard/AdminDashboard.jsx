import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import StatCard from '../../Component/common/StatCard';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Month');
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Dashboard statistics
  const stats = [
    {
      title: 'Total Patients',
      value: '4,178',
      change: 12,
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'bg-blue-100'
    },
    {
      title: 'Doctors',
      value: '247',
      change: 8,
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'bg-green-100'
    },
    {
      title: 'Appointments',
      value: '12,178',
      change: 15,
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-100'
    },
    {
      title: 'Revenue',
      value: '$55,1240',
      change: 22,
      icon: (
        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'bg-orange-100'
    }
  ];

  // Recent appointments data
  const recentAppointments = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Jane Smith', doctor: 'Dr. Johnson', time: '11:30 AM', status: 'Pending' },
    { id: 3, patient: 'Mike Johnson', doctor: 'Dr. Brown', time: '2:00 PM', status: 'Completed' },
    { id: 4, patient: 'Sarah Wilson', doctor: 'Dr. Davis', time: '3:30 PM', status: 'Cancelled' }
  ];

  // Top doctors data
  const topDoctors = [
    { name: 'Dr. Michael Smith', specialty: 'Cardiology', patients: 45, rating: 4.9 },
    { name: 'Dr. Sarah Johnson', specialty: 'Neurology', patients: 38, rating: 4.8 },
    { name: 'Dr. David Brown', specialty: 'Orthopedics', patients: 42, rating: 4.7 },
    { name: 'Dr. Emily Davis', specialty: 'Pediatrics', patients: 35, rating: 4.9 }
  ];

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, Administrator</p>
        </div>
        
        <div className="grid grid-cols-[auto_auto] gap-4 items-center">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Dashboard Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Overview</h2>
          <div className="w-full h-64 bg-gray-100 rounded-lg grid place-items-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-500">Dashboard Analytics Chart</p>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
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
            ))}
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
            {topDoctors.map((doctor, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full grid place-items-center">
                  <span className="text-blue-600 font-semibold">{doctor.name.charAt(3)}</span>
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
            ))}
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