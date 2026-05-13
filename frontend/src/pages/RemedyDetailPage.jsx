// ============================================
// HOMELY - Remedy Detail Page
// ============================================
// Full remedy view with ingredients, steps,
// ratings, and related remedies
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiClock, 
    FiBookmark, 
    FiShare2, 
    FiHeart,
    FiAlertTriangle,
    FiPrinter,
    FiMessageCircle,
    FiUser,
    FiCalendar,
    FiEdit2,
    FiTrash2
} from 'react-icons/fi';
import { 
    GiHerbsBundle, 
    GiMedicines,
    GiHoneypot,
    GiLeafSwirl 
} from 'react-icons/gi';
import toast from 'react-hot-toast';

// Components
import { Button, LoadingSpinner } from '../components/common';
import { RatingStars, IngredientList, InstructionsSteps } from '../components/remedy';

// Services & Context
import remedyService from '../services/remedyService';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';

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
// DIFFICULTY COLORS
// --------------------------------------------

const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

// --------------------------------------------
// SKELETON LOADER
// --------------------------------------------

const DetailSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-64 bg-[var(--color-bg-tertiary)] rounded-3xl mb-8" />
        <div className="h-10 bg-[var(--color-bg-tertiary)] rounded-xl mb-4 w-3/4" />
        <div className="h-6 bg-[var(--color-bg-tertiary)] rounded-lg mb-8 w-1/2" />
        <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-[var(--color-bg-tertiary)] rounded-2xl" />
            <div className="h-64 bg-[var(--color-bg-tertiary)] rounded-2xl" />
        </div>
    </div>
);

// --------------------------------------------
// REMEDY DETAIL PAGE COMPONENT
// --------------------------------------------

const RemedyDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
    
    // State
    const [remedy, setRemedy] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'instructions' | 'reviews'
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Check if current user is the owner of this remedy
    const isOwner = user && remedy?.createdBy && 
        (user._id === remedy.createdBy._id || user._id === remedy.createdBy);
    
    /**
     * Fetch remedy data
     */
    useEffect(() => {
        const fetchRemedy = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await remedyService.getById(id);
                
                if (response.success) {
                    setRemedy(response.data);
                    // Check if user has saved/liked
                    if (user && response.data.savedBy?.includes(user._id)) {
                        setIsSaved(true);
                    }
                } else {
                    setError(t('errors.notFound'));
                }
            } catch (err) {
                console.error('Error fetching remedy:', err);
                setError(t('remedy.loadError') || 'Failed to load remedy. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (id) {
            fetchRemedy();
        }
    }, [id, user]);
    
    /**
     * Handle save/bookmark
     */
    const handleSave = async () => {
        if (!user) {
            toast.error(t('dashboard.loginToSave'));
            navigate('/login');
            return;
        }
        
        try {
            setIsSaved(!isSaved);
            await remedyService.saveRemedy(id);
            toast.success(isSaved ? t('remedy.removedFromSaved') : t('remedy.savedToCollection'));
        } catch (err) {
            setIsSaved(!isSaved);
            toast.error(t('remedy.saveError') || 'Failed to save remedy');
        }
    };
    
    /**
     * Handle like
     */
    const handleLike = () => {
        if (!user) {
            toast.error(t('remedy.loginToLike') || 'Please login to like remedies');
            return;
        }
        setIsLiked(!isLiked);
    };
    
    /**
     * Handle rating change
     */
    const handleRating = async (rating) => {
        if (!user) {
            toast.error(t('remedy.loginToRate') || 'Please login to rate remedies');
            navigate('/login');
            return;
        }
        
        try {
            setUserRating(rating);
            await remedyService.rateRemedy(id, rating);
            toast.success(t('remedy.thanksForRating') || 'Thanks for rating!');
        } catch (err) {
            toast.error(t('remedy.ratingError') || 'Failed to submit rating');
        }
    };
    
    /**
     * Handle share
     */
    const handleShare = async () => {
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: remedy.title,
                    text: remedy.description,
                    url,
                });
            } catch (err) {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success(t('remedy.linkCopied') || 'Link copied to clipboard!');
        }
    };
    
    /**
     * Handle print
     */
    const handlePrint = () => {
        window.print();
    };
    
    /**
     * Handle edit - navigate to edit page
     */
    const handleEdit = () => {
        navigate(`/remedy/${id}/edit`);
    };
    
    /**
     * Handle delete remedy
     */
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await remedyService.delete(id);
            if (response.success) {
                toast.success(t('createRemedy.deleteSuccess') || 'Remedy deleted successfully');
                navigate('/dashboard');
            } else {
                toast.error(response.message || t('createRemedy.deleteError') || 'Failed to delete remedy');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.message || t('createRemedy.deleteError') || 'Failed to delete remedy');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };
    
    // Get category icon
    const CategoryIcon = remedy 
        ? (categoryIcons[remedy.category] || categoryIcons.default)
        : GiHerbsBundle;
    
    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <DetailSkeleton />
                </div>
            </div>
        );
    }
    
    // Error state
    if (error || !remedy) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <FiAlertTriangle className="w-16 h-16 mx-auto mb-4 text-[var(--color-error-500)]" />
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                        {t('remedy.notFound') || 'Remedy Not Found'}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] mb-6">
                        {error || t('remedy.notFoundDesc') || "The remedy you're looking for doesn't exist."}
                    </p>
                    <Link to="/dashboard">
                        <Button variant="primary" icon={FiArrowLeft}>
                            {t('remedy.backToDashboard') || 'Back to Dashboard'}
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen pb-12">
            {/* ===== Hero Section ===== */}
            <section className="relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br 
                               from-[var(--color-primary-100)] to-[var(--color-primary-50)]
                               dark:from-[var(--color-primary-900)]/30 dark:to-[var(--color-bg-primary)]" />
                
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.1, scale: 1 }}
                        className="absolute -top-20 -right-20 w-80 h-80"
                    >
                        <CategoryIcon className="w-full h-full text-[var(--color-primary-600)]" />
                    </motion.div>
                </div>
                
                <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-12">
                    {/* Back Button */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[var(--color-text-secondary)]
                                   hover:text-[var(--color-text-primary)] transition-colors mb-6"
                    >
                        <FiArrowLeft />
                        {t('back')}
                    </motion.button>
                    
                    {/* Main Content */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl
                                       bg-white dark:bg-[var(--color-bg-card)]
                                       shadow-xl flex items-center justify-center flex-shrink-0"
                        >
                            <CategoryIcon className="w-20 h-20 md:w-24 md:h-24 text-[var(--color-primary-500)]" />
                        </motion.div>
                        
                        {/* Info */}
                        <div className="flex-1">
                            {/* Category Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-3"
                            >
                                <span className="px-3 py-1 rounded-full text-sm font-medium
                                               bg-[#14532d]/20 
                                               text-[#0a2816] dark:text-[#22c55e]
                                               capitalize">
                                    {remedy.category?.replace('-', ' ')}
                                </span>
                            </motion.div>
                            
                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4"
                            >
                                {remedy.title}
                            </motion.h1>
                            
                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-[var(--color-text-secondary)] mb-6"
                            >
                                {remedy.description}
                            </motion.p>
                            
                            {/* Meta Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap items-center gap-4 mb-6"
                            >
                                {/* Difficulty */}
                                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize
                                               ${difficultyColors[remedy.difficulty] || difficultyColors.easy}`}>
                                    {remedy.difficulty} {t('remedy.difficulty')}
                                </span>
                                
                                {/* Prep Time */}
                                {remedy.prepTime && (
                                    <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
                                        <FiClock className="w-4 h-4" />
                                        {remedy.prepTime}
                                    </span>
                                )}
                                
                                {/* Rating */}
                                <RatingStars
                                    rating={remedy.averageRating || 0}
                                    totalRatings={remedy.totalRatings || 0}
                                    size="md"
                                />
                            </motion.div>
                            
                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-3"
                            >
                                <Button
                                    variant={isSaved ? 'primary' : 'secondary'}
                                    icon={FiBookmark}
                                    onClick={handleSave}
                                >
                                    {isSaved ? t('settings.saved') : t('save')}
                                </Button>
                                
                                <Button
                                    variant="secondary"
                                    icon={FiHeart}
                                    onClick={handleLike}
                                    className={isLiked ? 'text-red-500' : ''}
                                >
                                    {isLiked ? t('remedy.liked') : t('remedy.like')}
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    icon={FiShare2}
                                    onClick={handleShare}
                                >
                                    {t('remedy.shareRemedy') || 'Share'}
                                </Button>
                                
                                <Button
                                    variant="ghost"
                                    icon={FiPrinter}
                                    onClick={handlePrint}
                                >
                                    {t('remedy.print') || 'Print'}
                                </Button>
                                
                                {/* Edit/Delete buttons for owner */}
                                {isOwner && (
                                    <>
                                        <Button
                                            variant="secondary"
                                            icon={FiEdit2}
                                            onClick={handleEdit}
                                            className="border-[var(--color-primary-500)] text-[var(--color-primary-600)]
                                                      hover:bg-[var(--color-primary-50)] dark:hover:bg-[var(--color-primary-900)]/20"
                                        >
                                            {t('edit') || 'Edit'}
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            icon={FiTrash2}
                                            onClick={() => setShowDeleteModal(true)}
                                            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            {t('delete') || 'Delete'}
                                        </Button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* ===== Tabs Section ===== */}
            <section className="max-w-4xl mx-auto px-4 mt-8">
                {/* Tab Buttons */}
                <div className="flex border-b border-[var(--color-border-primary)] mb-8">
                    {['ingredients', 'instructions', 'reviews'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium capitalize relative transition-colors
                                       ${activeTab === tab 
                                           ? 'text-[var(--color-primary-600)]' 
                                           : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]'
                                       }`}
                        >
                            {t(`remedy.${tab}`) || tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5
                                               bg-[var(--color-primary-500)]"
                                />
                            )}
                        </button>
                    ))}
                </div>
                
                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Ingredients Tab */}
                        {activeTab === 'ingredients' && (
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 md:p-8
                                           border border-[var(--color-border-primary)]">
                                <IngredientList 
                                    ingredients={remedy.ingredients || []} 
                                />
                            </div>
                        )}
                        
                        {/* Instructions Tab */}
                        {activeTab === 'instructions' && (
                            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 md:p-8
                                           border border-[var(--color-border-primary)]">
                                <InstructionsSteps 
                                    steps={remedy.preparationSteps || remedy.instructions || remedy.steps || []} 
                                />
                            </div>
                        )}
                        
                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <div className="space-y-6">
                                {/* Rate This Remedy */}
                                <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 md:p-8
                                               border border-[var(--color-border-primary)]">
                                    <h3 className="font-bold text-[var(--color-text-primary)] mb-4">
                                        {t('remedy.rateThisRemedy') || 'Rate This Remedy'}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <RatingStars
                                            rating={userRating}
                                            interactive
                                            onChange={handleRating}
                                            showValue={false}
                                            size="lg"
                                        />
                                        <span className="text-[var(--color-text-tertiary)]">
                                            {userRating > 0 ? `${t('remedy.youRated') || 'You rated'} ${userRating} ${t('remedy.stars') || 'stars'}` : t('remedy.clickToRate') || 'Click to rate'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Reviews List */}
                                <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 md:p-8
                                               border border-[var(--color-border-primary)]">
                                    <div className="flex items-center gap-2 mb-6">
                                        <FiMessageCircle className="w-5 h-5 text-[var(--color-primary-500)]" />
                                        <h3 className="font-bold text-[var(--color-text-primary)]">
                                            {t('remedy.reviews') || 'Reviews'} ({remedy.reviews?.length || 0})
                                        </h3>
                                    </div>
                                    
                                    {remedy.reviews && remedy.reviews.length > 0 ? (
                                        <div className="space-y-6">
                                            {remedy.reviews.map((review, index) => (
                                                <div 
                                                    key={index}
                                                    className="pb-6 border-b border-[var(--color-border-primary)] last:border-0"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full 
                                                                       bg-[var(--color-primary-100)] 
                                                                       dark:bg-[var(--color-primary-900)]/30
                                                                       flex items-center justify-center">
                                                            <FiUser className="w-5 h-5 text-[var(--color-primary-600)]" />
                                                        </div>
                                                        
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-medium text-[var(--color-text-primary)]">
                                                                    {review.user?.name || t('remedy.anonymous') || 'Anonymous'}
                                                                </span>
                                                                <RatingStars
                                                                    rating={review.rating}
                                                                    size="sm"
                                                                    showValue={false}
                                                                />
                                                            </div>
                                                            
                                                            <p className="text-[var(--color-text-secondary)] mb-2">
                                                                {review.comment}
                                                            </p>
                                                            
                                                            <span className="flex items-center gap-1 text-xs 
                                                                           text-[var(--color-text-tertiary)]">
                                                                <FiCalendar className="w-3 h-3" />
                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <FiMessageCircle className="w-12 h-12 mx-auto mb-3 
                                                                       text-[var(--color-text-tertiary)]" />
                                            <p className="text-[var(--color-text-secondary)]">
                                                {t('remedy.noReviews') || 'No reviews yet.'} {t('remedy.beFirstToReview') || 'Be the first to share your experience!'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>
            
            {/* ===== Warnings/Precautions ===== */}
            {remedy.precautions && remedy.precautions.length > 0 && (
                <section className="max-w-4xl mx-auto px-4 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 dark:bg-amber-900/20 
                                   border border-amber-200 dark:border-amber-800
                                   rounded-2xl p-6"
                    >
                        <div className="flex items-start gap-4">
                            <FiAlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">
                                    {t('remedy.precautions')} & {t('remedy.warnings') || 'Warnings'}
                                </h3>
                                <ul className="space-y-2">
                                    {remedy.precautions.map((precaution, index) => (
                                        <li 
                                            key={index}
                                            className="text-amber-700 dark:text-amber-300 flex items-start gap-2"
                                        >
                                            <span className="text-amber-500">•</span>
                                            {precaution}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </section>
            )}
            
            {/* ===== Author Info ===== */}
            {remedy.createdBy && (
                <section className="max-w-4xl mx-auto px-4 mt-8">
                    <div className="bg-[var(--color-bg-card)] rounded-2xl p-6
                                   border border-[var(--color-border-primary)]">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full 
                                           bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)]
                                           flex items-center justify-center text-white font-bold text-xl">
                                {remedy.createdBy.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-tertiary)]">
                                    {t('remedy.sharedBy') || 'Shared by'}
                                </p>
                                <p className="font-bold text-[var(--color-text-primary)]">
                                    {remedy.createdBy.name || t('remedy.communityMember') || 'Community Member'}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            
            {/* ===== Delete Confirmation Modal ===== */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[var(--color-bg-card)] rounded-2xl p-6 max-w-md w-full
                                       shadow-xl border border-[var(--color-border-primary)]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30
                                               flex items-center justify-center">
                                    <FiTrash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                                    {t('createRemedy.deleteConfirmTitle') || 'Delete This Remedy?'}
                                </h3>
                            </div>
                            
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                {t('createRemedy.deleteConfirmMessage') || 
                                 'This action cannot be undone. Are you sure you want to delete this remedy?'}
                            </p>
                            
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    {t('createRemedy.cancel') || 'Cancel'}
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-600 hover:bg-red-700 border-red-600"
                                >
                                    {isDeleting 
                                        ? (t('loading') || 'Deleting...') 
                                        : (t('createRemedy.confirm') || 'Confirm')}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RemedyDetailPage;
