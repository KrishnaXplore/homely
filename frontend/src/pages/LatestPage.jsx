// ============================================
// HOMELY - Latest Remedies Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiClock, 
    FiRefreshCw,
    FiAlertCircle,
    FiGrid,
    FiList,
    FiCalendar
} from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context';
import remedyService from '../services/remedyService';
import { RemedyCard } from '../components/remedy';

const LatestPage = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [remedies, setRemedies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const fetchRemedies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await remedyService.getAll({ sort: 'newest', limit: 20 });
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
    }, [user]);

    const handleRefresh = () => {
        if (user) {
            setIsLoading(true);
            remedyService.getAll({ sort: 'newest', limit: 20 }).then(response => {
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
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#14532d] to-[#22c55e] mb-6"
                    >
                        <FiClock className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('latest.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('latest.subtitle')}
                    </p>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-[var(--color-text-secondary)]">
                        {remedies.length} {t('latest.remediesFound')}
                    </p>
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
                        <FiCalendar className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('latest.loginRequired')}
                        </h2>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            {t('latest.loginToView')}
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
                        <FiClock className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('latest.noRemedies')}
                        </h2>
                        <p className="text-[var(--color-text-secondary)]">
                            {t('latest.noRemediesDesc')}
                        </p>
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

export default LatestPage;
