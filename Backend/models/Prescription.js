const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Prescription = sequelize.define('Prescription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  prescriptionId: {
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
    allowNull: true
  },
  symptoms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  medications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  dosage: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 7, // days
    validate: {
      min: 1,
      max: 365
    }
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  refills: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 10
    }
  },
  refillDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'discontinued', 'expired'),
    allowNull: false,
    defaultValue: 'active'
  },
  prescribedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  contraindications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  sideEffects: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  labTests: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  followUpDate: {
    type: DataTypes.DATEONLY,
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
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  lifestyleChanges: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  alternativeMedications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
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
  patientCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  dispensedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dispensedBy: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pharmacyNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true,
  indexes: [
    {
      fields: ['patientId', 'prescribedDate']
    },
    {
      fields: ['doctorId', 'prescribedDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['expiryDate']
    }
  ]
});

// Instance method to check if prescription is active
Prescription.prototype.isActive = function() {
  return this.status === 'active';
};

// Instance method to check if prescription is expired
Prescription.prototype.isExpired = function() {
  if (!this.expiryDate) return false;
  const today = new Date();
  const expiryDate = new Date(this.expiryDate);
  return expiryDate < today;
};

// Instance method to get total cost
Prescription.prototype.getTotalCost = function() {
  return parseFloat(this.cost || 0);
};

// Instance method to get insurance amount
Prescription.prototype.getInsuranceAmount = function() {
  const total = this.getTotalCost();
  const coverage = parseFloat(this.insuranceCoverage || 0);
  return (total * coverage) / 100;
};

// Instance method to get patient cost
Prescription.prototype.getPatientCost = function() {
  const total = this.getTotalCost();
  const insuranceAmount = this.getInsuranceAmount();
  return total - insuranceAmount;
};

// Instance method to check if prescription needs refill
Prescription.prototype.needsRefill = function() {
  if (this.refills <= 0) return false;
  if (!this.refillDate) return false;
  
  const today = new Date();
  const refillDate = new Date(this.refillDate);
  return refillDate <= today;
};

// Instance method to get medication count
Prescription.prototype.getMedicationCount = function() {
  return this.medications ? this.medications.length : 0;
};

module.exports = Prescription;
