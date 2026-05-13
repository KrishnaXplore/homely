// ============================================
// HOMELY - About Us Page
// ============================================

import { motion } from 'framer-motion';
import { FiHeart, FiUsers, FiTarget, FiStar } from 'react-icons/fi';
import { GiHerbsBundle, GiMeditation } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
    const { t } = useLanguage();

    const values = [
        {
            icon: GiHerbsBundle,
            title: t('about.naturalTitle'),
            description: t('about.naturalDesc')
        },
        {
            icon: FiUsers,
            title: t('about.communityTitle'),
            description: t('about.communityDesc')
        },
        {
            icon: FiTarget,
            title: t('about.missionTitle'),
            description: t('about.missionDesc')
        },
        {
            icon: FiHeart,
            title: t('about.careTitle'),
            description: t('about.careDesc')
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
                        <GiMeditation className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('about.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('about.subtitle')}
                    </p>
                </div>

                {/* Story Section */}
                <div className="card-base p-8 mb-12">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('about.storyTitle')}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
                        {t('about.storyP1')}
                    </p>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {t('about.storyP2')}
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card-base p-6"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#14532d]/20 to-[#22c55e]/20">
                                        <Icon className="w-6 h-6 text-[#22c55e]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">
                                            {value.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-secondary)]">
                                            {value.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Team Section */}
                <div className="text-center card-base p-8">
                    <FiStar className="w-12 h-12 text-[#22c55e] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('about.teamTitle')}
                    </h2>
                    <p className="text-[var(--color-text-secondary)]">
                        {t('about.teamDesc')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AboutPage;
