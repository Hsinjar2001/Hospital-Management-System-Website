const { User, Appointment, Invoice, Review } = require('../models');
const { Op } = require('sequelize');

const getAllAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      date = '',
      doctorId = '',
      patientId = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (date) whereClause.appointment_date = date;
    if (doctorId) whereClause.doctorId = doctorId;
    if (patientId) whereClause.patientId = patientId;

    const appointments = await Appointment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty', 'qualification']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        appointments: appointments.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(appointments.count / limit),
          totalItems: appointments.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty', 'qualification', 'experience']
        },
        {
          model: Invoice,
          as: 'invoice'
        },
        {
          model: Review,
          as: 'reviews'
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    res.json({
      status: 'success',
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      appointmentType,
      symptoms,
      notes,
      duration,
      consultationFee
    } = req.body;

    const patient = await User.findOne({ where: { id: patientId, role: 'patient' } });
    const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });

    if (!patient || !doctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid patient or doctor ID'
      });
    }

    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: { [Op.notIn]: ['cancelled', 'completed'] }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available at this time'
      });
    }

    const appointmentId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const appointment = await Appointment.create({
      appointment_id: appointmentId,
      patientId: patientId,
      doctorId: doctorId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      appointment_type: appointmentType || 'consultation',
      symptoms,
      notes,
      duration: duration || 30,
      consultation_fee: consultationFee || 0
    });

    const newAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ]
    });

    res.status(201).json({
      status: 'success',
      data: { appointment: newAppointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    await appointment.update(req.body);

    const updatedAppointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        }
      ]
    });

    res.json({
      status: 'success',
      data: { appointment: updatedAppointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    await appointment.destroy();

    res.json({
      status: 'success',
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date, status } = req.query;

    const whereClause = { doctorId: doctorId };
    if (date) whereClause.appointment_date = date;
    if (status) whereClause.status = status;

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
        }
      ],
      order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
    });

    res.json({
      status: 'success',
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { status } = req.query;

    const whereClause = { patientId: patientId };
    if (status) whereClause.status = status;

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty', 'qualification']
        }
      ],
      order: [['appointment_date', 'DESC'], ['appointment_time', 'DESC']]
    });

    res.json({
      status: 'success',
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctor,
  getAppointmentsByPatient
};
