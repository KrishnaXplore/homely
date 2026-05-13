// ============================================
// HOMELY - Auth Layout Component
// ============================================
// Minimal layout for auth pages (login, signup)
// No navbar/footer, centered content
// ============================================

import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiHerbsBundle } from 'react-icons/gi';
import ThemeToggle from '../common/ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// AUTH LAYOUT COMPONENT
// --------------------------------------------

/**
 * AuthLayout - Layout wrapper for authentication pages
 * 
 * Features:
 * - Centered card design
 * - Animated background elements
 * - Logo link back to home
 * - Theme toggle available
 */
const AuthLayout = () => {
    const { t } = useLanguage();
    
    // --------------------------------------------
    // RENDER
    // --------------------------------------------
    
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top right blob */}
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 rounded-full
                               bg-[var(--color-primary-200)] dark:bg-[var(--color-primary-900)]
                               opacity-30 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Bottom left blob */}
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full
                               bg-[var(--color-primary-300)] dark:bg-[var(--color-primary-800)]
                               opacity-20 blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Floating leaves decoration */}
                <motion.span
                    className="absolute top-1/4 left-1/4 text-6xl opacity-10"
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    🌿
                </motion.span>
                <motion.span
                    className="absolute bottom-1/4 right-1/4 text-5xl opacity-10"
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                >
                    🍃
                </motion.span>
            </div>
            
            {/* Header with Logo and Theme Toggle */}
            <header className="relative z-10 py-6 px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo - Links to home */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <GiHerbsBundle className="w-8 h-8 text-[var(--color-primary-500)]" />
                        </motion.div>
                        <span className="text-xl font-bold gradient-text">{t('appName')}</span>
                    </Link>
                    
                    {/* Theme Toggle */}
                    <ThemeToggle />
                </div>
            </header>
            
            {/* Main Content - Centered */}
            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Auth page content renders here */}
                    <Outlet />
                </motion.div>
            </main>
            
            {/* Footer */}
            <footer className="relative z-10 py-4 text-center">
                <p className="text-sm text-[var(--color-text-tertiary)]">
                    © {new Date().getFullYear()} Homely. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default AuthLayout;
