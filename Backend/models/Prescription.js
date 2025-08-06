const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescriptionId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  appointmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'appointments',
      key: 'id'
    }
  },
  diagnosis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSON,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  refills: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contraindications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sideEffects: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  labTests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  followUpNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isControlled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requiresMonitoring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  monitoringInstructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dietRestrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lifestyleChanges: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  alternativeMedications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  insuranceCoverage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled', 'expired', 'purchased'),
    defaultValue: 'active'
  },
  prescribedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  purchaseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});

module.exports = Prescription;