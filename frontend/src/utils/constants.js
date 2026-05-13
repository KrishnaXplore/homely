// ============================================
// HOMELY - Application Constants
// ============================================
// Central place for all constant values
// Keeps magic strings/numbers organized
// ============================================

// --------------------------------------------
// API CONFIGURATION
// --------------------------------------------

/**
 * Base URL for API requests
 * Uses environment variable or defaults to localhost
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * API endpoints organized by feature
 */
export const API_ENDPOINTS = {
    // Authentication endpoints
    AUTH: {
        REGISTER: '/auth/signup',
        SIGNUP: '/auth/signup',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        VERIFY_OTP: '/auth/verify-otp',
        RESEND_OTP: '/auth/resend-otp',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        ME: '/auth/me',
        UPDATE_PASSWORD: '/auth/update-password',
    },
    // Remedy endpoints
    REMEDIES: {
        BASE: '/remedies',
        BY_ID: (id) => `/remedies/${id}`,
        SEARCH: '/remedies/search',
        CATEGORIES: '/remedies/categories',
        POPULAR: '/remedies/popular',
        SAVED: '/remedies/user/saved/list',
        RATE: (id) => `/remedies/${id}/rate`,
        SAVE: (id) => `/remedies/${id}/save`,
    },
    // User endpoints
    USERS: {
        PROFILE: '/users/profile',
        PREFERENCES: '/users/preferences',
        DASHBOARD: '/users/dashboard',
    },
    // AI endpoints
    AI: {
        CHAT: '/ai/chat',
        MODERATE: '/ai/moderate',
        FORMAT: '/ai/format',
    },
};

// --------------------------------------------
// REMEDY CATEGORIES
// --------------------------------------------

/**
 * Available remedy categories with display info
 */
export const REMEDY_CATEGORIES = [
    { value: 'immunity-booster', label: 'Immunity Boosters', icon: '🛡️', color: 'green' },
    { value: 'digestive-health', label: 'Digestive Health', icon: '🍵', color: 'amber' },
    { value: 'cold-and-cough', label: 'Cold & Cough', icon: '🤧', color: 'blue' },
    { value: 'skin-care', label: 'Skin Care', icon: '✨', color: 'pink' },
    { value: 'hair-care', label: 'Hair Care', icon: '💇', color: 'purple' },
    { value: 'sleep-and-relaxation', label: 'Sleep & Relaxation', icon: '😴', color: 'indigo' },
    { value: 'pain-relief', label: 'Pain Relief', icon: '💪', color: 'red' },
    { value: 'energy-booster', label: 'Energy Boosters', icon: '⚡', color: 'yellow' },
    { value: 'womens-health', label: "Women's Health", icon: '🌸', color: 'rose' },
    { value: 'mens-health', label: "Men's Health", icon: '💙', color: 'cyan' },
    { value: 'childrens-health', label: "Children's Health", icon: '👶', color: 'teal' },
    { value: 'elderly-care', label: 'Elderly Care', icon: '🧓', color: 'slate' },
];

// --------------------------------------------
// DIFFICULTY LEVELS
// --------------------------------------------

/**
 * Remedy difficulty levels
 */
export const DIFFICULTY_LEVELS = [
    { value: 'easy', label: 'Easy', color: 'green', description: 'Simple, quick to prepare' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Some experience helpful' },
    { value: 'hard', label: 'Hard', color: 'red', description: 'Complex, requires skill' },
];

// --------------------------------------------
// SORT OPTIONS
// --------------------------------------------

/**
 * Sorting options for remedy lists
 */
export const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'az', label: 'A to Z' },
    { value: 'za', label: 'Z to A' },
];

// --------------------------------------------
// THEME CONFIGURATION
// --------------------------------------------

/**
 * Theme options for the application
 */
export const THEME_OPTIONS = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};

// --------------------------------------------
// PAGINATION
// --------------------------------------------

/**
 * Default pagination settings
 */
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
};

// --------------------------------------------
// VALIDATION RULES
// --------------------------------------------

/**
 * Validation constants
 */
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    NAME_MAX_LENGTH: 50,
    BIO_MAX_LENGTH: 500,
    REMEDY_TITLE_MAX_LENGTH: 100,
    REMEDY_DESCRIPTION_MAX_LENGTH: 500,
    OTP_LENGTH: 6,
};

// --------------------------------------------
// LOCAL STORAGE KEYS
// --------------------------------------------

/**
 * Keys for localStorage
 */
export const STORAGE_KEYS = {
    TOKEN: 'homely_token',
    AUTH_TOKEN: 'homely_token', // Alias for TOKEN (used in auth services)
    USER: 'homely_user',
    THEME: 'homely_theme',
    RECENT_SEARCHES: 'homely_recent_searches',
};

// --------------------------------------------
// ANIMATION DURATIONS
// --------------------------------------------

/**
 * Standard animation durations (in seconds)
 */
export const ANIMATION = {
    FAST: 0.15,
    NORMAL: 0.3,
    SLOW: 0.5,
    PAGE_TRANSITION: 0.4,
};
