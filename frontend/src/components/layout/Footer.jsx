// ============================================
// HOMELY - Footer Component
// ============================================
// Site footer with links, social media, and credits
// Responsive multi-column layout
// ============================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiHeart, 
    FiGithub, 
    FiTwitter, 
    FiInstagram,
    FiMail,
    FiExternalLink
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useLanguage } from '../../context/LanguageContext';

// --------------------------------------------
// FOOTER COMPONENT
// --------------------------------------------

/**
 * Footer - Site-wide footer component
 * 
 * Features:
 * - Multi-column responsive layout
 * - Quick links navigation
 * - Social media links
 * - Newsletter signup (placeholder)
 * - Copyright notice
 */
const Footer = () => {
    const { t } = useLanguage();
    
    // Current year for copyright
    const currentYear = new Date().getFullYear();
    
    // --------------------------------------------
    // FOOTER LINKS DATA
    // --------------------------------------------
    
    const footerLinks = {
        explore: [
            { label: t('footer.allRemedies'), path: '/dashboard' },
            { label: t('footer.categories'), path: '/categories' },
            { label: t('footer.popular'), path: '/popular' },
            { label: t('footer.latest'), path: '/latest' },
        ],
        categories: [
            { label: t('footer.immunityBoosters'), path: '/category/immunity-booster' },
            { label: t('footer.digestiveHealth'), path: '/category/digestive-health' },
            { label: t('footer.coldAndCough'), path: '/category/cold-and-cough' },
            { label: t('footer.skinCare'), path: '/category/skin-care' },
        ],
        support: [
            { label: t('footer.aboutUs'), path: '/about' },
            { label: t('footer.contact'), path: '/contact' },
            { label: t('footer.faq'), path: '/faq' },
            { label: t('footer.privacyPolicy'), path: '/privacy' },
        ],
    };
    
    const socialLinks = [
        { icon: FiGithub, href: 'https://github.com/mayurshetty100', label: 'GitHub' },
        { icon: FiTwitter, href: 'https://twitter.com/mayurshetty100', label: 'Twitter' },
        { icon: FiInstagram, href: 'https://instagram.com/wanna.rizz.up', label: 'Instagram' },
        { icon: FiMail, href: 'mailto:mayurshettycoder@gmail.com', label: 'Email' },
    ];
    
    // --------------------------------------------
    // RENDER
    // --------------------------------------------
    
    return (
        <footer className="bg-[var(--color-bg-secondary)] border-t border-[var(--color-border-primary)]">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    
                    {/* -------- Brand Section -------- */}
                    <div className="lg:col-span-2">
                        {/* Logo */}
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <GiHerbsBundle className="w-8 h-8 text-[#14532d]" />
                            <span className="text-xl font-bold gradient-text">{t('appName')}</span>
                        </Link>
                        
                        {/* Description */}
                        <p className="text-[var(--color-text-secondary)] text-sm mb-6 max-w-xs">
                            {t('footer.description')}
                        </p>
                        
                        {/* Social Links */}
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2.5 rounded-xl
                                                   bg-[var(--color-bg-primary)]
                                                   border border-[var(--color-border-primary)]
                                                   text-[var(--color-text-secondary)]
                                                   hover:text-[var(--color-primary-500)]
                                                   hover:border-[var(--color-primary-500)]
                                                   transition-colors duration-200"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* -------- Explore Links -------- */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
                            {t('footer.explore')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.explore.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-[var(--color-text-secondary)]
                                                   hover:text-[var(--color-primary-500)]
                                                   transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* -------- Categories Links -------- */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
                            {t('footer.categoriesTitle')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.categories.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-[var(--color-text-secondary)]
                                                   hover:text-[var(--color-primary-500)]
                                                   transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* -------- Support Links -------- */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-wider mb-4">
                            {t('footer.support')}
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-[var(--color-text-secondary)]
                                                   hover:text-[var(--color-primary-500)]
                                                   transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="border-t border-[var(--color-border-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <p className="text-sm text-[var(--color-text-tertiary)]">
                            © {currentYear} Homely. {t('footer.copyright')}
                        </p>
                        
                        {/* Made with love */}
                        <p className="text-sm text-[var(--color-text-tertiary)] flex items-center gap-1">
                            {t('footer.madeWith')} <FiHeart className="w-4 h-4 text-red-500" /> {t('footer.forWellness')}
                        </p>
                        
                        {/* Legal Links */}
                        <div className="flex items-center gap-4">
                            <Link
                                to="/terms"
                                className="text-xs text-[var(--color-text-tertiary)]
                                           hover:text-[var(--color-primary-500)]"
                            >
                                {t('footer.terms')}
                            </Link>
                            <Link
                                to="/privacy"
                                className="text-xs text-[var(--color-text-tertiary)]
                                           hover:text-[var(--color-primary-500)]"
                            >
                                {t('footer.privacy')}
                            </Link>
                            <Link
                                to="/cookies"
                                className="text-xs text-[var(--color-text-tertiary)]
                                           hover:text-[var(--color-primary-500)]"
                            >
                                {t('footer.cookies')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
