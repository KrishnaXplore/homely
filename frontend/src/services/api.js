// ============================================
// HOMELY - API Service Configuration
// ============================================
// Axios instance with interceptors for API calls
// Handles auth tokens and error responses
// ============================================

import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

// --------------------------------------------
// AXIOS INSTANCE
// --------------------------------------------

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --------------------------------------------
// REQUEST INTERCEPTOR
// --------------------------------------------

/**
 * Add auth token to requests if available
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --------------------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------------------

/**
 * Handle responses and errors globally
 */
api.interceptors.response.use(
    (response) => {
        // Return data directly for successful responses
        return response.data;
    },
    (error) => {
        const responseData = error.response?.data || null;

        // Extract error information
        const errorResponse = {
            status: error.response?.status || 500,
            message: responseData?.message || error.message || 'Something went wrong',
            errors: responseData?.errors || null,
            response: error.response
                ? {
                    status: error.response.status,
                    data: responseData,
                }
                : null,
        };
        
        // Handle specific error cases
        if (errorResponse.status === 401) {
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            
            // Only redirect if not already on auth pages
            if (!window.location.pathname.includes('/login') && 
                !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        
        if (errorResponse.status === 403) {
            // Forbidden - user doesn't have permission
            console.error('Access forbidden:', errorResponse.message);
        }
        
        if (errorResponse.status === 404) {
            // Not found
            console.error('Resource not found:', errorResponse.message);
        }
        
        if (errorResponse.status >= 500) {
            // Server error
            console.error('Server error:', errorResponse.message);
        }
        
        return Promise.reject(errorResponse);
    }
);

// --------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------

/**
 * Set auth token in localStorage and axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        delete api.defaults.headers.common['Authorization'];
    }
};

/**
 * Get current auth token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Check if user is authenticated
 * @returns {boolean} Whether user has valid token
 */
export const isAuthenticated = () => {
    return !!getAuthToken();
};

export default api;
