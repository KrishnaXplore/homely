// ============================================
// HOMELY - Navbar Component
// ============================================
// Main navigation bar with logo, links, and user menu
// Responsive design with mobile hamburger menu
// ============================================

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMenu, 
    FiX, 
    FiHome,
    FiSearch,
    FiPlusCircle,
    FiUser,
    FiLogIn,
    FiLogOut,
    FiSettings,
    FiMessageCircle,
    FiShield
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// NAVBAR COMPONENT
// --------------------------------------------

/**
 * Navbar - Main navigation component
 * 
 * Features:
 * - Responsive design (desktop/mobile)
 * - Animated mobile menu
 * - Active link highlighting
 * - User dropdown menu
 * - Glass morphism effect
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object (null if not logged in)
 * @param {Function} props.onLogout - Logout handler function
 */
const Navbar = ({ user = null, onLogout }) => {
    // State for mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State for user dropdown menu
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    // Get current location for active link styling
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get translations
    const { t } = useLanguage();
    
    // --------------------------------------------
    // NAVIGATION LINKS
    // --------------------------------------------
    
    /**
     * Main navigation links
     * Shown in both desktop and mobile views
     */
    const navLinks = [
        { path: '/dashboard', label: t('nav.dashboard'), icon: FiHome },
        { path: '/ai-assistant', label: t('nav.aiAssistant'), icon: FiMessageCircle },
        { path: '/create', label: t('nav.createRemedy'), icon: FiPlusCircle, authRequired: true },
    ];
    
    /**
     * Check if a link is currently active
     */
    const isActiveLink = (path) => {
        return location.pathname === path;
    };
    
    // --------------------------------------------
    // HANDLERS
    // --------------------------------------------
    
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    
    const handleLogout = () => {
        setIsUserMenuOpen(false);
        if (onLogout) {
            onLogout();
        }
        navigate('/');
    };
    
    // --------------------------------------------
    // RENDER
    // --------------------------------------------
    
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--color-border-primary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* -------- Logo -------- */}
                    <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <GiHerbsBundle className="w-8 h-8 text-[#14532d]" />
                        </motion.div>
                        <span className="text-xl font-bold text-[#14532d]">{t('appName')}</span>
                    </Link>
                    
                    {/* -------- Desktop Navigation -------- */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            // Skip auth-required links if not logged in
                            if (link.authRequired && !user) return null;
                            
                            // Hide "Create Remedy" link on dashboard page (Add Remedy button exists there)
                            if (link.path === '/create' && location.pathname === '/dashboard') return null;
                            
                            const Icon = link.icon;
                            const isActive = isActiveLink(link.path);
                            
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg
                                        text-sm font-medium transition-all duration-200
                                        ${isActive 
                                            ? 'text-white shadow-md' 
                                            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                                        }
                                    `}
                                    style={isActive ? { background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)', color: 'white' } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {/* -------- Right Section (Theme, User, Mobile Menu) -------- */}
                    <div className="flex items-center gap-3">
                        {/* Theme Toggle */}
                        <ThemeToggle />
                        
                        {/* User Menu (Desktop) */}
                        <div className="hidden md:block relative">
                            {user ? (
                                // Logged in - Show user avatar/menu
                                <div className="relative">
                                    <motion.button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-xl
                                                   border border-[var(--color-border-primary)]
                                                   hover:border-[var(--color-primary-500)]
                                                   transition-colors duration-200"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=3d7a5a&color=fff`}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-lg object-cover"
                                        />
                                    </motion.button>
                                    
                                    {/* User Dropdown Menu */}
                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-2 w-56 py-2 rounded-xl
                                                           bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                                                           shadow-lg"
                                            >
                                                {/* User Info */}
                                                <div className="px-4 py-2 border-b border-[var(--color-border-primary)]">
                                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{user.name}</p>
                                                    <p className="text-xs text-[var(--color-text-tertiary)]">{user.email}</p>
                                                </div>
                                                
                                                {/* Menu Items */}
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm
                                                               text-[var(--color-text-secondary)]
                                                               hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                                >
                                                    <FiUser className="w-4 h-4" />
                                                    {t('nav.profile')}
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm
                                                               text-[var(--color-text-secondary)]
                                                               hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                                >
                                                    <FiSettings className="w-4 h-4" />
                                                    {t('nav.settings')}
                                                </Link>
                                                {/* Admin Panel Link - Only for admins */}
                                                {user.role === 'admin' && (
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-2 text-sm
                                                                   text-amber-600 dark:text-amber-400
                                                                   hover:bg-amber-50 dark:hover:bg-amber-950"
                                                    >
                                                        <FiShield className="w-4 h-4" />
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <div className="border-t border-[var(--color-border-primary)] mt-1 pt-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 w-full px-4 py-2 text-sm
                                                                   text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                    >
                                                        <FiLogOut className="w-4 h-4" />
                                                        {t('nav.logout')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                // Not logged in - Show login button
                                <Link to="/login">
                                    <motion.button
                                        style={{
                                            background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                                            color: 'white'
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                                   text-sm font-medium
                                                   shadow-md hover:shadow-lg transition-all duration-200"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <FiLogIn className="w-4 h-4" />
                                        {t('nav.login')}
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                        
                        {/* Mobile Menu Button */}
                        <motion.button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg
                                       text-[var(--color-text-secondary)]
                                       hover:bg-[var(--color-bg-hover)]"
                            whileTap={{ scale: 0.95 }}
                        >
                            {isMobileMenuOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
            
            {/* -------- Mobile Menu -------- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden border-t border-[var(--color-border-primary)] overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2 bg-[var(--color-bg-primary)]">
                            {/* Nav Links */}
                            {navLinks.map((link) => {
                                if (link.authRequired && !user) return null;
                                
                                // Hide "Create Remedy" link on dashboard page (Add Remedy button exists there)
                                if (link.path === '/create' && location.pathname === '/dashboard') return null;
                                
                                const Icon = link.icon;
                                const isActive = isActiveLink(link.path);
                                
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={closeMobileMenu}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl
                                            text-base font-medium transition-all duration-200
                                            ${isActive 
                                                ? 'text-white shadow-md' 
                                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                                            }
                                        `}
                                        style={isActive ? { background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)', color: 'white' } : {}}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            
                            {/* Auth Section */}
                            <div className="pt-2 border-t border-[var(--color-border-primary)]">
                                {user ? (
                                    <>
                                        <Link
                                            to="/profile"
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                       text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                                        >
                                            <FiUser className="w-5 h-5" />
                                            {t('nav.profile')}
                                        </Link>
                                        <Link
                                            to="/settings"
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                       text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                                        >
                                            <FiSettings className="w-5 h-5" />
                                            {t('nav.settings')}
                                        </Link>
                                        {/* Admin Panel Link - Only for admins */}
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                onClick={closeMobileMenu}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl
                                                           text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
                                            >
                                                <FiShield className="w-5 h-5" />
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl
                                                       text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            {t('nav.logout')}
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                                   text-white font-medium
                                                   bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]"
                                    >
                                        <FiLogIn className="w-5 h-5" />
                                        {t('nav.login')} / {t('nav.signup')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
