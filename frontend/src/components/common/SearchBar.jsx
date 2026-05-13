// ============================================
// HOMELY - Search Bar Component
// ============================================
// Animated search input with suggestions
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';

// --------------------------------------------
// TRENDING SEARCHES (Static for now)
// --------------------------------------------

const trendingSearches = [
    'Honey Ginger Tea',
    'Turmeric Milk',
    'Aloe Vera',
    'Apple Cider Vinegar',
    'Eucalyptus Oil',
];

// --------------------------------------------
// SEARCH BAR COMPONENT
// --------------------------------------------

const SearchBar = ({ 
    value = '',
    onChange,
    onSearch,
    placeholder = 'Search remedies...',
    showTrending = true,
    className = '',
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef(null);
    
    // Sync with external value
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    
    /**
     * Handle input change
     */
    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    };
    
    /**
     * Handle search submit
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch?.(localValue);
        inputRef.current?.blur();
    };
    
    /**
     * Handle clear
     */
    const handleClear = () => {
        setLocalValue('');
        onChange?.('');
        inputRef.current?.focus();
    };
    
    /**
     * Handle trending click
     */
    const handleTrendingClick = (term) => {
        setLocalValue(term);
        onChange?.(term);
        onSearch?.(term);
        setIsFocused(false);
    };
    
    return (
        <div className={`relative ${className}`}>
            <form onSubmit={handleSubmit}>
                <motion.div
                    animate={{ 
                        scale: isFocused ? 1.02 : 1,
                        boxShadow: isFocused 
                            ? '0 10px 40px rgba(0, 0, 0, 0.1)' 
                            : '0 4px 20px rgba(0, 0, 0, 0.05)'
                    }}
                    className="relative"
                >
                    {/* Search Icon */}
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5
                                        text-[var(--color-text-tertiary)]" />
                    
                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={localValue}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-12 py-4 rounded-2xl
                                   bg-[var(--color-bg-card)] border-2
                                   text-[var(--color-text-primary)]
                                   placeholder-[var(--color-text-tertiary)]
                                   focus:outline-none transition-colors
                                   text-lg"
                        style={{
                            borderColor: isFocused 
                                ? 'var(--color-primary-500)' 
                                : 'var(--color-border-primary)'
                        }}
                    />
                    
                    {/* Clear Button */}
                    <AnimatePresence>
                        {localValue && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                type="button"
                                onClick={handleClear}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5
                                           rounded-full bg-[var(--color-bg-tertiary)]
                                           hover:bg-[var(--color-error-100)] 
                                           dark:hover:bg-[var(--color-error-900)]
                                           text-[var(--color-text-tertiary)]
                                           hover:text-[var(--color-error-600)]
                                           transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </motion.div>
            </form>
            
            {/* Trending Dropdown */}
            <AnimatePresence>
                {isFocused && showTrending && !localValue && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 p-4 rounded-2xl
                                   bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                                   shadow-xl z-50"
                    >
                        <div className="flex items-center gap-2 mb-3 text-sm 
                                        text-[var(--color-text-tertiary)]">
                            <FiTrendingUp className="w-4 h-4" />
                            <span>Trending Searches</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {trendingSearches.map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => handleTrendingClick(term)}
                                    className="px-3 py-1.5 rounded-full text-sm
                                               bg-[var(--color-bg-tertiary)]
                                               hover:bg-[var(--color-primary-100)]
                                               dark:hover:bg-[var(--color-primary-900)]/30
                                               text-[var(--color-text-secondary)]
                                               hover:text-[var(--color-primary-600)]
                                               transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchBar;
