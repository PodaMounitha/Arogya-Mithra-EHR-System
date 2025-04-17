import axios from 'axios';
import * as mockData from '../utils/mockData';

const API_BASE_URL = 'http://127.0.0.1:5000';
const USE_MOCK_DATA = true; // Set this to false when the backend is available

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add some additional options to help with CORS
  withCredentials: false,
  timeout: 10000
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request error:', error);
  return Promise.reject(error);
});

// Authentication APIs
export const login = async (credentials) => {
  try {
    console.log('Login attempt with:', credentials);
    const response = await api.post('/api/auth/login', credentials);
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    // Let the interceptor handle the error
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Log the request data for debugging
    console.log('Registration request data:', userData);
    
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    // Log the error details for debugging
    console.error('Registration error:', error.response?.data || error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.error || 'Registration failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request. Please try again.');
    }
  }
};

export const logout = async () => {
  const response = await api.post('/api/auth/logout');
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.get('/api/auth/verify');
  return response.data;
};

// Doctor APIs
export const getDoctorStats = async () => {
  console.log('Fetching doctor stats...');
  if (USE_MOCK_DATA) {
    return mockData.mockDoctorStats();
  }
  
  try {
    const response = await api.get('/api/doctor/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor stats:', error);
    // Fallback to mock data
    return mockData.mockDoctorStats();
  }
};

export const getDoctorAppointments = async () => {
  console.log('Fetching doctor appointments...');
  if (USE_MOCK_DATA) {
    // Use the original function for appointments with filtered data
    const mockAppointments = mockData.appointments || [];
    return mockAppointments.filter(a => a.doctorId === 1);
  }
  
  try {
    const response = await api.get('/api/doctor/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    // Fallback to mock data
    const mockAppointments = mockData.appointments || [];
    return mockAppointments.filter(a => a.doctorId === 1);
  }
};

export const getDoctorPatients = async () => {
  console.log('Fetching doctor patients...');
  if (USE_MOCK_DATA) {
    return mockData.mockDoctorPatients();
  }
  
  try {
    const response = await api.get('/api/doctor/patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    // Fallback to mock data
    return mockData.mockDoctorPatients();
  }
};

export const getDoctorMedicalRecords = async () => {
  console.log('Fetching doctor medical records...');
  if (USE_MOCK_DATA) {
    return mockData.mockDoctorMedicalRecords();
  }
  
  try {
    const response = await api.get('/api/doctor/medical-records');
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor medical records:', error);
    // Fallback to mock data
    return mockData.mockDoctorMedicalRecords();
  }
};

// Patient APIs
export const getPatientStats = async () => {
  console.log('Fetching patient stats...');
  if (USE_MOCK_DATA) {
    return mockData.mockPatientStats();
  }
  
  try {
    const response = await api.get('/api/patient/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    // Fallback to mock data
    return mockData.mockPatientStats();
  }
};

export const getPatientAppointments = async () => {
  console.log('Fetching patient appointments...');
  if (USE_MOCK_DATA) {
    return mockData.mockPatientAppointments();
  }
  
  try {
    const response = await api.get('/api/patient/appointments');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    // Fallback to mock data
    return mockData.mockPatientAppointments();
  }
};

export const getPatientMedicalRecords = async () => {
  const response = await api.get('/api/patient/medical-records');
  return response.data;
};

export const getPatientPrescriptions = async () => {
  console.log('Fetching patient prescriptions...');
  if (USE_MOCK_DATA) {
    return mockData.mockPatientPrescriptions();
  }
  
  try {
    const response = await api.get('/api/patient/prescriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    // Fallback to mock data
    return mockData.mockPatientPrescriptions();
  }
};

export const getPatientHealthMetrics = async () => {
  console.log('Fetching patient health metrics...');
  if (USE_MOCK_DATA) {
    return mockData.mockPatientHealthMetrics();
  }
  
  try {
    const response = await api.get('/api/patient/health-metrics');
    return response.data;
  } catch (error) {
    console.error('Error fetching patient health metrics:', error);
    // Fallback to mock data
    return mockData.mockPatientHealthMetrics();
  }
};

// Shared APIs
export const getAppointments = async (userType, userId) => {
  const response = await api.get(`/api/${userType}/${userId}/appointments`);
  return response.data;
};

export const createAppointment = async (appointmentData) => {
  const response = await api.post('/api/appointments', appointmentData);
  return response.data;
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  const response = await api.put(`/api/appointments/${appointmentId}`, appointmentData);
  return response.data;
};

export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(`/api/appointments/${appointmentId}`);
  return response.data;
};

export const getMedicalRecords = async (userId) => {
  const response = await api.get(`/api/medical-records/${userId}`);
  return response.data;
};

export const createMedicalRecord = async (recordData) => {
  const response = await api.post('/api/medical-records', recordData);
  return response.data;
};

export const updateMedicalRecord = async (recordId, recordData) => {
  const response = await api.put(`/api/medical-records/${recordId}`, recordData);
  return response.data;
};

export const deleteMedicalRecord = async (recordId) => {
  const response = await api.delete(`/api/medical-records/${recordId}`);
  return response.data;
};

// Error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', error.response.status, error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error (No Response):', error.request);
      
      // Check if the error might be related to CORS
      if (error.message && error.message.includes('Network Error')) {
        console.error('This may be a CORS-related issue. Please ensure the backend server has CORS properly configured.');
      }
      
      return Promise.reject({ 
        error: 'Network error occurred. Please check if the server is running.',
        details: error.message 
      });
    } else {
      // Something else happened
      console.error('API Error:', error.message);
      return Promise.reject({ error: error.message });
    }
  }
);

export default api; 