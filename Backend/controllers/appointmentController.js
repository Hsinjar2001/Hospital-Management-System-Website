const { User, Patient, Doctor, Department, Appointment } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      patientId = '',
      doctorId = '',
      departmentId = '',
      date = '',
      appointmentType = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      // Patients can only see their own appointments
      // First, find the patient record for this user
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient profile not found'
        });
      }
      whereClause.patientId = patient.id;
    } else if (req.user.role === 'doctor') {
      // Doctors can only see their own appointments
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor profile not found'
        });
      }
      whereClause.doctorId = doctor.id;
    }
    // Admin can see all appointments (no additional filtering)

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { appointmentId: { [Op.iLike]: `%${search}%` } },
        { symptoms: { [Op.iLike]: `%${search}%` } },
        { diagnosis: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (patientId && req.user.role === 'admin') {
      whereClause.patientId = patientId;
    }

    if (doctorId && (req.user.role === 'admin' || req.user.role === 'doctor')) {
      whereClause.doctorId = doctorId;
    }

    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    if (date) {
      whereClause.appointmentDate = date;
    }

    if (appointmentType) {
      whereClause.appointmentType = appointmentType;
    }

    // Simplified query without complex associations to avoid errors
    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointmentDate', 'DESC'], ['appointmentTime', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching appointments'
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'description']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: { appointment }
    });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching appointment'
    });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      patientType,
      priority,
      symptoms,
      notes,
      duration,
      consultationFee
    } = req.body;

    // Generate appointment ID
    const appointmentId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check for conflicts
    const conflictingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: {
          [Op.in]: ['scheduled', 'confirmed']
        }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        error: 'Time slot is already booked'
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      appointmentId,
      patientId,
      doctorId,
      departmentId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      patientType,
      priority,
      symptoms,
      notes,
      duration,
      consultationFee
    });

    // Fetch created appointment with associations
    const createdAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointment: createdAppointment }
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating appointment'
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check for conflicts if time/date is being updated
    if (updateData.appointmentDate || updateData.appointmentTime) {
      const conflictingAppointment = await Appointment.findOne({
        where: {
          doctorId: appointment.doctorId,
          appointmentDate: updateData.appointmentDate || appointment.appointmentDate,
          appointmentTime: updateData.appointmentTime || appointment.appointmentTime,
          status: {
            [Op.in]: ['scheduled', 'confirmed']
          },
          id: {
            [Op.ne]: id
          }
        }
      });

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          error: 'Time slot is already booked'
        });
      }
    }

    // Update appointment
    await appointment.update(updateData);

    // Fetch updated appointment with associations
    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment: updatedAppointment }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating appointment'
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    await appointment.destroy();

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting appointment'
    });
  }
};

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private (Admin)
const getAppointmentStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.count();
    const scheduledAppointments = await Appointment.count({ where: { status: 'scheduled' } });
    const confirmedAppointments = await Appointment.count({ where: { status: 'confirmed' } });
    const completedAppointments = await Appointment.count({ where: { status: 'completed' } });
    const cancelledAppointments = await Appointment.count({ where: { status: 'cancelled' } });

    // Get appointments by date (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = await Appointment.count({
        where: { appointmentDate: dateStr }
      });
      
      last7Days.push({
        date: dateStr,
        count
      });
    }

    res.json({
      success: true,
      data: {
        totalAppointments,
        scheduledAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        last7Days
      }
    });
  } catch (error) {
    console.error('Get appointment stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching appointment statistics'
    });
  }
};

