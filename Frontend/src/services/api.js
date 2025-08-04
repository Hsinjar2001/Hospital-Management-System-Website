// API Service Layer for Hospital Management System
const API_BASE_URL = 'http://localhost:9999/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('hospitalToken') || sessionStorage.getItem('hospitalToken');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Making API request to:', fullUrl);
    console.log('📤 Request options:', options);

    const response = await fetch(fullUrl, {
      headers: getAuthHeaders(),
      ...options
    });

    console.log('📥 Response status:', response.status);
    const data = await response.json();
    console.log('📥 Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    });
  },

  forgotPassword: async (email) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (token, password) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password })
    });
  }
};

// Departments API
export const departmentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/departments${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/departments/${id}`);
  },

  create: async (departmentData) => {
    return apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData)
    });
  },

  update: async (id, departmentData) => {
    return apiRequest(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData)
    });
  },

  delete: async (id) => {
    return apiRequest(`/departments/${id}`, {
      method: 'DELETE'
    });
  }
};

// Patients API
export const patientsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/patients${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/patients/${id}`);
  },

  create: async (patientData) => {
    return apiRequest('/patients/register', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  },

  update: async (id, patientData) => {
    return apiRequest(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData)
    });
  },

  delete: async (id) => {
    return apiRequest(`/patients/${id}`, {
      method: 'DELETE'
    });
  },

  search: async (query) => {
    return apiRequest(`/patients/search?q=${encodeURIComponent(query)}`);
  }
};

// Doctors API
export const doctorsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/doctors${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/doctors/${id}`);
  },

  create: async (doctorData) => {
    return apiRequest('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData)
    });
  },

  update: async (id, doctorData) => {
    return apiRequest(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData)
    });
  },

  delete: async (id) => {
    return apiRequest(`/doctors/${id}`, {
      method: 'DELETE'
    });
  },

  search: async (query) => {
    return apiRequest(`/doctors/search?q=${encodeURIComponent(query)}`);
  },

  getSchedule: async (doctorId, date) => {
    return apiRequest(`/doctors/${doctorId}/schedule?date=${date}`);
  }
};

// Appointments API
export const appointmentsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/appointments${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/appointments/${id}`);
  },

  create: async (appointmentData) => {
    return apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  },

  update: async (id, appointmentData) => {
    return apiRequest(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    });
  },

  cancel: async (id, reason) => {
    return apiRequest(`/appointments/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason })
    });
  },

  reschedule: async (id, newDateTime) => {
    return apiRequest(`/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(newDateTime)
    });
  }
};

// Prescriptions API
export const prescriptionsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/prescriptions${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/prescriptions/${id}`);
  },

  create: async (prescriptionData) => {
    return apiRequest('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescriptionData)
    });
  },

  update: async (id, prescriptionData) => {
    return apiRequest(`/prescriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prescriptionData)
    });
  }
};

// Invoices API
export const invoicesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/invoices${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/invoices/${id}`);
  },

  create: async (invoiceData) => {
    return apiRequest('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData)
    });
  },

  update: async (id, invoiceData) => {
    return apiRequest(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData)
    });
  },

  pay: async (id, paymentData) => {
    return apiRequest(`/invoices/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (role, period = 'today') => {
    return apiRequest(`/dashboard/stats?role=${role}&period=${period}`);
  },

  getPatientDashboard: async () => {
    return apiRequest('/dashboard/patient');
  },

  getDoctorDashboard: async () => {
    return apiRequest('/dashboard/doctor');
  },

  getAdminDashboard: async () => {
    return apiRequest('/dashboard/admin');
  }
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  },

  updateNotificationSettings: async (settings) => {
    // For now, return success since backend doesn't have this endpoint yet
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Notification settings updated' });
      }, 500);
    });
  },

  updatePrivacySettings: async (settings) => {
    // For now, return success since backend doesn't have this endpoint yet
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: 'Privacy settings updated' });
      }, 500);
    });
  }
};

// File Upload API
export const uploadAPI = {
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);

    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    }).then(response => response.json());
  }
};

export default {
  auth: authAPI,
  users: usersAPI,
  departments: departmentsAPI,
  patients: patientsAPI,
  doctors: doctorsAPI,
  appointments: appointmentsAPI,
  prescriptions: prescriptionsAPI,
  invoices: invoicesAPI,
  dashboard: dashboardAPI,
  upload: uploadAPI
};
