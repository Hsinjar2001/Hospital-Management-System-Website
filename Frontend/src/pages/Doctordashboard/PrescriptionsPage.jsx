// pages/Doctordashboard/PrescriptionPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const PrescriptionPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

  // Sample prescriptions data
  const samplePrescriptions = [
    {
      id: 'RX-001',
      patientName: 'John Doe',
      patientId: 'PAT-001',
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with food in the morning'
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Take with meals'
        }
      ],
      createdDate: '2024-01-20',
      status: 'active',
      diagnosis: 'Hypertension, Type 2 Diabetes',
      notes: 'Patient tolerating medications well. Follow up in 4 weeks.',
      refills: 2,
      pharmacy: 'Central Pharmacy'
    },
    {
      id: 'RX-002',
      patientName: 'Jane Smith',
      patientId: 'PAT-002',
      medications: [
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Take with food. Do not exceed 1200mg per day'
        }
      ],
      createdDate: '2024-01-19',
      status: 'completed',
      diagnosis: 'Post-operative pain management',
      notes: 'Short-term pain relief post-surgery.',
      refills: 0,
      pharmacy: 'Main Street Pharmacy'
    },
    {
      id: 'RX-003',
      patientName: 'Robert Brown',
      patientId: 'PAT-003',
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '10 days',
          instructions: 'Complete full course even if feeling better'
        }
      ],
      createdDate: '2024-01-18',
      status: 'pending',
      diagnosis: 'Bacterial infection',
      notes: 'Patient allergic to penicillin - using alternative antibiotic.',
      refills: 0,
      pharmacy: 'City Pharmacy'
    }
  ];

  // Sample medications database
  const medicationsDatabase = [
    { name: 'Lisinopril', category: 'ACE Inhibitor', commonDosages: ['5mg', '10mg', '20mg'] },
    { name: 'Metformin', category: 'Antidiabetic', commonDosages: ['500mg', '750mg', '1000mg'] },
    { name: 'Ibuprofen', category: 'NSAID', commonDosages: ['200mg', '400mg', '600mg'] },
    { name: 'Amoxicillin', category: 'Antibiotic', commonDosages: ['250mg', '500mg', '875mg'] },
    { name: 'Atorvastatin', category: 'Statin', commonDosages: ['10mg', '20mg', '40mg', '80mg'] },
    { name: 'Omeprazole', category: 'PPI', commonDosages: ['20mg', '40mg'] }
  ];

  // Load prescriptions
  useEffect(() => {
    const loadPrescriptions = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPrescriptions(samplePrescriptions);
        setFilteredPrescriptions(samplePrescriptions);
      } catch (error) {
        console.error('Error loading prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, []);

  // Filter prescriptions
  useEffect(() => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(prescription => 
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(prescription => prescription.status === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  }, [prescriptions, searchTerm, statusFilter]);

  // Handle prescription creation
  const onSubmit = async (data) => {
    try {
      console.log('New prescription:', data);
      
      const newPrescription = {
        id: `RX-${String(prescriptions.length + 1).padStart(3, '0')}`,
        ...data,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'active',
        refills: parseInt(data.refills) || 0
      };

      setPrescriptions([newPrescription, ...prescriptions]);
      setShowCreateModal(false);
      reset();
      alert('✅ Prescription created successfully!');
      
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('❌ Failed to create prescription. Please try again.');
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage patient prescriptions and medications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Prescription
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {prescriptions.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No prescriptions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prescription.id}</div>
                      <div className="text-sm text-gray-500">{prescription.diagnosis}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                      <div className="text-sm text-gray-500">{prescription.patientId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {prescription.medications.slice(0, 2).map((med, index) => (
                          <div key={index} className="text-sm text-gray-900">
                            {med.name} {med.dosage}
                          </div>
                        ))}
                        {prescription.medications.length > 2 && (
                          <div className="text-sm text-gray-500">
                            +{prescription.medications.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(prescription.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPrescription(prescription);
                            setShowDetailsModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Print
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900">
                          Refill
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Prescription</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('patientName', { required: 'Patient name is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter patient name"
                    />
                    {errors.patientName && (
                      <p className="text-red-500 text-sm mt-1">{errors.patientName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('patientId', { required: 'Patient ID is required' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter patient ID"
                    />
                    {errors.patientId && (
                      <p className="text-red-500 text-sm mt-1">{errors.patientId.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('diagnosis', { required: 'Diagnosis is required' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter diagnosis"
                  />
                  {errors.diagnosis && (
                    <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>
                  )}
                </div>

                {/* Medications Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3 border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Medication Name</label>
                        <select
                          {...register('medicationName', { required: 'Medication is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                          <option value="">Select medication...</option>
                          {medicationsDatabase.map(med => (
                            <option key={med.name} value={med.name}>
                              {med.name} ({med.category})
                            </option>
                          ))}
                        </select>
                        {errors.medicationName && (
                          <p className="text-red-500 text-xs mt-1">{errors.medicationName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Dosage</label>
                        <input
                          type="text"
                          {...register('dosage', { required: 'Dosage is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="e.g., 10mg"
                        />
                        {errors.dosage && (
                          <p className="text-red-500 text-xs mt-1">{errors.dosage.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Frequency</label>
                        <select
                          {...register('frequency', { required: 'Frequency is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                          <option value="">Select frequency...</option>
                          <option value="Once daily">Once daily</option>
                          <option value="Twice daily">Twice daily</option>
                          <option value="Three times daily">Three times daily</option>
                          <option value="Four times daily">Four times daily</option>
                          <option value="As needed">As needed</option>
                        </select>
                        {errors.frequency && (
                          <p className="text-red-500 text-xs mt-1">{errors.frequency.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                        <input
                          type="text"
                          {...register('duration', { required: 'Duration is required' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                          placeholder="e.g., 30 days"
                        />
                        {errors.duration && (
                          <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Instructions</label>
                      <textarea
                        {...register('instructions')}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        placeholder="Special instructions for taking this medication..."
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Refills
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      {...register('refills')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Number of refills"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pharmacy
                    </label>
                    <input
                      type="text"
                      {...register('pharmacy')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Preferred pharmacy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    {...register('notes')}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Any additional notes or considerations..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
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
                    Create Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prescription Details - {selectedPrescription.id}
                </h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPrescription(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.patientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ID:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.patientId}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Diagnosis:</span>
                      <span className="ml-2 font-medium">{selectedPrescription.diagnosis}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(selectedPrescription.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Prescribed Medications</h4>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{med.name}</span>
                            <span className="ml-2 text-sm text-gray-600">{med.dosage}</span>
                          </div>
                          <div className="text-sm text-gray-600">{med.frequency}</div>
                          <div className="text-sm text-gray-600">Duration: {med.duration}</div>
                          <div className="text-sm text-gray-600">Refills: {selectedPrescription.refills}</div>
                        </div>
                        {med.instructions && (
                          <div className="mt-2 text-sm text-gray-700">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                      {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pharmacy</label>
                    <p className="text-sm text-gray-900">{selectedPrescription.pharmacy}</p>
                  </div>
                </div>

                {selectedPrescription.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="text-sm text-gray-900">{selectedPrescription.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPrescription(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Print Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionPage;
