const { User, Patient, Doctor, Prescription } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
const getAllPrescriptions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      patientId = '',
      doctorId = '',
      isUrgent = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Role-based filtering
    if (req.user.role === 'patient') {
      // Patients can only see their own prescriptions
      const patient = await Patient.findOne({ where: { userId: req.user.id } });
      if (!patient) {
        return res.status(404).json({
          success: false,
          error: 'Patient profile not found'
        });
      }
      whereClause.patientId = patient.id;
    } else if (req.user.role === 'doctor') {
      // Doctors can only see their own prescriptions
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          error: 'Doctor profile not found'
        });
      }
      whereClause.doctorId = doctor.id;
    }
    // Admin can see all prescriptions (no additional filtering)

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { prescriptionId: { [Op.iLike]: `%${search}%` } },
        { diagnosis: { [Op.iLike]: `%${search}%` } },
        { symptoms: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) {
      whereClause.status = status;
    }

    if (patientId && req.user.role === 'admin') {
      whereClause.patientId = patientId;
    }

    if (doctorId && (req.user.role === 'admin' || req.user.role === 'doctor')) {
      whereClause.doctorId = doctorId;
    }

    if (isUrgent !== '') {
      whereClause.isUrgent = isUrgent === 'true';
    }

    // Simplified query without complex associations to avoid errors
    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['prescribedDate', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all prescriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching prescriptions'
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { exclude: ['password'] }
            }
          ]
        }
      ]
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription not found'
      });
    }

    res.json({
      success: true,
      data: { prescription }
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching prescription'
    });
  }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
const createPrescription = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      symptoms,
      medications,
      dosage,
      instructions,
      duration,
      frequency,
      quantity,
      refills,
      notes,
      allergies,
      contraindications,
      sideEffects,
      labTests,
      followUpDate,
      followUpNotes,
      isUrgent,
      isControlled,
      requiresMonitoring,
      monitoringInstructions,
      dietRestrictions,
      lifestyleChanges,
      alternativeMedications,
      cost,
      insuranceCoverage
    } = req.body;

    // Generate prescription ID
    const prescriptionId = `PRESC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create prescription
    const prescription = await Prescription.create({
      prescriptionId,
      patientId,
      doctorId,
      appointmentId,
      diagnosis,
      symptoms,
      medications,
      dosage,
      instructions,
      duration,
      frequency,
      quantity,
      refills,
      notes,
      allergies,
      contraindications,
      sideEffects,
      labTests,
      followUpDate,
      followUpNotes,
      isUrgent,
      isControlled,
      requiresMonitoring,
      monitoringInstructions,
      dietRestrictions,
      lifestyleChanges,
      alternativeMedications,
      cost,
      insuranceCoverage
    });

    // Fetch created prescription with associations
    const createdPrescription = await Prescription.findByPk(prescription.id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription: createdPrescription }
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating prescription'
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription not found'
      });
    }

    // Update prescription
    await prescription.update(updateData);

    // Fetch updated prescription with associations
    const updatedPrescription = await Prescription.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Prescription updated successfully',
      data: { prescription: updatedPrescription }
    });
  } catch (error) {
    console.error('Update prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating prescription'
    });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (Doctor)
const deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription not found'
      });
    }

    await prescription.destroy();

    res.json({
      success: true,
      message: 'Prescription deleted successfully'
    });
  } catch (error) {
    console.error('Delete prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting prescription'
    });
  }
};

// @desc    Get prescription statistics
// @route   GET /api/prescriptions/stats
// @access  Private (Admin/Doctor)
const getPrescriptionStats = async (req, res) => {
  try {
    const totalPrescriptions = await Prescription.count();
    const activePrescriptions = await Prescription.count({ where: { status: 'active' } });
    const urgentPrescriptions = await Prescription.count({ where: { isUrgent: true } });
    const controlledPrescriptions = await Prescription.count({ where: { isControlled: true } });

    // Get prescriptions by status
    const prescriptionsByStatus = await Prescription.findAll({
      attributes: ['status'],
      group: ['status'],
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalPrescriptions,
        activePrescriptions,
        urgentPrescriptions,
        controlledPrescriptions,
        prescriptionsByStatus
      }
    });
  } catch (error) {
    console.error('Get prescription stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching prescription statistics'
    });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private (Admin/Doctor/Patient)
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
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
    });

    if (!prescription) {
      return res.status(404).json({
        status: 'error',
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: prescription
    });
  } catch (error) {
    console.error('Get prescription by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get prescriptions by patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Admin/Doctor/Patient)
const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { patientId: patientId },
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
    console.error('Get prescriptions by patient error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get prescriptions by doctor
// @route   GET /api/prescriptions/doctor/:doctorId
// @access  Private (Admin/Doctor)
const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { doctorId: doctorId },
      include: [
        {
          model: Patient,
          as: 'patient',
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
    console.error('Get prescriptions by doctor error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Search prescriptions
// @route   GET /api/prescriptions/search
// @access  Private (Admin/Doctor)
const searchPrescriptions = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: {
        [Op.or]: [
          { prescriptionId: { [Op.iLike]: `%${q}%` } },
          { diagnosis: { [Op.iLike]: `%${q}%` } },
          { symptoms: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName']
            }
          ]
        },
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
    console.error('Search prescriptions error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllPrescriptions,
  getPrescription,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
  searchPrescriptions,
  getPrescriptionStats
};
