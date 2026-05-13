// ============================================
// HOMELY - OTP Verification Page
// ============================================
// Email verification with 6-digit OTP code
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiRefreshCw, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { OTPInput } from '../components/auth';
import { Button } from '../components/common';

// --------------------------------------------
// OTP VERIFICATION PAGE COMPONENT
// --------------------------------------------

const VerifyOTPPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyOTP, resendOTP, pendingEmail, isAuthLoading } = useAuth();
    const { t } = useLanguage();
    
    // Get email from location state or context
    const email = location.state?.email || pendingEmail;
    const isNewUser = location.state?.isNewUser || false;
    
    // Component state
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isResending, setIsResending] = useState(false);
    
    // Redirect if no email
    useEffect(() => {
        if (!email) {
            navigate('/login', { replace: true });
        }
    }, [email, navigate]);
    
    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);
    
    /**
     * Handle OTP change
     */
    const handleOTPChange = (value) => {
        setOtp(value);
        setError('');
    };
    
    /**
     * Handle OTP completion (auto-submit)
     */
    const handleOTPComplete = async (value) => {
        setOtp(value);
        await handleSubmit(value);
    };
    
    /**
     * Handle form submission
     */
    const handleSubmit = async (otpValue = otp) => {
        if (otpValue.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }
        
        const result = await verifyOTP(otpValue, email);
        
        if (result.success) {
            navigate('/dashboard', { replace: true });
        } else {
            setError(result.error || result.message || 'Invalid verification code');
        }
    };
    
    /**
     * Handle resend OTP
     */
    const handleResend = async () => {
        if (!canResend || isResending) return;
        
        setIsResending(true);
        setError('');
        
        const result = await resendOTP(email);
        
        if (result.success) {
            setResendTimer(60);
            setCanResend(false);
            setOtp('');
        } else {
            setError(result.error || 'Failed to resend verification code');
        }
        
        setIsResending(false);
    };
    
    // Format timer
    const formatTimer = () => {
        const mins = Math.floor(resendTimer / 60);
        const secs = resendTimer % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    if (!email) return null;
    
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
            
            {/* Header */}
            <div className="text-center mb-8">
                {/* Email Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full
                               bg-gradient-to-br from-[var(--color-primary-100)] to-[var(--color-primary-200)]
                               dark:from-[var(--color-primary-900)] dark:to-[var(--color-primary-800)]
                               flex items-center justify-center"
                >
                    <FiMail className="w-10 h-10 text-[var(--color-primary-600)]" />
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-[var(--color-text-primary)] mb-2"
                >
                    {t('auth.otpTitle')} 📧
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[var(--color-text-secondary)]"
                >
                    {t('auth.otpSubtitle')}
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[var(--color-primary-600)] font-semibold"
                >
                    {email}
                </motion.p>
            </div>
            
            {/* OTP Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] 
                                     text-center mb-4">
                        {t('auth.enterOtp')}
                    </label>
                    
                    <OTPInput
                        length={6}
                        value={otp}
                        onChange={handleOTPChange}
                        onComplete={handleOTPComplete}
                        error={!!error}
                    />
                    
                    {/* Error Message */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[var(--color-error-500)] text-sm text-center mt-3"
                        >
                            {error}
                        </motion.p>
                    )}
                </div>
                
                {/* Verify Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isAuthLoading}
                    disabled={otp.length !== 6}
                    iconRight={FiCheck}
                >
                    {t('auth.verifyOtp')}
                </Button>
            </form>
            
            {/* Resend Section */}
            <div className="mt-8 text-center">
                <p className="text-[var(--color-text-tertiary)] text-sm mb-3">
                    Didn't receive the code?
                </p>
                
                {canResend ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleResend}
                        disabled={isResending}
                        className="inline-flex items-center gap-2 text-[var(--color-primary-600)]
                                   font-semibold hover:underline disabled:opacity-50"
                    >
                        <FiRefreshCw className={isResending ? 'animate-spin' : ''} />
                        {isResending ? 'Sending...' : t('auth.resendOtp')}
                    </motion.button>
                ) : (
                    <p className="text-[var(--color-text-secondary)]">
                        {t('auth.resendIn')}{' '}
                        <span className="font-mono font-bold text-[var(--color-primary-600)]">
                            {formatTimer()}
                        </span>
                        {' '}{t('auth.seconds')}
                    </p>
                )}
            </div>
            
            {/* Help Text */}
            <p className="text-center mt-6 text-xs text-[var(--color-text-tertiary)]">
                Check your spam folder if you don't see the email.
                <br />
                The code expires in 10 minutes.
            </p>
        </motion.div>
    );
};

export default VerifyOTPPage;
