// ============================================
// HOMELY - Create/Edit Remedy Page
// ============================================
// Form for users to submit new or edit existing remedies
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    FiArrowLeft,
    FiPlus,
    FiX,
    FiImage,
    FiCheck,
    FiAlertCircle,
    FiInfo,
    FiClock,
    FiList
} from 'react-icons/fi';
import { GiHerbsBundle, GiMortar } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import remedyService from '../services/remedyService';
import { Button, Input, LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';

// --------------------------------------------
// CONSTANTS
// --------------------------------------------

const CATEGORIES = [
    { value: 'digestive-health', labelKey: 'createRemedy.categoryDigestive', icon: '🍵' },
    { value: 'respiratory-health', labelKey: 'createRemedy.categoryRespiratory', icon: '🌬️' },
    { value: 'skin-care', labelKey: 'createRemedy.categorySkin', icon: '✨' },
    { value: 'immunity-booster', labelKey: 'createRemedy.categoryImmunity', icon: '💪' },
    { value: 'sleep-aid', labelKey: 'createRemedy.categorySleep', icon: '😴' },
    { value: 'pain-relief', labelKey: 'createRemedy.categoryPain', icon: '🩹' },
    { value: 'hair-care', labelKey: 'createRemedy.categoryHair', icon: '💇' },
    { value: 'energy-booster', labelKey: 'createRemedy.categoryEnergy', icon: '⚡' },
    { value: 'stress-relief', labelKey: 'createRemedy.categoryStress', icon: '🧘' },
    { value: 'other', labelKey: 'createRemedy.categoryOther', icon: '🌿' },
];

const DIFFICULTY_LEVELS = [
    { value: 'easy', labelKey: 'createRemedy.difficultyEasy', descKey: 'createRemedy.difficultyEasyDesc' },
    { value: 'medium', labelKey: 'createRemedy.difficultyMedium', descKey: 'createRemedy.difficultyMediumDesc' },
    { value: 'hard', labelKey: 'createRemedy.difficultyHard', descKey: 'createRemedy.difficultyHardDesc' },
];

// --------------------------------------------
// CREATE REMEDY PAGE COMPONENT
// --------------------------------------------

const CreateRemedyPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode
    const { user, isAuthenticated } = useAuth();
    const { t } = useLanguage();
    
    // Check if we're in edit mode
    const isEditMode = Boolean(id);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'easy',
        prepTime: '',
        ingredients: [{ name: '', amount: '', unit: '' }],
        instructions: [''],
        benefits: [''],
        warnings: [''],
        imageUrl: '',
        tags: [],
    });
    
    const [currentTag, setCurrentTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingRemedy, setIsLoadingRemedy] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    
    // ----------------------------------------
    // REDIRECT IF NOT AUTHENTICATED
    // ----------------------------------------
    
    useEffect(() => {
        if (!isAuthenticated) {
            toast.error(t('auth.loginRequired') || 'Please log in to create a remedy');
            navigate('/login', { state: { from: isEditMode ? `/remedy/${id}/edit` : '/create' } });
        }
    }, [isAuthenticated, navigate, t, isEditMode, id]);
    
    // ----------------------------------------
    // LOAD EXISTING REMEDY FOR EDIT MODE
    // ----------------------------------------
    
    useEffect(() => {
        const loadRemedy = async () => {
            if (!isEditMode || !id) return;
            
            setIsLoadingRemedy(true);
            try {
                const response = await remedyService.getById(id);
                if (response.success && response.data) {
                    const remedy = response.data;
                    
                    // Check ownership
                    if (user && remedy.createdBy && 
                        (user._id !== remedy.createdBy._id && user._id !== remedy.createdBy)) {
                        toast.error(t('errors.notAuthorized') || 'You can only edit your own remedies');
                        navigate('/dashboard');
                        return;
                    }
                    
                    // Transform server data to form format
                    setFormData({
                        title: remedy.title || '',
                        description: remedy.description || '',
                        category: remedy.category || '',
                        difficulty: remedy.difficulty || 'easy',
                        prepTime: remedy.preparationTime?.toString() || '',
                        ingredients: remedy.ingredients?.length > 0 
                            ? remedy.ingredients.map(ing => ({
                                name: ing.name || '',
                                amount: ing.quantity || '',
                                unit: ing.unit || '',
                            }))
                            : [{ name: '', amount: '', unit: '' }],
                        instructions: remedy.preparationSteps?.length > 0
                            ? remedy.preparationSteps.map(step => step.instruction || '')
                            : [''],
                        benefits: remedy.benefits?.length > 0
                            ? remedy.benefits.map(ben => ben.title || '')
                            : [''],
                        warnings: remedy.precautions?.length > 0
                            ? remedy.precautions
                            : [''],
                        imageUrl: remedy.mainImage || '',
                        tags: remedy.tags || [],
                    });
                } else {
                    toast.error(t('remedy.notFound') || 'Remedy not found');
                    navigate('/dashboard');
                }
            } catch (error) {
                console.error('Error loading remedy:', error);
                toast.error(t('remedy.loadError') || 'Failed to load remedy');
                navigate('/dashboard');
            } finally {
                setIsLoadingRemedy(false);
            }
        };
        
        loadRemedy();
    }, [id, isEditMode, user, navigate, t]);
    
    // ----------------------------------------
    // FORM HANDLERS
    // ----------------------------------------
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    // Ingredient handlers
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index][field] = value;
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };
    
    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
        }));
    };
    
    const removeIngredient = (index) => {
        if (formData.ingredients.length > 1) {
            setFormData(prev => ({
                ...prev,
                ingredients: prev.ingredients.filter((_, i) => i !== index)
            }));
        }
    };
    
    // Instruction handlers
    const handleInstructionChange = (index, value) => {
        const newInstructions = [...formData.instructions];
        newInstructions[index] = value;
        setFormData(prev => ({ ...prev, instructions: newInstructions }));
    };
    
    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...prev.instructions, '']
        }));
    };
    
    const removeInstruction = (index) => {
        if (formData.instructions.length > 1) {
            setFormData(prev => ({
                ...prev,
                instructions: prev.instructions.filter((_, i) => i !== index)
            }));
        }
    };
    
    // Benefits handlers
    const handleBenefitChange = (index, value) => {
        const newBenefits = [...formData.benefits];
        newBenefits[index] = value;
        setFormData(prev => ({ ...prev, benefits: newBenefits }));
    };
    
    const addBenefit = () => {
        setFormData(prev => ({
            ...prev,
            benefits: [...prev.benefits, '']
        }));
    };
    
    const removeBenefit = (index) => {
        if (formData.benefits.length > 1) {
            setFormData(prev => ({
                ...prev,
                benefits: prev.benefits.filter((_, i) => i !== index)
            }));
        }
    };
    
    // Warning handlers
    const handleWarningChange = (index, value) => {
        const newWarnings = [...formData.warnings];
        newWarnings[index] = value;
        setFormData(prev => ({ ...prev, warnings: newWarnings }));
    };
    
    const addWarning = () => {
        setFormData(prev => ({
            ...prev,
            warnings: [...prev.warnings, '']
        }));
    };
    
    const removeWarning = (index) => {
        setFormData(prev => ({
            ...prev,
            warnings: prev.warnings.filter((_, i) => i !== index)
        }));
    };
    
    // Tag handlers
    const addTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, currentTag.trim()]
            }));
            setCurrentTag('');
        }
    };
    
    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };
    
    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------
    
    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = t('errors.required');
            if (!formData.description.trim()) {
                newErrors.description = t('errors.required');
            } else if (formData.description.trim().length < 20) {
                newErrors.description = t('createRemedy.descriptionMinLength') || 'Description must be at least 20 characters';
            }
            if (!formData.category) newErrors.category = t('errors.required');
        }
        
        if (step === 2) {
            const validIngredients = formData.ingredients.filter(ing => ing.name.trim());
            if (validIngredients.length === 0) {
                newErrors.ingredients = t('errors.required');
            }
        }
        
        if (step === 3) {
            const validInstructions = formData.instructions.filter(inst => inst.trim());
            if (validInstructions.length === 0) {
                newErrors.instructions = t('errors.required');
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // ----------------------------------------
    // NAVIGATION
    // ----------------------------------------
    
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };
    
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };
    
    // ----------------------------------------
    // SUBMIT HANDLER
    // ----------------------------------------
    
    const handleSubmit = async () => {
        // Validate final step
        if (!validateStep(4)) return;
        
        setIsSubmitting(true);
        
        try {
            // Transform data to match server schema
            const cleanedIngredients = formData.ingredients
                .filter(ing => ing.name.trim())
                .map(ing => ({
                    name: ing.name.trim(),
                    quantity: ing.amount || '1',
                    unit: ing.unit || '',
                }));
            
            const cleanedSteps = formData.instructions
                .filter(inst => inst.trim())
                .map((inst, index) => ({
                    stepNumber: index + 1,
                    instruction: inst.trim(),
                }));
            
            const cleanedBenefits = formData.benefits
                .filter(ben => ben.trim())
                .map(ben => ({
                    title: ben.trim(),
                    description: '',
                }));
            
            const cleanedData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                difficulty: formData.difficulty,
                preparationTime: parseInt(formData.prepTime) || 15,
                mainImage: formData.imageUrl || 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
                ingredients: cleanedIngredients,
                preparationSteps: cleanedSteps,
                benefits: cleanedBenefits,
                precautions: formData.warnings.filter(warn => warn.trim()),
                tags: formData.tags,
            };
            
            let response;
            
            if (isEditMode) {
                // Update existing remedy
                response = await remedyService.update(id, cleanedData);
                
                if (response.success) {
                    toast.success(t('createRemedy.updateSuccess') || 'Remedy updated successfully!');
                    navigate(`/remedy/${id}`);
                } else {
                    // Handle validation errors from server
                    if (response.errors && Array.isArray(response.errors)) {
                        response.errors.forEach(err => toast.error(err.msg || err.message || err));
                    } else {
                        toast.error(response.message || t('createRemedy.updateError') || 'Failed to update remedy');
                    }
                }
            } else {
                // Create new remedy
                response = await remedyService.create(cleanedData);
                
                if (response.success) {
                    toast.success(t('createRemedy.success') || 'Remedy created successfully!');
                    navigate(`/remedy/${response.data?._id || response.remedy?._id}`);
                } else {
                    // Handle validation errors from server
                    if (response.errors && Array.isArray(response.errors)) {
                        response.errors.forEach(err => toast.error(err.msg || err.message || err));
                    } else {
                        toast.error(response.message || t('createRemedy.error') || 'Failed to create remedy');
                    }
                }
            }
        } catch (error) {
            console.error(isEditMode ? 'Update remedy error:' : 'Create remedy error:', error);
            // Handle validation errors from server
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach(err => toast.error(err.msg || err.message || err));
            } else {
                const errorKey = isEditMode ? 'createRemedy.updateError' : 'createRemedy.error';
                const defaultMsg = isEditMode ? 'Failed to update remedy' : 'Failed to create remedy';
                toast.error(error.message || t(errorKey) || defaultMsg);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ----------------------------------------
    // LOADING STATE FOR EDIT MODE
    // ----------------------------------------
    
    if (isLoadingRemedy) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner text={t('loading') || 'Loading...'} />
            </div>
        );
    }
    
    // ----------------------------------------
    // RENDER STEPS
    // ----------------------------------------
    
    const renderStep1 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)]
                               flex items-center justify-center mx-auto mb-4">
                    <GiHerbsBundle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {t('createRemedy.basicInfo')}
                </h2>
                <p className="text-[var(--color-text-tertiary)]">
                    {t('createRemedy.subtitle')}
                </p>
            </div>
            
            {/* Title */}
            <Input
                label={t('createRemedy.name')}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder={t('createRemedy.namePlaceholder')}
                error={errors.title}
                required
            />
            
            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t('createRemedy.description')} <span className="text-[var(--color-error-500)]">*</span>
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t('createRemedy.descriptionPlaceholder')}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                               border ${errors.description ? 'border-[var(--color-error-500)]' : 'border-[var(--color-border-primary)]'}
                               text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)]
                               focus:outline-none focus:border-[var(--color-primary-500)]
                               transition-colors resize-none`}
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-[var(--color-error-500)]">{errors.description}</p>
                )}
            </div>
            
            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t('createRemedy.category')} <span className="text-[var(--color-error-500)]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setFormData(prev => ({ ...prev, category: cat.value }));
                                if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                            }}
                            className={`p-3 rounded-xl border-2 text-sm text-left transition-all
                                       ${formData.category === cat.value
                                           ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/40 text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)] ring-2 ring-[var(--color-primary-500)]/30 font-medium'
                                           : 'border-[var(--color-border-primary)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-bg-tertiary)]'
                                       }`}
                        >
                            {cat.icon} {t(cat.labelKey)}
                        </motion.button>
                    ))}
                </div>
                {errors.category && (
                    <p className="mt-2 text-sm text-[var(--color-error-500)]">{errors.category}</p>
                )}
            </div>
            
            {/* Difficulty & Prep Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                        {t('createRemedy.difficulty')}
                    </label>
                    <div className="space-y-2">
                        {DIFFICULTY_LEVELS.map((level) => (
                            <motion.button
                                key={level.value}
                                type="button"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                                className={`w-full p-3 rounded-xl border-2 text-left transition-all
                                           ${formData.difficulty === level.value
                                               ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/40 ring-2 ring-[var(--color-primary-500)]/30'
                                               : 'border-[var(--color-border-primary)] bg-[var(--color-bg-card)] hover:border-[var(--color-primary-300)] hover:bg-[var(--color-bg-tertiary)]'
                                           }`}
                            >
                                <span className={`font-medium ${formData.difficulty === level.value ? 'text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]' : 'text-[var(--color-text-primary)]'}`}>
                                    {t(level.labelKey)}
                                </span>
                                <p className={`text-xs mt-0.5 ${formData.difficulty === level.value ? 'text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]' : 'text-[var(--color-text-tertiary)]'}`}>
                                    {t(level.descKey)}
                                </p>
                            </motion.button>
                        ))}
                    </div>
                </div>
                
                <div>
                    <Input
                        label={t('createRemedy.preparationTime')}
                        name="prepTime"
                        type="number"
                        value={formData.prepTime}
                        onChange={handleChange}
                        placeholder="e.g., 15"
                        icon={FiClock}
                        min="1"
                    />
                    
                    {/* Image URL */}
                    <div className="mt-4">
                        <Input
                            label={`Image URL (${t('createRemedy.optional')})`}
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            icon={FiImage}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
    
    const renderStep2 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-500)]
                               flex items-center justify-center mx-auto mb-4">
                    <GiMortar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {t('createRemedy.ingredients')}
                </h2>
                <p className="text-[var(--color-text-tertiary)]">
                    {t('createRemedy.subtitle')}
                </p>
            </div>
            
            {errors.ingredients && (
                <div className="p-3 rounded-xl bg-[var(--color-error-50)] dark:bg-[var(--color-error-900)]/20
                               border border-[var(--color-error-200)] dark:border-[var(--color-error-800)]
                               text-[var(--color-error-600)] dark:text-[var(--color-error-400)] text-sm flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.ingredients}
                </div>
            )}
            
            <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-start"
                    >
                        <div className="flex-1 grid grid-cols-6 gap-2">
                            <input
                                type="text"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                placeholder={t('createRemedy.ingredientName')}
                                className="col-span-3 px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                          border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                          placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                          focus:border-[var(--color-primary-500)] transition-colors"
                            />
                            <input
                                type="text"
                                value={ingredient.amount}
                                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                placeholder={t('createRemedy.amount')}
                                className="col-span-1 px-3 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                          border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                          placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                          focus:border-[var(--color-primary-500)] transition-colors"
                            />
                            <input
                                type="text"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                placeholder={t('createRemedy.unit')}
                                className="col-span-2 px-3 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                          border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                          placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                          focus:border-[var(--color-primary-500)] transition-colors"
                            />
                        </div>
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeIngredient(index)}
                            disabled={formData.ingredients.length === 1}
                            className="p-3 rounded-xl text-[var(--color-error-500)] 
                                      hover:bg-[var(--color-error-50)] dark:hover:bg-[var(--color-error-900)]/20
                                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                ))}
            </div>
            
            <Button
                type="button"
                onClick={addIngredient}
                className="w-full"
            >
                <FiPlus className="w-4 h-4 mr-2" />
                {t('createRemedy.addIngredient')}
            </Button>
        </motion.div>
    );
    
    const renderStep3 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-success-500)]
                               flex items-center justify-center mx-auto mb-4">
                    <FiList className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {t('createRemedy.steps')}
                </h2>
                <p className="text-[var(--color-text-tertiary)]">
                    {t('createRemedy.stepInstruction')}
                </p>
            </div>
            
            {errors.instructions && (
                <div className="p-3 rounded-xl bg-[var(--color-error-50)] dark:bg-[var(--color-error-900)]/20
                               border border-[var(--color-error-200)] dark:border-[var(--color-error-800)]
                               text-[var(--color-error-600)] dark:text-[var(--color-error-400)] text-sm flex items-center gap-2">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.instructions}
                </div>
            )}
            
            <div className="space-y-3">
                {formData.instructions.map((instruction, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 items-start"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary-500)] 
                                       text-white flex items-center justify-center text-sm font-medium mt-2">
                            {index + 1}
                        </div>
                        <textarea
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            placeholder={`${t('createRemedy.step')} ${index + 1}: ${t('createRemedy.stepPlaceholder')}`}
                            rows={2}
                            className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                      border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                      placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                      focus:border-[var(--color-primary-500)] transition-colors resize-none"
                        />
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeInstruction(index)}
                            disabled={formData.instructions.length === 1}
                            className="p-3 rounded-xl text-[var(--color-error-500)] 
                                      hover:bg-[var(--color-error-50)] dark:hover:bg-[var(--color-error-900)]/20
                                      disabled:opacity-30 disabled:cursor-not-allowed transition-colors mt-1"
                        >
                            <FiX className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                ))}
            </div>
            
            <Button
                type="button"
                onClick={addInstruction}
                className="w-full"
            >
                <FiPlus className="w-4 h-4 mr-2" />
                {t('createRemedy.addStep')}
            </Button>
        </motion.div>
    );
    
    const renderStep4 = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-success-500)] to-[var(--color-primary-500)]
                               flex items-center justify-center mx-auto mb-4">
                    <FiInfo className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {t('createRemedy.tips')}
                </h2>
                <p className="text-[var(--color-text-tertiary)]">
                    {t('createRemedy.optional')}
                </p>
            </div>
            
            {/* Benefits */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t('createRemedy.benefits')}
                </label>
                <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={benefit}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                placeholder={t('createRemedy.benefitPlaceholder')}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                          border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                          placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                          focus:border-[var(--color-primary-500)] transition-colors"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeBenefit(index)}
                                disabled={formData.benefits.length === 1}
                                className="p-3 rounded-xl text-[var(--color-error-500)] 
                                          hover:bg-[var(--color-error-50)] dark:hover:bg-[var(--color-error-900)]/20
                                          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </motion.button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addBenefit}
                    className="mt-2 text-sm px-4 py-2 rounded-lg bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] transition-colors flex items-center gap-1"
                >
                    <FiPlus className="w-4 h-4" /> {t('createRemedy.addBenefit')}
                </button>
            </div>
            
            {/* Warnings */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t('createRemedy.warnings')}
                </label>
                <div className="space-y-2">
                    {formData.warnings.map((warning, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={warning}
                                onChange={(e) => handleWarningChange(index, e.target.value)}
                                placeholder={t('createRemedy.warningPlaceholder')}
                                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                          border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                          placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                          focus:border-[var(--color-primary-500)] transition-colors"
                            />
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeWarning(index)}
                                className="p-3 rounded-xl text-[var(--color-error-500)] 
                                          hover:bg-[var(--color-error-50)] dark:hover:bg-[var(--color-error-900)]/20
                                          transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </motion.button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addWarning}
                    className="mt-2 text-sm px-4 py-2 rounded-lg bg-[var(--color-primary-500)] text-white hover:bg-[var(--color-primary-600)] transition-colors flex items-center gap-1"
                >
                    <FiPlus className="w-4 h-4" /> {t('createRemedy.addWarning')}
                </button>
            </div>
            
            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    {t('createRemedy.tags')}
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder={t('createRemedy.tagPlaceholder')}
                        className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)]
                                  border border-[var(--color-border-primary)] text-[var(--color-text-primary)]
                                  placeholder-[var(--color-text-tertiary)] focus:outline-none 
                                  focus:border-[var(--color-primary-500)] transition-colors"
                    />
                    <Button type="button" onClick={addTag}>
                        {t('createRemedy.addTag')}
                    </Button>
                </div>
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                            <motion.span
                                key={index}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                                          bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/30
                                          text-[var(--color-primary-600)] text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-[var(--color-error-500)] transition-colors"
                                >
                                    <FiX className="w-3 h-3" />
                                </button>
                            </motion.span>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Preview Summary */}
            <div className="p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-primary)]">
                <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
                    📋 {t('createRemedy.remedySummary')}
                </h3>
                <div className="space-y-2 text-sm">
                    <p><span className="text-[var(--color-text-tertiary)]">{t('createRemedy.summaryTitle')}:</span> {formData.title || '-'}</p>
                    <p><span className="text-[var(--color-text-tertiary)]">{t('createRemedy.category')}:</span> {formData.category ? `${CATEGORIES.find(c => c.value === formData.category)?.icon} ${t(CATEGORIES.find(c => c.value === formData.category)?.labelKey)}` : '-'}</p>
                    <p><span className="text-[var(--color-text-tertiary)]">{t('createRemedy.difficulty')}:</span> {t(DIFFICULTY_LEVELS.find(d => d.value === formData.difficulty)?.labelKey)}</p>
                    <p><span className="text-[var(--color-text-tertiary)]">{t('createRemedy.ingredients')}:</span> {formData.ingredients.filter(i => i.name).length} {t('createRemedy.items')}</p>
                    <p><span className="text-[var(--color-text-tertiary)]">{t('createRemedy.steps')}:</span> {formData.instructions.filter(i => i).length} {t('createRemedy.stepsCount')}</p>
                </div>
            </div>
        </motion.div>
    );
    
    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------
    
    if (!isAuthenticated) {
        return <LoadingSpinner fullScreen text={t('common.loading')} />;
    }
    
    // ----------------------------------------
    // RENDER
    // ----------------------------------------
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[var(--color-bg-primary)] pt-20 pb-12"
        >
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-xl bg-[var(--color-primary-500)] text-white
                                  hover:bg-[var(--color-primary-600)] transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </motion.button>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                            {isEditMode 
                                ? (t('createRemedy.editTitle') || 'Edit Remedy')
                                : t('createRemedy.title')}
                        </h1>
                        <p className="text-[var(--color-text-tertiary)]">
                            {isEditMode
                                ? (t('createRemedy.editSubtitle') || 'Update your remedy details')
                                : t('createRemedy.subtitle')}
                        </p>
                    </div>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                            <motion.div
                                animate={{
                                    scale: currentStep === step ? 1.1 : 1,
                                    backgroundColor: currentStep >= step 
                                        ? 'var(--color-primary-500)' 
                                        : 'var(--color-bg-tertiary)',
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center
                                           font-medium transition-colors
                                           ${currentStep >= step 
                                               ? 'text-white' 
                                               : 'text-[var(--color-text-tertiary)]'
                                           }`}
                            >
                                {currentStep > step ? <FiCheck className="w-5 h-5" /> : step}
                            </motion.div>
                            {step < 4 && (
                                <div className={`hidden sm:block w-16 md:w-24 h-1 mx-2 rounded-full transition-colors
                                               ${currentStep > step 
                                                   ? 'bg-[var(--color-primary-500)]' 
                                                   : 'bg-[var(--color-bg-tertiary)]'
                                               }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Form Content - using div instead of form to prevent unintentional submissions */}
                <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 sm:p-8 
                               border border-[var(--color-border-primary)] shadow-sm">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                    </AnimatePresence>
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-[var(--color-border-primary)]">
                        <Button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="gap-2"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            {t('createRemedy.previous')}
                        </Button>
                        
                        {currentStep < 4 ? (
                            <Button type="button" onClick={nextStep} className="gap-2">
                                {t('createRemedy.next')}
                                <FiArrowLeft className="w-4 h-4 rotate-180" />
                            </Button>
                        ) : (
                            <Button 
                                type="button" 
                                onClick={handleSubmit}
                                loading={isSubmitting} 
                                className="gap-2"
                            >
                                <FiCheck className="w-4 h-4" />
                                {isEditMode 
                                    ? (isSubmitting 
                                        ? (t('createRemedy.updating') || 'Updating...') 
                                        : (t('createRemedy.updateRemedy') || 'Update Remedy'))
                                    : (isSubmitting 
                                        ? (t('createRemedy.publishing') || 'Publishing...') 
                                        : t('createRemedy.publishRemedy'))}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CreateRemedyPage;
