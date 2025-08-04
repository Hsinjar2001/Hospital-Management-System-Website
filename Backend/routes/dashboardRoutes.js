const express = require('express');
const router = express.Router();
const { User, Patient, Doctor, Appointment, Department, Prescription, Invoice } = require('../models');
const { protect } = require('../middlewares/authMiddleware');
const { Op } = require('sequelize');

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
router.get('/admin', protect, async (req, res) => {
  try {
    console.log('🔍 Admin dashboard route hit by user:', req.user?.email);

    // Get real data from database
    const [totalPatients, totalDoctors, totalAppointments, totalDepartments] = await Promise.all([
      Patient.count(),
      Doctor.count(),
      Appointment.count(),
      Department.count()
    ]);

    // Get recent appointments with patient and doctor details
    const recentAppointments = await Appointment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Patient,
          attributes: ['firstName', 'lastName', 'phone']
        },
        {
          model: Doctor,
          attributes: ['firstName', 'lastName', 'specialty'],
          include: [{
            model: User,
            attributes: ['firstName', 'lastName']
          }]
        }
      ]
    });

    // Calculate monthly statistics (current month vs previous month)
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const [currentMonthPatients, previousMonthPatients, currentMonthAppointments, previousMonthAppointments] = await Promise.all([
      Patient.count({ where: { createdAt: { [Op.gte]: currentMonthStart } } }),
      Patient.count({ where: { createdAt: { [Op.between]: [previousMonthStart, previousMonthEnd] } } }),
      Appointment.count({ where: { createdAt: { [Op.gte]: currentMonthStart } } }),
      Appointment.count({ where: { createdAt: { [Op.between]: [previousMonthStart, previousMonthEnd] } } })
    ]);

    // Calculate percentage changes
    const patientsChange = previousMonthPatients > 0 ?
      Math.round(((currentMonthPatients - previousMonthPatients) / previousMonthPatients) * 100) : 0;
    const appointmentsChange = previousMonthAppointments > 0 ?
      Math.round(((currentMonthAppointments - previousMonthAppointments) / previousMonthAppointments) * 100) : 0;

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalDepartments,
        monthlyAppointments: currentMonthAppointments,
        monthlyPatients: currentMonthPatients,
        patientsChange,
        doctorsChange: 0, // Would need historical doctor data to calculate
        appointmentsChange,
        totalRevenue: 0, // Would need invoice/payment data to calculate
        recentAppointments
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Error loading admin dashboard data'
    });
  }
});

// @desc    Get doctor dashboard stats
// @route   GET /api/dashboard/doctor
// @access  Private (Doctor only)
router.get('/doctor', protect, async (req, res) => {
  try {
    const doctorId = req.user.id;

    // Get doctor's appointments
    const totalPatients = await Appointment.count({
      distinct: true,
      col: 'patientId',
      where: { doctorId }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.count({
      where: {
        doctorId,
        appointmentDate: {
          [require('sequelize').Op.between]: [todayStart, todayEnd]
        }
      }
    });

    const completedAppointments = await Appointment.count({
      where: {
        doctorId,
        status: 'completed'
      }
    });

    const pendingPrescriptions = await Prescription.count({
      where: {
        doctorId,
        status: 'active'
      }
    });

    // Get today's appointments with patient details
    const todayAppointmentsList = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate: {
          [Op.between]: [todayStart, todayEnd]
        }
      },
      include: [
        { model: Patient, attributes: ['firstName', 'lastName', 'phone'] }
      ],
      order: [['appointmentTime', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients,
          todayAppointments,
          completedAppointments,
          pendingPrescriptions,
          avgRating: 4.5, // Placeholder
          totalReviews: 0 // Placeholder
        },
        todayAppointments: todayAppointmentsList,
        upcomingAppointments: todayAppointmentsList
      }
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Error loading doctor dashboard data'
    });
  }
});

// @desc    Get patient dashboard stats
// @route   GET /api/dashboard/patient
// @access  Private (Patient only)
router.get('/patient', protect, async (req, res) => {
  try {
    // Find the patient record for this user
    const patient = await Patient.findOne({ where: { userId: req.user.id } });
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient profile not found'
      });
    }
    const patientId = patient.id;

    // Get patient's appointments
    const upcomingAppointments = await Appointment.count({
      where: {
        patientId,
        status: 'scheduled',
        appointmentDate: {
          [require('sequelize').Op.gte]: new Date()
        }
      }
    });

    const completedAppointments = await Appointment.count({
      where: {
        patientId,
        status: 'completed'
      }
    });

    const activePrescriptions = await Prescription.count({
      where: {
        patientId,
        status: 'active'
      }
    });

    const outstandingBills = await Invoice.sum('totalAmount', {
      where: {
        patientId,
        paymentStatus: 'pending'
      }
    }) || 0;

    // Get upcoming appointments with doctor details
    const upcomingAppointmentsList = await Appointment.findAll({
      where: {
        patientId,
        status: 'scheduled',
        appointmentDate: {
          [require('sequelize').Op.gte]: new Date()
        }
      },
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName', 'specialty'] }
      ],
      order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']],
      limit: 5
    });

    // Get recent prescriptions
    const recentPrescriptions = await Prescription.findAll({
      where: { patientId },
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        stats: {
          upcomingAppointments,
          completedAppointments,
          pendingPrescriptions: activePrescriptions,
          outstandingBills
        },
        upcomingAppointments: upcomingAppointmentsList,
        recentPrescriptions,
        healthMetrics: {
          lastCheckup: 'Not available',
          bloodPressure: 'Not recorded',
          weight: 'Not recorded',
          height: 'Not recorded',
          bmi: 'Not calculated'
        },
        recentActivity: [] // Placeholder
      }
    });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Error loading patient dashboard data'
    });
  }
});

// @desc    Get dashboard stats by role
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { role, period = 'today' } = req.query;
    
    // Basic stats that work for all roles
    const stats = {
      totalPatients: await Patient.count(),
      totalDoctors: await Doctor.count(),
      totalAppointments: await Appointment.count(),
      totalDepartments: await Department.count()
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error loading dashboard stats'
    });
  }
});

module.exports = router;
