const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  appointmentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'patients',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'doctors',
      key: 'id'
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
  appointmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  appointmentTime: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  appointmentType: {
    type: DataTypes.ENUM('consultation', 'follow-up', 'emergency', 'routine', 'surgery', 'procedure'),
    allowNull: false,
    defaultValue: 'consultation'
  },
  patientType: {
    type: DataTypes.ENUM('new', 'existing', 'emergency'),
    allowNull: false,
    defaultValue: 'existing'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'normal'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'),
    allowNull: false,
    defaultValue: 'scheduled'
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 30, // minutes
    validate: {
      min: 15,
      max: 240
    }
  },
  consultationFee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'waived'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'insurance', 'online', 'other'),
    allowNull: true
  },
  insuranceCoverage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  insuranceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  patientAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  followUpNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.ENUM('patient', 'doctor', 'admin', 'system'),
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  indexes: [
    {
      fields: ['appointmentDate', 'appointmentTime']
    },
    {
      fields: ['doctorId', 'appointmentDate']
    },
    {
      fields: ['patientId', 'appointmentDate']
    },
    {
      fields: ['status']
    }
  ]
});

// Instance method to get appointment datetime
Appointment.prototype.getAppointmentDateTime = function() {
  return new Date(`${this.appointmentDate}T${this.appointmentTime}`);
};

// Instance method to check if appointment is today
Appointment.prototype.isToday = function() {
  const today = new Date().toDateString();
  const appointmentDate = new Date(this.appointmentDate).toDateString();
  return today === appointmentDate;
};

// Instance method to check if appointment is in the past
Appointment.prototype.isPast = function() {
  const now = new Date();
  const appointmentDateTime = this.getAppointmentDateTime();
  return appointmentDateTime < now;
};

// Instance method to check if appointment is upcoming
Appointment.prototype.isUpcoming = function() {
  const now = new Date();
  const appointmentDateTime = this.getAppointmentDateTime();
  return appointmentDateTime > now;
};

// Instance method to get total amount
Appointment.prototype.getTotalAmount = function() {
  return parseFloat(this.consultationFee || 0);
};

// Instance method to get insurance amount
Appointment.prototype.getInsuranceAmount = function() {
  const total = this.getTotalAmount();
  const coverage = parseFloat(this.insuranceCoverage || 0);
  return (total * coverage) / 100;
};

// Instance method to get patient amount
Appointment.prototype.getPatientAmount = function() {
  const total = this.getTotalAmount();
  const insuranceAmount = this.getInsuranceAmount();
  return total - insuranceAmount;
};

// Instance method to check if appointment can be cancelled
Appointment.prototype.canBeCancelled = function() {
  const allowedStatuses = ['scheduled', 'confirmed'];
  const appointmentDateTime = this.getAppointmentDateTime();
  const now = new Date();
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  
  return allowedStatuses.includes(this.status) && hoursUntilAppointment > 24;
};

module.exports = Appointment;
