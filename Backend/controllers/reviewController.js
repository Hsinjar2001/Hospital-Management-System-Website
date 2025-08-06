const { User, Appointment, Review } = require('../models');
const { Op } = require('sequelize');

const getAllReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      rating = '',
      doctorId = '',
      is_approved = ''
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (rating) whereClause.rating = rating;
    if (doctorId) whereClause.doctorId = doctorId;
    if (is_approved !== '') whereClause.is_approved = is_approved === 'true';

    if (search) {
      whereClause[Op.or] = [
        { comment: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const reviews = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        },
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['id', 'appointment_id', 'appointment_date']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['review_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        reviews: reviews.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(reviews.count / limit),
          totalItems: reviews.count,
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

const getReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        },
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['id', 'appointment_id', 'appointment_date', 'appointment_time']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.json({
      status: 'success',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createReview = async (req, res) => {
  try {
    const {
      patient_id,
      doctor_id,
      appointment_id,
      rating,
      comment,
      is_anonymous = false
    } = req.body;

    const patient = await User.findOne({ where: { id: patient_id, role: 'patient' } });
    const doctor = await User.findOne({ where: { id: doctor_id, role: 'doctor' } });

    if (!patient || !doctor) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid patient or doctor ID'
      });
    }

    if (appointment_id) {
      const appointment = await Appointment.findByPk(appointment_id);
      if (!appointment) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid appointment ID'
        });
      }

      const existingReview = await Review.findOne({
        where: {
          patient_id,
          doctor_id,
          appointment_id
        }
      });

      if (existingReview) {
        return res.status(400).json({
          status: 'error',
          message: 'Review already exists for this appointment'
        });
      }
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    const review = await Review.create({
      patient_id,
      doctor_id,
      appointment_id,
      rating,
      comment,
      is_anonymous
    });

    const newReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName']
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
      data: { review: newReview }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    if (req.body.rating && (req.body.rating < 1 || req.body.rating > 5)) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    await review.update(req.body);

    const updatedReview = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName']
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
      data: { review: updatedReview }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.destroy();

    res.json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const approveReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    await review.update({ is_approved: true });

    const updatedReview = await Review.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName']
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
      data: { review: updatedReview }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getReviewsByDoctor = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { page = 1, limit = 10, is_approved = 'true' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { doctor_id };
    if (is_approved !== '') whereClause.is_approved = is_approved === 'true';

    const reviews = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['review_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        reviews: reviews.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(reviews.count / limit),
          totalItems: reviews.count,
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

const getReviewsByPatient = async (req, res) => {
  try {
    const { patient_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { patient_id },
      include: [
        {
          model: User,
          as: 'doctor',
          attributes: ['id', 'firstName', 'lastName', 'specialty']
        },
        {
          model: Appointment,
          as: 'appointment',
          attributes: ['id', 'appointment_id', 'appointment_date']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['review_date', 'DESC']]
    });

    res.json({
      status: 'success',
      data: {
        reviews: reviews.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(reviews.count / limit),
          totalItems: reviews.count,
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

module.exports = {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getReviewsByDoctor,
  getReviewsByPatient
};