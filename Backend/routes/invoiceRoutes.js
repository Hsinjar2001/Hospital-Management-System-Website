const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceStats
} = require('../controllers/invoiceController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protected routes
router.use(protect);

// Invoice management routes
router.get('/', authorize('admin', 'doctor', 'patient'), getAllInvoices);
router.get('/stats', authorize('admin'), getInvoiceStats);
router.get('/:id', authorize('admin', 'doctor', 'patient'), getInvoice);
router.post('/', authorize('admin', 'doctor'), createInvoice);
router.put('/:id', authorize('admin', 'doctor'), updateInvoice);
router.delete('/:id', authorize('admin'), deleteInvoice);

module.exports = router;
