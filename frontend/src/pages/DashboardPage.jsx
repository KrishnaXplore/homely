// ============================================
// HOMELY - Dashboard Page
// ============================================
// Main remedy browsing dashboard with search,
// filters, and remedy cards
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiGrid, 
    FiList, 
    FiRefreshCw,
    FiAlertCircle,
    FiPlus,
    FiTrendingUp,
    FiLock,
    FiLogIn
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Components
import { SearchBar, CategoryFilter, Button } from '../components/common';
import { RemedyCard } from '../components/remedy';

// Services & Context
import remedyService from '../services/remedyService';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';

// --------------------------------------------
// SAMPLE REMEDIES FOR GUESTS
// --------------------------------------------

const SAMPLE_REMEDIES = [
    {
        _id: 'sample-1',
        title: 'Honey & Ginger Tea for Sore Throat',
        description: 'A soothing remedy combining the antibacterial properties of honey with the warming effect of ginger to relieve sore throat and cold symptoms.',
        category: 'cold-and-cough',
        difficulty: 'easy',
        preparationTime: 10,
        ingredients: ['Fresh ginger', 'Raw honey', 'Lemon', 'Hot water'],
        averageRating: 4.8,
        totalRatings: 156,
        author: { name: 'Dr. Wellness' },
        createdAt: new Date().toISOString(),
        image: null
    },
    {
        _id: 'sample-2',
        title: 'Turmeric Golden Milk',
        description: 'Ancient Ayurvedic drink known for its powerful anti-inflammatory and immunity-boosting properties. Perfect before bedtime.',
        category: 'immunity-booster',
        difficulty: 'easy',
        preparationTime: 15,
        ingredients: ['Turmeric powder', 'Milk', 'Black pepper', 'Cinnamon', 'Honey'],
        averageRating: 4.9,
        totalRatings: 234,
        author: { name: 'Ayurveda Expert' },
        createdAt: new Date().toISOString(),
        image: null
    },
    {
        _id: 'sample-3',
        title: 'Aloe Vera Face Mask',
        description: 'Natural face mask for glowing skin using fresh aloe vera gel. Hydrates, soothes, and rejuvenates tired skin.',
        category: 'skin-care',
        difficulty: 'easy',
        preparationTime: 5,
        ingredients: ['Fresh aloe vera gel', 'Honey', 'Rose water'],
        averageRating: 4.7,
        totalRatings: 189,
        author: { name: 'Natural Beauty' },
        createdAt: new Date().toISOString(),
        image: null
    },
    {
        _id: 'sample-4',
        title: 'Peppermint Oil for Headaches',
        description: 'Quick relief from tension headaches using the cooling properties of peppermint essential oil.',
        category: 'pain-relief',
        difficulty: 'easy',
        preparationTime: 2,
        ingredients: ['Peppermint essential oil', 'Carrier oil'],
        averageRating: 4.6,
        totalRatings: 112,
        author: { name: 'Aromatherapy Guide' },
        createdAt: new Date().toISOString(),
        image: null
    },
    {
        _id: 'sample-5',
        title: 'Chamomile Sleep Tea',
        description: 'Calming bedtime tea to promote restful sleep and reduce anxiety naturally.',
        category: 'sleep-and-relaxation',
        difficulty: 'easy',
        preparationTime: 8,
        ingredients: ['Chamomile flowers', 'Lavender', 'Honey', 'Hot water'],
        averageRating: 4.8,
        totalRatings: 203,
        author: { name: 'Sleep Specialist' },
        createdAt: new Date().toISOString(),
        image: null
    },
    {
        _id: 'sample-6',
        title: 'Apple Cider Vinegar Digestive Tonic',
        description: 'Traditional remedy to improve digestion, reduce bloating, and support gut health.',
        category: 'digestive-health',
        difficulty: 'easy',
        preparationTime: 3,
        ingredients: ['Apple cider vinegar', 'Water', 'Honey', 'Ginger'],
        averageRating: 4.5,
        totalRatings: 178,
        author: { name: 'Gut Health Pro' },
        createdAt: new Date().toISOString(),
        image: null
    },
];

