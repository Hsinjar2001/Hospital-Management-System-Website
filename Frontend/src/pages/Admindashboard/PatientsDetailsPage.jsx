// pages/Admindashboard/PatientsDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { patientsAPI, invoicesAPI } from '../../services/api';

const PatientsDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // API base URL
  const API_BASE_URL = 'http://localhost:5003/api';

  // Load patient data from API
  useEffect(() => {
    const loadPatientData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Load real patient data from API
        const response = await patientsAPI.getById(id);
        if (response.success && response.data) {
          setPatient(response.data);
        } else {
          console.error('Failed to load patient:', response.error);
          setPatient(null);
        }
      } catch (error) {
        console.error('Error loading patient:', error);
        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    loadPatientData();
  }, [id]);

  // Patient invoices state
  const [patientInvoices, setPatientInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Fetch patient invoices
  const fetchPatientInvoices = async (patientId) => {
    setInvoicesLoading(true);
    try {
      // Get invoices filtered by patient ID
      const data = await invoicesAPI.getAll({ patientId });
      if (data.success) {
        setPatientInvoices(data.data.invoices || []);
      } else {
        setPatientInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching patient invoices:', error);
      setPatientInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Load patient data
  useEffect(() => {
    const loadPatientData = async () => {
      setLoading(true);
      try {
        // Fetch real patient data from API
        const response = await patientsAPI.getById(id);
        setPatient(response.data);

        // Fetch patient appointments, medical records, and invoices
        await Promise.all([
          fetchPatientInvoices(id),
          // Add more API calls here when available:
          // fetchPatientAppointments(id),
          // fetchPatientMedicalRecords(id)
        ]);

        // Set empty arrays for now until APIs are implemented
        setAppointments([]);
        setMedicalRecords([]);

      } catch (error) {
        console.error('Error loading patient data:', error);
        // Redirect to patients list if patient not found
        navigate('/admin/patients');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPatientData();
    }
  }, [id, navigate]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 'N/A';
    const bmi = weight / Math.pow(height / 100, 2);
    return bmi.toFixed(1);
  };

  // Get BMI status
  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return { status: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { status: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { status: 'Overweight', color: 'text-yellow-600' };
    return { status: 'Obese', color: 'text-red-600' };
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📋' },
    { id: 'medical', name: 'Medical Records', icon: '🏥' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'billing', name: 'Billing', icon: '💳' },
    { id: 'documents', name: 'Documents', icon: '📄' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The patient you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/patients')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Patients List
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate(`/admin/patients/edit/${patient.id}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit Patient
              </button>
              <button
                onClick={() => navigate('/admin/appointments/add', { state: { patientId: patient.id } })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Patient Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {patient.user?.profile_image ? (
                  <img 
                    src={patient.user?.profile_image} 
                    alt={patient.full_name || `${patient.user?.first_name || ''} ${patient.user?.last_name || ''}`.trim()}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {patient.user?.first_name?.charAt(0) || ''}{patient.user?.last_name?.charAt(0) || ''}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.full_name || `${patient.user?.first_name || ''} ${patient.user?.last_name || ''}`.trim()}</h2>
                <p className="text-gray-600">Patient ID: {patient.patient_id || `PAT-${patient.id}`}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status || 'active')}`}>
                    {patient.status || 'Active'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {patient.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : patient.user?.date_of_birth ? new Date().getFullYear() - new Date(patient.user.date_of_birth).getFullYear() : 'N/A'} years old • {patient.gender || patient.user?.gender || 'N/A'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Blood Group: {patient.bloodGroup}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 lg:mt-0 grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{patient.totalAppointments}</div>
                <div className="text-sm text-gray-600">Total Visits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{patient.completedAppointments}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{patient.pendingAppointments}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">${patient.pendingBills}</div>
                <div className="text-sm text-gray-600">Pending Bills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-sm text-gray-900">{patient.full_name || `${patient.user?.first_name || ''} ${patient.user?.last_name || ''}`.trim()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="text-sm text-gray-900">{patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : patient.user?.date_of_birth ? new Date(patient.user.date_of_birth).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="text-sm text-gray-900">{patient.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : patient.user?.date_of_birth ? new Date().getFullYear() - new Date(patient.user.date_of_birth).getFullYear() : 'N/A'} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="text-sm text-gray-900">{patient.gender || patient.user?.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                    <p className="text-sm text-gray-900">{patient.blood_group || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <p className="text-sm text-gray-900">{patient.maritalStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{patient.phone || patient.user?.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{patient.user?.email || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{patient.address || patient.user?.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <p className="text-sm text-gray-900">{patient.city || patient.user?.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <p className="text-sm text-gray-900">{patient.state || patient.user?.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                    <p className="text-sm text-gray-900">{patient.zipCode || patient.user?.zip_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <p className="text-sm text-gray-900">{patient.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                    <p className="text-sm text-gray-900">{patient.emergencyContactName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Relationship</label>
                    <p className="text-sm text-gray-900">{patient.emergencyContactRelation}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{patient.emergencyContactPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{patient.emergencyContactEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Medical Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Overview</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Doctor</label>
                    <p className="text-sm text-gray-900">{patient.primaryDoctor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="text-sm text-gray-900">{patient.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Visit</label>
                    <p className="text-sm text-gray-900">{new Date(patient.lastVisit).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="text-sm text-gray-900">{new Date(patient.registrationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Vital Signs</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Height</span>
                    <span className="text-sm text-gray-900">{patient.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Weight</span>
                    <span className="text-sm text-gray-900">{patient.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">BMI</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-900">{calculateBMI(patient.weight, patient.height)}</span>
                      <span className={`text-xs block ${getBMIStatus(patient.bmi).color}`}>
                        {getBMIStatus(patient.bmi).status}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Blood Pressure</span>
                    <span className="text-sm text-gray-900">{patient.bloodPressure} mmHg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                    <span className="text-sm text-gray-900">{patient.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Temperature</span>
                    <span className="text-sm text-gray-900">{patient.temperature}°F</span>
                  </div>
                </div>
              </div>

              {/* Insurance Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
                {patient.hasInsurance ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Provider</label>
                      <p className="text-sm text-gray-900">{patient.insuranceProvider}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Policy Number</label>
                      <p className="text-sm text-gray-900">{patient.policyNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Group Number</label>
                      <p className="text-sm text-gray-900">{patient.groupNumber}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No insurance information available</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Medical Records Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                  <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg">{patient.allergies || 'No known allergies'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                  <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg">{patient.currentMedications || 'No current medications'}</p>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{patient.medicalHistory || 'No medical history recorded'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Medical Records</h3>
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{record.diagnosis}</h4>
                        <p className="text-sm text-gray-600">Dr. {record.doctor} • {new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-gray-700">Treatment:</label>
                        <p className="text-sm text-gray-900">{record.treatment}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">Notes:</label>
                        <p className="text-sm text-gray-900">{record.notes}</p>
                      </div>
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div>
                          <label className="text-xs font-medium text-gray-700">Prescriptions:</label>
                          <ul className="text-sm text-gray-900 list-disc list-inside">
                            {record.prescriptions.map((prescription, index) => (
                              <li key={index}>{prescription}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Appointment History</h3>
                <button
                  onClick={() => navigate('/admin/appointments/add', { state: { patientId: patient.id } })}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule New
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{appointment.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Bills</p>
                    <p className="text-2xl font-bold text-gray-900">${patient.totalBills}</p>
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
                    <p className="text-sm font-medium text-gray-600">Pending Bills</p>
                    <p className="text-2xl font-bold text-yellow-600">${patient.pendingBills}</p>
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
                    <p className="text-sm font-medium text-gray-600">Last Payment</p>
                    <p className="text-lg font-bold text-green-600">{new Date(patient.lastPayment).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoicesLoading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600">Loading invoices...</span>
                          </div>
                        </td>
                      </tr>
                    ) : patientInvoices.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          <div className="py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-900 mb-2">No invoices found</p>
                            <p className="text-gray-500">This patient doesn't have any invoices yet.</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      patientInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceId || invoice.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(invoice.invoiceDate || invoice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {invoice.description || 'Medical Services'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${parseFloat(invoice.totalAmount || invoice.amount || 0).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                            <button className="text-green-600 hover:text-green-900">Download</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents</h3>
              <p className="text-gray-500 mb-4">No documents have been uploaded for this patient yet.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Upload Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsDetailsPage;
