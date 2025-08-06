const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, specialty, experience, qualification, dateOfBirth, gender, address, emergencyContact } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'patient',
      specialty,
      experience,
      qualification,
      dateOfBirth,
      gender,
      address,
      emergencyContact
    });

    const token = generateToken(user.id);

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          specialty: user.specialty,
          experience: user.experience,
          qualification: user.qualification
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated'
      });
    }

    const token = generateToken(user.id);

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          specialty: user.specialty,
          experience: user.experience,
          qualification: user.qualification
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, specialty, experience, qualification, dateOfBirth, gender, address, emergencyContact } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      specialty: specialty || user.specialty,
      experience: experience || user.experience,
      qualification: qualification || user.qualification,
      dateOfBirth: dateOfBirth || user.dateOfBirth,
      gender: gender || user.gender,
      address: address || user.address,
      emergencyContact: emergencyContact || user.emergencyContact
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'Role parameter is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: users } = await User.findAndCountAll({
      where: { role },
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get users by role error:', error);
    res.status(500).json({
      success: false,
      error: 'Error getting users by role'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getUsersByRole
};