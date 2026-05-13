// ============================================
// HOMELY - Input Component
// ============================================
// Reusable form input with icons and validation
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiEyeOff } from 'react-icons/fi';

// --------------------------------------------
// INPUT COMPONENT
// --------------------------------------------

/**
 * Input - Styled form input component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {React.Component} props.icon - Left icon component
 * @param {string} props.error - Error message
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.required - Required field
 */
const Input = ({
    type = 'text',
    name,
    label,
    placeholder,
    value,
    onChange,
    icon: Icon,
    error,
    disabled = false,
    required = false,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    
    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            
            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {Icon && (
                    <div className={`
                        absolute left-4 top-1/2 -translate-y-1/2 
                        transition-colors duration-200
                        ${isFocused 
                            ? 'text-[#14532d]' 
                            : 'text-[var(--color-text-tertiary)]'
                        }
                        ${error ? 'text-red-500' : ''}
                    `}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                
                {/* Input Field */}
                <motion.input
                    type={inputType}
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full py-3.5 rounded-xl
                        bg-[var(--color-bg-primary)]
                        border-2 outline-none
                        text-[var(--color-text-primary)]
                        placeholder-[var(--color-text-tertiary)]
                        transition-all duration-200
                        ${Icon ? 'pl-12' : 'pl-4'}
                        ${isPassword ? 'pr-12' : 'pr-4'}
                        ${error 
                            ? 'border-[var(--color-error-500)] focus:border-[var(--color-error-500)] focus:shadow-[0_0_0_3px_rgba(155,68,68,0.2)]' 
                            : 'border-[var(--color-border-primary)] focus:border-[#14532d] focus:shadow-[0_0_0_3px_rgba(20,83,45,0.2)]'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed bg-[var(--color-bg-secondary)]' : ''}
                    `}
                    whileFocus={{ scale: 1.01 }}
                    {...props}
                />
                
                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2
                                   text-[var(--color-text-tertiary)]
                                   hover:text-[var(--color-text-secondary)]
                                   transition-colors duration-200"
                    >
                        {showPassword ? (
                            <FiEyeOff className="w-5 h-5" />
                        ) : (
                            <FiEye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            
            {/* Error Message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
