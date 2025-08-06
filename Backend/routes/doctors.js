const express = require('express');
const router = express.Router();
const { User, Appointment } = require('../models');
const { authenticateToken } = require('../middleware/auth');
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');

router.get('/', getAllDoctors);

router.get('/patients', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Doctor role required.'
      });
    }

    const doctorAppointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
      include: [{
        model: User,
        as: 'patient',
        attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
      }]
    });

    const uniquePatients = [];
    const patientIds = new Set();

    doctorAppointments.forEach(appointment => {
      if (appointment.patient && !patientIds.has(appointment.patient.id)) {
        patientIds.add(appointment.patient.id);
        uniquePatients.push({
          id: appointment.patient.id,
          firstName: appointment.patient.firstName,
          lastName: appointment.patient.lastName,
          email: appointment.patient.email,
          phone: appointment.patient.phone,
          name: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          totalAppointments: doctorAppointments.filter(a => a.patient && a.patient.id === appointment.patient.id).length
        });
      }
    });

    res.json({
      success: true,
      data: {
        patients: uniquePatients,
        total: uniquePatients.length
      }
    });
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching patients'
    });
  }
});

router.get('/:id', getDoctorById);

module.exports = router;