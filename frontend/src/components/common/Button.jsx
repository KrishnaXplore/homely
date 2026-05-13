// ============================================
// HOMELY - Button Component
// ============================================
// Reusable button with variants and loading state
// ============================================

import { motion } from 'framer-motion';
import { LoadingSpinner } from './';

// --------------------------------------------
// BUTTON COMPONENT
// --------------------------------------------

/**
 * Button - Styled button component
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disabled state
 * @param {React.Component} props.icon - Left icon
 * @param {React.Component} props.iconRight - Right icon
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    icon: Icon,
    iconRight: IconRight,
    children,
    className = '',
    type = 'button', // Default to 'button' to prevent unintentional form submissions
    ...props
}) => {
    // Size classes
    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };
    
    // Variant classes with glow effects
    const variantClasses = {
        primary: `
            font-semibold
            shadow-lg hover:shadow-xl
            border border-transparent
            btn-glow-primary
        `,
        secondary: `
            text-[var(--color-text-primary)] font-medium
            bg-[var(--color-bg-card)]
            border-2 border-[var(--color-border-primary)]
            hover:border-green-700
            hover:bg-[var(--color-bg-hover)]
            btn-glow-secondary
        `,
        outline: `
            text-[#14532d] font-medium
            bg-transparent
            border-2 border-[#14532d]
            hover:bg-[#14532d] hover:text-white
            glow-hover
        `,
        ghost: `
            text-[var(--color-text-secondary)] font-medium
            bg-transparent
            border border-transparent
            hover:bg-[var(--color-bg-hover)]
            hover:text-[var(--color-text-primary)]
            hover:border-[var(--color-border-primary)]
        `,
        danger: `
            text-white font-semibold
            bg-gradient-to-r from-[var(--color-error-500)] to-[var(--color-error-600)]
            hover:from-[var(--color-error-600)] hover:to-[var(--color-error-800)]
            shadow-lg shadow-[var(--color-error-500)]/25
            border border-transparent
            hover:border-[var(--color-error-500)]
        `,
    };
    
    // Inline styles for primary variant (guaranteed to work)
    const variantStyles = {
        primary: {
            background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
            color: 'white'
        },
        secondary: {},
        outline: {},
        ghost: {},
        danger: {}
    };
    
    const isDisabled = disabled || loading;
    
    return (
        <motion.button
            type={type}
            style={variantStyles[variant]}
            className={`
                inline-flex items-center justify-center gap-2
                rounded-xl transition-all duration-200
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${fullWidth ? 'w-full' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${className}
            `}
            disabled={isDisabled}
            whileHover={!isDisabled ? { scale: 1.02 } : {}}
            whileTap={!isDisabled ? { scale: 0.98 } : {}}
            {...props}
        >
            {loading ? (
                <LoadingSpinner size="sm" />
            ) : (
                <>
                    {Icon && <Icon className="w-5 h-5" />}
                    {children}
                    {IconRight && <IconRight className="w-5 h-5" />}
                </>
            )}
        </motion.button>
    );
};

export default Button;
