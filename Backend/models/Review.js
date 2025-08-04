const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reviewId: {
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
      notEmpty: true
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  visitDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'hidden'),
    allowNull: false,
    defaultValue: 'pending'
  },
  categories: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  aspects: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      professionalism: 0,
      communication: 0,
      bedside_manner: 0,
      wait_time: 0,
      facility_cleanliness: 0,
      overall_experience: 0
    }
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  notHelpfulCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  reportCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  isReported: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reportedReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reportedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  moderatedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  moderatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  moderationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responseFromDoctor: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  responseDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'neutral', 'negative'),
    allowNull: true
  },
  language: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'en'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    {
      fields: ['doctorId', 'reviewDate']
    },
    {
      fields: ['patientId', 'reviewDate']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['status']
    },
    {
      fields: ['isVerified']
    }
  ]
});

// Instance method to get average aspect rating
Review.prototype.getAverageAspectRating = function() {
  if (!this.aspects) return 0;
  const values = Object.values(this.aspects).filter(val => val > 0);
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// Instance method to check if review is positive
Review.prototype.isPositive = function() {
  return this.rating >= 4;
};

// Instance method to check if review is negative
Review.prototype.isNegative = function() {
  return this.rating <= 2;
};

// Instance method to check if review is neutral
Review.prototype.isNeutral = function() {
  return this.rating === 3;
};

// Instance method to get helpful percentage
Review.prototype.getHelpfulPercentage = function() {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return Math.round((this.helpfulCount / total) * 100);
};

// Instance method to check if review is approved
Review.prototype.isApproved = function() {
  return this.status === 'approved';
};

// Instance method to check if review is pending
Review.prototype.isPending = function() {
  return this.status === 'pending';
};

// Instance method to check if review is rejected
Review.prototype.isRejected = function() {
  return this.status === 'rejected';
};

// Instance method to check if review is hidden
Review.prototype.isHidden = function() {
  return this.status === 'hidden';
};

// Instance method to get sentiment based on rating
Review.prototype.getSentiment = function() {
  if (this.rating >= 4) return 'positive';
  if (this.rating <= 2) return 'negative';
  return 'neutral';
};

// Instance method to check if review has doctor response
Review.prototype.hasDoctorResponse = function() {
  return !!this.responseFromDoctor;
};

// Instance method to get time since review
Review.prototype.getTimeSinceReview = function() {
  const reviewDate = new Date(this.reviewDate);
  const now = new Date();
  const diffTime = Math.abs(now - reviewDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

module.exports = Review;
