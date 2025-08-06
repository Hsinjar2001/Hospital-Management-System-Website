const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const User = require('./User');
const Appointment = require('./Appointment');
const Invoice = require('./Invoice');
const Review = require('./Review');
const Prescription = require('./Prescription');

User.hasMany(Appointment, { 
  foreignKey: 'patient_id', 
  as: 'patientAppointments',
  onDelete: 'CASCADE'
});

User.hasMany(Appointment, { 
  foreignKey: 'doctor_id', 
  as: 'doctorAppointments',
  onDelete: 'CASCADE'
});

Appointment.belongsTo(User, { 
  foreignKey: 'patient_id', 
  as: 'patient'
});

Appointment.belongsTo(User, { 
  foreignKey: 'doctor_id', 
  as: 'doctor'
});

User.hasMany(Invoice, { 
  foreignKey: 'patient_id', 
  as: 'patientInvoices',
  onDelete: 'CASCADE'
});

User.hasMany(Invoice, { 
  foreignKey: 'doctor_id', 
  as: 'doctorInvoices',
  onDelete: 'CASCADE'
});

Invoice.belongsTo(User, { 
  foreignKey: 'patient_id', 
  as: 'patient'
});

Invoice.belongsTo(User, { 
  foreignKey: 'doctor_id', 
  as: 'doctor'
});

Appointment.hasOne(Invoice, { 
  foreignKey: 'appointment_id', 
  as: 'invoice',
  onDelete: 'CASCADE'
});

Invoice.belongsTo(Appointment, {
  foreignKey: 'appointment_id',
  as: 'appointment'
});

User.hasMany(Review, { 
  foreignKey: 'patient_id', 
  as: 'patientReviews',
  onDelete: 'CASCADE'
});

User.hasMany(Review, { 
  foreignKey: 'doctor_id', 
  as: 'doctorReviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(User, { 
  foreignKey: 'patient_id', 
  as: 'patient'
});

Review.belongsTo(User, { 
  foreignKey: 'doctor_id', 
  as: 'doctor'
});

Appointment.hasMany(Review, { 
  foreignKey: 'appointment_id', 
  as: 'reviews',
  onDelete: 'CASCADE'
});

Review.belongsTo(Appointment, { 
  foreignKey: 'appointment_id', 
  as: 'appointment'
});

User.hasMany(Prescription, { 
  foreignKey: 'patientId', 
  as: 'patientPrescriptions',
  onDelete: 'CASCADE'
});

User.hasMany(Prescription, { 
  foreignKey: 'doctorId', 
  as: 'doctorPrescriptions',
  onDelete: 'CASCADE'
});

Prescription.belongsTo(User, { 
  foreignKey: 'patientId', 
  as: 'patient'
});

Prescription.belongsTo(User, { 
  foreignKey: 'doctorId', 
  as: 'doctor'
});

Appointment.hasMany(Prescription, { 
  foreignKey: 'appointmentId', 
  as: 'prescriptions',
  onDelete: 'SET NULL'
});

Prescription.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment'
});

module.exports = {
  sequelize,
  User,
  Appointment,
  Invoice,
  Review,
  Prescription
};
