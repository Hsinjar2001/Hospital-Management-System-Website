// Component/forms/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const AppointmentForm = ({ 
  onSubmit, 
  initialData = null,
  loading = false,
  doctors = [],
  departments = [],
  timeSlots = [],
  className = '',
  mode = 'create' // 'create' or 'edit'
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [step, setStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch, 
    setValue,
    getValues 
  } = useForm({
    defaultValues: initialData || {
      patientType: 'existing',
      appointmentType: 'consultation',
      priority: 'normal',
      status: 'scheduled'
    }
  });

  // Watch form values for dynamic updates
  const watchedValues = watch();

  // Use only real departments from props - no dummy data
  const defaultDepartments = departments || [];

  // Use only provided doctors - no dummy data
  const defaultDoctors = doctors;

  const defaultTimeSlots = timeSlots.length > 0 ? timeSlots : [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  // Filter doctors based on selected department
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = defaultDoctors.filter(doctor => 
        doctor.department === selectedDepartment
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(defaultDoctors);
    }
  }, [selectedDepartment]);

  // Update available time slots based on selected date and doctor
  useEffect(() => {
    if (selectedDate && watchedValues.doctorId) {
      // In a real app, this would fetch available slots from API
      setAvailableSlots(defaultTimeSlots);
    }
  }, [selectedDate, watchedValues.doctorId]);



  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setValue('appointmentDate', date);
    setValue('appointmentTime', ''); // Reset time selection
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.patientName?.trim()) {
      errors.patientName = 'Patient name is required';
    }
    

    
    if (!data.doctorId) {
      errors.doctorId = 'Doctor is required';
    }
    
    if (!data.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required';
    }
    
    if (!data.appointmentTime) {
      errors.appointmentTime = 'Appointment time is required';
    }

    return errors;
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    
    // Add additional data
    const formData = {
      ...data,
      appointmentId: mode === 'create' ? `APT-${Date.now()}` : initialData?.appointmentId,
      createdAt: mode === 'create' ? new Date().toISOString() : initialData?.createdAt,
      updatedAt: new Date().toISOString()
    };

    onSubmit(formData);
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get selected doctor info
  const getSelectedDoctor = () => {
    return filteredDoctors.find(doctor => doctor.id.toString() === watchedValues.doctorId);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {mode === 'create' ? 'Book New Appointment' : 'Edit Appointment'}
        </h2>
        <p className="text-sm text-gray-600">
          {mode === 'create' 
            ? 'Fill in the details below to schedule a new appointment'
            : 'Update the appointment details below'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Step 1: Patient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Patient Information
          </h3>

          {/* Patient Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Type <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register('patientType', { required: 'Patient type is required' })}
                  value="existing"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Existing Patient</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  {...register('patientType')}
                  value="new"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">New Patient</span>
              </label>
            </div>
            {errors.patientType && (
              <p className="text-red-500 text-sm mt-1">{errors.patientType.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('patientName', { required: 'Patient name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter patient's full name"
              />
              {(errors.patientName || formErrors.patientName) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.patientName?.message || formErrors.patientName}
                </p>
              )}
            </div>

            {/* Patient ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID {watchedValues.patientType === 'existing' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                {...register('patientId', { 
                  required: watchedValues.patientType === 'existing' ? 'Patient ID is required for existing patients' : false 
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter patient ID"
                disabled={watchedValues.patientType === 'new'}
              />
              {errors.patientId && (
                <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: 'Invalid phone number format'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('emailAddress', { 
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="patient@example.com"
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Appointment Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Appointment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* Doctor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor <span className="text-red-500">*</span>
              </label>
              <select
                {...register('doctorId', { required: 'Doctor is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"

              >
                <option value="">Select Doctor</option>
                {filteredDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
              {(errors.doctorId || formErrors.doctorId) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.doctorId?.message || formErrors.doctorId}
                </p>
              )}
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('appointmentType', { required: 'Appointment type is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Type</option>
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="check-up">Regular Check-up</option>
                <option value="emergency">Emergency</option>
                <option value="procedure">Procedure</option>
                <option value="second-opinion">Second Opinion</option>
              </select>
              {errors.appointmentType && (
                <p className="text-red-500 text-sm mt-1">{errors.appointmentType.message}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 3: Date and Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Date & Time Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('appointmentDate', { required: 'Appointment date is required' })}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {(errors.appointmentDate || formErrors.appointmentDate) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.appointmentDate?.message || formErrors.appointmentDate}
                </p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time <span className="text-red-500">*</span>
              </label>
              <select
                {...register('appointmentTime', { required: 'Appointment time is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={!selectedDate || !watchedValues.doctorId}
              >
                <option value="">Select Time</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {(errors.appointmentTime || formErrors.appointmentTime) && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.appointmentTime?.message || formErrors.appointmentTime}
                </p>
              )}
            </div>
          </div>

          {/* Available Time Slots Grid */}
          {selectedDate && watchedValues.doctorId && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setValue('appointmentTime', slot)}
                    className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                      watchedValues.appointmentTime === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Additional Information
          </h3>

          {/* Reason for Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('reasonForVisit', { required: 'Reason for visit is required' })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Please describe the reason for this appointment..."
            />
            {errors.reasonForVisit && (
              <p className="text-red-500 text-sm mt-1">{errors.reasonForVisit.message}</p>
            )}
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Symptoms
            </label>
            <textarea
              {...register('symptoms')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Describe any current symptoms (optional)..."
            />
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              {...register('specialInstructions')}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              placeholder="Any special instructions or requirements (optional)..."
            />
          </div>
        </div>

        {/* Doctor Information Card */}
        {getSelectedDoctor() && (
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Selected Doctor Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-700 font-medium">Doctor Name</p>
                <p className="text-blue-900 font-semibold">{getSelectedDoctor().name}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Specialty</p>
                <p className="text-blue-900 font-semibold">{getSelectedDoctor().specialty}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Experience</p>
                <p className="text-blue-900 font-semibold">{getSelectedDoctor().experience}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Consultation Fee</p>
                <p className="text-blue-900 font-semibold">${getSelectedDoctor().fee}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Rating</p>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <p className="text-blue-900 font-semibold">{getSelectedDoctor().rating}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Availability</p>
                <p className="text-green-600 font-semibold">{getSelectedDoctor().availability}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'create' ? 'Booking Appointment...' : 'Updating Appointment...'}
              </div>
            ) : (
              mode === 'create' ? 'Book Appointment' : 'Update Appointment'
            )}
          </button>
          
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
          >
            {mode === 'create' ? 'Reset' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
