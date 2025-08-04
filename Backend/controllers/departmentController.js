const { Department, Doctor, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      isActive = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { headOfDepartment: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (isActive !== '') {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows: departments } = await Department.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['name', 'ASC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      success: true,
      data: {
        departments,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching departments'
    });
  }
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: 'doctors',
          attributes: ['id', 'doctorId', 'specialty', 'availability', 'status']
        }
      ]
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: { department }
    });
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching department'
    });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      color,
      headOfDepartment,
      contactNumber,
      email,
      location,
      floor,
      roomNumber,
      capacity,
      workingHours,
      services,
      equipment,
      notes
    } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({
      where: { name: { [Op.iLike]: name } }
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        error: 'Department with this name already exists'
      });
    }

    // Create department
    const department = await Department.create({
      name,
      description,
      icon,
      color,
      headOfDepartment,
      contactNumber,
      email,
      location,
      floor,
      roomNumber,
      capacity,
      workingHours,
      services,
      equipment,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department }
    });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating department'
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    // Check if name is being updated and if it conflicts
    if (updateData.name && updateData.name !== department.name) {
      const existingDepartment = await Department.findOne({
        where: {
          name: { [Op.iLike]: updateData.name },
          id: { [Op.ne]: id }
        }
      });

      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          error: 'Department with this name already exists'
        });
      }
    }

    // Update department
    await department.update(updateData);

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: { department }
    });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating department'
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Department not found'
      });
    }

    // Check if department has doctors
    const doctorCount = await Doctor.count({
      where: { departmentId: id }
    });

    if (doctorCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete department with assigned doctors'
      });
    }

    await department.destroy();

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting department'
    });
  }
};

// @desc    Get department statistics
// @route   GET /api/departments/stats
// @access  Private (Admin)
const getDepartmentStats = async (req, res) => {
  try {
    const totalDepartments = await Department.count();
    const activeDepartments = await Department.count({ where: { isActive: true } });
    const totalDoctors = await Doctor.count();
    const activeDoctors = await Doctor.count({ where: { status: 'active' } });

    // Get departments with doctor counts
    const departmentsWithDoctors = await Department.findAll({
      include: [
        {
          model: Doctor,
          as: 'doctors',
          attributes: []
        }
      ],
      attributes: [
        'id',
        'name',
        'isActive',
        [sequelize.fn('COUNT', sequelize.col('doctors.id')), 'doctorCount']
      ],
      group: ['Department.id'],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        totalDepartments,
        activeDepartments,
        totalDoctors,
        activeDoctors,
        departmentsWithDoctors
      }
    });
  } catch (error) {
    console.error('Get department stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching department statistics'
    });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: Doctor,
          as: 'doctors',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['firstName', 'lastName', 'profileImage']
            }
          ],
          where: { status: 'active' },
          required: false
        }
      ]
    });

    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Department not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: department
    });
  } catch (error) {
    console.error('Get department by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Get department doctors
// @route   GET /api/departments/:id/doctors
// @access  Public
const getDepartmentDoctors = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, availability = '' } = req.query;

    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        status: 'error',
        message: 'Department not found'
      });
    }

    const offset = (page - 1) * limit;
    const whereClause = {
      departmentId: id,
      status: 'active'
    };

    if (availability) {
      whereClause.availability = availability;
    }

    const { count, rows: doctors } = await Doctor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'profileImage']
        }
      ],
      order: [['rating', 'DESC'], ['totalReviews', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      status: 'success',
      data: {
        department: department.name,
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
    console.error('Get department doctors error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

// @desc    Search departments
// @route   GET /api/departments/search
// @access  Public
const searchDepartments = async (req, res) => {
  try {
    const { q = '', page = 1, limit = 10 } = req.query;

    if (!q.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: departments } = await Department.findAndCountAll({
      where: {
        [Op.and]: [
          { isActive: true },
          {
            [Op.or]: [
              { name: { [Op.iLike]: `%${q}%` } },
              { description: { [Op.iLike]: `%${q}%` } }
            ]
          }
        ]
      },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          attributes: ['id'],
          where: { status: 'active' },
          required: false
        }
      ],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Add doctor count to each department
    const departmentsWithCount = departments.map(dept => ({
      ...dept.toJSON(),
      doctorCount: dept.doctors ? dept.doctors.length : 0,
      doctors: undefined // Remove the doctors array from response
    }));

    res.status(200).json({
      status: 'success',
      data: {
        departments: departmentsWithCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Search departments error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllDepartments,
  getDepartment,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentDoctors,
  getDepartmentStats,
  searchDepartments
};
