const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getReviewsByDoctor,
  getReviewsByPatient
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAllReviews);
router.get('/:id', authenticateToken, getReview);
router.post('/', authenticateToken, createReview);
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);
router.patch('/:id/approve', authenticateToken, approveReview);
router.get('/doctor/:doctor_id', authenticateToken, getReviewsByDoctor);
router.get('/patient/:patient_id', authenticateToken, getReviewsByPatient);

module.exports = router;