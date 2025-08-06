const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');
const { authenticateToken: protect, authorizeRoles: authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, authorize('admin', 'doctor'), getPatientById);
router.post('/', protect, authorize('admin'), createPatient);
router.put('/:id', protect, authorize('admin'), updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;