const express = require('express');
const router = express.Router();
const { User, Appointment, Prescription, Invoice, sequelize } = require('../models');
const { authenticateToken: protect } = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/admin', protect, async (req, res) => {
  try {
    console.log('🔍 Admin dashboard route hit by user:', req.user?.email);

    const [totalPatients, totalDoctors, totalAppointments] = await Promise.all([
      User.count({ where: { role: 'patient' } }),
      User.count({ where: { role: 'doctor' } }),
      Appointment.count()
    ]);

    const recentAppointments = await Appointment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName', 'phone']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['firstName', 'lastName']
        }
      ]
    });

    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const previousMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const previousMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const [currentMonthPatients, previousMonthPatients] = await Promise.all([
      User.count({
        where: {
          role: 'patient',
          createdAt: { [Op.gte]: currentMonthStart }
        }
      }),
      User.count({
        where: {
          role: 'patient',
          createdAt: {
            [Op.gte]: previousMonthStart,
            [Op.lte]: previousMonthEnd
          }
        }
      })
    ]);

    const [currentMonthDoctors, previousMonthDoctors] = await Promise.all([
      User.count({
        where: {
          role: 'doctor',
          createdAt: { [Op.gte]: currentMonthStart }
        }
      }),
      User.count({
        where: {
          role: 'doctor',
          createdAt: {
            [Op.gte]: previousMonthStart,
            [Op.lte]: previousMonthEnd
          }
        }
      })
    ]);

    const [currentMonthAppointments, previousMonthAppointments] = await Promise.all([
      Appointment.count({
        where: {
          createdAt: { [Op.gte]: currentMonthStart }
        }
      }),
      Appointment.count({
        where: {
          createdAt: {
            [Op.gte]: previousMonthStart,
            [Op.lte]: previousMonthEnd
          }
        }
      })
    ]);

    const patientsChange = previousMonthPatients > 0 
      ? ((currentMonthPatients - previousMonthPatients) / previousMonthPatients) * 100 
      : 0;
    
    const doctorsChange = previousMonthDoctors > 0 
      ? ((currentMonthDoctors - previousMonthDoctors) / previousMonthDoctors) * 100 
      : 0;
    
    const appointmentsChange = previousMonthAppointments > 0 
      ? ((currentMonthAppointments - previousMonthAppointments) / previousMonthAppointments) * 100 
      : 0;

    const totalRevenue = await Invoice.sum('total_amount', {
      where: { payment_status: 'paid' }
    }) || 0;

    const pendingPayments = await Invoice.sum('total_amount', {
      where: { payment_status: 'pending' }
    }) || 0;

    const topDoctors = await User.findAll({
      where: { role: 'doctor' },
      attributes: ['id', 'firstName', 'lastName', 'specialty'],
      include: [{
        model: Appointment,
        attributes: [],
        required: false
      }],
      group: ['User.id'],
      order: [[sequelize.fn('COUNT', sequelize.col('Appointments.id')), 'DESC']],
      limit: 5
    });

    const totalPrescriptions = await Prescription.count();
    const activePrescriptions = await Prescription.count({
      where: { status: 'active' }
    });
    const totalDepartments = await User.count({
      where: { role: 'doctor' },
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('specialty')), 'specialty']],
      group: ['specialty']
    }).then(result => result.length);

    res.json({
      success: true,
      data: {
          totalPatients,
          totalDoctors,
          totalAppointments,
          totalDepartments,
          totalRevenue,
          pendingPayments,
          activePrescriptions,
          patientsChange: Math.round(patientsChange * 100) / 100,
          doctorsChange: Math.round(doctorsChange * 100) / 100,
          appointmentsChange: Math.round(appointmentsChange * 100) / 100,
          monthlyAppointments: currentMonthAppointments,
          monthlyPatients: currentMonthPatients,
          recentAppointments,
          topDoctors
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

router.get('/doctor', protect, async (req, res) => {
  try {
    const doctorId = req.user.id;

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
        appointment_date: {
          [Op.between]: [todayStart, todayEnd]
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

    const todayAppointmentsList = await Appointment.findAll({
      where: {
        doctorId,
        appointment_date: {
          [Op.between]: [todayStart, todayEnd]
        }
      },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName', 'phone']
        }
      ],
      order: [['appointment_time', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalPatients,
          todayAppointments,
          completedAppointments,
          pendingPrescriptions
        },
        todaySchedule: todayAppointmentsList
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

router.get('/patient', protect, async (req, res) => {
  try {
    const patientId = req.user.id;

    const upcomingAppointments = await Appointment.count({
      where: {
        patientId,
        status: 'scheduled',
        appointment_date: {
          [Op.gte]: new Date()
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

    const outstandingBills = await Invoice.sum('total_amount', {
      where: {
        patientId,
        payment_status: 'pending'
      }
    }) || 0;

    const upcomingAppointmentsList = await Appointment.findAll({
      where: {
        patientId,
        status: 'scheduled',
        appointment_date: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']],
      limit: 5
    });

    const recentPrescriptions = await Prescription.findAll({
      where: { patientId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['firstName', 'lastName']
        }
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
        recentPrescriptions
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

router.get('/stats', protect, async (req, res) => {
  try {
    const { role, period = 'today' } = req.query;
    
    const stats = {
      totalPatients: await User.count({ where: { role: 'patient' } }),
      totalDoctors: await User.count({ where: { role: 'doctor' } }),
      totalAppointments: await Appointment.count()
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