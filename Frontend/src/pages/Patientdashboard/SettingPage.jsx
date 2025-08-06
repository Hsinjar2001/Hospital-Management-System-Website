import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { usersAPI } from '../../services/api';

const SettingPage = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  // Watch form values for debugging
  const watchedValues = watch();
  console.log('Current form values:', watchedValues);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user data from localStorage first
      const storedUser = localStorage.getItem('hospitalUser') || sessionStorage.getItem('hospitalUser');
      if (storedUser) {
        let user;
        try {
          user = JSON.parse(storedUser);
          console.log('Loaded user data from localStorage:', user);
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // If parsing fails, try to get from API
          const response = await usersAPI.getProfile();
          if (response.success) {
            user = response.data.user;
            console.log('Loaded user data from API:', user);
          }
        }

        if (user) {
          setUserData(user);
          
          // Populate form fields with user data
          setValue('firstName', user.firstName || user.first_name || '');
          setValue('lastName', user.lastName || user.last_name || '');
          setValue('email', user.email || '');
          setValue('phone', user.phone || '');
          
          console.log('Form populated with:', {
            firstName: user.firstName || user.first_name || '',
            lastName: user.lastName || user.last_name || '',
            email: user.email || '',
            phone: user.phone || ''
          });
        } else {
          console.log('No user data found');
        }
      } else {
        console.log('No stored user data found in localStorage or sessionStorage');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const updateData = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone
      };

      const response = await usersAPI.updateProfile(updateData);

      if (response.success) {
        const storedUser = localStorage.getItem('hospitalUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const updatedUser = { ...user, ...updateData };
          localStorage.setItem('hospitalUser', JSON.stringify(updatedUser));
        }
        setUserData(prev => ({ ...prev, ...updateData }));
        alert('✅ Profile updated successfully!');
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`❌ ${error.message || 'Failed to update profile. Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Update your personal information</p>
            
            {/* Debug section - remove this after fixing */}
            {userData && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <p><strong>Loaded Data:</strong> firstName: {userData.firstName || 'N/A'}, lastName: {userData.lastName || 'N/A'}, email: {userData.email || 'N/A'}, phone: {userData.phone || 'N/A'}</p>
                <p><strong>Form Values:</strong> firstName: {watchedValues.firstName || 'N/A'}, lastName: {watchedValues.lastName || 'N/A'}, email: {watchedValues.email || 'N/A'}, phone: {watchedValues.phone || 'N/A'}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Invalid phone number'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
