const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  appointment_id: {
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
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  appointment_time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  appointment_type: {
    type: DataTypes.ENUM('consultation', 'follow-up', 'emergency', 'routine', 'surgery', 'procedure'),
    allowNull: false,
    defaultValue: 'consultation'
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
    defaultValue: 30,
    validate: {
      min: 15,
      max: 240
    }
  },
  consultation_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  indexes: [
    {
      fields: ['appointment_date']
    },
    {
      fields: ['patient_id']
    },
    {
      fields: ['doctor_id']
    },
    {
      fields: ['status']
    }
  ]
});

Appointment.prototype.getAppointmentDateTime = function() {
  return `${this.appointment_date} ${this.appointment_time}`;
};

Appointment.prototype.isToday = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.appointment_date === today;
};

Appointment.prototype.isPast = function() {
  const now = new Date();
  const appointmentDateTime = new Date(`${this.appointment_date}T${this.appointment_time}`);
  return appointmentDateTime < now;
};

Appointment.prototype.isUpcoming = function() {
  const now = new Date();
  const appointmentDateTime = new Date(`${this.appointment_date}T${this.appointment_time}`);
  return appointmentDateTime > now;
};

module.exports = Appointment;