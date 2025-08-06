const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
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
  appointment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'appointments',
      key: 'id'
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  paid_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  due_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'overdue', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'insurance', 'online', 'bank_transfer', 'other'),
    allowNull: true
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  paid_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  indexes: [
    {
      fields: ['invoice_number']
    },
    {
      fields: ['patient_id']
    },
    {
      fields: ['doctor_id']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['invoice_date']
    }
  ]
});

Invoice.prototype.calculateDueAmount = function() {
  return parseFloat(this.total_amount) - parseFloat(this.paid_amount);
};

Invoice.prototype.isOverdue = function() {
  if (!this.due_date) return false;
  const today = new Date();
  const dueDate = new Date(this.due_date);
  return today > dueDate && this.payment_status !== 'paid';
};

Invoice.prototype.markAsPaid = function() {
  this.paid_amount = this.total_amount;
  this.due_amount = 0;
  this.payment_status = 'paid';
  this.paid_date = new Date().toISOString().split('T')[0];
};

module.exports = Invoice;