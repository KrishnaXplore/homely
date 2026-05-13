// ============================================
// HOMELY - Contact Page
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiPhone, FiSend, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(t('contact.successMessage'));
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    const contactInfo = [
        {
            icon: FiMail,
            label: t('contact.email'),
            value: 'mayurshettycoder@gmail.com',
            href: 'mailto:mayurshettycoder@gmail.com'
        },
        {
            icon: FiMapPin,
            label: t('contact.location'),
            value: 'India',
            href: null
        }
    ];

    const socialLinks = [
        { icon: FiGithub, href: 'https://github.com/mayurshetty100', label: 'GitHub' },
        { icon: FiTwitter, href: 'https://twitter.com/mayurshetty100', label: 'Twitter' },
        { icon: FiInstagram, href: 'https://instagram.com/wanna.rizz.up', label: 'Instagram' }
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
                        <FiMail className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('contact.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('contact.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-base p-8"
                    >
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                            {t('contact.formTitle')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                    {t('contact.nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl
                                               bg-[var(--color-bg-primary)]
                                               border border-[var(--color-border-primary)]
                                               text-[var(--color-text-primary)]
                                               focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                                               transition-all duration-200"
                                    placeholder={t('contact.namePlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                    {t('contact.emailLabel')}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl
                                               bg-[var(--color-bg-primary)]
                                               border border-[var(--color-border-primary)]
                                               text-[var(--color-text-primary)]
                                               focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                                               transition-all duration-200"
                                    placeholder={t('contact.emailPlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                    {t('contact.subjectLabel')}
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl
                                               bg-[var(--color-bg-primary)]
                                               border border-[var(--color-border-primary)]
                                               text-[var(--color-text-primary)]
                                               focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                                               transition-all duration-200"
                                    placeholder={t('contact.subjectPlaceholder')}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                    {t('contact.messageLabel')}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl
                                               bg-[var(--color-bg-primary)]
                                               border border-[var(--color-border-primary)]
                                               text-[var(--color-text-primary)]
                                               focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                                               transition-all duration-200 resize-none"
                                    placeholder={t('contact.messagePlaceholder')}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3
                                           bg-gradient-to-r from-[#14532d] to-[#22c55e]
                                           text-white font-semibold rounded-xl
                                           hover:shadow-lg hover:shadow-[#22c55e]/30
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        {t('contact.sendButton')}
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        <div className="card-base p-8">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                                {t('contact.infoTitle')}
                            </h2>
                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    const Icon = info.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-[#14532d]/20 to-[#22c55e]/20">
                                                <Icon className="w-5 h-5 text-[#22c55e]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">
                                                    {info.label}
                                                </p>
                                                {info.href ? (
                                                    <a
                                                        href={info.href}
                                                        className="text-[var(--color-text-primary)] hover:text-[#22c55e] transition-colors"
                                                    >
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-[var(--color-text-primary)]">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card-base p-8">
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                                {t('contact.followUs')}
                            </h2>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 rounded-xl
                                                       bg-[var(--color-bg-primary)]
                                                       border border-[var(--color-border-primary)]
                                                       text-[var(--color-text-secondary)]
                                                       hover:text-[#22c55e] hover:border-[#22c55e]
                                                       transition-all duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Icon className="w-6 h-6" />
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
