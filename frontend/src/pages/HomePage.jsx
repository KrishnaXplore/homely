// ============================================
// HOMELY - Home/Landing Page
// ============================================
// Full animated landing page with all sections
// ============================================

import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
    FiArrowRight, 
    FiSearch, 
    FiHeart, 
    FiShield, 
    FiStar,
    FiCheck,
    FiMessageCircle,
    FiBookOpen,
    FiUsers,
    FiEdit3,
    FiX
} from 'react-icons/fi';
import { 
    GiHerbsBundle, 
    GiMedicines, 
    GiCauldron,
    GiMortar,
    GiHealthNormal,
    GiSparkles
} from 'react-icons/gi';
import { useAuth } from '../context';
import { useLanguage } from '../context/LanguageContext';
import { getTestimonials, createTestimonial, getMyTestimonial, updateTestimonial } from '../services/testimonialApi';

// --------------------------------------------
// ANIMATION VARIANTS
// --------------------------------------------

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const fadeInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// --------------------------------------------
// FLOATING ELEMENTS COMPONENT
// --------------------------------------------

const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient blobs */}
        <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full
                       bg-gradient-to-br from-[var(--color-primary-200)] to-[var(--color-primary-400)]
                       opacity-20 blur-3xl"
            animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -20, 0],
                rotate: [0, 90, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute top-1/3 -left-40 w-80 h-80 rounded-full
                       bg-gradient-to-br from-[var(--color-primary-300)] to-[var(--color-primary-500)]
                       opacity-15 blur-3xl"
            animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
                y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
            className="absolute bottom-20 right-1/4 w-64 h-64 rounded-full
                       bg-gradient-to-br from-green-300 to-emerald-500
                       opacity-10 blur-3xl"
            animate={{ 
                scale: [1, 1.4, 1],
                y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Floating icons */}
        <motion.span
            className="absolute top-32 left-[15%] text-5xl opacity-20"
            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
        >
            🌿
        </motion.span>
        <motion.span
            className="absolute top-48 right-[20%] text-4xl opacity-15"
            animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
        >
            🍃
        </motion.span>
        <motion.span
            className="absolute bottom-40 left-[25%] text-3xl opacity-20"
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
        >
            🌱
        </motion.span>
        <motion.span
            className="absolute top-[60%] right-[10%] text-4xl opacity-15"
            animate={{ y: [0, 15, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
        >
            🍵
        </motion.span>
    </div>
);

// --------------------------------------------
// HERO SECTION
// --------------------------------------------

const HeroSection = ({ t }) => {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);
    
    return (
        <section className="relative min-h-screen flex items-center pt-16 pb-20 px-4 overflow-hidden">
            <FloatingElements />
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full
                               bg-gradient-to-r from-[var(--color-primary-50)] to-[var(--color-primary-100)]
                               dark:from-[var(--color-primary-950)] dark:to-[var(--color-primary-900)]
                               border border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]
                               shadow-lg shadow-[var(--color-primary-500)]/10"
                >
                    <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <GiSparkles className="w-4 h-4 text-[var(--color-primary-600)]" />
                    </motion.span>
                    <span className="text-sm font-semibold text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]">
                        {t('home.badge')}
                    </span>
                </motion.div>
                
                {/* Main Headline */}
                <motion.div style={{ y, opacity }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6
                                   text-[var(--color-text-primary)] leading-tight"
                    >
                        {t('home.heroTitle')}{' '}
                        <span className="relative">
                            <span className="gradient-text">{t('home.heroTitleHighlight')}</span>
                            <motion.svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 300 12"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.8 }}
                            >
                                <motion.path
                                    d="M2 10 Q150 -5 298 10"
                                    fill="none"
                                    stroke="url(#gradient)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--color-primary-400)" />
                                        <stop offset="100%" stopColor="var(--color-primary-600)" />
                                    </linearGradient>
                                </defs>
                            </motion.svg>
                        </span>
                        <br />
                        <span className="text-4xl sm:text-5xl lg:text-6xl">{t('home.forEverydayWellness')}</span>
                    </motion.h1>
                </motion.div>
                
                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    {t('home.heroSubtitle')}
                </motion.p>
                
                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
                >
                    <Link to="/dashboard">
                        <motion.button
                            style={{
                                background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
                                color: 'white'
                            }}
                            className="group flex items-center gap-3 px-8 py-4 rounded-2xl
                                       text-lg font-semibold
                                       shadow-xl hover:shadow-2xl
                                       transition-all duration-300"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <GiHerbsBundle className="w-6 h-6" />
                            {t('home.exploreRemedies')}
                            <motion.span
                                className="group-hover:translate-x-1 transition-transform"
                            >
                                <FiArrowRight className="w-5 h-5" />
                            </motion.span>
                        </motion.button>
                    </Link>
                    
                    <Link to="/search">
                        <motion.button
                            className="flex items-center gap-3 px-8 py-4 rounded-2xl
                                       text-lg font-semibold
                                       text-[var(--color-text-primary)]
                                       bg-[var(--color-bg-card)]
                                       border-2 border-[var(--color-border-primary)]
                                       hover:border-[var(--color-primary-500)]
                                       hover:bg-[var(--color-bg-hover)]
                                       shadow-lg hover:shadow-xl
                                       transition-all duration-300"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FiSearch className="w-5 h-5" />
                            {t('home.searchRemedies')}
                        </motion.button>
                    </Link>
                </motion.div>
                
                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-wrap items-center justify-center gap-8 sm:gap-16"
                >
                    {[
                        { number: '100+', label: t('home.naturalRemedies') },
                        { number: '12', label: t('home.categories') },
                        { number: '1000+', label: t('home.happyUsers') },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="text-center"
                        >
                            <motion.p 
                                className="text-3xl sm:text-4xl font-bold gradient-text"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                            >
                                {stat.number}
                            </motion.p>
                            <p className="text-sm text-[var(--color-text-tertiary)] mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// --------------------------------------------
// FEATURES SECTION
// --------------------------------------------

const FeaturesSection = ({ t }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    const features = [
        {
            icon: GiMedicines,
            title: t('home.timeTested'),
            description: t('home.timeTestedDesc'),
            color: 'from-green-400 to-emerald-600'
        },
        {
            icon: GiCauldron,
            title: t('home.simpleIngredients'),
            description: t('home.simpleIngredientsDesc'),
            color: 'from-amber-400 to-orange-600'
        },
        {
            icon: FiShield,
            title: t('home.safeNatural'),
            description: t('home.safeNaturalDesc'),
            color: 'from-blue-400 to-indigo-600'
        },
        {
            icon: FiMessageCircle,
            title: t('home.aiAssistant'),
            description: t('home.aiAssistantDesc'),
            color: 'from-purple-400 to-violet-600'
        },
        {
            icon: FiBookOpen,
            title: t('home.detailedInstructions'),
            description: t('home.detailedInstructionsDesc'),
            color: 'from-pink-400 to-rose-600'
        },
        {
            icon: FiUsers,
            title: t('home.communityWisdom'),
            description: t('home.communityWisdomDesc'),
            color: 'from-cyan-400 to-teal-600'
        }
    ];
    
    return (
        <section ref={ref} className="py-24 px-4 bg-[var(--color-bg-secondary)] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-primary-500) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <motion.span 
                        className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium
                                   bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-950)]
                                   text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]"
                    >
                        {t('home.featuresTitle')}
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('home.ctaTitle')}
                    </h2>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('home.ctaSubtitle')}
                    </p>
                </motion.div>
                
                {/* Features Grid */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={scaleIn}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group p-8 rounded-3xl bg-[var(--color-bg-card)]
                                       border border-[var(--color-border-primary)]
                                       hover:border-transparent hover:shadow-2xl
                                       transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 
                                           group-hover:opacity-5 transition-opacity duration-300`} />
                            
                            {/* Icon */}
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                                className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.color}
                                           flex items-center justify-center shadow-lg`}
                            >
                                <feature.icon className="w-7 h-7 text-white" />
                            </motion.div>
                            
                            {/* Content */}
                            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3 
                                          group-hover:text-[var(--color-primary-600)] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// --------------------------------------------
// HOW IT WORKS SECTION
// --------------------------------------------

const HowItWorksSection = ({ t }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    const steps = [
        {
            number: '01',
            title: t('home.step1Title'),
            description: t('home.step1Desc'),
            icon: FiSearch
        },
        {
            number: '02',
            title: t('home.step2Title'),
            description: t('home.step2Desc'),
            icon: FiBookOpen
        },
        {
            number: '03',
            title: t('home.step3Title'),
            description: t('home.step3Desc'),
            icon: GiMortar
        },
        {
            number: '04',
            title: t('home.step4Title'),
            description: t('home.step4Desc'),
            icon: GiHealthNormal
        }
    ];
    
    return (
        <section ref={ref} className="py-24 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <motion.span 
                        className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium
                                   bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-950)]
                                   text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]"
                    >
                        {t('home.howItWorks')}
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('home.ctaTitle')}
                    </h2>
                </motion.div>
                
                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 
                                   bg-gradient-to-r from-[var(--color-primary-200)] via-[var(--color-primary-400)] to-[var(--color-primary-200)]
                                   dark:from-[var(--color-primary-900)] dark:via-[var(--color-primary-700)] dark:to-[var(--color-primary-900)]
                                   transform -translate-y-1/2 rounded-full" />
                    
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                variants={fadeInUp}
                                className="relative text-center"
                            >
                                {/* Step circle */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-full
                                               bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]
                                               flex items-center justify-center shadow-xl
                                               shadow-[var(--color-primary-500)]/30"
                                >
                                    <step.icon className="w-8 h-8 text-white" />
                                </motion.div>
                                
                                {/* Step number */}
                                <span className="absolute top-0 right-1/4 text-6xl font-black 
                                               text-[var(--color-primary-100)] dark:text-[var(--color-primary-950)]
                                               -z-10 select-none">
                                    {step.number}
                                </span>
                                
                                {/* Content */}
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-sm">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// --------------------------------------------
// CATEGORIES PREVIEW SECTION
// --------------------------------------------

const CategoriesSection = ({ t }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    const categories = [
        { name: t('categories.immunityBooster'), icon: '🛡️', count: 15, color: 'from-green-400 to-emerald-600' },
        { name: t('categories.digestiveHealth'), icon: '🍵', count: 12, color: 'from-amber-400 to-orange-600' },
        { name: t('categories.respiratoryHealth'), icon: '🤧', count: 18, color: 'from-blue-400 to-indigo-600' },
        { name: t('categories.skinCare'), icon: '✨', count: 10, color: 'from-pink-400 to-rose-600' },
        { name: t('categories.sleepAid'), icon: '😴', count: 8, color: 'from-purple-400 to-violet-600' },
        { name: t('categories.energyBoost'), icon: '⚡', count: 9, color: 'from-yellow-400 to-amber-600' },
    ];
    
    return (
        <section ref={ref} className="py-24 px-4 bg-[var(--color-bg-secondary)]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-center mb-12"
                >
                    <motion.span 
                        className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium
                                   bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-950)]
                                   text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]"
                    >
                        {t('home.popularCategories')}
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('home.popularCategories')}
                    </h2>
                </motion.div>
                
                {/* Categories Grid */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.name}
                            variants={scaleIn}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="group cursor-pointer"
                        >
                            <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                                <div className="p-6 rounded-2xl bg-[var(--color-bg-card)]
                                               border border-[var(--color-border-primary)]
                                               hover:border-transparent hover:shadow-xl
                                               transition-all duration-300 text-center">
                                    <motion.span 
                                        className="text-4xl block mb-3"
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                                    >
                                        {cat.icon}
                                    </motion.span>
                                    <h3 className="font-semibold text-[var(--color-text-primary)] text-sm mb-1
                                                  group-hover:text-[var(--color-primary-600)] transition-colors">
                                        {cat.name}
                                    </h3>
                                    <span className="text-xs text-[var(--color-text-tertiary)]">
                                        {cat.count} remedies
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                >
                    <Link to="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                                       text-[#14532d] font-medium
                                       border-2 border-[#14532d]
                                       hover:bg-[#14532d] hover:text-white
                                       transition-all duration-300"
                        >
                            {t('home.viewAll')}
                            <FiArrowRight />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

// --------------------------------------------
// TESTIMONIALS SECTION
// --------------------------------------------

const TestimonialsSection = ({ t }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const { user, isAuthenticated } = useAuth();
    
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [myTestimonial, setMyTestimonial] = useState(null);
    const [formData, setFormData] = useState({ content: '', rating: 5 });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Fetch testimonials on mount
    useEffect(() => {
        fetchTestimonials();
    }, []);
    
    // Check if user has existing testimonial when modal opens
    useEffect(() => {
        if (showModal && isAuthenticated) {
            checkMyTestimonial();
        }
    }, [showModal, isAuthenticated]);
    
    const fetchTestimonials = async () => {
        try {
            const response = await getTestimonials(6);
            setTestimonials(response.testimonials || []);
        } catch (err) {
            console.error('Failed to fetch testimonials:', err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const checkMyTestimonial = async () => {
        try {
            const response = await getMyTestimonial();
            if (response.testimonial) {
                setMyTestimonial(response.testimonial);
                setFormData({
                    content: response.testimonial.content,
                    rating: response.testimonial.rating
                });
            }
        } catch (err) {
            // User doesn't have a testimonial yet - that's fine
            setMyTestimonial(null);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);
        
        try {
            if (myTestimonial) {
                await updateTestimonial(formData);
                setSuccess(t('home.testimonialUpdated'));
            } else {
                await createTestimonial(formData);
                setSuccess(t('home.thankYouTestimonial'));
            }
            
            // Refresh testimonials list
            await fetchTestimonials();
            
            // Close modal after a short delay
            setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to submit testimonial');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // No testimonials placeholder
    const EmptyPlaceholder = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4"
        >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-950)]
                          flex items-center justify-center">
                <FiMessageCircle className="w-12 h-12 text-[var(--color-primary-500)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                {t('home.beFirstToShare')}
            </h3>
            <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-6">
                {t('home.communityGettingStarted')}
            </p>
            {isAuthenticated ? (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
                >
                    <FiEdit3 className="w-5 h-5" />
                    {t('home.writeTestimonial')}
                </motion.button>
            ) : (
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
                >
                    {t('home.loginToShare')}
                    <FiArrowRight className="w-5 h-5" />
                </Link>
            )}
        </motion.div>
    );
    
    // Testimonial Modal - inline to prevent focus loss on re-render
    const testimonialModalContent = showModal ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-md p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                        {myTestimonial ? t('home.updateYourTestimonial') : t('home.shareYourExperience')}
                    </h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                    >
                        <FiX className="w-5 h-5 text-[var(--color-text-secondary)]" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            {t('home.yourRating')}
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <FiStar 
                                        className={`w-8 h-8 ${
                                            star <= formData.rating 
                                                ? 'fill-yellow-400 text-yellow-400' 
                                                : 'text-[var(--color-text-tertiary)]'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                            {t('home.yourTestimonial')}
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            placeholder={t('home.testimonialPlaceholder')}
                            rows={4}
                            maxLength={500}
                            required
                            minLength={20}
                            className="w-full px-4 py-3 rounded-xl border border-[var(--color-border-primary)]
                                     bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]
                                     placeholder:text-[var(--color-text-tertiary)]
                                     focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
                                     resize-none"
                        />
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-1 text-right">
                            {formData.content.length}/500 {t('home.characters')}
                        </p>
                    </div>
                    
                    {/* Error/Success Messages */}
                    {error && (
                        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm">
                            {success}
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting || formData.content.length < 20}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
                    >
                        {isSubmitting ? t('home.submitting') : myTestimonial ? t('home.updateTestimonial') : t('home.submitTestimonial')}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    ) : null;
    
    return (
        <section ref={ref} className="py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={fadeInUp}
                    className="text-center mb-16"
                >
                    <motion.span 
                        className="inline-block px-4 py-1.5 mb-4 rounded-full text-sm font-medium
                                   bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-950)]
                                   text-[var(--color-primary-700)] dark:text-[var(--color-primary-400)]"
                    >
                        {t('home.communityStories')}
                    </motion.span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                        {t('home.whatCommunitySays')}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('home.realExperiences')}
                    </p>
                    
                    {/* Add Testimonial Button (for logged in users) */}
                    {isAuthenticated && testimonials.length > 0 && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowModal(true)}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium
                                     border-2 border-[var(--color-primary-500)] text-[var(--color-primary-600)]
                                     dark:text-[var(--color-primary-400)] hover:bg-[var(--color-primary-50)]
                                     dark:hover:bg-[var(--color-primary-950)] transition-colors"
                        >
                            <FiEdit3 className="w-4 h-4" />
                            {myTestimonial ? t('home.editMyTestimonial') : t('home.shareYourStory')}
                        </motion.button>
                    )}
                </motion.div>
                
                {/* Content */}
                {isLoading ? (
                    // Loading skeleton
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div 
                                key={i}
                                className="p-8 rounded-3xl bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] animate-pulse"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-5 h-5 rounded bg-[var(--color-bg-tertiary)]" />
                                    ))}
                                </div>
                                <div className="space-y-2 mb-6">
                                    <div className="h-4 rounded bg-[var(--color-bg-tertiary)]" />
                                    <div className="h-4 rounded bg-[var(--color-bg-tertiary)] w-3/4" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-bg-tertiary)]" />
                                    <div>
                                        <div className="h-4 w-24 rounded bg-[var(--color-bg-tertiary)] mb-1" />
                                        <div className="h-3 w-16 rounded bg-[var(--color-bg-tertiary)]" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : testimonials.length === 0 ? (
                    // Empty state
                    <EmptyPlaceholder />
                ) : (
                    // Testimonials Grid
                    <motion.div
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial._id}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="p-8 rounded-3xl bg-[var(--color-bg-card)]
                                           border border-[var(--color-border-primary)]
                                           hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        </motion.span>
                                    ))}
                                </div>
                                
                                {/* Content */}
                                <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                
                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    {testimonial.user?.avatar ? (
                                        <img
                                            src={testimonial.user.avatar}
                                            alt={testimonial.user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)] flex items-center justify-center">
                                            <span className="text-white font-semibold text-lg">
                                                {testimonial.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-[var(--color-text-primary)]">
                                            {testimonial.user?.name || 'Anonymous'}
                                        </p>
                                        <p className="text-sm text-[var(--color-text-tertiary)]">
                                            {testimonial.user?.bio || 'Homely User'}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
            
            {/* Modal */}
            {testimonialModalContent}
        </section>
    );
};

// --------------------------------------------
// CTA SECTION
// --------------------------------------------

const CTASection = ({ t }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    
    return (
        <section ref={ref} className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="relative p-12 sm:p-16 rounded-[2rem] overflow-hidden
                               bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[var(--color-primary-700)]
                               shadow-2xl shadow-[var(--color-primary-500)]/30"
                >
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -right-1/2 w-full h-full
                                       border border-white/10 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-1/2 -left-1/2 w-full h-full
                                       border border-white/10 rounded-full"
                        />
                    </div>
                    
                    <div className="relative z-10 text-center">
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="inline-block mb-6"
                        >
                            <GiHerbsBundle className="w-16 h-16 text-white/90" />
                        </motion.div>
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {t('home.readyToStart')}
                        </h2>
                        <p className="text-[var(--color-primary-100)] text-lg mb-8 max-w-xl mx-auto">
                            {t('home.joinCommunity')}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-8 py-4 rounded-2xl
                                               text-lg font-semibold
                                               text-[var(--color-primary-700)]
                                               bg-white hover:bg-[var(--color-primary-50)]
                                               shadow-xl transition-all duration-300"
                                >
                                    <FiHeart className="w-5 h-5" />
                                    {t('home.signUpFree')}
                                </motion.button>
                            </Link>
                            
                            <Link to="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-8 py-4 rounded-2xl
                                               text-lg font-semibold text-white
                                               border-2 border-white/30
                                               hover:bg-white/10
                                               transition-all duration-300"
                                >
                                    {t('home.exploreRemedies')}
                                    <FiArrowRight className="w-5 h-5" />
                                </motion.button>
                            </Link>
                        </div>
                        
                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-6 mt-10 text-white/70"
                        >
                            {[
                                { icon: FiCheck, text: t('home.freeForever') },
                                { icon: FiShield, text: t('home.safe') },
                                { icon: FiHeart, text: t('home.noAds') }
                            ].map((badge, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <badge.icon className="w-4 h-4" />
                                    {badge.text}
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// --------------------------------------------
// HOME PAGE COMPONENT
// --------------------------------------------

const HomePage = () => {
    const { t } = useLanguage();
    
    return (
        <div className="overflow-hidden">
            <HeroSection t={t} />
            <FeaturesSection t={t} />
            <HowItWorksSection t={t} />
            <CategoriesSection t={t} />
            <TestimonialsSection t={t} />
            <CTASection t={t} />
        </div>
    );
};

export default HomePage;
