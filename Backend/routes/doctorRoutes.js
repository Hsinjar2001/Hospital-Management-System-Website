const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controllers
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  uploadDoctorImage,
  getDoctorAppointments,
  getDoctorSchedule,
  updateDoctorSchedule,
  getDoctorAvailability,
  updateDoctorAvailability,
  getDoctorReviews,
  searchDoctors,
  getDoctorStats,
  getDoctorsByDepartment
} = require('../controllers/doctorController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/doctors');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doctor-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes (for doctor search and profiles)
router.get('/search', searchDoctors);
router.get('/department/:departmentId', getDoctorsByDepartment);

// Protected routes
router.use(protect);

// Doctor management routes (Admin access)
router.get('/', authorize('admin'), getAllDoctors);
router.get('/stats', authorize('admin'), getDoctorStats);
router.post('/', authorize('admin'), createDoctor);
router.put('/:id', authorize('admin'), updateDoctor);
router.delete('/:id', authorize('admin'), deleteDoctor);

// Doctor profile routes (Doctor can access their own profile)
router.get('/:id', authorize('admin', 'doctor', 'patient'), getDoctorById);
router.get('/profile/:id', authorize('admin', 'doctor'), getDoctorProfile);
router.put('/profile/:id', authorize('admin', 'doctor'), updateDoctorProfile);
router.post('/profile/:id/image', authorize('admin', 'doctor'), upload.single('profileImage'), uploadDoctorImage);

// Doctor schedule and availability routes
router.get('/:id/schedule', authorize('admin', 'doctor', 'patient'), getDoctorSchedule);
router.put('/:id/schedule', authorize('admin', 'doctor'), updateDoctorSchedule);
router.get('/:id/availability', authorize('admin', 'doctor', 'patient'), getDoctorAvailability);
router.put('/:id/availability', authorize('admin', 'doctor'), updateDoctorAvailability);

// Doctor appointments and reviews
router.get('/:id/appointments', authorize('admin', 'doctor'), getDoctorAppointments);
router.get('/:id/reviews', authorize('admin', 'doctor', 'patient'), getDoctorReviews);

module.exports = router;