// --------------------------------------------
// SORT OPTIONS
// --------------------------------------------

const getSortOptions = (t) => [
    { value: 'newest', label: t('dashboard.newest') },
    { value: 'oldest', label: t('dashboard.oldest') },
    { value: 'rating', label: t('dashboard.highestRated') },
    { value: 'popular', label: t('dashboard.popular') },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' },
];

// --------------------------------------------
// SKELETON CARD COMPONENT
// --------------------------------------------

const SkeletonCard = () => (
    <div className="rounded-2xl overflow-hidden bg-[var(--color-bg-card)]
                    border border-[var(--color-border-primary)] animate-pulse">
        <div className="h-40 bg-[var(--color-bg-tertiary)]" />
        <div className="p-5">
            <div className="h-5 rounded bg-[var(--color-bg-tertiary)] mb-3 w-3/4" />
            <div className="h-4 rounded bg-[var(--color-bg-tertiary)] mb-2" />
            <div className="h-4 rounded bg-[var(--color-bg-tertiary)] w-2/3 mb-4" />
            <div className="flex justify-between pt-3 border-t border-[var(--color-border-primary)]">
                <div className="h-6 w-16 rounded bg-[var(--color-bg-tertiary)]" />
                <div className="h-6 w-12 rounded bg-[var(--color-bg-tertiary)]" />
            </div>
        </div>
    </div>
);

// --------------------------------------------
// EMPTY STATE COMPONENT
// --------------------------------------------

const EmptyState = ({ searchQuery, category, onReset, t }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
    >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full
                        bg-[var(--color-bg-tertiary)] flex items-center justify-center">
            <FiAlertCircle className="w-12 h-12 text-[var(--color-text-tertiary)]" />
        </div>
        
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
            {t('dashboard.noResults')}
        </h3>
        <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            {t('dashboard.noResultsDesc')}
        </p>
        
        <Button variant="secondary" onClick={onReset}>
            {t('dashboard.clearFilters')}
        </Button>
    </motion.div>
);

// --------------------------------------------
// DASHBOARD PAGE COMPONENT
// --------------------------------------------

