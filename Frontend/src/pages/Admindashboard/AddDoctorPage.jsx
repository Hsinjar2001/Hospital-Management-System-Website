// pages/Admindashboard/AddDoctorPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorForm from '../../Component/forms/DoctorForm';

const AddDoctorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Determine if this is edit mode
  const isEditMode = Boolean(id);

  // Sample doctor data for edit mode (replace with actual API call)
  const sampleDoctorData = {
    doctorId: 'DOC-001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@hospital.com',
    phone: '+1 (555) 123-4567',
    gender: 'female',
    dateOfBirth: '1985-03-15',
    address: '123 Medical Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    licenseNumber: 'MD123456',
    registrationNumber: 'REG789012',
    department: 'cardiology',
    specialty: 'Cardiologist',
    experience: 12,
    consultationFee: 200,
    qualifications: 'MBBS, MD (Cardiology), FACC',
    employmentType: 'full-time',
    status: 'active',
    joinDate: '2020-01-15',
    availability: 'available',
    bio: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 12 years of practice.',
    languages: 'English, Spanish, French',
    notes: 'Specializes in interventional cardiology and heart failure management.',
    profileImage: null,
    createdAt: '2020-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  };

  // Load doctor data for edit mode
  React.useEffect(() => {
    if (isEditMode) {
      // In a real app, fetch doctor data by ID
      // For now, using sample data
      setInitialData(sampleDoctorData);
    }
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      console.log('Doctor form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (isEditMode) {
        // Update existing doctor
        alert('✅ Doctor information updated successfully!');
        navigate('/admin/doctors');
      } else {
        // Add new doctor
        alert('✅ New doctor added successfully!');
        navigate('/admin/doctors');
      }
    } catch (error) {
      console.error('Error submitting doctor form:', error);
      alert('❌ Failed to save doctor information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/admin/doctors');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin/doctors')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Doctors
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Doctor' : 'Add New Doctor'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Description */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  {isEditMode ? 'Edit Doctor Information' : 'Add New Doctor'}
                </h3>
                <p className="text-sm text-blue-700">
                  {isEditMode 
                    ? 'Update the doctor\'s information below. All changes will be saved to the system and the doctor will be notified of any updates.'
                    : 'Fill out the form below to add a new doctor to the system. The doctor will receive credentials and access information via email once the profile is created.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Form */}
        <DoctorForm 
          onSubmit={handleSubmit}
          initialData={initialData}
          loading={loading}
          mode={isEditMode ? 'edit' : 'create'}
          className="mb-8"
        />

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Account Creation</h4>
                <p className="text-sm text-gray-600">
                  {isEditMode 
                    ? 'Updated information will be reflected in the doctor\'s profile immediately.'
                    : 'A new doctor account will be created with login credentials sent via email.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Security & Privacy</h4>
                <p className="text-sm text-gray-600">
                  All doctor information is encrypted and stored securely. Access is restricted to authorized personnel only.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Verification Required</h4>
                <p className="text-sm text-gray-600">
                  {isEditMode 
                    ? 'Any changes to license information will require manual verification by the admin team.'
                    : 'Medical license and credentials will be verified before the doctor account is activated.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Schedule Setup</h4>
                <p className="text-sm text-gray-600">
                  {isEditMode 
                    ? 'Doctor can update their availability and schedule from their dashboard.'
                    : 'The doctor will need to set up their availability schedule after account activation.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Common Issues</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• License number format should be state-specific</li>
                <li>• Profile images should be professional headshots</li>
                <li>• Qualifications should be listed in order of importance</li>
                <li>• Experience should reflect actual practice years</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Support Contacts</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• HR Department: hr@hospital.com</p>
                <p>• IT Support: support@hospital.com</p>
                <p>• Admin Help: admin@hospital.com</p>
                <p>• Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorPage;
