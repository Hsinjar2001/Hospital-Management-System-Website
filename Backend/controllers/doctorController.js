const { User } = require('../models');
const { Op } = require('sequelize');

const getAllDoctors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, availability } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      role: 'doctor'
    };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const doctors = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['firstName', 'ASC']]
    });

    const totalPages = Math.ceil(doctors.count / limit);

    res.json({
      status: 'success',
      data: {
        doctors: doctors.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: doctors.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctors'
    });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await User.findOne({
      where: { 
        id,
        role: 'doctor'
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'createdAt']
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        doctor
      }
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctor'
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById
};
