// ============================================
// HOMELY - Forgot Password Page
// ============================================
// Request password reset email
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { Input, Button } from '../components/common';

// --------------------------------------------
// FORGOT PASSWORD PAGE COMPONENT
// --------------------------------------------

const ForgotPasswordPage = () => {
    const { forgotPassword, isAuthLoading } = useAuth();
    const { t } = useLanguage();
    
    // Component state
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError(t('auth.emailRequired'));
            return;
        }
        
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError(t('auth.validEmail'));
            return;
        }
        
        const result = await forgotPassword(email);
        
        if (result.success) {
            setIsSubmitted(true);
        }
    };
    
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
                    // Request Form
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
                                           bg-gradient-to-br from-amber-100 to-amber-200
                                           dark:from-amber-900/50 dark:to-amber-800/50
                                           flex items-center justify-center"
                            >
                                <span className="text-4xl">🔑</span>
                            </motion.div>
                            
                            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                {t('auth.forgotPassword')}
                            </h1>
                            <p className="text-[var(--color-text-secondary)]">
                                {t('auth.enterEmailToReset')}
                            </p>
                        </div>
                        
                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                type="email"
                                name="email"
                                label={t('auth.emailAddress')}
                                placeholder={t('auth.emailPlaceholder')}
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                icon={FiMail}
                                error={error}
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
                                {t('auth.sendResetLink')}
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
                            {t('auth.checkEmailForReset')} 📧
                        </h1>
                        <p className="text-[var(--color-text-secondary)] mb-2">
                            {t('auth.checkEmailForReset')}
                        </p>
                        <p className="text-[var(--color-primary-600)] font-semibold mb-6">
                            {email}
                        </p>
                        
                        <div className="bg-[var(--color-bg-tertiary)] rounded-xl p-4 mb-6">
                            <p className="text-sm text-[var(--color-text-secondary)]">
                                📌 The link will expire in <strong>1 hour</strong>
                                <br />
                                Check your spam folder if you don't see it
                            </p>
                        </div>
                        
                        <Button
                            variant="secondary"
                            size="lg"
                            fullWidth
                            onClick={() => setIsSubmitted(false)}
                        >
                            Send Another Link
                        </Button>
                        
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
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ForgotPasswordPage;
