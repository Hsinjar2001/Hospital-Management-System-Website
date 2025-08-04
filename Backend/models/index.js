const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Department = require('./Department');
const Appointment = require('./Appointment');
const Prescription = require('./Prescription');
const Invoice = require('./Invoice');
const Review = require('./Review');

// Define associations

// User associations
User.hasOne(Patient, { 
  foreignKey: 'userId', 
  as: 'patient',
  onDelete: 'CASCADE'
});

User.hasOne(Doctor, { 
  foreignKey: 'userId', 
  as: 'doctor',
  onDelete: 'CASCADE'
});

// Patient associations
Patient.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user',
  onDelete: 'CASCADE'
});

Patient.hasMany(Appointment, { 
  foreignKey: 'patientId', 
  as: 'appointments',
  onDelete: 'CASCADE'
});

Patient.hasMany(Prescription, { 
  foreignKey: 'patientId', 
  as: 'prescriptions',
  onDelete: 'CASCADE'
});

Patient.hasMany(Invoice, { 
  foreignKey: 'patientId', 
  as: 'invoices',
  onDelete: 'CASCADE'
});

Patient.hasMany(Review, { 
  foreignKey: 'patientId', 
  as: 'reviews',
  onDelete: 'CASCADE'
});

// Doctor associations
Doctor.belongsTo(User, { 
  foreignKey: 'userId', 
  as: 'user',
  onDelete: 'CASCADE'
});

Doctor.belongsTo(Department, { 
  foreignKey: 'departmentId', 
  as: 'department'
});

Doctor.hasMany(Appointment, { 
  foreignKey: 'doctorId', 
  as: 'appointments',
  onDelete: 'CASCADE'
});

Doctor.hasMany(Prescription, { 
  foreignKey: 'doctorId', 
  as: 'prescriptions',
  onDelete: 'CASCADE'
});

Doctor.hasMany(Invoice, {
  foreignKey: 'doctorId',
  as: 'invoices',
  onDelete: 'CASCADE'
});

Doctor.hasMany(Review, {
  foreignKey: 'doctorId',
  as: 'reviews',
  onDelete: 'CASCADE'
});

// Department associations
Department.hasMany(Doctor, { 
  foreignKey: 'departmentId', 
  as: 'doctors',
  onDelete: 'SET NULL'
});

Department.hasMany(Appointment, { 
  foreignKey: 'departmentId', 
  as: 'appointments',
  onDelete: 'CASCADE'
});

// Appointment associations
Appointment.belongsTo(Patient, { 
  foreignKey: 'patientId', 
  as: 'patient'
});

Appointment.belongsTo(Doctor, { 
  foreignKey: 'doctorId', 
  as: 'doctor'
});

Appointment.belongsTo(Department, { 
  foreignKey: 'departmentId', 
  as: 'department'
});

Appointment.hasOne(Prescription, { 
  foreignKey: 'appointmentId', 
  as: 'prescription',
  onDelete: 'SET NULL'
});

Appointment.hasOne(Invoice, { 
  foreignKey: 'appointmentId', 
  as: 'invoice',
  onDelete: 'SET NULL'
});

// Prescription associations
Prescription.belongsTo(Patient, { 
  foreignKey: 'patientId', 
  as: 'patient'
});

Prescription.belongsTo(Doctor, { 
  foreignKey: 'doctorId', 
  as: 'doctor'
});

Prescription.belongsTo(Appointment, { 
  foreignKey: 'appointmentId', 
  as: 'appointment'
});

// Invoice associations
Invoice.belongsTo(Patient, {
  foreignKey: 'patientId',
  as: 'patient'
});

Invoice.belongsTo(Doctor, {
  foreignKey: 'doctorId',
  as: 'doctor'
});

Invoice.belongsTo(Appointment, {
  foreignKey: 'appointmentId',
  as: 'appointment'
});

// Review associations
Review.belongsTo(Patient, { 
  foreignKey: 'patientId', 
  as: 'patient'
});

Review.belongsTo(Doctor, { 
  foreignKey: 'doctorId', 
  as: 'doctor'
});

Review.belongsTo(Appointment, { 
  foreignKey: 'appointmentId', 
  as: 'appointment'
});

// Export all models and sequelize instance
module.exports = {
  sequelize,
  User,
  Patient,
  Doctor,
  Department,
  Appointment,
  Prescription,
  Invoice,
  Review
};
