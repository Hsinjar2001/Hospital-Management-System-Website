const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Doctor = sequelize.define('Doctor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departments',
      key: 'id'
    }
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  registrationNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 50
    }
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  employmentType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'visiting'),
    allowNull: false,
    defaultValue: 'full-time'
  },
  joinDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  availability: {
    type: DataTypes.ENUM('available', 'unavailable', 'on-leave', 'busy'),
    allowNull: false,
    defaultValue: 'available'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  languages: {
    type: DataTypes.STRING,
    allowNull: true
  },
  awards: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  publications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  researchInterests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  schedule: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      monday: { start: '09:00', end: '17:00', isAvailable: true },
      tuesday: { start: '09:00', end: '17:00', isAvailable: true },
      wednesday: { start: '09:00', end: '17:00', isAvailable: true },
      thursday: { start: '09:00', end: '17:00', isAvailable: true },
      friday: { start: '09:00', end: '17:00', isAvailable: true },
      saturday: { start: '09:00', end: '13:00', isAvailable: true },
      sunday: { start: '09:00', end: '13:00', isAvailable: false }
    }
  },
  consultationHours: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      duration: 30, // minutes
      breakTime: 15, // minutes
      maxPatientsPerDay: 20
    }
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended', 'retired'),
    allowNull: false,
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'doctors',
  timestamps: true
});

// Instance method to get full name
Doctor.prototype.getFullName = function() {
  if (this.User) {
    return this.User.getFullName();
  }
  return 'Unknown Doctor';
};

// Instance method to get average rating
Doctor.prototype.getAverageRating = function() {
  if (this.totalReviews === 0) return 0;
  return parseFloat(this.rating || 0);
};

// Instance method to check if doctor is available
Doctor.prototype.isAvailable = function() {
  return this.availability === 'available' && this.status === 'active';
};

// Instance method to get experience in years
Doctor.prototype.getExperienceInYears = function() {
  if (!this.joinDate) return this.experience || 0;
  const joinDate = new Date(this.joinDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - joinDate);
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
};

module.exports = Doctor;
