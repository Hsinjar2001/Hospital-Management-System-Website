const express = require('express');
const router = express.Router();
const {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
  purchasePrescription,
  getPatientInvoices,
  resetPrescriptionStatus
} = require('../controllers/invoiceController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllInvoices);
router.get('/:id', authenticateToken, getInvoice);
router.post('/', authenticateToken, createInvoice);
router.put('/:id', authenticateToken, updateInvoice);
router.delete('/:id', authenticateToken, deleteInvoice);
router.patch('/:id/pay', authenticateToken, markAsPaid);
router.post('/purchase/:prescriptionId', authenticateToken, purchasePrescription);
router.patch('/reset/:prescriptionId', authenticateToken, resetPrescriptionStatus);
router.get('/patient/list', authenticateToken, getPatientInvoices);

module.exports = router;