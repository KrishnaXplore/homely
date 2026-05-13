// ============================================
// HOMELY - Settings Page
// ============================================
// User settings including language preferences
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiGlobe, 
    FiBell,
    FiLock,
    FiUser,
    FiCheck,
    FiChevronRight,
    FiChevronDown,
    FiArrowLeft,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import toast from 'react-hot-toast';

// --------------------------------------------
// ANIMATION VARIANTS
// --------------------------------------------

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { opacity: 0, y: -20 }
};

const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.3 }
    })
};

// --------------------------------------------
// SETTINGS PAGE COMPONENT
// --------------------------------------------

const SettingsPage = () => {
    const navigate = useNavigate();
    const { t, language, changeLanguage, getAvailableLanguages } = useLanguage();
    const { user } = useAuth();
    
    // Local state for settings
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [profileVisibility, setProfileVisibility] = useState('public');
    const [showEmail, setShowEmail] = useState(false);
    
    // Change Password state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Get available languages
    const languages = getAvailableLanguages();

    // ----------------------------------------
    // HANDLERS
    // ----------------------------------------

    const handleLanguageChange = (langCode) => {
        setSelectedLanguage(langCode);
        changeLanguage(langCode);
        toast.success(t('settings.saved'));
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        // Validate
        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }
        
        if (passwordForm.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        setIsChangingPassword(true);
        
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            
            toast.success('Password changed successfully!');
            setShowChangePassword(false);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-bg-primary py-8 px-4"
        >
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4 transition-colors"
                    >
                        <FiArrowLeft />
                        <span>{t('back')}</span>
                    </button>
                    <h1 className="text-3xl font-bold text-text-primary">
                        {t('settings.title')}
                    </h1>
                    <p className="text-text-secondary mt-2">
                        {t('settings.subtitle')}
                    </p>
                </div>

                {/* Settings Sections */}
                <div className="space-y-6">
                    
                    {/* ===== LANGUAGE SECTION ===== */}
                    <motion.div
                        variants={cardVariants}
                        custom={0}
                        className="bg-bg-card rounded-2xl border border-border-primary overflow-hidden"
                    >
                        <div className="p-6 border-b border-border-primary">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                                    <FiGlobe className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">
                                        {t('settings.language')}
                                    </h2>
                                    <p className="text-sm text-text-secondary">
                                        {t('settings.languageDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="space-y-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                            selectedLanguage === lang.code
                                                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500'
                                                : 'bg-bg-secondary hover:bg-bg-tertiary border-2 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">
                                                {lang.code === 'en' && '🇬🇧'}
                                                {lang.code === 'hi' && '🇮🇳'}
                                                {lang.code === 'kn' && '🇮🇳'}
                                            </span>
                                            <div className="text-left">
                                                <p className="font-medium text-text-primary">
                                                    {lang.name}
                                                </p>
                                                <p className="text-sm text-text-secondary">
                                                    {lang.fullName}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedLanguage === lang.code && (
                                            <div className="p-1 bg-green-500 rounded-full">
                                                <FiCheck className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* ===== NOTIFICATIONS SECTION ===== */}
                    <motion.div
                        variants={cardVariants}
                        custom={1}
                        className="bg-bg-card rounded-2xl border border-border-primary overflow-hidden"
                    >
                        <div className="p-6 border-b border-border-primary">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                                    <FiBell className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">
                                        {t('settings.notifications')}
                                    </h2>
                                    <p className="text-sm text-text-secondary">
                                        {t('settings.notificationsDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
                                <span className="text-text-primary">
                                    {t('settings.emailNotifications')}
                                </span>
                                <button
                                    onClick={() => setEmailNotifications(!emailNotifications)}
                                    className="relative w-12 h-6 rounded-full transition-all duration-300"
                                    style={{
                                        background: emailNotifications 
                                            ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' 
                                            : '#6b7280',
                                        boxShadow: emailNotifications 
                                            ? '0 0 12px rgba(34, 197, 94, 0.5)' 
                                            : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <span
                                        className="absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            transform: emailNotifications ? 'translateX(24px)' : 'translateX(0)'
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
                                <span className="text-text-primary">
                                    {t('settings.pushNotifications')}
                                </span>
                                <button
                                    onClick={() => setPushNotifications(!pushNotifications)}
                                    className="relative w-12 h-6 rounded-full transition-all duration-300"
                                    style={{
                                        background: pushNotifications 
                                            ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' 
                                            : '#6b7280',
                                        boxShadow: pushNotifications 
                                            ? '0 0 12px rgba(34, 197, 94, 0.5)' 
                                            : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <span
                                        className="absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            transform: pushNotifications ? 'translateX(24px)' : 'translateX(0)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ===== PRIVACY SECTION ===== */}
                    <motion.div
                        variants={cardVariants}
                        custom={3}
                        className="bg-bg-card rounded-2xl border border-border-primary overflow-hidden"
                    >
                        <div className="p-6 border-b border-border-primary">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl">
                                    <FiLock className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">
                                        {t('settings.privacy')}
                                    </h2>
                                    <p className="text-sm text-text-secondary">
                                        {t('settings.privacyDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-4">
                            {/* Profile Visibility */}
                            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
                                <span className="text-text-primary">
                                    {t('settings.profileVisibility')}
                                </span>
                                <select
                                    value={profileVisibility}
                                    onChange={(e) => setProfileVisibility(e.target.value)}
                                    className="bg-bg-tertiary text-text-primary px-3 py-1.5 rounded-lg border border-border-primary focus:outline-none focus:border-green-500"
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                    <option value="followers">Followers Only</option>
                                </select>
                            </div>

                            {/* Show Email */}
                            <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl">
                                <span className="text-text-primary">
                                    {t('settings.showEmail')}
                                </span>
                                <button
                                    onClick={() => setShowEmail(!showEmail)}
                                    className="relative w-12 h-6 rounded-full transition-all duration-300"
                                    style={{
                                        background: showEmail 
                                            ? 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)' 
                                            : '#6b7280',
                                        boxShadow: showEmail 
                                            ? '0 0 12px rgba(34, 197, 94, 0.5)' 
                                            : 'inset 0 2px 4px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <span
                                        className="absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300"
                                        style={{
                                            background: 'linear-gradient(180deg, #ffffff 0%, #e5e7eb 100%)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            transform: showEmail ? 'translateX(24px)' : 'translateX(0)'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ===== ACCOUNT SECTION ===== */}
                    <motion.div
                        variants={cardVariants}
                        custom={3}
                        className="bg-bg-card rounded-2xl border border-border-primary overflow-hidden"
                    >
                        <div className="p-6 border-b border-border-primary">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-xl">
                                    <FiUser className="w-5 h-5 text-indigo-500" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-text-primary">
                                        {t('settings.account')}
                                    </h2>
                                    <p className="text-sm text-text-secondary">
                                        {t('settings.accountDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-2">
                            {/* Change Password - Expandable */}
                            <div className="bg-bg-secondary rounded-xl overflow-hidden">
                                <button 
                                    onClick={() => setShowChangePassword(!showChangePassword)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary transition-colors"
                                >
                                    <span className="text-text-primary">
                                        {t('settings.changePassword')}
                                    </span>
                                    {showChangePassword ? (
                                        <FiChevronDown className="text-text-secondary" />
                                    ) : (
                                        <FiChevronRight className="text-text-secondary" />
                                    )}
                                </button>
                                
                                <AnimatePresence>
                                    {showChangePassword && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <form onSubmit={handlePasswordChange} className="p-4 pt-0 space-y-4">
                                                {/* Current Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showCurrentPassword ? 'text' : 'password'}
                                                            value={passwordForm.currentPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                                            className="w-full px-4 py-3 pr-12 rounded-xl bg-bg-tertiary border border-border-primary
                                                                       text-text-primary placeholder-text-tertiary
                                                                       focus:outline-none focus:border-green-500 transition-colors"
                                                            placeholder="Enter current password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
                                                        >
                                                            {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* New Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showNewPassword ? 'text' : 'password'}
                                                            value={passwordForm.newPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                            className="w-full px-4 py-3 pr-12 rounded-xl bg-bg-tertiary border border-border-primary
                                                                       text-text-primary placeholder-text-tertiary
                                                                       focus:outline-none focus:border-green-500 transition-colors"
                                                            placeholder="Enter new password (min 8 characters)"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
                                                        >
                                                            {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Confirm New Password */}
                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            value={passwordForm.confirmPassword}
                                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                            className="w-full px-4 py-3 pr-12 rounded-xl bg-bg-tertiary border border-border-primary
                                                                       text-text-primary placeholder-text-tertiary
                                                                       focus:outline-none focus:border-green-500 transition-colors"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary"
                                                        >
                                                            {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Submit Button */}
                                                <div className="flex gap-3 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isChangingPassword}
                                                        className="flex-1 py-3 px-4 rounded-xl font-semibold
                                                                   disabled:opacity-50 disabled:cursor-not-allowed
                                                                   transition-all duration-200 shadow-lg hover:shadow-xl
                                                                   hover:scale-[1.02] active:scale-[0.98]"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        {isChangingPassword ? 'Changing...' : 'Update Password'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowChangePassword(false);
                                                            setPasswordForm({
                                                                currentPassword: '',
                                                                newPassword: '',
                                                                confirmPassword: '',
                                                            });
                                                        }}
                                                        className="py-3 px-6 rounded-xl font-semibold
                                                                   transition-all duration-200 shadow-lg hover:shadow-xl
                                                                   hover:scale-[1.02] active:scale-[0.98]"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Export Data */}
                            <button className="w-full flex items-center justify-between p-4 bg-bg-secondary hover:bg-bg-tertiary rounded-xl transition-colors">
                                <span className="text-text-primary">
                                    {t('settings.exportData')}
                                </span>
                                <FiChevronRight className="text-text-secondary" />
                            </button>

                            {/* Delete Account */}
                            <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                                <span className="text-red-500">
                                    {t('settings.deleteAccount')}
                                </span>
                                <FiChevronRight className="text-red-500" />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
