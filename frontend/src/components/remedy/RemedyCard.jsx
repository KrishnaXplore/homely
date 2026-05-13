// ============================================
// HOMELY - Remedy Card Component
// ============================================
// Displays a single remedy in card format
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiClock, 
    FiStar, 
    FiBookmark, 
    FiHeart,
    FiChevronRight 
} from 'react-icons/fi';
import { 
    GiHerbsBundle, 
    GiMedicines, 
    GiHoneypot,
    GiLeafSwirl
} from 'react-icons/gi';

// --------------------------------------------
// CATEGORY ICONS MAP
// --------------------------------------------

const categoryIcons = {
    'digestive': GiHerbsBundle,
    'respiratory': GiLeafSwirl,
    'skin-care': GiHoneypot,
    'immunity': GiMedicines,
    'pain-relief': GiMedicines,
    'sleep': GiLeafSwirl,
    'stress': GiHerbsBundle,
    'hair-care': GiLeafSwirl,
    'default': GiHerbsBundle,
};

// --------------------------------------------
// DIFFICULTY BADGE COLORS
// --------------------------------------------

const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// --------------------------------------------
// REMEDY CARD COMPONENT
// --------------------------------------------

const RemedyCard = ({ 
    remedy, 
    onSave, 
    onLike,
    isSaved = false,
    isLiked = false,
    isGuest = false,
    variant = 'default' // 'default' | 'compact' | 'featured'
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [localSaved, setLocalSaved] = useState(isSaved);
    const [localLiked, setLocalLiked] = useState(isLiked);
    
    // Check if this is a sample remedy
    const isSampleRemedy = remedy._id?.startsWith('sample-');
    
    // Get category icon
    const CategoryIcon = categoryIcons[remedy.category] || categoryIcons.default;
    
    // Format rating
    const rating = remedy.averageRating?.toFixed(1) || '0.0';
    const ratingCount = remedy.totalRatings || 0;
    
    /**
     * Handle save/bookmark click
     */
    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLocalSaved(!localSaved);
        onSave?.(remedy._id);
    };
    
    /**
     * Handle like click
     */
    const handleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLocalLiked(!localLiked);
        onLike?.(remedy._id);
    };
    
    // Compact variant
    if (variant === 'compact') {
        const CardWrapper = isSampleRemedy ? 'div' : Link;
        const cardProps = isSampleRemedy ? { className: 'cursor-pointer' } : { to: `/remedy/${remedy._id}` };
        
        return (
            <CardWrapper {...cardProps}>
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl
                               bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                               hover:border-[var(--color-primary-500)] transition-colors"
                >
                    <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] 
                                    dark:bg-[var(--color-primary-900)]/30
                                    flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="w-6 h-6 text-[var(--color-primary-600)]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-primary)] truncate">
                            {remedy.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-tertiary)]">
                            {remedy.category}
                        </p>
                    </div>
                    
                    {isSampleRemedy && (
                        <span className="px-2 py-1 text-xs font-medium bg-amber-100 
                                         text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 
                                         rounded-full">
                            Preview
                        </span>
                    )}
                    
                    <FiChevronRight className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                </motion.div>
            </CardWrapper>
        );
    }
    
    // Default card variant - use div for sample remedies, Link for real ones
    const CardWrapper = isSampleRemedy ? 'div' : Link;
    const cardProps = isSampleRemedy ? { className: 'cursor-pointer block' } : { to: `/remedy/${remedy._id}` };
    
    return (
        <CardWrapper {...cardProps}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="group relative h-full rounded-2xl overflow-hidden
                           bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                           hover:border-[var(--color-primary-500)] 
                           hover:shadow-[0_8px_30px_var(--shadow-color-lg),0_0_20px_var(--glow-color)]
                           transition-all duration-300"
            >
                {/* Image/Icon Section */}
                <div className="relative h-40 bg-gradient-to-br from-[var(--color-primary-100)] 
                                to-[var(--color-primary-200)] dark:from-[var(--color-primary-900)]/50 
                                dark:to-[var(--color-primary-800)]/50 overflow-hidden">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-4">
                            <GiHerbsBundle className="w-24 h-24 text-[var(--color-primary-600)]" />
                        </div>
                        <div className="absolute bottom-4 right-4">
                            <GiLeafSwirl className="w-16 h-16 text-[var(--color-primary-600)]" />
                        </div>
                    </div>
                    
                    {/* Main Icon */}
                    <motion.div
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <CategoryIcon className="w-20 h-20 text-[var(--color-primary-600)]" />
                    </motion.div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleLike}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors
                                       ${localLiked 
                                           ? 'bg-red-500 text-white' 
                                           : 'bg-white/80 dark:bg-gray-800/80 text-[var(--color-text-secondary)]'
                                       }`}
                        >
                            <FiHeart className={`w-4 h-4 ${localLiked ? 'fill-current' : ''}`} />
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSave}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors
                                       ${localSaved 
                                           ? 'bg-[var(--color-primary-500)] text-white' 
                                           : 'bg-white/80 dark:bg-gray-800/80 text-[var(--color-text-secondary)]'
                                       }`}
                        >
                            <FiBookmark className={`w-4 h-4 ${localSaved ? 'fill-current' : ''}`} />
                        </motion.button>
                    </div>
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium
                                        bg-white/90 dark:bg-gray-800/90 
                                        text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]
                                        capitalize">
                            {remedy.category?.replace('-', ' ')}
                        </span>
                    </div>
                    
                    {/* Pending Status Badge */}
                    {remedy.status === 'pending' && (
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium
                                            bg-amber-500 text-white shadow-sm">
                                ⏳ Pending Review
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Content Section */}
                <div className="p-5">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2
                                   group-hover:text-[var(--color-primary-600)] transition-colors
                                   line-clamp-2">
                        {remedy.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                        {remedy.description}
                    </p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-3 
                                    border-t border-[var(--color-border-primary)]">
                        {/* Difficulty & Time */}
                        <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize
                                            ${difficultyColors[remedy.difficulty] || difficultyColors.easy}`}>
                                {remedy.difficulty}
                            </span>
                            
                            {remedy.prepTime && (
                                <span className="flex items-center gap-1 text-xs 
                                               text-[var(--color-text-tertiary)]">
                                    <FiClock className="w-3.5 h-3.5" />
                                    {remedy.prepTime}
                                </span>
                            )}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {rating}
                            </span>
                            <span className="text-xs text-[var(--color-text-tertiary)]">
                                ({ratingCount})
                            </span>
                        </div>
                    </div>
                </div>
                
                {/* Preview Badge for sample remedies */}
                {isSampleRemedy && (
                    <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium 
                                    bg-amber-500 text-white rounded-full shadow-lg">
                        ✨ Preview
                    </div>
                )}
                
                {/* Hover Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-0 left-0 right-0 h-1 
                               bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-400)]"
                />
            </motion.div>
        </CardWrapper>
    );
};

export default RemedyCard;
