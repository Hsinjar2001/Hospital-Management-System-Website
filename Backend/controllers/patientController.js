const { User, Patient, Doctor, Department, Appointment, Prescription, Invoice } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin/Doctor)
const getAllPatients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      bloodGroup = '',
      hasInsurance = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { patientId: { [Op.iLike]: `%${search}%` } },
        { emergencyContactName: { [Op.iLike]: `%${search}%` } },
        { insuranceProvider: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (bloodGroup) {
      whereClause.bloodGroup = bloodGroup;
    }

    if (hasInsurance !== '') {
      whereClause.hasInsurance = hasInsurance === 'true';
    }

    const { count, rows: patients } = await Patient.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'address', 'city', 'state', 'zipCode', 'profileImage']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching patients'
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private (Admin/Doctor/Patient)
const getPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: { patient }
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching patient'
    });
  }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private (Admin)
const createPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodGroup
    } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user first
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      role: 'patient',
      isActive: true
    });

    // Create patient record
    const patient = await Patient.create({
      userId: user.id,
      fullName: `${firstName} ${lastName}`,
      dateOfBirth,
      gender,
      bloodGroup,
      phone,
      address
    });

    // Fetch created patient with associations
    const createdPatient = await Patient.findByPk(patient.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: { patient: createdPatient }
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating patient'
    });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Admin/Patient)
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    // Update patient
    await patient.update(updateData);

    // Fetch updated patient with associations
    const updatedPatient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient: updatedPatient }
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating patient'
    });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    await patient.destroy();

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting patient'
    });
  }
};

// @desc    Get patient statistics
// @route   GET /api/patients/stats
// @access  Private (Admin)
const getPatientStats = async (req, res) => {
  try {
    const totalPatients = await Patient.count();
    const activePatients = await Patient.count({ where: { status: 'active' } });
    const minorPatients = await Patient.count({ where: { isMinor: true } });
    const insuredPatients = await Patient.count({ where: { hasInsurance: true } });

    // Get patients by blood group
    const patientsByBloodGroup = await Patient.findAll({
      attributes: ['bloodGroup'],
      group: ['bloodGroup'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalPatients,
        activePatients,
        minorPatients,
        insuredPatients,
        patientsByBloodGroup
      }
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching patient statistics'
    });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private (Admin/Doctor/Patient)
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'address', 'city', 'state', 'zipCode', 'profileImage']
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is accessing their own profile
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (error) {
    console.error('Get patient by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile/:id
// @access  Private (Admin/Doctor/Patient)
const getPatientProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is accessing their own profile
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: patient
    });
  } catch (error) {
    console.error('Get patient profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile/:id
// @access  Private (Admin/Doctor/Patient)
const updatePatientProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is updating their own profile
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Separate user data from patient data
    const userData = {};
    const patientData = {};

    const userFields = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'address', 'city', 'state', 'zipCode'];

    Object.keys(updateData).forEach(key => {
      if (userFields.includes(key)) {
        userData[key] = updateData[key];
      } else {
        patientData[key] = updateData[key];
      }
    });

    // Update user data
    if (Object.keys(userData).length > 0) {
      await patient.user.update(userData);
    }

    // Update patient data
    if (Object.keys(patientData).length > 0) {
      await patient.update(patientData);
    }

    // Fetch updated patient
    const updatedPatient = await Patient.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      message: 'Patient profile updated successfully',
      data: updatedPatient
    });
  } catch (error) {
    console.error('Update patient profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Upload patient profile image
// @route   POST /api/patients/profile/:id/image
// @access  Private (Admin/Doctor/Patient)
const uploadPatientImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const patient = await Patient.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is updating their own profile
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Delete old image if exists
    if (patient.user.profileImage) {
      const oldImagePath = path.join(__dirname, '../uploads/patients', patient.user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new image path
    const imagePath = req.file.filename;
    await patient.user.update({ profileImage: imagePath });

    res.status(200).json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: imagePath,
        imageUrl: `/uploads/patients/${imagePath}`
      }
    });
  } catch (error) {
    console.error('Upload patient image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get patient appointments
// @route   GET /api/patients/:id/appointments
// @access  Private (Admin/Doctor/Patient)
const getPatientAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = '', upcoming = '' } = req.query;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is accessing their own data
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const offset = (page - 1) * limit;
    const whereClause = { patientId: id };

    if (status) {
      whereClause.status = status;
    }

    if (upcoming === 'true') {
      whereClause.appointmentDate = {
        [Op.gte]: new Date().toISOString().split('T')[0]
      };
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            },
            {
              model: Department,
              as: 'department',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get patient prescriptions
// @route   GET /api/patients/:id/prescriptions
// @access  Private (Admin/Doctor/Patient)
const getPatientPrescriptions = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is accessing their own data
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { patientId: id },
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        prescriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get patient invoices
// @route   GET /api/patients/:id/invoices
// @access  Private (Admin/Doctor/Patient)
const getPatientInvoices = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = '' } = req.query;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient not found'
      });
    }

    // Check if user is accessing their own data
    if (req.user.role === 'patient' && req.user.id !== patient.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const offset = (page - 1) * limit;
    const whereClause = { patientId: id };

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: invoices } = await Invoice.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Appointment,
          as: 'appointment',
          include: [
            {
              model: Doctor,
              as: 'doctor',
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['firstName', 'lastName']
                }
              ]
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        invoices,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get patient invoices error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Private (Admin/Doctor)
const searchPatients = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: patients } = await Patient.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone'],
          where: {
            [Op.or]: [
              { firstName: { [Op.iLike]: `%${q}%` } },
              { lastName: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } },
              { phone: { [Op.iLike]: `%${q}%` } }
            ]
          }
        }
      ],
      where: {
        [Op.or]: [
          { patientId: { [Op.iLike]: `%${q}%` } },
          { emergencyContactName: { [Op.iLike]: `%${q}%` } }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        patients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPatients,
  getPatient,
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
};
