const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoiceId: {
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
    allowNull: true,
    field: 'doctor_id',
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
  prescriptionId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'prescriptions',
      key: 'id'
    }
  },
  invoiceDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  discountPercentage: {
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
    defaultValue: 0.00,
    validate: {
      min: 0
    }
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
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  paidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  balanceAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled', 'refunded'),
    allowNull: false,
    defaultValue: 'draft'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'check', 'bank_transfer', 'insurance', 'online', 'other'),
    allowNull: true
  },
  paymentDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  billingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  recurringFrequency: {
    type: DataTypes.ENUM('weekly', 'monthly', 'quarterly', 'yearly'),
    allowNull: true
  },
  nextBillingDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  reminderSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  overdueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lateFees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  lateFeeRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  refundDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  refundReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancelledAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelledBy: {
    type: DataTypes.ENUM('patient', 'doctor', 'admin', 'system'),
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  indexes: [
    {
      fields: ['patientId', 'invoiceDate']
    },
    {
      fields: ['doctorId', 'invoiceDate']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['dueDate']
    }
  ]
});

// Instance method to calculate total amount
Invoice.prototype.calculateTotal = function() {
  const subtotal = parseFloat(this.subtotal || 0);
  const taxAmount = parseFloat(this.taxAmount || 0);
  const discountAmount = parseFloat(this.discountAmount || 0);
  const insuranceAmount = parseFloat(this.insuranceAmount || 0);
  
  return subtotal + taxAmount - discountAmount - insuranceAmount;
};

// Instance method to calculate balance
Invoice.prototype.calculateBalance = function() {
  const total = this.calculateTotal();
  const paid = parseFloat(this.paidAmount || 0);
  return Math.max(0, total - paid);
};

// Instance method to check if invoice is overdue
Invoice.prototype.isOverdue = function() {
  if (!this.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  return dueDate < today && this.paymentStatus !== 'paid';
};

// Instance method to check if invoice is paid
Invoice.prototype.isPaid = function() {
  return this.paymentStatus === 'paid' || this.balanceAmount <= 0;
};

// Instance method to check if invoice is partially paid
Invoice.prototype.isPartiallyPaid = function() {
  const total = this.calculateTotal();
  const paid = parseFloat(this.paidAmount || 0);
  return paid > 0 && paid < total;
};

// Instance method to get days overdue
Invoice.prototype.getDaysOverdue = function() {
  if (!this.isOverdue()) return 0;
  const today = new Date();
  const dueDate = new Date(this.dueDate);
  const diffTime = Math.abs(today - dueDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Instance method to calculate late fees
Invoice.prototype.calculateLateFees = function() {
  if (!this.isOverdue()) return 0;
  const daysOverdue = this.getDaysOverdue();
  const balance = this.calculateBalance();
  const rate = parseFloat(this.lateFeeRate || 0) / 100;
  return balance * rate * daysOverdue;
};

// Instance method to get payment percentage
Invoice.prototype.getPaymentPercentage = function() {
  const total = this.calculateTotal();
  if (total === 0) return 100;
  const paid = parseFloat(this.paidAmount || 0);
  return Math.round((paid / total) * 100);
};

module.exports = Invoice;
