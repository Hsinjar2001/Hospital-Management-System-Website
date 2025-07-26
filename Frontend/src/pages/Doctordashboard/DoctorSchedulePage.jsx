// pages/Doctordashboard/DoctorSchedulePage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const DoctorSchedulePage = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Sample schedule data
  const sampleScheduleData = {
    'Monday': {
      availability: { start: '09:00', end: '17:00', isAvailable: true },
      appointments: [
        { id: 1, time: '09:00', patient: 'John Doe', type: 'Consultation', duration: 30 },
        { id: 2, time: '10:30', patient: 'Jane Smith', type: 'Follow-up', duration: 45 },
        { id: 3, time: '14:00', patient: 'Robert Brown', type: 'Procedure', duration: 60 }
      ],
      breaks: [
        { id: 1, time: '12:00', duration: 60, type: 'Lunch Break' }
      ]
    },
    'Tuesday': {
      availability: { start: '09:00', end: '17:00', isAvailable: true },
      appointments: [
        { id: 4, time: '09:30', patient: 'Maria Garcia', type: 'Consultation', duration: 30 },
        { id: 5, time: '11:00', patient: 'David Wilson', type: 'Follow-up', duration: 30 }
      ],
      breaks: [
        { id: 2, time: '12:30', duration: 60, type: 'Lunch Break' }
      ]
    },
    'Wednesday': {
      availability: { start: '09:00', end: '17:00', isAvailable: true },
      appointments: [
        { id: 6, time: '10:00', patient: 'Lisa Anderson', type: 'Consultation', duration: 30 },
        { id: 7, time: '15:30', patient: 'Michael Johnson', type: 'Procedure', duration: 90 }
      ],
      breaks: [
        { id: 3, time: '12:00', duration: 60, type: 'Lunch Break' }
      ]
    },
    'Thursday': {
      availability: { start: '09:00', end: '17:00', isAvailable: true },
      appointments: [
        { id: 8, time: '09:00', patient: 'Sarah Taylor', type: 'Follow-up', duration: 30 }
      ],
      breaks: [
        { id: 4, time: '12:00', duration: 60, type: 'Lunch Break' },
        { id: 5, time: '15:00', duration: 30, type: 'Coffee Break' }
      ]
    },
    'Friday': {
      availability: { start: '09:00', end: '15:00', isAvailable: true },
      appointments: [
        { id: 9, time: '09:30', patient: 'Emma Davis', type: 'Consultation', duration: 45 },
        { id: 10, time: '11:00', patient: 'James Wilson', type: 'Follow-up', duration: 30 }
      ],
      breaks: [
        { id: 6, time: '12:30', duration: 45, type: 'Lunch Break' }
      ]
    },
    'Saturday': {
      availability: { start: '10:00', end: '14:00', isAvailable: true },
      appointments: [
        { id: 11, time: '10:30', patient: 'Anna Rodriguez', type: 'Consultation', duration: 30 }
      ],
      breaks: []
    },
    'Sunday': {
      availability: { start: '00:00', end: '00:00', isAvailable: false },
      appointments: [],
      breaks: []
    }
  };

  useEffect(() => {
    setScheduleData(sampleScheduleData);
  }, []);

  // Get days of current week
  const getWeekDays = (date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(diff + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Navigate weeks
  const goToPreviousWeek = () => {
    const prevWeek = new Date(currentWeek);
    prevWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(prevWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  // Time slots generation
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle availability toggle
  const toggleAvailability = (dayName) => {
    setScheduleData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        availability: {
          ...prev[dayName].availability,
          isAvailable: !prev[dayName].availability.isAvailable
        }
      }
    }));
  };

  // Handle slot submission
  const onSubmitSlot = (data) => {
    console.log('New slot data:', data);
    setShowAddSlotModal(false);
    reset();
    alert('✅ Schedule updated successfully!');
  };

  // Get appointment color
  const getAppointmentColor = (type) => {
    switch (type) {
      case 'Consultation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Follow-up': return 'bg-green-100 text-green-800 border-green-200';
      case 'Procedure': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your availability and appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowAvailabilityModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Set Availability
          </button>
          <button
            onClick={() => setShowAddSlotModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Block
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousWeek}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h2 className="text-lg font-semibold text-gray-900">
              Week of {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
            </h2>
            
            <button
              onClick={goToNextWeek}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => setCurrentWeek(new Date())}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            Today
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-4">
              <div className="p-2 text-sm font-medium text-gray-600">Time</div>
              {weekDays.map((day, index) => {
                const dayName = dayNames[day.getDay()];
                const dayData = scheduleData[dayName];
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div key={index} className={`p-2 text-center rounded-lg ${isToday ? 'bg-green-100' : 'bg-gray-50'}`}>
                    <div className="text-sm font-medium text-gray-900">{dayName}</div>
                    <div className="text-xs text-gray-600">{day.getDate()}</div>
                    <div className="mt-1">
                      <button
                        onClick={() => toggleAvailability(dayName)}
                        className={`text-xs px-2 py-1 rounded-full ${
                          dayData?.availability?.isAvailable 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {dayData?.availability?.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="space-y-1">
              {timeSlots.map(timeSlot => (
                <div key={timeSlot} className="grid grid-cols-8 gap-2">
                  <div className="p-2 text-sm text-gray-600 font-medium">{timeSlot}</div>
                  {weekDays.map((day, dayIndex) => {
                    const dayName = dayNames[day.getDay()];
                    const dayData = scheduleData[dayName];
                    const appointment = dayData?.appointments?.find(apt => apt.time === timeSlot);
                    const isBreak = dayData?.breaks?.find(brk => brk.time === timeSlot);
                    
                    return (
                      <div key={dayIndex} className="p-1">
                        {appointment ? (
                          <div className={`p-2 rounded-lg border text-xs ${getAppointmentColor(appointment.type)}`}>
                            <div className="font-medium">{appointment.patient}</div>
                            <div>{appointment.type}</div>
                            <div>{appointment.duration}min</div>
                          </div>
                        ) : isBreak ? (
                          <div className="p-2 rounded-lg border bg-gray-100 text-gray-700 text-xs">
                            <div className="font-medium">{isBreak.type}</div>
                            <div>{isBreak.duration}min</div>
                          </div>
                        ) : dayData?.availability?.isAvailable ? (
                          <div className="h-12 border border-dashed border-gray-300 rounded-lg hover:bg-green-50 cursor-pointer"></div>
                        ) : (
                          <div className="h-12 bg-gray-100 rounded-lg"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-xs text-gray-500">Appointments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Hours</p>
              <p className="text-2xl font-bold text-gray-900">40</p>
              <p className="text-xs text-gray-500">This Week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
              <p className="text-xs text-gray-500">Schedule Fill</p>
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
              <p className="text-sm font-medium text-gray-600">Break Time</p>
              <p className="text-2xl font-bold text-gray-900">6h</p>
              <p className="text-xs text-gray-500">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Set Weekly Availability</h3>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                {dayNames.slice(1, 7).map(day => (
                  <div key={day} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900">{day}</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        defaultValue="09:00"
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        defaultValue="17:00"
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      />
                      <input
                        type="checkbox"
                        defaultChecked
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAvailabilityModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Availability
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Schedule Block</h3>
                <button
                  onClick={() => setShowAddSlotModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmitSlot)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Block Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('type', { required: 'Type is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select type...</option>
                    <option value="break">Break</option>
                    <option value="surgery">Surgery</option>
                    <option value="meeting">Meeting</option>
                    <option value="training">Training</option>
                    <option value="personal">Personal Time</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="time"
                      {...register('startTime', { required: 'Start time is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.startTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (min) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="15"
                      step="15"
                      {...register('duration', { required: 'Duration is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddSlotModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add Block
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

export default DoctorSchedulePage;
