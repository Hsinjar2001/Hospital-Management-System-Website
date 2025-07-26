// pages/Doctordashboard/ReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Sample reviews data
  const sampleReviews = [
    {
      id: 'REV-001',
      patientName: 'John Doe',
      patientId: 'PAT-001',
      rating: 5,
      comment: 'Dr. Johnson is an excellent cardiologist. Very thorough examination and clear explanation of my condition. Highly recommended!',
      date: '2024-01-20',
      appointmentDate: '2024-01-18',
      replied: false,
      helpful: 12,
      verified: true
    },
    {
      id: 'REV-002',
      patientName: 'Jane Smith',
      patientId: 'PAT-002',
      rating: 4,
      comment: 'Great doctor with good bedside manner. The wait time was a bit long, but the consultation was worth it. Very knowledgeable and professional.',
      date: '2024-01-19',
      appointmentDate: '2024-01-16',
      replied: true,
      reply: {
        text: 'Thank you for your feedback, Jane. I apologize for the wait time and will work to improve our scheduling. I\'m glad you found the consultation helpful.',
        date: '2024-01-19'
      },
      helpful: 8,
      verified: true
    },
    {
      id: 'REV-003',
      patientName: 'Robert Brown',
      patientId: 'PAT-003',
      rating: 5,
      comment: 'Outstanding care! Dr. Johnson took the time to listen to all my concerns and provided comprehensive treatment options. Follow-up care has been excellent.',
      date: '2024-01-17',
      appointmentDate: '2024-01-15',
      replied: false,
      helpful: 15,
      verified: true
    },
    {
      id: 'REV-004',
      patientName: 'Maria Garcia',
      patientId: 'PAT-004',
      rating: 3,
      comment: 'Decent doctor but felt rushed during the appointment. Would have liked more time to discuss treatment options.',
      date: '2024-01-16',
      appointmentDate: '2024-01-14',
      replied: true,
      reply: {
        text: 'Thank you for your honest feedback, Maria. I will ensure to allocate more time for our future appointments to thoroughly address all your concerns.',
        date: '2024-01-16'
      },
      helpful: 5,
      verified: true
    },
    {
      id: 'REV-005',
      patientName: 'David Wilson',
      patientId: 'PAT-005',
      rating: 5,
      comment: 'Exceptional doctor! Very caring and took time to explain everything in detail. The treatment plan has been very effective.',
      date: '2024-01-15',
      appointmentDate: '2024-01-12',
      replied: false,
      helpful: 10,
      verified: true
    },
    {
      id: 'REV-006',
      patientName: 'Lisa Anderson',
      patientId: 'PAT-006',
      rating: 4,
      comment: 'Very professional and knowledgeable. Office staff could be more friendly, but Dr. Johnson is excellent.',
      date: '2024-01-14',
      appointmentDate: '2024-01-11',
      replied: false,
      helpful: 7,
      verified: true
    }
  ];

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setReviews(sampleReviews);
        setFilteredReviews(sampleReviews);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Filter reviews
  useEffect(() => {
    let filtered = reviews;

    if (selectedRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(selectedRating));
    }

    if (selectedPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      if (selectedPeriod !== 'all') {
        filtered = filtered.filter(review => new Date(review.date) >= filterDate);
      }
    }

    setFilteredReviews(filtered);
  }, [reviews, selectedRating, selectedPeriod]);

  // Calculate statistics
  const calculateStats = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : 0;
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    const responseRate = totalReviews > 0 
      ? ((reviews.filter(r => r.replied).length / totalReviews) * 100).toFixed(1)
      : 0;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      responseRate
    };
  };

  const stats = calculateStats();

  // Handle reply submission
  const onSubmitReply = async (data) => {
    try {
      const updatedReviews = reviews.map(review => 
        review.id === selectedReview.id 
          ? {
              ...review,
              replied: true,
              reply: {
                text: data.replyText,
                date: new Date().toISOString().split('T')[0]
              }
            }
          : review
      );

      setReviews(updatedReviews);
      setShowReplyModal(false);
      setSelectedReview(null);
      reset();
      alert('✅ Reply posted successfully!');
      
    } catch (error) {
      console.error('Error posting reply:', error);
      alert('❌ Failed to post reply. Please try again.');
    }
  };

  // Render stars
  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Reviews</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and respond to patient feedback
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className={`text-2xl font-bold ${getRatingColor(stats.averageRating)}`}>
                {stats.averageRating}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ratingDistribution[5]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{rating}</span>
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
                <span className="text-sm text-gray-500 w-12">{percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Rating</label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedRating('all');
                setSelectedPeriod('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">No reviews found matching your criteria.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      {review.patientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{review.patientName}</h3>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                      {review.verified && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Verified Patient
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{review.helpful} helpful</span>
                  {!review.replied && (
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setShowReplyModal(true);
                      }}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>

              {review.replied && review.reply && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 ml-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-green-800">Dr. Johnson replied</span>
                    <span className="text-xs text-green-600">{new Date(review.reply.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-green-700 text-sm">{review.reply.text}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Appointment: {new Date(review.appointmentDate).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Patient ID: {review.patientId}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Reply to Review</h3>
                <button
                  onClick={() => {
                    setShowReplyModal(false);
                    setSelectedReview(null);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{selectedReview.patientName}</span>
                  {renderStars(selectedReview.rating, 'w-4 h-4')}
                </div>
                <p className="text-sm text-gray-700">{selectedReview.comment}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmitReply)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reply <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('replyText', { 
                      required: 'Reply is required',
                      maxLength: {
                        value: 500,
                        message: 'Reply must be 500 characters or less'
                      }
                    })}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Thank you for your feedback..."
                  />
                  {errors.replyText && (
                    <p className="text-red-500 text-sm mt-1">{errors.replyText.message}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Tips for responding:</strong> Be professional, thank the patient for their feedback, 
                    address any concerns mentioned, and invite them to contact you directly if needed.
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowReplyModal(false);
                      setSelectedReview(null);
                      reset();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;
