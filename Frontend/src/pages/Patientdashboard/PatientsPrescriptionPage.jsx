// pages/Patientdashboard/PatientPrescriptionPage.jsx
import React, { useState, useEffect } from 'react';

const PatientPrescriptionPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sample prescriptions data[5]
  const samplePrescriptions = [
    {
      id: 'RX-2025-001',
      prescribedBy: 'Dr. Sarah Johnson',
      department: 'Cardiology',
      date: '2025-07-15',
      status: 'active',
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take with food in the morning',
          quantity: 30,
          refills: 2,
          refillsUsed: 0
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Take with meals',
          quantity: 60,
          refills: 2,
          refillsUsed: 0
        }
      ],
      diagnosis: 'Hypertension, Type 2 Diabetes',
      notes: 'Monitor blood pressure and blood sugar levels regularly. Return for follow-up in 4 weeks.',
      pharmacyInstructions: 'Patient counseled on medication administration and side effects.',
      expiryDate: '2025-08-15',
      pharmacy: 'Central Pharmacy'
    },
    {
      id: 'RX-2025-002',
      prescribedBy: 'Dr. Emily Davis',
      department: 'Dermatology',
      date: '2025-07-18',
      status: 'pending',
      medications: [
        {
          name: 'Hydrocortisone Cream',
          dosage: '1%',
          frequency: 'Twice daily',
          duration: '14 days',
          instructions: 'Apply thin layer to affected area',
          quantity: 1,
          refills: 1,
          refillsUsed: 0
        }
      ],
      diagnosis: 'Eczema',
      notes: 'Apply as needed for itching and inflammation. Avoid face and genital areas.',
      pharmacyInstructions: 'Topical use only. Patient advised on proper application.',
      expiryDate: '2025-08-18',
      pharmacy: 'Main Street Pharmacy'
    },
    {
      id: 'RX-2025-003',
      prescribedBy: 'Dr. Michael Wilson',
      department: 'General Medicine',
      date: '2025-07-10',
      status: 'completed',
      medications: [
        {
          name: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '10 days',
          instructions: 'Complete full course even if feeling better',
          quantity: 30,
          refills: 0,
          refillsUsed: 0
        }
      ],
      diagnosis: 'Bacterial infection',
      notes: 'Complete antibiotic course. Return if symptoms persist after completion.',
      pharmacyInstructions: 'Patient counseled on completing full antibiotic course.',
      expiryDate: '2025-07-20',
      pharmacy: 'Health Plus Pharmacy'
    },
    {
      id: 'RX-2025-004',
      prescribedBy: 'Dr. James Miller',
      department: 'Orthopedics',
      date: '2025-07-05',
      status: 'expired',
      medications: [
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Three times daily as needed',
          duration: '7 days',
          instructions: 'Take with food. Do not exceed 1200mg per day',
          quantity: 21,
          refills: 1,
          refillsUsed: 1
        }
      ],
      diagnosis: 'Post-operative pain',
      notes: 'For pain management after knee surgery. Use ice packs and elevate leg.',
      pharmacyInstructions: 'Patient advised on maximum daily dose and food requirements.',
      expiryDate: '2025-07-12',
      pharmacy: 'MediCare Pharmacy'
    }
  ];

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

  useEffect(() => {
    let filtered = prescriptions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(prescription => prescription.status === statusFilter);
    }

    setFilteredPrescriptions(filtered);
  }, [prescriptions, statusFilter]);

  const handleRefillRequest = (prescriptionId, medicationName) => {
    alert(`✅ Refill request submitted for ${medicationName}. You will be notified when ready for pickup.`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const calculateStats = () => {
    const active = prescriptions.filter(p => p.status === 'active').length;
    const pending = prescriptions.filter(p => p.status === 'pending').length;
    const completed = prescriptions.filter(p => p.status === 'completed').length;
    const expiringSoon = prescriptions.filter(p => isExpiringSoon(p.expiryDate)).length;

    return { active, pending, completed, expiringSoon };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-sm text-gray-600 mt-1">
            View and manage your prescribed medications
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Prescriptions</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No prescriptions found.</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{prescription.id}</h3>
                  <p className="text-sm text-gray-600">
                    Prescribed by {prescription.prescribedBy} • {prescription.department}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                  {isExpiringSoon(prescription.expiryDate) && (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                      Expiring Soon
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Diagnosis</h4>
                <p className="text-sm text-gray-600">{prescription.diagnosis}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-3">Medications</h4>
                <div className="space-y-3">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{medication.name}</h5>
                          <p className="text-sm text-gray-600">{medication.dosage} • {medication.frequency}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Duration: {medication.duration}</p>
                          <p className="text-sm text-gray-600">Qty: {medication.quantity}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Instructions:</span> {medication.instructions}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Refills: {medication.refills - medication.refillsUsed} of {medication.refills} remaining
                        </div>
                        {prescription.status === 'active' && (medication.refills - medication.refillsUsed) > 0 && (
                          <button
                            onClick={() => handleRefillRequest(prescription.id, medication.name)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Request Refill
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Pharmacy</h5>
                  <p className="text-sm text-gray-600">{prescription.pharmacy}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-1">Expires</h5>
                  <p className="text-sm text-gray-600">{new Date(prescription.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>

              {prescription.notes && (
                <div className="mb-4">
                  <h5 className="font-medium text-gray-900 mb-1">Doctor's Notes</h5>
                  <p className="text-sm text-gray-600">{prescription.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedPrescription(prescription);
                    setShowDetailsModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Full Details
                </button>
                <div className="flex space-x-3">
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    Download PDF
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Prescription Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Prescription Details</h3>
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
                {/* Prescription Header */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedPrescription.id}</h4>
                      <p className="text-sm text-gray-600">
                        Prescribed by {selectedPrescription.prescribedBy}
                      </p>
                      <p className="text-sm text-gray-600">{selectedPrescription.department}</p>
                      <p className="text-sm text-gray-600">
                        Date: {new Date(selectedPrescription.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                      {selectedPrescription.status.charAt(0).toUpperCase() + selectedPrescription.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Diagnosis</h5>
                  <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
                </div>

                {/* Medications */}
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Prescribed Medications</h5>
                  <div className="space-y-4">
                    {selectedPrescription.medications.map((medication, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="font-medium text-gray-900">{medication.name}</h6>
                            <p className="text-sm text-gray-600">Dosage: {medication.dosage}</p>
                            <p className="text-sm text-gray-600">Frequency: {medication.frequency}</p>
                            <p className="text-sm text-gray-600">Duration: {medication.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Quantity: {medication.quantity}</p>
                            <p className="text-sm text-gray-600">
                              Refills: {medication.refills - medication.refillsUsed} of {medication.refills} remaining
                            </p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-sm font-medium text-gray-700">Instructions:</h6>
                          <p className="text-sm text-gray-600">{medication.instructions}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Pharmacy Information</h5>
                    <p className="text-sm text-gray-600">{selectedPrescription.pharmacy}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Prescription Expires</h5>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPrescription.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Doctor's Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Doctor's Notes</h5>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedPrescription.notes}</p>
                    </div>
                  </div>
                )}

                {/* Pharmacy Instructions */}
                {selectedPrescription.pharmacyInstructions && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Pharmacy Instructions</h5>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">{selectedPrescription.pharmacyInstructions}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Download PDF
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Print
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedPrescription(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptionPage;
 