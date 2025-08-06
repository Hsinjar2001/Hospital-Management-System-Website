const User = require('../models/User');

const getAllPatients = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: users } = await User.findAndCountAll({
      where: {
        role: 'patient'
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'role',
        'isActive',
        'specialty',
        'experience',
        'qualification',
        'dateOfBirth',
        'gender',
        'address',
        'emergencyContact',
        'createdAt',
        'updatedAt'
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching patients'
    });
  }
};

const getPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({
      where: {
        id: req.params.id,
        role: 'patient'
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user: patient }
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching patient'
    });
  }
};

const createPatient = async (req, res) => {
  try {
    const patientData = {
      ...req.body,
      role: 'patient'
    };

    const patient = await User.create(patientData);

    res.status(201).json({
      success: true,
      data: { user: patient }
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating patient'
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const patient = await User.findOne({
      where: {
        id: req.params.id,
        role: 'patient'
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    await patient.update(req.body);

    res.status(200).json({
      success: true,
      data: { user: patient }
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating patient'
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const patient = await User.findOne({
      where: {
        id: req.params.id,
        role: 'patient'
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }

    await patient.destroy();

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting patient'
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
