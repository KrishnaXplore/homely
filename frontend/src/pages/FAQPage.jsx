// ============================================
// HOMELY - FAQ Page
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHelpCircle, FiChevronDown, FiSearch } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';

const FAQPage = () => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: t('faq.q1'),
            answer: t('faq.a1')
        },
        {
            question: t('faq.q2'),
            answer: t('faq.a2')
        },
        {
            question: t('faq.q3'),
            answer: t('faq.a3')
        },
        {
            question: t('faq.q4'),
            answer: t('faq.a4')
        },
        {
            question: t('faq.q5'),
            answer: t('faq.a5')
        },
        {
            question: t('faq.q6'),
            answer: t('faq.a6')
        },
        {
            question: t('faq.q7'),
            answer: t('faq.a7')
        },
        {
            question: t('faq.q8'),
            answer: t('faq.a8')
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#14532d] to-[#22c55e] mb-6"
                    >
                        <FiHelpCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        {t('faq.title')}
                    </h1>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                        {t('faq.subtitle')}
                    </p>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t('faq.searchPlaceholder')}
                            className="w-full pl-12 pr-4 py-4 rounded-xl
                                       bg-[var(--color-bg-secondary)]
                                       border border-[var(--color-border-primary)]
                                       text-[var(--color-text-primary)]
                                       placeholder:text-[var(--color-text-tertiary)]
                                       focus:ring-2 focus:ring-[#22c55e] focus:border-transparent
                                       transition-all duration-200"
                        />
                    </div>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {filteredFaqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card-base overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-medium text-[var(--color-text-primary)] pr-4">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiChevronDown className="w-5 h-5 text-[var(--color-text-secondary)] flex-shrink-0" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6 text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-primary)] pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[var(--color-text-secondary)]">
                            {t('faq.noResults')}
                        </p>
                    </div>
                )}

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center card-base p-8"
                >
                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                        {t('faq.stillHaveQuestions')}
                    </h3>
                    <p className="text-[var(--color-text-secondary)] mb-4">
                        {t('faq.contactUs')}
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3
                                   bg-gradient-to-r from-[#14532d] to-[#22c55e]
                                   text-white font-semibold rounded-xl
                                   hover:shadow-lg hover:shadow-[#22c55e]/30
                                   transition-all duration-200"
                    >
                        {t('faq.getInTouch')}
                    </a>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default FAQPage;
