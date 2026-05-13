// ============================================
// HOMELY - Authentication Context
// ============================================
// Global auth state management
// Handles user login, logout, and session
// ============================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { setAuthToken } from '../services/api';
import { useLanguage } from './LanguageContext';

// --------------------------------------------
// AUTH CONTEXT
// --------------------------------------------

const AuthContext = createContext(null);

// --------------------------------------------
// AUTH PROVIDER COMPONENT
// --------------------------------------------

/**
 * AuthProvider - Provides authentication state and methods
 * 
 * Features:
 * - User state management
 * - Login/Logout functionality
 * - OTP verification flow
 * - Persistent session (localStorage)
 * - Loading states for auth operations
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
    // --------------------------------------------
    // HOOKS
    // --------------------------------------------
    
    const { t } = useLanguage();
    
    // --------------------------------------------
    // STATE
    // --------------------------------------------
    
    // Current user object
    const [user, setUser] = useState(null);
    
    // Loading state for initial auth check
    const [isLoading, setIsLoading] = useState(true);
    
    // Loading state for auth operations
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    
    // Email for OTP verification flow
    const [pendingEmail, setPendingEmail] = useState(null);
    
    // --------------------------------------------
    // INITIALIZE AUTH
    // --------------------------------------------
    
    /**
     * Check for existing session on mount
     */
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check for stored user
                const storedUser = authService.getStoredUser();
                
                if (storedUser && authService.isAuthenticated()) {
                    // Verify token is still valid by fetching current user
                    try {
                        const response = await authService.getCurrentUser();
                        if (response.success) {
                            setUser(response.user);
                        } else {
                            // Token invalid, clear session
                            authService.logout();
                        }
                    } catch (error) {
                        // Token expired or invalid
                        authService.logout();
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        initializeAuth();
    }, []);
    
    // --------------------------------------------
    // AUTH METHODS
    // --------------------------------------------
    
    /**
     * Register a new user
     * @param {Object} userData - Registration data
     * @returns {Promise<Object>} Result object
     */
    const register = useCallback(async (userData) => {
        setIsAuthLoading(true);
        
        try {
            const response = await authService.register(userData);
            
            if (response.success) {
                // Check if user is already verified (development mode)
                if (response.user && response.token) {
                    // Direct login - no verification needed
                    setUser(response.user);
                    toast.success(t('success.accountCreated'));
                    return { success: true, needsVerification: false };
                }
                
                // Store email for OTP verification (production)
                setPendingEmail(userData.email);
                toast.success(t('success.registrationSuccessful'));
                return { success: true, needsVerification: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, []);
    
    /**
     * Login user
     * @param {Object} credentials - Login credentials
     * @returns {Promise<Object>} Result object
     */
    const login = useCallback(async (credentials) => {
        setIsAuthLoading(true);
        
        try {
            const response = await authService.login(credentials);
            
            if (response.success) {
                // Check if email verification is needed
                if (response.needsVerification) {
                    setPendingEmail(credentials.email);
                    toast.success(t('success.pleaseVerifyEmail'));
                    return { success: true, needsVerification: true };
                }
                
                // Login successful
                setUser(response.user);
                toast.success(t('success.welcomeBackUser', { name: response.user.name }));
                return { success: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, []);
    
    /**
     * Verify email with OTP
     * @param {string} otp - OTP code
     * @param {string} emailOverride - Optional email override for page refresh/direct navigation
     * @returns {Promise<Object>} Result object
     */
    const verifyOTP = useCallback(async (otp, emailOverride = pendingEmail) => {
        const verificationEmail = emailOverride || pendingEmail;

        if (!verificationEmail) {
            return { success: false, error: 'No pending verification' };
        }
        
        setIsAuthLoading(true);
        
        try {
            const response = await authService.verifyOTP({
                email: verificationEmail,
                otp
            });
            
            if (response.success) {
                setUser(response.user);
                setPendingEmail(null);
                toast.success(t('success.emailVerified'));
                return { success: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Verification failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, [pendingEmail, t]);
    
    /**
     * Resend OTP to pending email
     * @param {string} emailOverride - Optional email override for page refresh/direct navigation
     * @returns {Promise<Object>} Result object
     */
    const resendOTP = useCallback(async (emailOverride = pendingEmail) => {
        const verificationEmail = emailOverride || pendingEmail;

        if (!verificationEmail) {
            return { success: false, error: 'No pending verification' };
        }
        
        setIsAuthLoading(true);
        
        try {
            const response = await authService.resendOTP({ email: verificationEmail });
            
            if (response.success) {
                if (!pendingEmail) {
                    setPendingEmail(verificationEmail);
                }
                toast.success(t('success.otpSentSuccess'));
                return { success: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Failed to resend OTP';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, [pendingEmail, t]);
    
    /**
     * Request password reset
     * @param {string} email - User's email
     * @returns {Promise<Object>} Result object
     */
    const forgotPassword = useCallback(async (email) => {
        setIsAuthLoading(true);
        
        try {
            const response = await authService.forgotPassword({ email });
            
            if (response.success) {
                setPendingEmail(email);
                toast.success(t('success.passwordResetOtpSent'));
                return { success: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Failed to send reset email';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, []);
    
    /**
     * Reset password with OTP
     * @param {string} otp - OTP code
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Result object
     */
    const resetPassword = useCallback(async (otp, newPassword) => {
        if (!pendingEmail) {
            return { success: false, error: 'No pending reset request' };
        }
        
        setIsAuthLoading(true);
        
        try {
            const response = await authService.resetPassword({
                email: pendingEmail,
                otp,
                newPassword
            });
            
            if (response.success) {
                setPendingEmail(null);
                toast.success(t('success.passwordResetSuccess'));
                return { success: true };
            }
            
            return { success: false, error: response.message };
        } catch (error) {
            const message = error.message || 'Password reset failed';
            toast.error(message);
            return { success: false, error: message };
        } finally {
            setIsAuthLoading(false);
        }
    }, [pendingEmail]);
    
    /**
     * Logout user
     */
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setPendingEmail(null);
        toast.success(t('success.loggedOut'));
    }, []);
    
    /**
     * Update user in state (for profile updates)
     * @param {Object} updatedUser - Updated user data
     */
    const updateUser = useCallback((updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('homely_user', JSON.stringify(updatedUser));
    }, []);
    
    // --------------------------------------------
    // CONTEXT VALUE
    // --------------------------------------------
    
    const value = {
        // State
        user,
        isLoading,
        isAuthLoading,
        isAuthenticated: !!user,
        pendingEmail,
        
        // Methods
        register,
        login,
        logout,
        verifyOTP,
        resendOTP,
        forgotPassword,
        resetPassword,
        updateUser,
        setPendingEmail,
    };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// --------------------------------------------
// CUSTOM HOOK
// --------------------------------------------

/**
 * useAuth - Hook to access auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

export default AuthContext;
