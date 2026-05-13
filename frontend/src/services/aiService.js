// ============================================
// HOMELY - AI Service
// ============================================
// API calls for AI-powered features
// ============================================

import api from './api';

// --------------------------------------------
// AI SERVICE
// --------------------------------------------

const aiService = {
    /**
     * Send a message to AI assistant
     * @param {string} message - User's message
     * @param {Array} conversationHistory - Previous messages
     * @param {Object} remedyContext - Optional remedy context
     * @param {string} language - Language code (en, hi, kn)
     * @param {string} image - Optional base64 image for vision analysis
     * @returns {Promise<Object>} AI response
     */
    async chat(message, conversationHistory = [], remedyContext = null, language = 'en', image = null) {
        const payload = {
            message,
            conversationHistory,
            remedyContext,
            language,
        };
        
        // Include image if provided
        if (image) {
            payload.image = image;
        }
        
        const response = await api.post('/ai/chat', payload);
        return response;
    },
    
    /**
     * AI-powered natural language search
     * @param {string} query - Search query
     * @param {string} language - Language code
     * @returns {Promise<Object>} Search results
     */
    async search(query, language = 'en') {
        const response = await api.post('/ai/search', { query, language });
        return response;
    },
};

export default aiService;
