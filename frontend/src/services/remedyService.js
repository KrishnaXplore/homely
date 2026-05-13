// ============================================
// HOMELY - Remedy Service
// ============================================
// API calls for remedy operations
// CRUD operations, search, ratings
// ============================================

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

// --------------------------------------------
// REMEDY SERVICE
// --------------------------------------------

const remedyService = {
    /**
     * Get all remedies with optional filters
     * @param {Object} params - Query parameters
     * @param {string} params.search - Search keyword
     * @param {string} params.category - Filter by category
     * @param {string} params.difficulty - Filter by difficulty
     * @param {number} params.page - Page number
     * @param {number} params.limit - Items per page
     * @param {string} params.sort - Sort field
     * @returns {Promise<Object>} Response with remedies array and pagination
     */
    async getAll(params = {}) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.BASE, { params });
        return response;
    },
    
    /**
     * Get a single remedy by ID
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with remedy data
     */
    async getById(id) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.BY_ID(id));
        return response;
    },
    
    /**
     * Get remedies by category
     * @param {string} category - Category slug
     * @param {Object} params - Additional query params
     * @returns {Promise<Object>} Response with remedies
     */
    async getByCategory(category, params = {}) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.BASE, {
            params: { category, ...params }
        });
        return response;
    },
    
    /**
     * Search remedies
     * @param {string} query - Search query
     * @param {Object} params - Additional filters
     * @returns {Promise<Object>} Response with search results
     */
    async search(query, params = {}) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.SEARCH, {
            params: { q: query, ...params }
        });
        return response;
    },
    
    /**
     * Create a new remedy
     * @param {Object} remedyData - Remedy data
     * @returns {Promise<Object>} Response with created remedy
     */
    async create(remedyData) {
        const response = await api.post(API_ENDPOINTS.REMEDIES.BASE, remedyData);
        return response;
    },
    
    /**
     * Update an existing remedy
     * @param {string} id - Remedy ID
     * @param {Object} remedyData - Updated remedy data
     * @returns {Promise<Object>} Response with updated remedy
     */
    async update(id, remedyData) {
        const response = await api.put(API_ENDPOINTS.REMEDIES.BY_ID(id), remedyData);
        return response;
    },
    
    /**
     * Delete a remedy
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async delete(id) {
        const response = await api.delete(API_ENDPOINTS.REMEDIES.BY_ID(id));
        return response;
    },
    
    /**
     * Rate a remedy
     * @param {string} id - Remedy ID
     * @param {number} rating - Rating value (1-5)
     * @returns {Promise<Object>} Response with updated remedy
     */
    async rate(id, rating) {
        const response = await api.post(API_ENDPOINTS.REMEDIES.RATE(id), { rating });
        return response;
    },
    
    /**
     * Save/bookmark a remedy
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async save(id) {
        const response = await api.post(API_ENDPOINTS.REMEDIES.SAVE(id));
        return response;
    },
    
    /**
     * Unsave/unbookmark a remedy
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async unsave(id) {
        const response = await api.delete(API_ENDPOINTS.REMEDIES.SAVE(id));
        return response;
    },
    
    /**
     * Get user's saved remedies
     * @returns {Promise<Object>} Response with saved remedies
     */
    async getSaved() {
        const response = await api.get(API_ENDPOINTS.REMEDIES.SAVED);
        return response;
    },
    
    /**
     * Get user's saved remedies (alias)
     * @returns {Promise<Object>} Response with saved remedies
     */
    async getSavedRemedies() {
        return this.getSaved();
    },
    
    /**
     * Unsave a remedy (alias)
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async unsaveRemedy(id) {
        return this.unsave(id);
    },
    
    /**
     * Favorite a remedy
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async favoriteRemedy(id) {
        const response = await api.post(API_ENDPOINTS.REMEDIES.SAVE(id));
        return response;
    },
    
    /**
     * Unfavorite a remedy
     * @param {string} id - Remedy ID
     * @returns {Promise<Object>} Response with status
     */
    async unfavoriteRemedy(id) {
        const response = await api.delete(API_ENDPOINTS.REMEDIES.SAVE(id));
        return response;
    },
    
    /**
     * Get user's favorite remedies
     * @returns {Promise<Object>} Response with favorite remedies
     */
    async getFavoriteRemedies() {
        const response = await api.get(API_ENDPOINTS.REMEDIES.SAVED);
        return response;
    },
    
    /**
     * Get popular/featured remedies
     * @param {number} limit - Number of remedies to fetch
     * @returns {Promise<Object>} Response with popular remedies
     */
    async getPopular(limit = 6) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.BASE, {
            params: { sort: '-rating', limit }
        });
        return response;
    },
    
    /**
     * Get latest remedies
     * @param {number} limit - Number of remedies to fetch
     * @returns {Promise<Object>} Response with latest remedies
     */
    async getLatest(limit = 6) {
        const response = await api.get(API_ENDPOINTS.REMEDIES.BASE, {
            params: { sort: '-createdAt', limit }
        });
        return response;
    },

    /**
     * Get user's own created remedies
     * @param {string} userId - User ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Response with user's remedies
     */
    async getUserRemedies(userId, params = {}) {
        const response = await api.get(`/remedies/user/${userId}`, { params });
        return response;
    },
};

export default remedyService;
