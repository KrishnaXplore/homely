// ============================================
// HOMELY - Rating Stars Component
// ============================================
// Interactive star rating with hover preview
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

// --------------------------------------------
// RATING STARS COMPONENT
// --------------------------------------------

const RatingStars = ({
    rating = 0,
    maxRating = 5,
    size = 'md', // 'sm' | 'md' | 'lg'
    interactive = false,
    onChange,
    showValue = true,
    totalRatings = 0,
    className = '',
}) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    // Size configurations
    const sizes = {
        sm: { star: 'w-4 h-4', text: 'text-sm', gap: 'gap-0.5' },
        md: { star: 'w-5 h-5', text: 'text-base', gap: 'gap-1' },
        lg: { star: 'w-7 h-7', text: 'text-lg', gap: 'gap-1.5' },
    };
    
    const currentSize = sizes[size] || sizes.md;
    const displayRating = hoverRating || rating;
    
    /**
     * Handle star click
     */
    const handleClick = (value) => {
        if (interactive && onChange) {
            onChange(value);
        }
    };
    
    /**
     * Handle mouse enter
     */
    const handleMouseEnter = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };
    
    /**
     * Handle mouse leave
     */
    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };
    
    return (
        <div className={`flex items-center ${currentSize.gap} ${className}`}>
            {/* Stars */}
            <div 
                className={`flex ${currentSize.gap}`}
                onMouseLeave={handleMouseLeave}
            >
                {[...Array(maxRating)].map((_, index) => {
                    const value = index + 1;
                    const isFilled = value <= displayRating;
                    const isHalf = !isFilled && value - 0.5 <= displayRating;
                    
                    return (
                        <motion.button
                            key={index}
                            type="button"
                            whileHover={interactive ? { scale: 1.2 } : {}}
                            whileTap={interactive ? { scale: 0.9 } : {}}
                            onClick={() => handleClick(value)}
                            onMouseEnter={() => handleMouseEnter(value)}
                            disabled={!interactive}
                            className={`${interactive ? 'cursor-pointer' : 'cursor-default'}
                                       focus:outline-none transition-colors`}
                        >
                            <FiStar
                                className={`${currentSize.star} transition-colors
                                           ${isFilled || isHalf
                                               ? 'text-amber-500 fill-amber-500'
                                               : 'text-gray-300 dark:text-gray-600'
                                           }`}
                            />
                        </motion.button>
                    );
                })}
            </div>
            
            {/* Rating Value */}
            {showValue && (
                <div className={`flex items-center ${currentSize.gap} ml-1`}>
                    <span className={`font-bold text-[var(--color-text-primary)] ${currentSize.text}`}>
                        {rating.toFixed(1)}
                    </span>
                    {totalRatings > 0 && (
                        <span className={`text-[var(--color-text-tertiary)] ${currentSize.text}`}>
                            ({totalRatings})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default RatingStars;
