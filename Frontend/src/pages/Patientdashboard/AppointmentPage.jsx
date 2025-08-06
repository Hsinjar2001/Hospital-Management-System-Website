// pages/Patientdashboard/AppointmentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { doctorsAPI, appointmentsAPI } from '../../services/api';

const AppointmentPage = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookModal, setShowBookModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const selectedDoctorId = watch('doctorId');

  // Appointments will be loaded from API

  // Doctors will be loaded from API

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get current user data
        const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
        
        // Fetch real appointments and doctors from API
        const doctorsResponse = await doctorsAPI.getAll();
        
        // Fetch patient appointments if user is logged in
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
             const patientId = userData.patientId || userData.id;
             const appointmentsResponse = await appointmentsAPI.getAll({ patientId: patientId });
            
            if (appointmentsResponse.status === 'success' && appointmentsResponse.data.appointments) {
              const formattedAppointments = appointmentsResponse.data.appointments.map(apt => ({
                id: apt.appointment_id,
                doctorName: apt.doctor?.firstName && apt.doctor?.lastName ? `${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Unknown Doctor',
                specialty: apt.doctor?.specialty || 'Unknown Specialty',
                date: apt.appointment_date,
                time: apt.appointment_time,
                status: apt.status,
                type: apt.appointment_type,
                reason: apt.symptoms || apt.notes || 'No reason provided',
                fee: apt.consultation_fee || 'N/A'
              }));
              setAppointments(formattedAppointments);
              setFilteredAppointments(formattedAppointments);
            } else {
              setAppointments([]);
              setFilteredAppointments([]);
            }
          } catch (appointmentError) {
            console.error('Error fetching appointments:', appointmentError);
            setAppointments([]);
            setFilteredAppointments([]);
          }
        } else {
          setAppointments([]);
          setFilteredAppointments([]);
        }
        
        // Set doctors from API response
        if (doctorsResponse.status === 'success' && doctorsResponse.data && doctorsResponse.data.doctors) {
          setDoctors(doctorsResponse.data.doctors);
        } else {
          setDoctors([]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Set empty arrays on error
        setAppointments([]);
        setFilteredAppointments([]);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  }, [appointments, statusFilter]);

  useEffect(() => {
    if (selectedDoctorId) {
      const doctor = doctors.find(d => d.id === selectedDoctorId);
      setSelectedDoctor(doctor);
      // Generate available slots for the selected doctor
      generateAvailableSlots();
    }
  }, [selectedDoctorId, doctors]);

  const generateAvailableSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of ['00', '30']) {
        const time = `${hour.toString().padStart(2, '0')}:${minute}`;
        const displayTime = new Date(`2000-01-01 ${time}`).toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        slots.push({ value: time, label: displayTime });
      }
    }
    
    setAvailableSlots(slots);
  };

  const onSubmit = async (data) => {
    try {
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (!storedUser) {
        alert('❌ Please log in to book an appointment.');
        return;
      }

      const userData = JSON.parse(storedUser);
      
      const selectedDoctorFromForm = data.doctorId;
      const doctorFromList = doctors.find(d => d.id == selectedDoctorFromForm);
      
      // Get patient ID from user data (assuming it's stored in userData.patientId)
      const patientId = userData.patientId || userData.id;
      
      const appointmentData = {
        patientId: patientId,
        doctorId: selectedDoctorFromForm,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        appointmentType: data.appointmentType || 'consultation',
        patientType: 'existing',
        priority: 'normal',
        symptoms: data.reason || '',
        notes: data.notes || '',
        duration: 30,
        consultationFee: doctorFromList?.consultationFee || 0
      };
      
      const response = await appointmentsAPI.create(appointmentData);
      
      if (response.status === 'success') {
         setShowBookModal(false);
         reset();
         alert('✅ Appointment booked successfully!');
         
         // Reload appointments from API to get updated data
         const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
         if (storedUser) {
           try {
             const userData = JSON.parse(storedUser);
             const patientId = userData.patientId || userData.id;
             const appointmentsResponse = await appointmentsAPI.getAll({ patientId: patientId });
             
             if (appointmentsResponse.status === 'success' && appointmentsResponse.data.appointments) {
               const formattedAppointments = appointmentsResponse.data.appointments.map(apt => ({
                 id: apt.appointment_id,
                 doctorName: apt.doctor?.user ? `${apt.doctor.user.firstName} ${apt.doctor.user.lastName}` : 'Unknown Doctor',
                 department: apt.doctor?.specialty || apt.department?.name || 'Unknown Department',
                 date: apt.appointment_date,
                 time: apt.appointment_time,
                 status: apt.status,
                 type: apt.appointment_type,
                 reason: apt.symptoms || apt.notes || 'No reason provided',
                 fee: apt.consultation_fee || 'N/A'
               }));
               setAppointments(formattedAppointments);
               setFilteredAppointments(formattedAppointments);
             }
           } catch (reloadError) {
             console.error('Error reloading appointments:', reloadError);
           }
         }
       } else {
        throw new Error(response.error || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('❌ Failed to book appointment. Please try again.');
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      ));
      alert('✅ Appointment cancelled successfully!');
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your medical appointments and consultations
          </p>
        </div>
        <button
          onClick={() => setShowBookModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Book Appointment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'cancelled').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor & Specialty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.doctorName}</div>
                        <div className="text-sm text-gray-500">{appointment.specialty}</div>
                        {appointment.location && (
                          <div className="text-xs text-gray-400">{appointment.location}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{appointment.type}</div>
                      <div className="text-sm text-gray-500">{appointment.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.fee && appointment.fee !== 'N/A' ? `$${appointment.fee}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          View
                        </button>
                        {appointment.status === 'scheduled' && (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Book New Appointment</h3>
                <button
                  onClick={() => {
                    setShowBookModal(false);
                    reset();
                    setSelectedDoctor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('doctorId', { required: 'Doctor selection is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(doctor => (
                       <option key={doctor.id} value={doctor.id}>
                         {doctor.firstName && doctor.lastName ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'}{doctor.specialty ? ` - ${doctor.specialty}` : ''}
                       </option>
                     ))}
                  </select>
                  {errors.doctorId && (
                    <p className="text-red-500 text-sm mt-1">{errors.doctorId.message}</p>
                  )}
                </div>

                {selectedDoctorId && (
                  (() => {
                    const currentDoctor = doctors.find(d => d.id == selectedDoctorId);
                    return currentDoctor ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{currentDoctor.firstName && currentDoctor.lastName ? `${currentDoctor.firstName} ${currentDoctor.lastName}` : 'Unknown Doctor'}</h4>
                            <p className="text-sm text-gray-600">{currentDoctor.specialty || 'Doctor'}</p>
                            <p className="text-sm text-gray-600">{currentDoctor.email || 'No email'}</p>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('appointmentDate', { required: 'Date is required' })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.appointmentDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Time <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('appointmentTime', { required: 'Time is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time...</option>
                      {availableSlots.map(slot => (
                        <option key={slot.value} value={slot.value}>{slot.label}</option>
                      ))}
                    </select>
                    {errors.appointmentTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentTime.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Appointment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('appointmentType', { required: 'Type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type...</option>
                    <option value="consultation">Consultation</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="emergency">Emergency</option>
                    <option value="routine">Routine</option>
                    <option value="surgery">Surgery</option>
                    <option value="procedure">Procedure</option>
                  </select>
                  {errors.appointmentType && (
                    <p className="text-red-500 text-sm mt-1">{errors.appointmentType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('reason', { required: 'Reason is required' })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe your symptoms or reason for the appointment..."
                  />
                  {errors.reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookModal(false);
                      reset();
                      setSelectedDoctor(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Book Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
