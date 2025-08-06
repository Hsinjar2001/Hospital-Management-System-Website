const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_approved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  review_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    {
      fields: ['patient_id']
    },
    {
      fields: ['doctor_id']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['review_date']
    }
  ]
});

Review.prototype.getRatingStars = function() {
  return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
};

Review.prototype.isRecent = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(this.review_date) > thirtyDaysAgo;
};

module.exports = Review;