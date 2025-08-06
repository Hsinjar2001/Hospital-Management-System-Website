const express = require('express');
const router = express.Router();

const {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByUserId,
  getPrescriptionsByDoctor,
  searchPrescriptions,
  purchasePrescription
} = require('../controllers/prescriptionController');

const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllPrescriptions);
router.get('/search', authenticateToken, searchPrescriptions);
router.get('/patient/:patientId', authenticateToken, getPrescriptionsByPatient);
router.get('/user/:userId', authenticateToken, getPrescriptionsByUserId);
router.get('/doctor/:doctorId', authenticateToken, getPrescriptionsByDoctor);

router.get('/:id', authenticateToken, getPrescription);
router.post('/', authenticateToken, createPrescription);
router.post('/:id/purchase', authenticateToken, purchasePrescription);
router.put('/:id', authenticateToken, updatePrescription);
router.delete('/:id', authenticateToken, deletePrescription);

module.exports = router;
