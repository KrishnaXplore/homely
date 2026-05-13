// ============================================
// HOMELY - Login Page
// ============================================
// User login with email and password
// ============================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { Input, Button } from '../components/common';

// --------------------------------------------
// LOGIN PAGE COMPONENT
// --------------------------------------------

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthLoading } = useAuth();
    const { t } = useLanguage();
    
    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    
    // Get redirect path
    const from = location.state?.from?.pathname || '/dashboard';
    
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    /**
     * Validate form
     */
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = t('auth.emailRequired');
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('auth.validEmail');
        }
        
        if (!formData.password) {
            newErrors.password = t('auth.passwordRequired');
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.passwordMin');
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
        
        const result = await login(formData);
        
        if (result.success) {
            if (result.needsVerification) {
                navigate('/verify-otp', { state: { email: formData.email } });
            } else {
                navigate(from, { replace: true });
            }
        }
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                       rounded-3xl p-8 shadow-2xl"
        >
            {/* Header */}
            <div className="text-center mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl font-bold text-[var(--color-text-primary)] mb-2"
                >
                    {t('auth.welcomeBack')}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[var(--color-text-secondary)]"
                >
                    {t('auth.signInToContinue')}
                </motion.p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                    type="email"
                    name="email"
                    label={t('auth.emailAddress')}
                    placeholder={t('auth.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    icon={FiMail}
                    error={errors.email}
                    required
                />
                
                <Input
                    type="password"
                    name="password"
                    label={t('auth.password')}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={formData.password}
                    onChange={handleChange}
                    icon={FiLock}
                    error={errors.password}
                    required
                />
                
                {/* Forgot Password Link */}
                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-[#14532d] hover:underline"
                    >
                        {t('auth.forgotPassword')}
                    </Link>
                </div>
                
                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isAuthLoading}
                    iconRight={FiArrowRight}
                >
                    {t('auth.signIn')}
                </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-border-primary)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-tertiary)]">
                        {t('auth.orContinueWith')}
                    </span>
                </div>
            </div>
            
            {/* Social Login */}
            <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                icon={FcGoogle}
                onClick={() => console.log('Google login - TODO')}
            >
                Google
            </Button>
            
            {/* Footer */}
            <p className="text-center mt-8 text-[var(--color-text-secondary)]">
                {t('auth.noAccount')}{' '}
                <Link 
                    to="/signup" 
                    className="text-[#14532d] font-semibold hover:underline"
                >
                    {t('auth.signUpFree')}
                </Link>
            </p>
        </motion.div>
    );
};

export default LoginPage;
