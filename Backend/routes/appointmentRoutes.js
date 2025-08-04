const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllAppointments,
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
  getAvailableSlots,
  getAppointmentStats,
  searchAppointments
} = require('../controllers/appointmentController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protected routes
router.use(protect);

// Appointment management routes
router.get('/', authorize('admin', 'doctor', 'patient'), getAllAppointments);
router.get('/search', authorize('admin', 'doctor'), searchAppointments);
router.get('/stats', authorize('admin'), getAppointmentStats);
router.get('/date/:date', authorize('admin', 'doctor'), getAppointmentsByDate);
router.get('/doctor/:doctorId', authorize('admin', 'doctor'), getAppointmentsByDoctor);
router.get('/patient/:patientId', authorize('admin', 'doctor', 'patient'), getAppointmentsByPatient);
router.get('/available-slots/:doctorId/:date', getAvailableSlots);

// Individual appointment routes
router.get('/:id', authorize('admin', 'doctor', 'patient'), getAppointmentById);
router.post('/', authorize('admin', 'doctor', 'patient'), createAppointment);
router.put('/:id', authorize('admin', 'doctor', 'patient'), updateAppointment);
router.delete('/:id', authorize('admin'), deleteAppointment);

// Appointment status management
router.put('/:id/cancel', authorize('admin', 'doctor', 'patient'), cancelAppointment);
router.put('/:id/reschedule', authorize('admin', 'doctor', 'patient'), rescheduleAppointment);
router.put('/:id/confirm', authorize('admin', 'doctor'), confirmAppointment);
router.put('/:id/complete', authorize('admin', 'doctor'), completeAppointment);

module.exports = router;
