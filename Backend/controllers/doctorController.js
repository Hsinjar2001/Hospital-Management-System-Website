const { User, Doctor, Patient, Department, Appointment, Review } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public/Private
const getAllDoctors = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      department = '',
      specialty = '',
      status = '',
      availability = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { doctorId: { [Op.iLike]: `%${search}%` } },
        { specialty: { [Op.iLike]: `%${search}%` } },
        { licenseNumber: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (department) {
      whereClause.departmentId = department;
    }

    if (specialty) {
      whereClause.specialty = { [Op.iLike]: `%${specialty}%` };
    }

    if (status) {
      whereClause.status = status;
    }

    if (availability) {
      whereClause.availability = availability;
    }

    const { count, rows: doctors } = await Doctor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender', 'profileImage']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description', 'icon', 'color']
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
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching doctors'
    });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public/Private
const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'description', 'icon', 'color']
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: { doctor }
    });
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching doctor'
    });
  }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private (Admin)
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      doctorId,
      departmentId,
      licenseNumber,
      registrationNumber,
      specialty,
      experience,
      consultationFee,
      qualifications,
      employmentType,
      joinDate,
      availability,
      bio,
      languages,
      awards,
      certifications,
      publications,
      researchInterests,
      schedule,
      consultationHours,
      notes
    } = req.body;

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      where: {
        [Op.or]: [
          { doctorId },
          { licenseNumber },
          { userId }
        ]
      }
    });

    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        error: 'Doctor with this ID, license number, or user ID already exists'
      });
    }

    // Create doctor
    const doctor = await Doctor.create({
      userId,
      doctorId,
      departmentId,
      licenseNumber,
      registrationNumber,
      specialty,
      experience,
      consultationFee,
      qualifications,
      employmentType,
      joinDate,
      availability,
      bio,
      languages,
      awards,
      certifications,
      publications,
      researchInterests,
      schedule,
      consultationHours,
      notes
    });

    // Fetch created doctor with associations
    const createdDoctor = await Doctor.findByPk(doctor.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor: createdDoctor }
    });
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating doctor'
    });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin/Doctor)
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    // Update doctor
    await doctor.update(updateData);

    // Fetch updated doctor with associations
    const updatedDoctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone', 'gender']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Doctor updated successfully',
      data: { doctor: updatedDoctor }
    });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating doctor'
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    await doctor.destroy();

    res.json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting doctor'
    });
  }
};

// @desc    Get doctor statistics
// @route   GET /api/doctors/stats
// @access  Private (Admin)
const getDoctorStats = async (req, res) => {
  try {
    const totalDoctors = await Doctor.count();
    const activeDoctors = await Doctor.count({ where: { status: 'active' } });
    const availableDoctors = await Doctor.count({ where: { availability: 'available' } });
    const departments = await Department.count();

    // Get doctors by department
    const doctorsByDepartment = await Doctor.findAll({
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['name']
        }
      ],
      attributes: ['departmentId'],
      group: ['departmentId', 'department.name']
    });

    res.json({
      success: true,
      data: {
        totalDoctors,
        activeDoctors,
        availableDoctors,
        departments,
        doctorsByDepartment
      }
    });
  } catch (error) {
    console.error('Get doctor stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching doctor statistics'
    });
  }
};

