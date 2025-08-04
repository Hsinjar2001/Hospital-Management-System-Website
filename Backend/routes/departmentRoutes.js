const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDoctors,
  getDepartmentStats,
  searchDepartments
} = require('../controllers/departmentController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Public routes (for department listing)
router.get('/', getAllDepartments);
router.get('/search', searchDepartments);
router.get('/:id', getDepartmentById);
router.get('/:id/doctors', getDepartmentDoctors);

// Protected routes
router.use(protect);

// Department management routes (Admin access)
router.post('/', authorize('admin'), createDepartment);
router.put('/:id', authorize('admin'), updateDepartment);
router.delete('/:id', authorize('admin'), deleteDepartment);
router.get('/:id/stats', authorize('admin'), getDepartmentStats);

module.exports = router;
