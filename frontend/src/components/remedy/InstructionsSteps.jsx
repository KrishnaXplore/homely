// ============================================
// HOMELY - Instructions Steps Component
// ============================================
// Step-by-step preparation instructions
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiList } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// STEP ITEM COMPONENT
// --------------------------------------------

const StepItem = ({ step, index, isActive, isCompleted, onComplete, t }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative pl-12 pb-8 border-l-2 last:pb-0 transition-colors
                   ${isCompleted 
                       ? 'border-[var(--color-primary-500)]' 
                       : 'border-[var(--color-border-primary)]'
                   }`}
    >
        {/* Step Number Circle */}
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(index)}
            className={`absolute -left-5 w-10 h-10 rounded-full
                       flex items-center justify-center font-bold
                       transition-all duration-300
                       ${isCompleted 
                           ? 'bg-[var(--color-primary-500)] text-white shadow-lg shadow-[var(--color-primary-500)]/30' 
                           : isActive
                               ? 'bg-[var(--color-bg-card)] border-2 border-[var(--color-primary-500)] text-[var(--color-primary-500)]'
                               : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]'
                       }`}
        >
            {isCompleted ? (
                <FiCheck className="w-5 h-5" />
            ) : (
                <span>{index + 1}</span>
            )}
        </motion.button>
        
        {/* Step Content */}
        <div className={`transition-opacity ${isCompleted ? 'opacity-60' : ''}`}>
            {step.title && (
                <h4 className={`font-bold mb-2 text-[var(--color-text-primary)]
                               ${isCompleted ? 'line-through' : ''}`}>
                    {step.title}
                </h4>
            )}
            <p className={`text-[var(--color-text-secondary)] leading-relaxed
                          ${isCompleted ? 'line-through' : ''}`}>
                {step.instruction || step.description || step}
            </p>
            
            {/* Duration if available */}
            {step.duration && (
                <span className="inline-block mt-2 text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-tertiary)] px-2 py-1 rounded">
                    ⏱️ {step.duration}
                </span>
            )}
            
            {/* Step tip if available */}
            {(step.tip || step.tips) && (
                <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20
                               border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        💡 <span className="font-medium">{t('remedyDetail.tip')}:</span> {step.tip || step.tips}
                    </p>
                </div>
            )}
        </div>
    </motion.div>
);

// --------------------------------------------
// INSTRUCTIONS STEPS COMPONENT
// --------------------------------------------

const InstructionsSteps = ({ steps = [], className = '' }) => {
    const [completedSteps, setCompletedSteps] = useState([]);
    const { t } = useLanguage();
    
    // Calculate current active step
    const activeStep = completedSteps.length;
    const progress = steps.length > 0 
        ? (completedSteps.length / steps.length) * 100 
        : 0;
    
    /**
     * Toggle step completion
     */
    const toggleStep = (index) => {
        setCompletedSteps(prev => {
            if (prev.includes(index)) {
                // Unmark this and all following steps
                return prev.filter(i => i < index);
            } else {
                // Mark all steps up to and including this one
                const newCompleted = [];
                for (let i = 0; i <= index; i++) {
                    if (!prev.includes(i)) newCompleted.push(i);
                }
                return [...prev, ...newCompleted].sort((a, b) => a - b);
            }
        });
    };
    
    /**
     * Reset progress
     */
    const resetProgress = () => {
        setCompletedSteps([]);
    };
    
    if (!steps.length) {
        return (
            <div className="text-center py-8 text-[var(--color-text-tertiary)]">
                {t('remedyDetail.noInstructions')}
            </div>
        );
    }
    
    return (
        <div className={className}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FiList className="w-5 h-5 text-[var(--color-primary-500)]" />
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                        {t('remedyDetail.instructions')} ({completedSteps.length}/{steps.length})
                    </h3>
                </div>
                
                {completedSteps.length > 0 && (
                    <button
                        onClick={resetProgress}
                        className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                    >
                        {t('remedyDetail.resetProgress')}
                    </button>
                )}
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] mb-8 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r 
                               from-[var(--color-primary-500)] to-[var(--color-primary-400)]"
                />
            </div>
            
            {/* Steps */}
            <div className="ml-4">
                {steps.map((step, index) => (
                    <StepItem
                        key={index}
                        step={step}
                        index={index}
                        isActive={index === activeStep}
                        isCompleted={completedSteps.includes(index)}
                        onComplete={toggleStep}
                        t={t}
                    />
                ))}
            </div>
            
            {/* Completion Message */}
            <AnimatePresence>
                {progress === 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-8 p-6 rounded-2xl bg-gradient-to-r 
                                   from-[var(--color-primary-100)] to-[var(--color-primary-50)]
                                   dark:from-[var(--color-primary-900)]/30 dark:to-[var(--color-primary-800)]/20
                                   text-center"
                    >
                        <span className="text-4xl mb-3 block">🎉</span>
                        <h4 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                            {t('remedyDetail.allDone')}
                        </h4>
                        <p className="text-[var(--color-text-secondary)]">
                            {t('remedyDetail.remedyReady')}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InstructionsSteps;
