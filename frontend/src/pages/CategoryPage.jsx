// ============================================
// HOMELY - Category Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiArrowLeft, 
    FiRefreshCw,
    FiAlertCircle,
    FiGrid,
    FiList
} from 'react-icons/fi';
import { 
    GiHerbsBundle, 
    GiStomach, 
    GiLungs, 
    GiHealing,
    GiHairStrands,
    GiMeditation,
    GiFruitBowl,
    GiMedicines
} from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context';
import remedyService from '../services/remedyService';
import { RemedyCard } from '../components/remedy';

const categoryInfo = {
    'immunity-booster': { icon: GiHerbsBundle, color: '#22c55e' },
    'digestive-health': { icon: GiStomach, color: '#f59e0b' },
    'cold-and-cough': { icon: GiLungs, color: '#3b82f6' },
    'skin-care': { icon: GiHealing, color: '#ec4899' },
    'hair-care': { icon: GiHairStrands, color: '#a855f7' },
    'stress-relief': { icon: GiMeditation, color: '#6366f1' },
    'energy-vitality': { icon: GiFruitBowl, color: '#eab308' },
    'general-wellness': { icon: GiMedicines, color: '#14b8a6' }
};

const CategoryPage = () => {
    const { slug } = useParams();
    const { t } = useLanguage();
    const { user } = useAuth();
    const [remedies, setRemedies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const info = categoryInfo[slug] || { icon: GiHerbsBundle, color: '#22c55e' };
    const Icon = info.icon;

    // Get translated category name
    const getCategoryName = () => {
        const nameMap = {
            'immunity-booster': t('categories.immunityBooster'),
            'digestive-health': t('categories.digestiveHealth'),
            'cold-and-cough': t('categories.coldAndCough'),
            'skin-care': t('categories.skinCare'),
            'hair-care': t('categories.hairCare'),
            'stress-relief': t('categories.stressRelief'),
            'energy-vitality': t('categories.energyVitality'),
            'general-wellness': t('categories.generalWellness')
        };
        return nameMap[slug] || slug;
    };

    useEffect(() => {
        const fetchRemedies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await remedyService.getByCategory(slug);
                if (response.success) {
                    setRemedies(response.data || []);
                } else {
                    setError(response.message || 'Failed to load remedies');
                }
            } catch (err) {
                setError(err.message || 'Failed to load remedies');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchRemedies();
        } else {
            setIsLoading(false);
        }
    }, [slug, user]);

    const handleRefresh = () => {
        if (user) {
            setIsLoading(true);
            remedyService.getByCategory(slug).then(response => {
                if (response.success) {
                    setRemedies(response.data || []);
                }
            }).finally(() => setIsLoading(false));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-8 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    to="/categories"
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[#22c55e] mb-6 transition-colors"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    {t('categories.backToCategories')}
                </Link>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div 
                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ backgroundColor: `${info.color}20` }}
                        >
                            <Icon className="w-8 h-8" style={{ color: info.color }} />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">
                                {getCategoryName()}
                            </h1>
                            <p className="text-[var(--color-text-secondary)]">
                                {remedies.length} {t('categories.remediesFound')}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] hover:border-[#22c55e] transition-colors disabled:opacity-50"
                        >
                            <FiRefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="flex bg-[var(--color-bg-secondary)] rounded-xl p-1 border border-[var(--color-border-primary)]">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#22c55e] text-white' : 'text-[var(--color-text-secondary)]'}`}
                            >
                                <FiGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#22c55e] text-white' : 'text-[var(--color-text-secondary)]'}`}
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {!user ? (
                    <div className="card-base p-12 text-center">
                        <FiAlertCircle className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('categories.loginRequired')}
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            {t('categories.loginToView')}
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14532d] to-[#22c55e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            {t('auth.signIn')}
                        </Link>
                    </div>
                ) : isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                    </div>
                ) : error ? (
                    <div className="card-base p-12 text-center">
                        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('errors.somethingWrong')}
                        </h2>
                        <p className="text-[var(--color-text-secondary)]">{error}</p>
                    </div>
                ) : remedies.length === 0 ? (
                    <div className="card-base p-12 text-center">
                        <Icon className="w-16 h-16 mx-auto mb-4" style={{ color: info.color }} />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('categories.noRemedies')}
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            {t('categories.noRemediesDesc')}
                        </p>
                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#14532d] to-[#22c55e] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            {t('categories.createFirst')}
                        </Link>
                    </div>
                ) : (
                    <div className={viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                    }>
                        {remedies.map((remedy, index) => (
                            <motion.div
                                key={remedy._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <RemedyCard remedy={remedy} viewMode={viewMode} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CategoryPage;
