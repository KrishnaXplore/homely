// ============================================
// HOMELY - Cookies Policy Page
// ============================================

import { motion } from 'framer-motion';
import { FiSettings, FiInfo, FiToggleRight, FiShield } from 'react-icons/fi';
import { GiCookie } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';

const CookiesPage = () => {
    const { t } = useLanguage();

    const cookieTypes = [
        {
            icon: FiShield,
            title: t('cookies.essentialTitle'),
            description: t('cookies.essentialDesc'),
            required: true
        },
        {
            icon: FiSettings,
            title: t('cookies.functionalTitle'),
            description: t('cookies.functionalDesc'),
            required: false
        },
        {
            icon: FiInfo,
            title: t('cookies.analyticsTitle'),
            description: t('cookies.analyticsDesc'),
            required: false
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#14532d] to-[#22c55e] mb-6"
                    >
                        <GiCookie className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('cookies.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('cookies.subtitle')}
                    </p>
                </div>

                {/* What are Cookies */}
                <div className="card-base p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('cookies.whatAreTitle')}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {t('cookies.whatAreContent')}
                    </p>
                </div>

                {/* Cookie Types */}
                <div className="space-y-6 mb-8">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {t('cookies.typesTitle')}
                    </h2>
                    {cookieTypes.map((cookie, index) => {
                        const Icon = cookie.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-base p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#14532d]/20 to-[#22c55e]/20 flex-shrink-0">
                                            <Icon className="w-6 h-6 text-[#22c55e]" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                                                {cookie.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                {cookie.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {cookie.required ? (
                                            <span className="px-3 py-1 text-xs font-medium bg-[#22c55e]/20 text-[#22c55e] rounded-full">
                                                {t('cookies.required')}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 text-xs font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] rounded-full">
                                                {t('cookies.optional')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Managing Cookies */}
                <div className="card-base p-8 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-[#14532d]/20 to-[#22c55e]/20 flex-shrink-0">
                            <FiToggleRight className="w-6 h-6 text-[#22c55e]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                                {t('cookies.manageTitle')}
                            </h2>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                {t('cookies.manageContent')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card-base p-8 text-center"
                >
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                        {t('cookies.questionsTitle')}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        {t('cookies.questionsContent')}
                    </p>
                    <a
                        href="mailto:mayurshettycoder@gmail.com"
                        className="text-[#22c55e] hover:underline"
                    >
                        mayurshettycoder@gmail.com
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CookiesPage;
