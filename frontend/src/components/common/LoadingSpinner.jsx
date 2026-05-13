// ============================================
// HOMELY - Loading Spinner Component
// ============================================
// Reusable loading spinner with customizable size
// ============================================

import { motion } from 'framer-motion';
import { GiHerbsBundle } from 'react-icons/gi';

// --------------------------------------------
// LOADING SPINNER COMPONENT
// --------------------------------------------

/**
 * LoadingSpinner - Animated loading indicator
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.fullScreen - Whether to show full screen overlay
 */
const LoadingSpinner = ({ size = 'md', text, fullScreen = false }) => {
    // Size configurations
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };
    
    const textSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    
    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                }}
            >
                <GiHerbsBundle 
                    className={`${sizeClasses[size]} text-[var(--color-primary-500)]`} 
                />
            </motion.div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${textSizes[size]} text-[var(--color-text-secondary)]`}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
    
    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center 
                            bg-[var(--color-bg-primary)]/80 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }
    
    return spinner;
};

export default LoadingSpinner;
