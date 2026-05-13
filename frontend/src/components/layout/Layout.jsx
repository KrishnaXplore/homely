// ============================================
// HOMELY - Main Layout Component
// ============================================
// Wrapper layout that includes Navbar and Footer
// Used for pages that need the standard layout
// ============================================

import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

// --------------------------------------------
// LAYOUT COMPONENT
// --------------------------------------------

/**
 * Layout - Main page wrapper with navigation
 * 
 * Features:
 * - Consistent header/footer across pages
 * - Page transition animations
 * - Scroll to top on navigation
 * - Main content area with proper spacing
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onLogout - Logout handler
 */
const Layout = ({ user, onLogout }) => {
    // --------------------------------------------
    // PAGE TRANSITION ANIMATION
    // --------------------------------------------
    
    const pageTransition = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3 }
    };
    
    // --------------------------------------------
    // RENDER
    // --------------------------------------------
    
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
            {/* Navigation Bar */}
            <Navbar user={user} onLogout={onLogout} />
            
            {/* Main Content Area */}
            <motion.main
                className="flex-grow pt-16" // pt-16 accounts for fixed navbar height
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                exit={pageTransition.exit}
                transition={pageTransition.transition}
            >
                {/* Outlet renders the matched child route */}
                <Outlet />
            </motion.main>
            
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Layout;
