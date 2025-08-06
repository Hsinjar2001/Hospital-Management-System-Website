import React, { useState } from 'react';
import axios from 'axios';

const FixDoctorIssue = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [checkResult, setCheckResult] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9999/api';

  const handleCreateMissingDoctor = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/fix/create-missing-doctor`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating doctor record');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckDoctors = async () => {
    setLoading(true);
    setError(null);
    setCheckResult(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/fix/check-doctors`);
      setCheckResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error checking doctors');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 Fix Doctor Issue
          </h1>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                ⚠️ Issue Description
              </h3>
              <p className="text-yellow-700">
                A user with role 'doctor' exists but has no corresponding doctor record in the doctors table. 
                This causes the doctor to not appear in the appointment booking page.
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCheckDoctors}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Checking...' : '🔍 Check Doctor Status'}
              </button>
              
              <button
                onClick={handleCreateMissingDoctor}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {loading ? 'Creating...' : '✅ Create Missing Doctor Record'}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">❌ Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">✅ Success</h3>
                <p className="text-green-700 mb-2">{result.message}</p>
                {result.doctor && (
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-medium mb-2">Doctor Details:</h4>
                    <ul className="text-sm space-y-1">
                      <li><strong>Name:</strong> {result.doctor.user?.first_name} {result.doctor.user?.last_name}</li>
                      <li><strong>Email:</strong> {result.doctor.user?.email}</li>
                      <li><strong>Doctor ID:</strong> {result.doctor.doctor_id}</li>
                      <li><strong>Department:</strong> {result.doctor.department?.name}</li>
                      <li><strong>Specialty:</strong> {result.doctor.specialty}</li>
                      <li><strong>Status:</strong> {result.doctor.status}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {checkResult && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">📊 Doctor Status Check</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Doctor Users: {checkResult.data.doctorUsers.length}</h4>
                    <ul className="text-sm mt-1">
                      {checkResult.data.doctorUsers.map(user => (
                        <li key={user.id}>
                          {user.first_name} {user.last_name} ({user.email})
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Doctor Records: {checkResult.data.doctorRecords.length}</h4>
                    <ul className="text-sm mt-1">
                      {checkResult.data.doctorRecords.map(doctor => (
                        <li key={doctor.id}>
                          {doctor.user?.first_name} {doctor.user?.last_name} - {doctor.specialty}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {checkResult.data.mismatch && (
                    <div className="bg-red-100 p-2 rounded">
                      <p className="text-red-700 font-medium">⚠️ Mismatch detected! Some doctor users don't have doctor records.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixDoctorIssue;