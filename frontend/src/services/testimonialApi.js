// ============================================
// HOMELY - Testimonial API Service
// ============================================
// API functions for testimonial operations
// ============================================

import api from './api';

// --------------------------------------------
// PUBLIC ENDPOINTS
// --------------------------------------------

/**
 * Get recent testimonials for homepage display
 * @param {number} limit - Number of testimonials to fetch
 * @returns {Promise} - Array of testimonials
 */
export const getTestimonials = async (limit = 6) => {
    return api.get(`/testimonials?limit=${limit}`);
};

// --------------------------------------------
// PROTECTED ENDPOINTS
// --------------------------------------------

/**
 * Get the current user's testimonial
 * @returns {Promise} - User's testimonial or error
 */
export const getMyTestimonial = async () => {
    return api.get('/testimonials/mine');
};

/**
 * Create a new testimonial
 * @param {Object} data - Testimonial data { content, rating }
 * @returns {Promise} - Created testimonial
 */
export const createTestimonial = async (data) => {
    return api.post('/testimonials', data);
};

/**
 * Update existing testimonial
 * @param {Object} data - Updated testimonial data { content, rating }
 * @returns {Promise} - Updated testimonial
 */
export const updateTestimonial = async (data) => {
    return api.put('/testimonials', data);
};

/**
 * Delete user's testimonial
 * @returns {Promise} - Success message
 */
export const deleteTestimonial = async () => {
    return api.delete('/testimonials');
};
