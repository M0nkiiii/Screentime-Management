import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to dynamically add `/auth` for specific routes
const getAuthUrl = (endpoint) => `${API_BASE_URL}/auth${endpoint}`;

// Fetch user info (only `/auth` endpoints use the helper)
export const fetchUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(getAuthUrl('/user'), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    throw error;
  }
};

// Update user info
export const updateUser = async (userData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(getAuthUrl('/user'), userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user info:', error.message);
    throw error;
  }
};

// Fetch weekly usage data
export const fetchWeeklyUsage = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/usage/weekly/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching weekly usage:', error.message);
        throw error;
    }
};

export const fetchDailyUsage = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL}/usage/daily/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const triggerPrediction = async (userId, token) => {
  const response = await axios.get(`${API_BASE_URL}/usage/predict/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
