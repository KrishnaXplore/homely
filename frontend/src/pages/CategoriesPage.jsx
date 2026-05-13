// ============================================
// HOMELY - Categories Page
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    GiHerbsBundle, 
    GiStomach, 
    GiLungs, 
    GiFruitBowl,
    GiHealing,
    GiMedicines,
    GiHairStrands,
    GiMeditation
} from 'react-icons/gi';
import { FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const CategoriesPage = () => {
    const { t } = useLanguage();

    const categories = [
        {
            slug: 'immunity-booster',
            icon: GiHerbsBundle,
            name: t('categories.immunityBooster'),
            description: t('categories.immunityBoosterDesc'),
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-500/10'
        },
        {
            slug: 'digestive-health',
            icon: GiStomach,
            name: t('categories.digestiveHealth'),
            description: t('categories.digestiveHealthDesc'),
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-500/10'
        },
        {
            slug: 'cold-and-cough',
            icon: GiLungs,
            name: t('categories.coldAndCough'),
            description: t('categories.coldAndCoughDesc'),
            color: 'from-blue-500 to-cyan-600',
            bgColor: 'bg-blue-500/10'
        },
        {
            slug: 'skin-care',
            icon: GiHealing,
            name: t('categories.skinCare'),
            description: t('categories.skinCareDesc'),
            color: 'from-pink-500 to-rose-600',
            bgColor: 'bg-pink-500/10'
        },
        {
            slug: 'hair-care',
            icon: GiHairStrands,
            name: t('categories.hairCare'),
            description: t('categories.hairCareDesc'),
            color: 'from-purple-500 to-violet-600',
            bgColor: 'bg-purple-500/10'
        },
        {
            slug: 'stress-relief',
            icon: GiMeditation,
            name: t('categories.stressRelief'),
            description: t('categories.stressReliefDesc'),
            color: 'from-indigo-500 to-blue-600',
            bgColor: 'bg-indigo-500/10'
        },
        {
            slug: 'energy-vitality',
            icon: GiFruitBowl,
            name: t('categories.energyVitality'),
            description: t('categories.energyVitalityDesc'),
            color: 'from-yellow-500 to-amber-600',
            bgColor: 'bg-yellow-500/10'
        },
        {
            slug: 'general-wellness',
            icon: GiMedicines,
            name: t('categories.generalWellness'),
            description: t('categories.generalWellnessDesc'),
            color: 'from-teal-500 to-green-600',
            bgColor: 'bg-teal-500/10'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#14532d] to-[#22c55e] mb-6"
                    >
                        <GiHerbsBundle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('categories.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('categories.subtitle')}
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/category/${category.slug}`}
                                    className="block card-base p-6 h-full hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${category.bgColor} flex items-center justify-center mb-4`}>
                                        <Icon className={`w-7 h-7 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} 
                                              style={{ color: category.color.includes('green') ? '#22c55e' : 
                                                              category.color.includes('amber') ? '#f59e0b' :
                                                              category.color.includes('blue') ? '#3b82f6' :
                                                              category.color.includes('pink') ? '#ec4899' :
                                                              category.color.includes('purple') ? '#a855f7' :
                                                              category.color.includes('indigo') ? '#6366f1' :
                                                              category.color.includes('yellow') ? '#eab308' :
                                                              '#14b8a6' }} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[#22c55e] transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center text-[#22c55e] text-sm font-medium">
                                        {t('categories.explore')}
                                        <FiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default CategoriesPage;
