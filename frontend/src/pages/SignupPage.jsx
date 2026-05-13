// ============================================
// HOMELY - Signup Page
// ============================================
// User registration with email verification
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { Input, Button } from '../components/common';

// --------------------------------------------
// PASSWORD REQUIREMENTS COMPONENT
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
// SIGNUP PAGE COMPONENT
// --------------------------------------------

const SignupPage = () => {
    const navigate = useNavigate();
    const { register, isAuthLoading } = useAuth();
    const { t } = useLanguage();
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showRequirements, setShowRequirements] = useState(false);
    
    // Password requirements check
    const passwordChecks = {
        length: formData.password.length >= 6,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
    };
    
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
        
        if (!formData.name.trim()) {
            newErrors.name = t('auth.nameRequired');
        } else if (formData.name.trim().length < 2) {
            newErrors.name = t('auth.nameMin');
        }
        
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
        
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.confirmPasswordRequired');
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
        
        const result = await register({
            name: formData.name.trim(),
            email: formData.email,
            password: formData.password,
        });
        
        if (result.success) {
            if (result.needsVerification) {
                // Production: needs email verification
                navigate('/verify-otp', { state: { email: formData.email, isNewUser: true } });
            } else {
                // Development: direct login, go to dashboard
                navigate('/dashboard');
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
                    {t('auth.signupTitle')}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[var(--color-text-secondary)]"
                >
                    {t('auth.signupSubtitle')}
                </motion.p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="text"
                    name="name"
                    label={t('auth.fullName')}
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    icon={FiUser}
                    error={errors.name}
                    required
                />
                
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
                
                <div>
                    <Input
                        type="password"
                        name="password"
                        label={t('auth.password')}
                        placeholder={t('auth.createPassword')}
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
                        <PasswordRequirement met={passwordChecks.length} text={t('auth.atLeast6Chars')} />
                        <PasswordRequirement met={passwordChecks.uppercase} text={t('auth.oneUppercase')} />
                        <PasswordRequirement met={passwordChecks.lowercase} text={t('auth.oneLowercase')} />
                        <PasswordRequirement met={passwordChecks.number} text={t('auth.oneNumber')} />
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
                
                {/* Terms Agreement */}
                <p className="text-xs text-[var(--color-text-tertiary)] text-center py-2">
                    {t('auth.termsAgree')}{' '}
                    <Link to="/terms" className="text-[#14532d] hover:underline">
                        {t('auth.termsOfService')}
                    </Link>
                    {' '}{t('auth.and')}{' '}
                    <Link to="/privacy" className="text-[#14532d] hover:underline">
                        {t('auth.privacyPolicy')}
                    </Link>
                </p>
                
                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={isAuthLoading}
                    iconRight={FiArrowRight}
                >
                    {t('auth.signUp')}
                </Button>
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-border-primary)]" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-tertiary)]">
                        {t('auth.orContinueWith')}
                    </span>
                </div>
            </div>
            
            {/* Social Signup */}
            <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
                icon={FcGoogle}
                onClick={() => console.log('Google signup - TODO')}
            >
                Google
            </Button>
            
            {/* Footer */}
            <p className="text-center mt-6 text-[var(--color-text-secondary)]">
                {t('auth.hasAccount')}{' '}
                <Link 
                    to="/login" 
                    className="text-[#14532d] font-semibold hover:underline"
                >
                    {t('auth.signIn')}
                </Link>
            </p>
        </motion.div>
    );
};

export default SignupPage;