const DashboardPage = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    // Get sort options with translations
    const sortOptions = getSortOptions(t);
    
    // State
    const [remedies, setRemedies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    
    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    
    // Guest mode - show sample remedies
    const isGuest = !user;
    
    /**
     * Fetch remedies from API
     */
    const fetchRemedies = useCallback(async (pageToFetch, reset = false, search = '', category = 'all', sort = 'newest') => {
        // For guests, show sample remedies
        if (isGuest) {
            setRemedies(SAMPLE_REMEDIES);
            setTotalCount(SAMPLE_REMEDIES.length);
            setHasMore(false);
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            const params = {
                page: pageToFetch,
                limit: 12,
                includeOwn: 'true', // Include user's own remedies (including pending)
            };
            
            // Add filters
            if (search) params.q = search;
            if (category !== 'all') params.category = category;
            
            // Add sorting - use server-expected values
            params.sort = sort; // sortBy already has correct values: newest, oldest, popular, rating, az, za
            
            const response = await remedyService.getAll(params);
            
            if (response.success) {
                const newRemedies = response.data || [];
                
                if (reset) {
                    setRemedies(newRemedies);
                } else {
                    setRemedies(prev => [...prev, ...newRemedies]);
                }
                
                // Use totalItems from pagination (API returns totalItems, not total)
                const total = response.pagination?.totalItems || response.pagination?.total || 0;
                setTotalCount(total);
                setHasMore(response.pagination?.hasNextPage ?? newRemedies.length === 12);
            }
        } catch (err) {
            console.error('Error fetching remedies:', err);
            // Only set error state for actual network/server errors, not for empty results
            // The UI already handles "no results found" gracefully
            if (err.response?.status >= 500) {
                setError('Failed to load remedies. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [isGuest, user]);
    
    // Initial fetch and filter changes
    useEffect(() => {
        // Reset to first page and fetch with new filters
        setPage(1);
        fetchRemedies(1, true, searchQuery, selectedCategory, sortBy);
    }, [searchQuery, selectedCategory, sortBy, user, fetchRemedies]);
    
    /**
     * Handle search - guests prompted to login
     */
    const handleSearch = (query) => {
        if (isGuest) {
            toast.error(t('dashboard.loginToSearch'));
            return;
        }
        setSearchQuery(query);
    };
    
    /**
     * Handle category change - guests prompted to login
     */
    const handleCategoryChange = (category) => {
        if (isGuest) {
            toast.error(t('dashboard.loginToFilter'));
            return;
        }
        setSelectedCategory(category);
    };
    
    /**
     * Handle sort change - guests prompted to login
     */
    const handleSortChange = (e) => {
        if (isGuest) {
            toast.error(t('dashboard.loginToSort'));
            return;
        }
        setSortBy(e.target.value);
    };
    
    /**
     * Reset all filters
     */
    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('newest');
    };
    
    /**
     * Load more remedies
     */
    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchRemedies(nextPage, false, searchQuery, selectedCategory, sortBy);
        }
    };
    
    /**
     * Handle save remedy
     */
    const handleSaveRemedy = async (remedyId) => {
        if (!user) {
            toast.error(t('dashboard.loginToSave'));
            return;
        }
        
        try {
            await remedyService.saveRemedy(remedyId);
            toast.success(t('dashboard.remedySaved'));
        } catch (err) {
            console.error('Error saving remedy:', err);
        }
    };
    
    /**
     * Handle card click for guests
     */
    const handleGuestCardClick = (e, remedyId) => {
        if (isGuest && remedyId.startsWith('sample-')) {
            e.preventDefault();
            toast((toastObj) => (
                <div className="flex flex-col gap-2">
                    <span className="font-semibold">🔒 {t('dashboard.loginRequired')}</span>
                    <span className="text-sm">{t('dashboard.loginRequiredDesc')}</span>
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => {
                                toast.dismiss(toastObj.id);
                                navigate('/login');
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium"
                        >
                            {t('nav.login')}
                        </button>
                        <button
                            onClick={() => toast.dismiss(toastObj.id)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                        >
                            {t('dashboard.maybeLater')}
                        </button>
                    </div>
                </div>
            ), { duration: 10000 });
        }
    };
    
    return (
        <div className="min-h-screen pb-12">
            {/* ===== Guest Banner ===== */}
            {isGuest && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
                               text-white py-3 px-4"
                >
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 text-center">
                        <div className="flex items-center gap-2">
                            <FiLock className="w-5 h-5" />
                            <span className="font-medium">
                                {t('dashboard.guestBanner')}
                            </span>
                        </div>
                        <Link to="/login">
                            <button className="px-4 py-1.5 bg-white text-[var(--color-primary-600)] 
                                             rounded-full font-semibold text-sm hover:bg-gray-100 
                                             transition-colors flex items-center gap-2">
                                <FiLogIn className="w-4 h-4" />
                                {t('dashboard.signInNow')}
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
            
            {/* ===== Hero Section ===== */}
            <section className="relative py-12 px-4 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/4 w-72 h-72 
                                    bg-[var(--color-primary-200)] dark:bg-[var(--color-primary-900)]/30
                                    rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 
                                    bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-800)]/20
                                    rounded-full blur-3xl opacity-50" />
                </div>
                
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            {t('dashboard.title')} 🌿
                        </h1>
                        <p className="text-lg text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
                            {t('dashboard.subtitle')}
                        </p>
                    </motion.div>
                    
                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSearch={handleSearch}
                            placeholder={t('dashboard.searchPlaceholder')}
                        />
                    </motion.div>
                </div>
            </section>
            
            {/* ===== Main Content ===== */}
            <section className="px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <CategoryFilter
                            selected={selectedCategory}
                            onChange={handleCategoryChange}
                        />
                    </motion.div>
                    
                    {/* Toolbar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-between gap-4 mb-6"
                    >
                        {/* Results Count */}
                        <div className="flex items-center gap-3">
                            <GiHerbsBundle className="w-6 h-6 text-[var(--color-primary-500)]" />
                            <span className="text-[var(--color-text-secondary)]">
                                <span className="font-bold text-[var(--color-text-primary)]">
                                    {totalCount}
                                </span> {t('dashboard.remediesFound')}
                            </span>
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            {/* Sort Dropdown */}
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="px-4 py-2 rounded-xl bg-[var(--color-bg-card)]
                                           border border-[var(--color-border-primary)]
                                           text-[var(--color-text-primary)]
                                           focus:outline-none focus:border-[var(--color-primary-500)]
                                           cursor-pointer"
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            
                            {/* View Mode Toggle */}
                            <div className="flex rounded-xl overflow-hidden border 
                                            border-[var(--color-border-primary)]">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 transition-colors ${
                                        viewMode === 'grid'
                                            ? 'text-white'
                                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                                    style={viewMode === 'grid' ? { background: '#166534' } : {}}
                                >
                                    <FiGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 transition-colors ${
                                        viewMode === 'list'
                                            ? 'text-white'
                                            : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                                    }`}
                                    style={viewMode === 'list' ? { background: '#166534' } : {}}
                                >
                                    <FiList className="w-5 h-5" />
                                </button>
                            </div>
                            
                            {/* Add Remedy Button (for logged in users) */}
                            {user && (
                                <Link to="/create">
                                    <Button variant="primary" icon={FiPlus}>
                                        {t('dashboard.addRemedy')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </motion.div>
                    
                    {/* ===== Remedies Grid/List ===== */}
                    <AnimatePresence mode="wait">
                        {isLoading && remedies.length === 0 ? (
                            // Loading Skeletons
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={viewMode === 'grid' 
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                    : 'space-y-4'
                                }
                            >
                                {[...Array(8)].map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </motion.div>
                        ) : error ? (
                            // Error State
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <FiAlertCircle className="w-16 h-16 mx-auto mb-4 
                                                          text-[var(--color-error-500)]" />
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                                    {t('errors.somethingWrong')}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] mb-6">
                                    {error}
                                </p>
                                <Button 
                                    variant="primary" 
                                    icon={FiRefreshCw}
                                    onClick={() => fetchRemedies(true)}
                                >
                                    {t('errors.tryAgain')}
                                </Button>
                            </motion.div>
                        ) : remedies.length === 0 ? (
                            // Empty State
                            <EmptyState
                                searchQuery={searchQuery}
                                category={selectedCategory}
                                onReset={resetFilters}
                                t={t}
                            />
                        ) : (
                            // Remedies Grid
                            <motion.div
                                key="remedies"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className={viewMode === 'grid' 
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                    : 'space-y-4'
                                }>
                                    {remedies.map((remedy, index) => (
                                        <motion.div
                                            key={remedy._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={(e) => handleGuestCardClick(e, remedy._id)}
                                        >
                                            <RemedyCard
                                                remedy={remedy}
                                                onSave={handleSaveRemedy}
                                                variant={viewMode === 'list' ? 'compact' : 'default'}
                                                isGuest={isGuest}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                                
                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="text-center mt-12">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            loading={isLoading}
                                            onClick={loadMore}
                                        >
                                            {t('dashboard.loadMore')}
                                        </Button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
            
            {/* ===== Floating Quick Stats ===== */}
            {!isLoading && remedies.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
                               hidden lg:flex items-center gap-6 px-6 py-3 rounded-full
                               bg-[var(--color-bg-card)]/90 backdrop-blur-lg
                               border border-[var(--color-border-primary)] shadow-xl"
                >
                    <div className="flex items-center gap-2 text-sm">
                        <FiTrendingUp className="w-4 h-4 text-[var(--color-primary-500)]" />
                        <span className="text-[var(--color-text-secondary)]">
                            {t('dashboard.showing')} <span className="font-bold text-[var(--color-text-primary)]">{remedies.length}</span> {t('dashboard.of')} {totalCount}
                        </span>
                    </div>
                    
                    {(searchQuery || selectedCategory !== 'all') && (
                        <button
                            onClick={resetFilters}
                            className="text-sm text-[var(--color-primary-600)] hover:underline"
                        >
                            {t('dashboard.clearFilters')}
                        </button>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default DashboardPage;