// @desc    Get available doctors
// @route   GET /api/doctors/available
// @access  Public
const getAvailableDoctors = async (req, res) => {
  try {
    const { departmentId, date, time } = req.query;

    const whereClause = {
      status: 'active',
      availability: 'available'
    };

    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    const doctors = await Doctor.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email', 'phone']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'description']
        }
      ],
      order: [['rating', 'DESC']]
    });

    res.json({
      success: true,
      data: { doctors }
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching available doctors'
    });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Private (Admin/Doctor/Patient)
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'description', 'icon', 'color']
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctors/profile/:id
// @access  Private (Admin/Doctor)
const getDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
        },
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is accessing their own profile
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.status(200).json({
      status: 'success',
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile/:id
// @access  Private (Admin/Doctor)
const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const doctor = await Doctor.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is updating their own profile
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Separate user data from doctor data
    const userData = {};
    const doctorData = {};

    const userFields = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'address', 'city', 'state', 'zipCode'];

    Object.keys(updateData).forEach(key => {
      if (userFields.includes(key)) {
        userData[key] = updateData[key];
      } else {
        doctorData[key] = updateData[key];
      }
    });

    // Update user data
    if (Object.keys(userData).length > 0) {
      await doctor.user.update(userData);
    }

    // Update doctor data
    if (Object.keys(doctorData).length > 0) {
      await doctor.update(doctorData);
    }

    // Fetch updated doctor
    const updatedDoctor = await Doctor.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
        },
        {
          model: Department,
          as: 'department'
        }
      ]
    });

    res.status(200).json({
      status: 'success',
      message: 'Doctor profile updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Upload doctor profile image
// @route   POST /api/doctors/profile/:id/image
// @access  Private (Admin/Doctor)
const uploadDoctorImage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    const doctor = await Doctor.findByPk(id, {
      include: [{ model: User, as: 'user' }]
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is updating their own profile
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    // Delete old image if exists
    if (doctor.user.profileImage) {
      const oldImagePath = path.join(__dirname, '../uploads/doctors', doctor.user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new image path
    const imagePath = req.file.filename;
    await doctor.user.update({ profileImage: imagePath });

    res.status(200).json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: imagePath,
        imageUrl: `/uploads/doctors/${imagePath}`
      }
    });
  } catch (error) {
    console.error('Upload doctor image error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctor appointments
// @route   GET /api/doctors/:id/appointments
// @access  Private (Admin/Doctor)
const getDoctorAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status = '', date = '' } = req.query;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is accessing their own data
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const offset = (page - 1) * limit;
    const whereClause = { doctorId: id };

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      whereClause.appointmentDate = date;
    }

    const { count, rows: appointments } = await Appointment.findAndCountAll({
      where: whereClause,
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
          model: Department,
          as: 'department',
          attributes: ['name']
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
    console.error('Get doctor appointments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctor schedule
// @route   GET /api/doctors/:id/schedule
// @access  Private (Admin/Doctor/Patient)
const getDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      attributes: ['id', 'schedule', 'consultationHours', 'availability']
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        schedule: doctor.schedule,
        consultationHours: doctor.consultationHours,
        availability: doctor.availability
      }
    });
  } catch (error) {
    console.error('Get doctor schedule error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Update doctor schedule
// @route   PUT /api/doctors/:id/schedule
// @access  Private (Admin/Doctor)
const updateDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedule, consultationHours } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is updating their own schedule
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const updateData = {};
    if (schedule) updateData.schedule = schedule;
    if (consultationHours) updateData.consultationHours = consultationHours;

    await doctor.update(updateData);

    res.status(200).json({
      status: 'success',
      message: 'Doctor schedule updated successfully',
      data: {
        schedule: doctor.schedule,
        consultationHours: doctor.consultationHours
      }
    });
  } catch (error) {
    console.error('Update doctor schedule error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctor availability
// @route   GET /api/doctors/:id/availability
// @access  Private (Admin/Doctor/Patient)
const getDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findByPk(id, {
      attributes: ['id', 'availability', 'schedule', 'consultationHours']
    });

    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Get appointments for the specified date if provided
    let bookedSlots = [];
    if (date) {
      const appointments = await Appointment.findAll({
        where: {
          doctorId: id,
          appointmentDate: date,
          status: ['scheduled', 'confirmed', 'in-progress']
        },
        attributes: ['appointmentTime']
      });
      bookedSlots = appointments.map(apt => apt.appointmentTime);
    }

    res.status(200).json({
      status: 'success',
      data: {
        availability: doctor.availability,
        schedule: doctor.schedule,
        consultationHours: doctor.consultationHours,
        bookedSlots: bookedSlots
      }
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private (Admin/Doctor)
const updateDoctorAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { availability } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    // Check if user is updating their own availability
    if (req.user.role === 'doctor' && req.user.id !== doctor.userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await doctor.update({ availability });

    res.status(200).json({
      status: 'success',
      message: 'Doctor availability updated successfully',
      data: {
        availability: doctor.availability
      }
    });
  } catch (error) {
    console.error('Update doctor availability error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctor reviews
// @route   GET /api/doctors/:id/reviews
// @access  Private (Admin/Doctor/Patient)
const getDoctorReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor not found'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { doctorId: id },
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
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get doctor reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Search doctors
// @route   GET /api/doctors/search
// @access  Public
const searchDoctors = async (req, res) => {
  try {
    const { q = '', specialty = '', department = '', page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status: 'active' };

    if (specialty) {
      whereClause.specialty = { [Op.iLike]: `%${specialty}%` };
    }

    const includeClause = [
      {
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email', 'phone', 'profileImage'],
        where: q ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${q}%` } },
            { lastName: { [Op.iLike]: `%${q}%` } }
          ]
        } : {}
      },
      {
        model: Department,
        as: 'department',
        attributes: ['id', 'name', 'icon', 'color'],
        where: department ? { name: { [Op.iLike]: `%${department}%` } } : {}
      }
    ];

    const { count, rows: doctors } = await Doctor.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get doctors by department
// @route   GET /api/doctors/department/:departmentId
// @access  Public
const getDoctorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: doctors } = await Doctor.findAndCountAll({
      where: {
        departmentId: departmentId,
        status: 'active',
        availability: 'available'
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'profileImage']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['name', 'icon', 'color']
        }
      ],
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get doctors by department error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctor,
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
  getDoctorsByDepartment,
  getDoctorStats,
  getAvailableDoctors
};
