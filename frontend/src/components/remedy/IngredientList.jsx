// ============================================
// HOMELY - Ingredient List Component
// ============================================
// Displays remedy ingredients with checkboxes
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiShoppingBag } from 'react-icons/fi';

// --------------------------------------------
// INGREDIENT ITEM COMPONENT
// --------------------------------------------

const IngredientItem = ({ ingredient, index, checked, onToggle }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-start gap-3 group"
    >
        <button
            onClick={() => onToggle(index)}
            className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 
                       flex items-center justify-center transition-all
                       ${checked 
                           ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]' 
                           : 'border-[var(--color-border-secondary)] hover:border-[var(--color-primary-500)]'
                       }`}
        >
            <AnimatePresence>
                {checked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                    >
                        <FiCheck className="w-4 h-4 text-white" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
        
        <div className="flex-1">
            <p className={`text-[var(--color-text-primary)] transition-all
                          ${checked ? 'line-through opacity-60' : ''}`}>
                {ingredient.name}
            </p>
            {ingredient.amount && (
                <p className="text-sm text-[var(--color-text-tertiary)]">
                    {ingredient.amount}
                </p>
            )}
        </div>
    </motion.div>
);

// --------------------------------------------
// INGREDIENT LIST COMPONENT
// --------------------------------------------

const IngredientList = ({ ingredients = [], className = '' }) => {
    const [checkedItems, setCheckedItems] = useState([]);
    
    // Calculate progress
    const progress = ingredients.length > 0 
        ? (checkedItems.length / ingredients.length) * 100 
        : 0;
    
    /**
     * Toggle ingredient check
     */
    const toggleIngredient = (index) => {
        setCheckedItems(prev => 
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };
    
    /**
     * Reset all checks
     */
    const resetAll = () => {
        setCheckedItems([]);
    };
    
    /**
     * Check all
     */
    const checkAll = () => {
        setCheckedItems(ingredients.map((_, i) => i));
    };
    
    if (!ingredients.length) {
        return (
            <div className="text-center py-8 text-[var(--color-text-tertiary)]">
                No ingredients listed
            </div>
        );
    }
    
    return (
        <div className={className}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FiShoppingBag className="w-5 h-5 text-[var(--color-primary-500)]" />
                    <h3 className="font-bold text-[var(--color-text-primary)]">
                        Ingredients ({checkedItems.length}/{ingredients.length})
                    </h3>
                </div>
                
                <div className="flex gap-2">
                    <button
                        onClick={resetAll}
                        className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
                    >
                        Reset
                    </button>
                    <span className="text-[var(--color-text-tertiary)]">|</span>
                    <button
                        onClick={checkAll}
                        className="text-sm text-[var(--color-primary-600)] hover:underline"
                    >
                        Check All
                    </button>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 rounded-full bg-[var(--color-bg-tertiary)] mb-6 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r 
                               from-[var(--color-primary-500)] to-[var(--color-primary-400)]"
                />
            </div>
            
            {/* Ingredients List */}
            <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                    <IngredientItem
                        key={index}
                        ingredient={ingredient}
                        index={index}
                        checked={checkedItems.includes(index)}
                        onToggle={toggleIngredient}
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
                        className="mt-6 p-4 rounded-xl bg-[var(--color-success-100)] 
                                   dark:bg-[var(--color-success-900)]/30 text-center"
                    >
                        <p className="text-[var(--color-success-600)] font-medium">
                            ✅ You have all the ingredients! Ready to prepare.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IngredientList;