// @desc    Get available time slots
// @route   GET /api/appointments/available-slots
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        error: 'Doctor ID and date are required'
      });
    }

    // Get doctor's schedule
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    // Get booked appointments for the date
    const bookedAppointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate: date,
        status: {
          [Op.in]: ['scheduled', 'confirmed']
        }
      },
      attributes: ['appointmentTime']
    });

    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);

    // Generate available time slots (assuming 30-minute intervals)
    const timeSlots = [];
    const startTime = '09:00';
    const endTime = '17:00';
    
    let currentTime = new Date(`2000-01-01T${startTime}`);
    const endDateTime = new Date(`2000-01-01T${endTime}`);

    while (currentTime < endDateTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);
      if (!bookedTimes.includes(timeStr)) {
        timeSlots.push(timeStr);
      }
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    res.json({
      success: true,
      data: { timeSlots }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching available time slots'
    });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private (Admin/Doctor/Patient)
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'icon', 'color']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient') {
      if (req.user.id !== appointment.patient.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'doctor') {
      if (req.user.id !== appointment.doctor.userId) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Admin/Doctor/Patient)
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment cannot be cancelled (less than 24 hours notice or already completed)'
      });
    }

    // Check access permissions
    let cancelledBy = 'admin';
    if (req.user.role === 'patient' && req.user.id === appointment.patient.userId) {
      cancelledBy = 'patient';
    } else if (req.user.role === 'doctor' && req.user.id === appointment.doctor.userId) {
      cancelledBy = 'doctor';
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await appointment.update({
      status: 'cancelled',
      cancellationReason: cancellationReason || 'No reason provided',
      cancelledBy: cancelledBy,
      cancelledAt: new Date()
    });

    res.status(200).json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Reschedule appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private (Admin/Doctor/Patient)
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate, appointmentTime } = req.body;

    if (!appointmentDate || !appointmentTime) {
      return res.status(400).json({
        status: 'error',
        message: 'New appointment date and time are required'
      });
    }

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Patient, as: 'patient' },
        { model: Doctor, as: 'doctor' }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'patient' && req.user.id !== appointment.patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    } else if (req.user.role === 'doctor' && req.user.id !== appointment.doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Check if the new slot is available
    const conflictingAppointment = await Appointment.findOne({
      where: {
        doctorId: appointment.doctorId,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        status: ['scheduled', 'confirmed', 'in-progress'],
        id: { [Op.ne]: id }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'The selected time slot is not available'
      });
    }

    await appointment.update({
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      status: 'scheduled' // Reset to scheduled status
    });

    res.status(200).json({
      status: 'success',
      message: 'Appointment rescheduled successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Confirm appointment
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Admin/Doctor)
const confirmAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        status: 'error',
        message: 'Only scheduled appointments can be confirmed'
      });
    }

    await appointment.update({ status: 'confirmed' });

    res.status(200).json({
      status: 'success',
      message: 'Appointment confirmed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Confirm appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Complete appointment
// @route   PUT /api/appointments/:id/complete
// @access  Private (Admin/Doctor)
const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnosis, treatment, notes } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    if (!['confirmed', 'in-progress'].includes(appointment.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Only confirmed or in-progress appointments can be completed'
      });
    }

    await appointment.update({
      status: 'completed',
      diagnosis: diagnosis,
      treatment: treatment,
      notes: notes,
      completedAt: new Date()
    });

    res.status(200).json({
      status: 'success',
      message: 'Appointment completed successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Complete appointment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get appointments by date
// @route   GET /api/appointments/date/:date
// @access  Private (Admin/Doctor)
const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { doctorId = '', status = '' } = req.query;

    const whereClause = { appointmentDate: date };

    if (doctorId) {
      whereClause.doctorId = doctorId;
    }

    if (status) {
      whereClause.status = status;
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name']
        }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.status(200).json({
      status: 'success',
      data: appointments
    });
  } catch (error) {
    console.error('Get appointments by date error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get appointments by doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private (Admin/Doctor)
const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10, status = '', date = '' } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { doctorId: doctorId };

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      whereClause.appointmentDate = date;
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'phone']
            }
          ]
        }
      ],
      order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get appointments by doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get appointments by patient
// @route   GET /api/appointments/patient/:patientId
// @access  Private (Admin/Doctor/Patient)
const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status = '', upcoming = '' } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { patientId: patientId };

    if (status) {
      whereClause.status = status;
    }

    if (upcoming === 'true') {
      whereClause.appointmentDate = {
        [Op.gte]: new Date().toISOString().split('T')[0]
      };
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            },
            {
              model: Department,
              as: 'department',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get appointments by patient error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Search appointments
// @route   GET /api/appointments/search
// @access  Private (Admin/Doctor)
const searchAppointments = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: {
        [Op.or]: [
          { appointmentId: { [Op.iLike]: `%${q}%` } },
          { symptoms: { [Op.iLike]: `%${q}%` } },
          { diagnosis: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email'],
              where: {
                [Op.or]: [
                  { firstName: { [Op.iLike]: `%${q}%` } },
                  { lastName: { [Op.iLike]: `%${q}%` } },
                  { email: { [Op.iLike]: `%${q}%` } }
                ]
              },
              required: false
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName'],
              where: {
                [Op.or]: [
                  { firstName: { [Op.iLike]: `%${q}%` } },
                  { lastName: { [Op.iLike]: `%${q}%` } }
                ]
              },
              required: false
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointment,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  rescheduleAppointment,
  confirmAppointment,
  completeAppointment,
  getAppointmentsByDate,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  searchAppointments,
  getAppointmentStats,
  getAvailableSlots
};
