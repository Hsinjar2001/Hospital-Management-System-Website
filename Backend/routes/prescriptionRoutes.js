const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  searchPrescriptions
} = require('../controllers/prescriptionController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protected routes
router.use(protect);

// Prescription management routes
router.get('/', authorize('admin', 'doctor', 'patient'), getAllPrescriptions);
router.get('/search', authorize('admin', 'doctor'), searchPrescriptions);
router.get('/patient/:patientId', authorize('admin', 'doctor', 'patient'), getPrescriptionsByPatient);
router.get('/doctor/:doctorId', authorize('admin', 'doctor'), getPrescriptionsByDoctor);

// Individual prescription routes
router.get('/:id', authorize('admin', 'doctor', 'patient'), getPrescriptionById);
router.post('/', authorize('admin', 'doctor'), createPrescription);
router.put('/:id', authorize('admin', 'doctor'), updatePrescription);
router.delete('/:id', authorize('admin', 'doctor'), deletePrescription);

module.exports = router;
