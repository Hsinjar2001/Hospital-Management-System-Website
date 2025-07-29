// Component/forms/DoctorForm.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const DoctorForm = ({ 
  onSubmit, 
  initialData = null,
  loading = false,
  departments = [],
  specialties = [],
  className = '',
  mode = 'create' // 'create' or 'edit'
}) => {
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.profileImage || null);
  const [formStep, setFormStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch, 
    setValue,
    getValues 
  } = useForm({
    defaultValues: initialData || {
      status: 'active',
      gender: '',
      employmentType: 'full-time',
      consultationFee: 0,
      experience: 0,
      department: '',
      specialty: '',
      availability: 'available'
    }
  });

  // Watch form values for dynamic updates
  const watchedValues = watch();

  // Sample data (replace with actual data from props or API)
  const defaultDepartments = departments.length > 0 ? departments : [
    { id: 'cardiology', name: 'Cardiology', icon: '❤️' },
    { id: 'neurology', name: 'Neurology', icon: '🧠' },
    { id: 'orthopedics', name: 'Orthopedics', icon: '🦴' },
    { id: 'pediatrics', name: 'Pediatrics', icon: '👶' },
    { id: 'dermatology', name: 'Dermatology', icon: '🌟' },
    { id: 'gynecology', name: 'Gynecology', icon: '👩‍⚕️' },
    { id: 'internal-medicine', name: 'Internal Medicine', icon: '🏥' },
    { id: 'psychiatry', name: 'Psychiatry', icon: '🧘‍♂️' },
    { id: 'radiology', name: 'Radiology', icon: '📸' },
    { id: 'anesthesiology', name: 'Anesthesiology', icon: '💉' }
  ];

  const defaultSpecialties = specialties.length > 0 ? specialties : [
    'General Practitioner',
    'Cardiologist',
    'Neurologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Dermatologist',
    'Gynecologist',
    'Psychiatrist',
    'Radiologist',
    'Anesthesiologist',
    'Oncologist',
    'Urologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Pulmonologist',
    'Gastroenterologist',
    'Endocrinologist',
    'Nephrologist',
    'Rheumatologist',
    'Emergency Medicine'
  ];

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  // Form validation
  const validateForm = (data) => {
    const errors = {};
    
    // Basic validation
    if (!data.firstName?.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!data.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!data.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!data.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!data.licenseNumber?.trim()) {
      errors.licenseNumber = 'License number is required';
    }
    
    if (!data.department) {
      errors.department = 'Department is required';
    }
    
    if (!data.specialty) {
      errors.specialty = 'Specialty is required';
    }

    return errors;
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add all form fields
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    
    // Add profile image if exists
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    
    // Add additional data
    const additionalData = {
      doctorId: mode === 'create' ? `DOC-${Date.now()}` : initialData?.doctorId,
      createdAt: mode === 'create' ? new Date().toISOString() : initialData?.createdAt,
      updatedAt: new Date().toISOString(),
      profileImage: profileImage
    };

    // Merge with form data
    const finalData = {
      ...data,
      ...additionalData
    };

    onSubmit(finalData);
  };

  // Navigation between steps
  const nextStep = () => {
    if (formStep < 4) setFormStep(formStep + 1);
  };

  const prevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  // Step indicator
  const steps = [
    { id: 1, name: 'Basic Info', icon: '👤' },
    { id: 2, name: 'Professional', icon: '🏥' },
    { id: 3, name: 'Contact', icon: '📞' },
    { id: 4, name: 'Additional', icon: '📋' }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      
      {/* Form Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {mode === 'create' ? 'Add New Doctor' : 'Edit Doctor Information'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {mode === 'create' 
            ? 'Fill in the details below to add a new doctor to the system'
            : 'Update the doctor information below'
          }
        </p>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                formStep >= step.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {formStep > step.id ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">{step.name}</span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
        
        {/* Step 1: Basic Information */}
        {formStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Basic Information</h3>
              <p className="text-sm text-gray-600">Personal details and profile picture</p>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              <div className="text-center">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Photo
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 400x400px, Max: 5MB
                </p>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter first name"
                />
                {(errors.firstName || formErrors.firstName) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName?.message || formErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter last name"
                />
                {(errors.lastName || formErrors.lastName) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName?.message || formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('gender', { required: 'Gender is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Information */}
        {formStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Information</h3>
              <p className="text-sm text-gray-600">Medical credentials and specialization</p>
            </div>

            {/* License and Registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('licenseNumber', { required: 'License number is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter license number"
                />
                {(errors.licenseNumber || formErrors.licenseNumber) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.licenseNumber?.message || formErrors.licenseNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  {...register('registrationNumber')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter registration number"
                />
              </div>
            </div>

            {/* Department and Specialty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Department</option>
                  {defaultDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.icon} {dept.name}
                    </option>
                  ))}
                </select>
                {(errors.department || formErrors.department) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.department?.message || formErrors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('specialty', { required: 'Specialty is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Specialty</option>
                  {defaultSpecialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
                {(errors.specialty || formErrors.specialty) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specialty?.message || formErrors.specialty}
                  </p>
                )}
              </div>
            </div>

            {/* Experience and Qualifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  {...register('experience', { 
                    required: 'Experience is required',
                    min: { value: 0, message: 'Experience cannot be negative' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter years of experience"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('consultationFee', { 
                    required: 'Consultation fee is required',
                    min: { value: 0, message: 'Fee cannot be negative' }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter consultation fee"
                />
                {errors.consultationFee && (
                  <p className="text-red-500 text-sm mt-1">{errors.consultationFee.message}</p>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualifications <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('qualifications', { required: 'Qualifications are required' })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Enter medical qualifications and degrees (e.g., MBBS, MD, etc.)"
              />
              {errors.qualifications && (
                <p className="text-red-500 text-sm mt-1">{errors.qualifications.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {formStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Contact Information</h3>
              <p className="text-sm text-gray-600">Communication and address details</p>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="doctor@example.com"
                />
                {(errors.email || formErrors.email) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email?.message || formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Invalid phone number format'
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
                {(errors.phone || formErrors.phone) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone?.message || formErrors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Enter complete address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('state', { required: 'State is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter state"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('zipCode', { required: 'ZIP code is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter ZIP code"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {formStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
              <p className="text-sm text-gray-600">Employment details and additional notes</p>
            </div>

            {/* Employment Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('employmentType', { required: 'Employment type is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Employment Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="consultant">Consultant</option>
                </select>
                {errors.employmentType && (
                  <p className="text-red-500 text-sm mt-1">{errors.employmentType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                  <option value="suspended">Suspended</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Join Date and Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Join Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('joinDate', { required: 'Join date is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.joinDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.joinDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('availability', { required: 'Availability is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Availability</option>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="on-vacation">On Vacation</option>
                  <option value="emergency-only">Emergency Only</option>
                </select>
                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                {...register('bio')}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Enter a brief biography or professional summary"
              />
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <input
                type="text"
                {...register('languages')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter languages separated by commas (e.g., English, Spanish, French)"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                placeholder="Any additional notes or comments"
              />
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={formStep === 1}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex space-x-3">
            {formStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'create' ? 'Adding Doctor...' : 'Updating Doctor...'}
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {mode === 'create' ? 'Add Doctor' : 'Update Doctor'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
