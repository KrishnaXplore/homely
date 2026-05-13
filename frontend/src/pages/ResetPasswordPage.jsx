// ============================================
// HOMELY - Reset Password Page
// ============================================
// Set new password using reset token
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiArrowLeft, FiArrowRight, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { Input, Button } from '../components/common';

// --------------------------------------------
// PASSWORD REQUIREMENT COMPONENT
// --------------------------------------------

const PasswordRequirement = ({ met, text }) => (
    <div className={`flex items-center gap-2 text-sm transition-colors ${
        met 
            ? 'text-[var(--color-success-600)]' 
            : 'text-[var(--color-text-tertiary)]'
    }`}>
        <motion.div
            initial={false}
            animate={{ scale: met ? 1 : 0.8, opacity: met ? 1 : 0.5 }}
        >
            <FiCheck className={met ? 'visible' : 'invisible'} />
        </motion.div>
        <span>{text}</span>
    </div>
);

// --------------------------------------------
// RESET PASSWORD PAGE COMPONENT
// --------------------------------------------

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { resetPassword, isAuthLoading } = useAuth();
    const { t } = useLanguage();
    
    // Get token from URL
    const token = searchParams.get('token');
    
    // Component state
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showRequirements, setShowRequirements] = useState(false);
    const [tokenError, setTokenError] = useState(false);
    
    // Password requirements check
    const passwordChecks = {
        length: formData.password.length >= 6,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
    };
    
    // Check for token
    useEffect(() => {
        if (!token) {
            setTokenError(true);
        }
    }, [token]);
    
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    /**
     * Validate form
     */
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.password) {
            newErrors.password = t('auth.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.passwordMin');
        }
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.confirmPassword');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.passwordsMatch');
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        const result = await resetPassword(token, formData.password);
        
        if (result.success) {
            setIsSubmitted(true);
        } else if (result.message?.includes('expired') || result.message?.includes('invalid')) {
            setTokenError(true);
        }
    };
    
    // Token Error State
    if (tokenError) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                           rounded-3xl p-8 shadow-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full
                               bg-gradient-to-br from-[var(--color-error-100)] to-[var(--color-error-200)]
                               dark:from-[var(--color-error-900)] dark:to-[var(--color-error-800)]
                               flex items-center justify-center"
                >
                    <FiAlertCircle className="w-10 h-10 text-[var(--color-error-600)]" />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                    Invalid or Expired Link
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-6">
                    This password reset link is invalid or has expired.
                    <br />
                    Please request a new one.
                </p>
                
                <Link to="/forgot-password">
                    <Button variant="primary" size="lg" fullWidth>
                        Request New Link
                    </Button>
                </Link>
                
                <p className="mt-6 text-sm text-[var(--color-text-tertiary)]">
                    Remember your password?{' '}
                    <Link 
                        to="/login" 
                        className="text-[var(--color-primary-600)] font-semibold hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                       rounded-3xl p-8 shadow-2xl"
        >
            {/* Back Button */}
            <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-[var(--color-text-secondary)]
                           hover:text-[var(--color-text-primary)] transition-colors mb-6"
            >
                <FiArrowLeft />
                {t('auth.backToLogin')}
            </Link>
            
            <AnimatePresence mode="wait">
                {!isSubmitted ? (
                    // Reset Form
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', duration: 0.5 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full
                                           bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)]
                                           dark:from-[var(--color-primary-900)] dark:to-[var(--color-primary-800)]
                                           flex items-center justify-center"
                            >
                                <FiLock className="w-10 h-10 text-[var(--color-primary-600)]" />
                            </motion.div>
                            
                            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                {t('auth.resetPassword')} 🔐
                            </h1>
                            <p className="text-[var(--color-text-secondary)]">
                                {t('auth.enterEmailToReset')}
                            </p>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    type="password"
                                    name="password"
                                    label={t('auth.newPassword')}
                                    placeholder={t('auth.newPasswordPlaceholder')}
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setShowRequirements(true)}
                                    icon={FiLock}
                                    error={errors.password}
                                    required
                                />
                                
                                {/* Password Requirements */}
                                <motion.div
                                    initial={false}
                                    animate={{ 
                                        height: showRequirements ? 'auto' : 0,
                                        opacity: showRequirements ? 1 : 0 
                                    }}
                                    className="overflow-hidden mt-2 space-y-1"
                                >
                                    <PasswordRequirement met={passwordChecks.length} text="At least 6 characters" />
                                    <PasswordRequirement met={passwordChecks.uppercase} text="One uppercase letter" />
                                    <PasswordRequirement met={passwordChecks.lowercase} text="One lowercase letter" />
                                    <PasswordRequirement met={passwordChecks.number} text="One number" />
                                </motion.div>
                            </div>
                            
                            <Input
                                type="password"
                                name="confirmPassword"
                                label={t('auth.confirmPassword')}
                                placeholder={t('auth.confirmPasswordPlaceholder')}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                icon={FiLock}
                                error={errors.confirmPassword}
                                required
                            />
                            
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={isAuthLoading}
                                iconRight={FiArrowRight}
                            >
                                {t('auth.resetPassword')}
                            </Button>
                        </form>
                    </motion.div>
                ) : (
                    // Success State
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-center"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', duration: 0.5 }}
                            className="w-24 h-24 mx-auto mb-6 rounded-full
                                       bg-gradient-to-br from-[var(--color-success-100)] to-[var(--color-success-200)]
                                       dark:from-[var(--color-success-900)] dark:to-[var(--color-success-800)]
                                       flex items-center justify-center"
                        >
                            <FiCheck className="w-12 h-12 text-[var(--color-success-600)]" />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                            {t('auth.resetSuccess')} 🎉
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mb-8">
                            {t('auth.resetSuccess')}
                        </p>
                        
                        <Link to="/login">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                iconRight={FiArrowRight}
                            >
                                Sign In Now
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ResetPasswordPage;
