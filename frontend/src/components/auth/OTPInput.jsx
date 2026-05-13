// ============================================
// HOMELY - OTP Input Component
// ============================================
// 6-digit OTP input with auto-focus
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// --------------------------------------------
// OTP INPUT COMPONENT
// --------------------------------------------

/**
 * OTPInput - 6-digit OTP verification input
 * 
 * Features:
 * - Auto-focus next input on entry
 * - Backspace navigation
 * - Paste support
 * - Visual feedback
 * 
 * @param {Object} props - Component props
 * @param {number} props.length - Number of digits (default: 6)
 * @param {string} props.value - Current OTP value
 * @param {Function} props.onChange - Callback when OTP changes
 * @param {Function} props.onComplete - Callback when all digits entered
 * @param {boolean} props.disabled - Disable input
 * @param {boolean} props.error - Show error state
 */
const OTPInput = ({
    length = 6,
    value = '',
    onChange,
    onComplete,
    disabled = false,
    error = false,
}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);
    
    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    // Keep internal state in sync when parent controls the OTP value
    useEffect(() => {
        const normalizedValue = (value || '').replace(/\D/g, '').slice(0, length);
        const nextOtp = new Array(length).fill('');

        normalizedValue.split('').forEach((digit, index) => {
            nextOtp[index] = digit;
        });

        setOtp((currentOtp) => {
            const currentValue = currentOtp.join('');
            const nextValue = nextOtp.join('');
            return currentValue === nextValue ? currentOtp : nextOtp;
        });
    }, [length, value]);
    
    // Call onComplete when all digits are filled
    useEffect(() => {
        const otpValue = otp.join('');

        if (onChange) {
            onChange(otpValue);
        }

        if (otpValue.length === length && onComplete) {
            onComplete(otpValue);
        }
    }, [otp, length, onChange, onComplete]);
    
    /**
     * Handle input change
     */
    const handleChange = (index, value) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;
        
        const newOtp = [...otp];
        
        // Handle paste
        if (value.length > 1) {
            const pastedValue = value.slice(0, length - index);
            for (let i = 0; i < pastedValue.length; i++) {
                if (index + i < length) {
                    newOtp[index + i] = pastedValue[i];
                }
            }
            setOtp(newOtp);
            
            // Focus last filled input or next empty
            const nextIndex = Math.min(index + pastedValue.length, length - 1);
            inputRefs.current[nextIndex]?.focus();
            return;
        }
        
        // Single digit entry
        newOtp[index] = value;
        setOtp(newOtp);
        
        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    /**
     * Handle keydown for backspace navigation
     */
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    
    /**
     * Handle paste
     */
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
        }
    };
    
    /**
     * Clear OTP
     */
    const clearOtp = () => {
        setOtp(new Array(length).fill(''));
        inputRefs.current[0]?.focus();
    };
    
    return (
        <div className="flex flex-col items-center">
            <div className="flex gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                    <motion.input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={length} // Allow paste
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={`
                            w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold
                            rounded-xl border-2 outline-none
                            transition-all duration-200
                            bg-[var(--color-bg-primary)]
                            text-[var(--color-text-primary)]
                            ${error 
                                ? 'border-red-500 focus:border-red-500' 
                                : digit
                                    ? 'border-[var(--color-primary-500)]'
                                    : 'border-[var(--color-border-primary)] focus:border-[var(--color-primary-500)]'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileFocus={{ scale: 1.05 }}
                    />
                ))}
            </div>
            
            {/* Hidden clear button for programmatic access */}
            <button type="button" onClick={clearOtp} className="sr-only">
                Clear OTP
            </button>
        </div>
    );
};

export default OTPInput;
