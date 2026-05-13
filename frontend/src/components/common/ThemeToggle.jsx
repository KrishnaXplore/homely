// ============================================
// HOMELY - Theme Toggle Button
// ============================================
// Animated button to switch between light/dark themes
// ============================================

import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { THEME_OPTIONS } from '../../utils/constants';

// --------------------------------------------
// THEME TOGGLE COMPONENT
// --------------------------------------------

/**
 * ThemeToggle - Button to toggle between light and dark mode
 * 
 * Features:
 * - Animated icon transitions
 * - Shows sun (light) or moon (dark)
 * - Accessible with keyboard support
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 */
const ThemeToggle = ({ className = '' }) => {
    // Get theme state and toggle function from context
    const { theme, setTheme, isDark } = useTheme();
    const { t } = useLanguage();
    
    // --------------------------------------------
    // TOGGLE HANDLER
    // --------------------------------------------
    
    const handleToggle = () => {
        // Simple toggle between light and dark only
        if (isDark) {
            setTheme(THEME_OPTIONS.LIGHT);
        } else {
            setTheme(THEME_OPTIONS.DARK);
        }
    };
    
    // Get translated tooltip text
    const tooltipText = isDark ? t('settings.switchToLight') : t('settings.switchToDark');
    
    // --------------------------------------------
    // RENDER
    // --------------------------------------------
    
    return (
        <motion.button
            onClick={handleToggle}
            className={`
                relative p-2.5 rounded-xl
                bg-[var(--color-bg-card)]
                border border-[var(--color-border-primary)]
                text-[var(--color-text-secondary)]
                hover:text-[var(--color-primary-500)]
                hover:border-[var(--color-primary-500)]
                hover:bg-[var(--color-bg-hover)]
                hover:shadow-[0_0_15px_var(--glow-color)]
                focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2
                transition-all duration-300
                ${className}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={tooltipText}
            title={tooltipText}
        >
            {/* Animated icon with rotation effect */}
            <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            >
                {isDark ? (
                    <FiSun className="w-5 h-5 text-amber-400" />
                ) : (
                    <FiMoon className="w-5 h-5 text-indigo-500" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
