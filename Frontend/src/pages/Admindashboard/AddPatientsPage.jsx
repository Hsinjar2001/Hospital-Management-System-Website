// pages/Admindashboard/AddPatientsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimplePatientForm from '../../Component/forms/SimplePatientForm';
import { patientsAPI } from '../../services/api';

const AddPatientsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Determine if this is edit mode
  const isEditMode = Boolean(id);

  // Load patient data for edit mode from API
  useEffect(() => {

    
    if (isEditMode && id) {
      const loadPatientData = async () => {
        try {
          const response = await patientsAPI.getById(id);
          if (response.success && response.data) {
            setInitialData(response.data);
          } else {
            console.error('Failed to load patient data:', response.error);
          }
        } catch (error) {
          console.error('Error loading patient data:', error);
        }
      };
      loadPatientData();
    }
  }, [id, isEditMode]);

  // Simple form doesn't need insurance providers list



  // Handle form submission
  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      console.log('Patient form submitted:', formData);

      if (isEditMode) {
        // Update existing patient
        const response = await patientsAPI.update(id, formData);
        if (response.success) {
          alert('✅ Patient information updated successfully!');
          navigate(`/admin/patients/${id}`);
        } else {
          throw new Error(response.error || 'Failed to update patient');
        }
      } else {
        // Add new patient
        const response = await patientsAPI.create(formData);
        if (response.success) {
          alert('✅ New patient registered successfully!');
          navigate('/admin/patients');
        } else {
          throw new Error(response.error || 'Failed to create patient');
        }
      }
    } catch (error) {
      console.error('Error submitting patient form:', error);
      alert('❌ Failed to save patient information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      if (isEditMode) {
        navigate(`/admin/patients/${id}`);
      } else {
        navigate('/admin/patients');
      }
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
                onClick={() => navigate('/admin/patients')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Patients
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Patient' : 'Register New Patient'}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              {isEditMode && (
                <button 
                  onClick={() => navigate(`/admin/patients/${id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Profile
                </button>
              )}
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
                  {isEditMode ? 'Edit Patient Information' : 'Patient Registration'}
                </h3>
                <p className="text-sm text-blue-700">
                  {isEditMode 
                    ? 'Update the patient\'s information below. Changes will be saved immediately and the patient will be notified of important updates.'
                    : 'Complete the form below to register a new patient in the hospital system. All fields marked with * are required for registration.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Steps Overview */}
        {!isEditMode && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Process</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Personal Info</p>
                  <p className="text-xs text-gray-500">Basic details</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Contact</p>
                  <p className="text-xs text-gray-500">Address & phone</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Medical</p>
                  <p className="text-xs text-gray-500">Health history</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Emergency</p>
                  <p className="text-xs text-gray-500">Contact info</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Insurance</p>
                  <p className="text-xs text-gray-500">Coverage details</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Patient Form */}
        <SimplePatientForm
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
                <h4 className="text-sm font-medium text-gray-900">Patient ID Generation</h4>
                <p className="text-sm text-gray-600">
                  {isEditMode 
                    ? 'Patient ID cannot be changed once assigned for security and tracking purposes.'
                    : 'A unique Patient ID will be automatically generated upon successful registration.'
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
                <h4 className="text-sm font-medium text-gray-900">Privacy & Security</h4>
                <p className="text-sm text-gray-600">
                  All patient information is encrypted and protected under HIPAA compliance. Access is restricted to authorized medical personnel only.
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
                <h4 className="text-sm font-medium text-gray-900">Insurance Verification</h4>
                <p className="text-sm text-gray-600">
                  {isEditMode 
                    ? 'Insurance information changes may require verification before coverage updates.'
                    : 'Insurance details will be verified within 24 hours of registration. Patients will be notified of verification status.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-7-10a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Minor Patients</h4>
                <p className="text-sm text-gray-600">
                  For patients under 18, a parent or legal guardian must provide consent and serve as the primary emergency contact.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">Emergency Information</h4>
                <p className="text-sm text-gray-600">
                  Emergency contact information is critical for patient safety. Please ensure all contact details are current and accurate.
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
              <h4 className="text-sm font-medium text-gray-900 mb-2">Common Questions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• What if the patient doesn't have insurance?</li>
                <li>• How to handle incomplete medical history?</li>
                <li>• What documents are required for registration?</li>
                <li>• How to add multiple emergency contacts?</li>
                <li>• What if patient information changes later?</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Support Contacts</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Patient Registration: registration@hospital.com</p>
                <p>• Insurance Verification: insurance@hospital.com</p>
                <p>• Medical Records: records@hospital.com</p>
                <p>• General Support: +1 (555) 123-4567</p>
                <p>• Emergency Line: +1 (555) 911-HELP</p>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Reference</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
              <div>
                <p className="font-medium text-gray-700">Required Documents:</p>
                <p>• Government-issued ID</p>
                <p>• Insurance card (if applicable)</p>
                <p>• Emergency contact info</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Optional Documents:</p>
                <p>• Previous medical records</p>
                <p>• Medication list</p>
                <p>• Allergy information</p>
              </div>
              <div>
                <p className="font-medium text-gray-700">Processing Time:</p>
                <p>• Registration: Immediate</p>
                <p>• Insurance verification: 24 hours</p>
                <p>• Medical records transfer: 3-5 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPatientsPage;
