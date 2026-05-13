// ============================================
// HOMELY - Suggested Questions Component
// ============================================
// Quick suggestion chips for common questions
// ============================================

import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// SUGGESTED QUESTIONS COMPONENT
// --------------------------------------------

const SuggestedQuestions = ({ onSelect, className = '' }) => {
    const { t } = useLanguage();
    
    // Suggestions with translation keys
    const suggestions = [
        {
            icon: '🤧',
            textKey: 'ai.coldFlu',
        },
        {
            icon: '😴',
            textKey: 'ai.sleepQuality',
        },
        {
            icon: '🤕',
            textKey: 'ai.headache',
        },
        {
            icon: '🍵',
            textKey: 'ai.herbalTeas',
        },
        {
            icon: '✨',
            textKey: 'ai.skinCare',
        },
        {
            icon: '💪',
            textKey: 'ai.immunity',
        },
    ];
    
    return (
        <div className={className}>
            <p className="text-sm text-[var(--color-text-tertiary)] mb-3 text-center">
                {t('ai.suggestedQuestions')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion, index) => (
                    <motion.button
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(t(suggestion.textKey))}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full
                                   bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                                   hover:border-[var(--color-primary-500)] hover:bg-[var(--color-bg-hover)]
                                   text-sm text-[var(--color-text-secondary)]
                                   hover:text-[var(--color-primary-600)] transition-all"
                    >
                        <span>{suggestion.icon}</span>
                        <span>{t(suggestion.textKey)}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuestions;
