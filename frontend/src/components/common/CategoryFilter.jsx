// ============================================
// HOMELY - Category Filter Component
// ============================================
// Horizontal scrollable category filter pills
// ============================================

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { 
    GiHerbsBundle, 
    GiLungs,
    GiHealing,
    GiShield,
    GiBrain,
    GiNightSleep,
    GiHairStrands,
    GiStomach
} from 'react-icons/gi';
import { MdAllInclusive } from 'react-icons/md';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// CATEGORIES DATA (with translation keys)
// --------------------------------------------

const categoriesData = [
    { id: 'all', nameKey: 'dashboardCategories.all', icon: MdAllInclusive },
    { id: 'digestive-health', nameKey: 'dashboardCategories.digestive', icon: GiStomach },
    { id: 'respiratory-health', nameKey: 'dashboardCategories.respiratory', icon: GiLungs },
    { id: 'skin-care', nameKey: 'dashboardCategories.skinCare', icon: GiHealing },
    { id: 'immunity-booster', nameKey: 'dashboardCategories.immunity', icon: GiShield },
    { id: 'stress-relief', nameKey: 'dashboardCategories.stressRelief', icon: GiBrain },
    { id: 'sleep-aid', nameKey: 'dashboardCategories.sleep', icon: GiNightSleep },
    { id: 'hair-care', nameKey: 'dashboardCategories.hairCare', icon: GiHairStrands },
    { id: 'pain-relief', nameKey: 'dashboardCategories.painRelief', icon: GiHerbsBundle },
];

// --------------------------------------------
// CATEGORY FILTER COMPONENT
// --------------------------------------------

const CategoryFilter = ({ 
    selected = 'all', 
    onChange,
    className = '' 
}) => {
    const scrollRef = useRef(null);
    const { t } = useLanguage();
    
    /**
     * Scroll handler
     */
    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    
    return (
        <div className={`relative ${className}`}>
            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10
                           p-2 rounded-full bg-[var(--color-bg-card)]
                           border border-[var(--color-border-primary)]
                           shadow-lg hover:bg-[var(--color-bg-hover)]
                           text-[var(--color-text-secondary)]
                           hidden md:flex items-center justify-center"
            >
                <FiChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-2
                           scroll-smooth md:px-10"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {categoriesData.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selected === category.id;
                    
                    return (
                        <motion.button
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onChange?.(category.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full
                                       whitespace-nowrap transition-all duration-200 flex-shrink-0
                                       ${isSelected 
                                           ? 'text-white shadow-lg' 
                                           : 'bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary-500)] hover:text-[var(--color-primary-600)]'
                                       }`}
                            style={isSelected ? { background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' } : {}}
                        >
                            <Icon className={`w-5 h-5 ${isSelected ? '' : 'opacity-70'}`} />
                            <span className="font-medium">{t(category.nameKey)}</span>
                        </motion.button>
                    );
                })}
            </div>
            
            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10
                           p-2 rounded-full bg-[var(--color-bg-card)]
                           border border-[var(--color-border-primary)]
                           shadow-lg hover:bg-[var(--color-bg-hover)]
                           text-[var(--color-text-secondary)]
                           hidden md:flex items-center justify-center"
            >
                <FiChevronRight className="w-5 h-5" />
            </button>
            
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-8 
                            bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent
                            pointer-events-none md:w-12" />
            <div className="absolute right-0 top-0 bottom-0 w-8 
                            bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent
                            pointer-events-none md:w-12" />
        </div>
    );
};

export default CategoryFilter;
