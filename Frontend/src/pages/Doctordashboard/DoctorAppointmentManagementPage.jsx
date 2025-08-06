import React, { useState, useEffect } from 'react';
import { appointmentsAPI } from '../../services/api';

const DoctorAppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [updating, setUpdating] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);

  const getDoctorInfo = () => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        return userData;
      }
    } catch (error) {
      console.error('Error getting doctor info:', error);
    }
    return null;
  };

  useEffect(() => {
    const docInfo = getDoctorInfo();
    setDoctorInfo(docInfo);
  }, []);

  useEffect(() => {
    if (doctorInfo) {
      loadAppointments(doctorInfo);
    }
  }, [doctorInfo, filter, selectedDate]);

  const loadAppointments = async (doctorInfo) => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      if (selectedDate) {
        params.date = selectedDate;
      }

      const response = await appointmentsAPI.getByDoctor(doctorInfo.id, params);
      if (response.status === 'success') {
        setAppointments(response.data.appointments || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      setUpdating(appointmentId);
      const response = await appointmentsAPI.update(appointmentId, { status });
      if (response.status === 'success') {
        const doctorInfo = getDoctorInfo();
        if (doctorInfo) {
          loadAppointments(doctorInfo);
        }
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment status');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!doctorInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to view appointments.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setFilter('all');
              setSelectedDate('');
            }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {appointments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No appointments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symptoms
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(appointment.appointment_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(appointment.appointment_time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">
                          {appointment.appointment_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {appointment.symptoms || 'No symptoms provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.status === 'scheduled' || appointment.status === 'confirmed' ? (
                            <>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                disabled={updating === appointment.id}
                                className="text-green-600 hover:text-green-900 disabled:opacity-50"
                              >
                                {updating === appointment.id ? 'Updating...' : 'Complete'}
                              </button>
                              <button
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                disabled={updating === appointment.id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {updating === appointment.id ? 'Updating...' : 'Cancel'}
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-400">No actions available</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentManagementPage;