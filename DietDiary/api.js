import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://diet-diary-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const handleApiError = (error) => {
    if (error.response) {
        return {
            message: error.response.data?.message || 'An error occurred',
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        return { message: 'No response from server. Please check your connection.' };
    } else {
        return { message: error.message || 'An unexpected error occurred' };
    }
};

export const register = async (name, email, password) => {
    try {
        console.log('Registering with:', name, email, password);
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    } catch (error) {
        const errorInfo = handleApiError(error);
        throw new Error(errorInfo.message);
    }
};

export const login = async (email, password) => {
    try {
        console.log('Logging in with:', email, password); 
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        const errorInfo = handleApiError(error);
        throw new Error(errorInfo.message);
    }
};

export const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
};

export const addMeal = async (mealData) => {
    try {
        const response = await api.post('/meals', mealData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getTodayMeals = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        console.log(today)
        const response = await api.get(`/meals/date/${today}`);
        

        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getMealHistory = async () => {
    try {
    
        const response = await api.get('/meals/');
        // console.log('Meal history response:', response.data.data);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getMealDetails = async (id) => {
    try {
        const response = await api.get(`/meals/${id}`);
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};
