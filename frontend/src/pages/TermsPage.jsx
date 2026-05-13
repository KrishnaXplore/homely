// ============================================
// HOMELY - Terms of Service Page
// ============================================

import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiAlertCircle, FiUsers, FiEdit3 } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const TermsPage = () => {
    const { t } = useLanguage();

    const sections = [
        {
            icon: FiCheckCircle,
            title: t('terms.acceptanceTitle'),
            content: t('terms.acceptanceContent')
        },
        {
            icon: FiUsers,
            title: t('terms.userAccountsTitle'),
            content: t('terms.userAccountsContent')
        },
        {
            icon: FiEdit3,
            title: t('terms.contentTitle'),
            content: t('terms.contentContent')
        },
        {
            icon: FiAlertCircle,
            title: t('terms.disclaimerTitle'),
            content: t('terms.disclaimerContent')
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
                        <FiFileText className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('terms.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('terms.subtitle')}
                    </p>
                    <p className="text-sm text-[var(--color-text-tertiary)] mt-4">
                        {t('terms.lastUpdated')}: February 2026
                    </p>
                </div>

                {/* Introduction */}
                <div className="card-base p-8 mb-8">
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {t('terms.intro')}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-base p-8"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#14532d]/20 to-[#22c55e]/20 flex-shrink-0">
                                        <Icon className="w-6 h-6 text-[#22c55e]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                                            {section.title}
                                        </h2>
                                        <p className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Changes Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 card-base p-8"
                >
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
                        {t('terms.changesTitle')}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {t('terms.changesContent')}
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default TermsPage;
