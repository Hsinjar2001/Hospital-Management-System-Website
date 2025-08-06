const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient
} = require('../controllers/appointmentController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllAppointments);
router.get('/:id', authenticateToken, getAppointment);
router.post('/', authenticateToken, createAppointment);
router.put('/:id', authenticateToken, updateAppointment);
router.delete('/:id', authenticateToken, deleteAppointment);
router.get('/doctor/:doctorId', authenticateToken, getAppointmentsByDoctor);
router.get('/patient/:patient_id', authenticateToken, getAppointmentsByPatient);

module.exports = router;