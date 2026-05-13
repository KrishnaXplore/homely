// ============================================
// HOMELY - Authentication Service
// ============================================
// API calls for auth operations
// Login, Signup, OTP verification, Password reset
// ============================================

import api, { setAuthToken } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

// --------------------------------------------
// AUTH SERVICE
// --------------------------------------------

const authService = {
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @param {string} userData.name - User's full name
     * @param {string} userData.email - User's email
     * @param {string} userData.password - User's password
     * @returns {Promise<Object>} Response with user data
     */
    async register(userData) {
        const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response;
    },
    
    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @param {string} credentials.email - User's email
     * @param {string} credentials.password - User's password
     * @returns {Promise<Object>} Response with user data and token
     */
    async login(credentials) {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
        
        if (response.success && response.token) {
            // Store token and user data
            setAuthToken(response.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        
        return response;
    },
    
    /**
     * Verify email with OTP
     * @param {Object} data - Verification data
     * @param {string} data.email - User's email
     * @param {string} data.otp - OTP code
     * @returns {Promise<Object>} Response with verification status
     */
    async verifyOTP(data) {
        const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
        
        if (response.success && response.token) {
            // Store token after successful verification
            setAuthToken(response.token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        }
        
        return response;
    },
    
    /**
     * Resend OTP to user's email
     * @param {Object} data - Request data
     * @param {string} data.email - User's email
     * @returns {Promise<Object>} Response with status
     */
    async resendOTP(data) {
        const response = await api.post(API_ENDPOINTS.AUTH.RESEND_OTP, data);
        return response;
    },
    
    /**
     * Request password reset
     * @param {Object} data - Request data
     * @param {string} data.email - User's email
     * @returns {Promise<Object>} Response with status
     */
    async forgotPassword(data) {
        const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
        return response;
    },
    
    /**
     * Reset password with OTP
     * @param {Object} data - Reset data
     * @param {string} data.email - User's email
     * @param {string} data.otp - OTP code
     * @param {string} data.newPassword - New password
     * @returns {Promise<Object>} Response with status
     */
    async resetPassword(data) {
        const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
        return response;
    },
    
    /**
     * Get current user profile
     * @returns {Promise<Object>} Response with user data
     */
    async getCurrentUser() {
        const response = await api.get(API_ENDPOINTS.AUTH.ME);
        return response;
    },
    
    /**
     * Update user profile
     * @param {Object} data - Profile data to update
     * @param {string} data.name - User's name
     * @returns {Promise<Object>} Response with updated user
     */
    async updateProfile(data) {
        const response = await api.put('/users/profile', data);
        // Server returns { success, message, data: user }
        const updatedUser = response.data || response.user;
        if (response.success && updatedUser) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        }
        return response;
    },
    
    /**
     * Change user password
     * @param {Object} data - Password data
     * @param {string} data.currentPassword - Current password
     * @param {string} data.newPassword - New password
     * @returns {Promise<Object>} Response with status
     */
    async changePassword(data) {
        const response = await api.put('/users/password', data);
        return response;
    },
    
    /**
     * Logout user - clear all auth data
     */
    logout() {
        setAuthToken(null);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    },
    
    /**
     * Get stored user from localStorage
     * @returns {Object|null} User object or null
     */
    getStoredUser() {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    },
    
    /**
     * Check if user is authenticated
     * @returns {boolean} Authentication status
     */
    isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    },
};

export default authService;
