// ============================================
// HOMELY - 404 Not Found Page
// ============================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';

const NotFoundPage = () => {
    const { t } = useLanguage();
    
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="text-center">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                    className="inline-block mb-8"
                >
                    <div className="relative">
                        <GiHerbsBundle className="w-24 h-24 text-[var(--color-primary-500)] opacity-20" />
                        <span className="absolute inset-0 flex items-center justify-center text-4xl">
                            🍂
                        </span>
                    </div>
                </motion.div>
                
                {/* 404 Text */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-8xl font-bold gradient-text mb-4"
                >
                    404
                </motion.h1>
                
                {/* Message */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4"
                >
                    {t('notFound.subtitle')}
                </motion.h2>
                
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto"
                >
                    {t('notFound.description')}
                </motion.p>
                
                {/* Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link to="/">
                        <motion.button
                            className="flex items-center gap-2 px-6 py-3 rounded-xl
                                       text-white font-medium
                                       bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)]
                                       hover:from-[var(--color-primary-600)] hover:to-[var(--color-primary-700)]
                                       shadow-lg transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiHome className="w-5 h-5" />
                            {t('notFound.backHome')}
                        </motion.button>
                    </Link>
                    
                    <motion.button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl
                                   text-[var(--color-text-primary)] font-medium
                                   bg-[var(--color-bg-card)]
                                   border border-[var(--color-border-primary)]
                                   hover:border-[var(--color-primary-500)]
                                   transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        {t('notFound.goBack')}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
