const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controllers
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientProfile,
  updatePatientProfile,
  uploadPatientImage,
  getPatientAppointments,
  getPatientPrescriptions,
  getPatientInvoices,
  searchPatients,
  getPatientStats
} = require('../controllers/patientController');

// Import middleware
const { protect, authorize } = require('../middlewares/authMiddleware');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/patients');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'patient-' + uniqueSuffix + path.extname(file.originalname));
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

// Public routes (for patient registration)
router.post('/register', createPatient);

// Protected routes
router.use(protect);

// Patient management routes (Admin/Doctor access)
router.get('/', authorize('admin', 'doctor'), getAllPatients);
router.get('/search', authorize('admin', 'doctor'), searchPatients);
router.get('/stats', authorize('admin'), getPatientStats);
router.get('/:id', authorize('admin', 'doctor', 'patient'), getPatientById);
router.put('/:id', authorize('admin', 'doctor'), updatePatient);
router.delete('/:id', authorize('admin'), deletePatient);

// Patient profile routes (Patient can access their own profile)
router.get('/profile/:id', authorize('admin', 'doctor', 'patient'), getPatientProfile);
router.put('/profile/:id', authorize('admin', 'doctor', 'patient'), updatePatientProfile);
router.post('/profile/:id/image', authorize('admin', 'doctor', 'patient'), upload.single('profileImage'), uploadPatientImage);

// Patient related data routes
router.get('/:id/appointments', authorize('admin', 'doctor', 'patient'), getPatientAppointments);
router.get('/:id/prescriptions', authorize('admin', 'doctor', 'patient'), getPatientPrescriptions);
router.get('/:id/invoices', authorize('admin', 'doctor', 'patient'), getPatientInvoices);

module.exports = router;
