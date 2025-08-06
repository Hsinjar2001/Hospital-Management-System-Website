const { User, Prescription, Appointment } = require('../models');
const { Op } = require('sequelize');

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

    if (req.user && req.user.role === 'patient') {
      whereClause.patientId = req.user.id;
    } else if (req.user && req.user.role === 'doctor') {
      whereClause.doctorId = req.user.id;
    }

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

    if (patientId && req.user && req.user.role === 'admin') {
      whereClause.patientId = patientId;
    }

    if (doctorId && req.user && (req.user.role === 'admin' || req.user.role === 'doctor')) {
      whereClause.doctorId = doctorId;
    }

    if (isUrgent !== '') {
      whereClause.isUrgent = isUrgent === 'true';
    }

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'patient',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'doctor',
          attributes: { exclude: ['password'] }
        }
      ]
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

const getPrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findByPk(id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'doctor',
          attributes: { exclude: ['password'] }
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

    const prescriptionId = `PRESC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const finalDoctorId = req.user && req.user.role === 'doctor' ? req.user.id : doctorId;

    if (!finalDoctorId) {
      return res.status(400).json({
        success: false,
        error: 'Doctor ID is required. Please ensure you are logged in as a doctor or provide a valid doctorId.'
      });
    }

    const prescription = await Prescription.create({
      prescriptionId,
      patientId,
      doctorId: finalDoctorId,
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
      insuranceCoverage,
      status: 'active',
      prescribedDate: new Date()
    });

    const createdPrescription = await Prescription.findByPk(prescription.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'doctor',
          attributes: { exclude: ['password'] }
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

    await prescription.update(updateData);

    const updatedPrescription = await Prescription.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: { exclude: ['password'] }
          }]
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

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { patientId: patientId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
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
      success: false,
      error: 'Internal server error'
    });
  }
};

const getPrescriptionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findByPk(userId);
    if (!user || user.role !== 'patient') {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { patientId: userId },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
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
    console.error('Get prescriptions by user ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

const getPrescriptionsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: { doctorId: doctorId },
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
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
      success: false,
      error: 'Internal server error'
    });
  }
};

const searchPrescriptions = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: prescriptions } = await Prescription.findAndCountAll({
      where: {
        [Op.or]: [
          { prescriptionId: { [Op.iLike]: `%${q}%` } },
          { diagnosis: { [Op.iLike]: `%${q}%` } },
          { symptoms: { [Op.iLike]: `%${q}%` } },
          { medications: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [
        {
          model: Patient,
          as: 'patient',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
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
      success: false,
      error: 'Internal server error'
    });
  }
};

const purchasePrescription = async (req, res) => {
  try {
    const { id } = req.params;
    const { purchaseData } = req.body;

    const prescription = await Prescription.findByPk(id);
    if (!prescription) {
      return res.status(404).json({
        success: false,
        error: 'Prescription not found'
      });
    }

    await prescription.update({
      status: 'purchased',
      purchaseDate: new Date(),
      ...purchaseData
    });

    res.json({
      success: true,
      message: 'Prescription purchased successfully',
      data: { prescription }
    });
  } catch (error) {
    console.error('Purchase prescription error:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing prescription purchase'
    });
  }
};

module.exports = {
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
};
