// ============================================
// HOMELY - Admin Panel Page
// ============================================
// Admin dashboard for managing pending remedies
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    FiCheck, 
    FiX, 
    FiClock, 
    FiUser, 
    FiCalendar,
    FiShield,
    FiAlertTriangle,
    FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

const AdminPanel = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [pendingRemedies, setPendingRemedies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [rejectionModal, setRejectionModal] = useState({ open: false, remedyId: null });
    const [rejectionReason, setRejectionReason] = useState('');

    // Check if user is admin
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'admin') {
            toast.error(t('admin.accessDenied'));
            navigate('/dashboard');
            return;
        }
        fetchPendingRemedies();
    }, [user, navigate, t]);

    const fetchPendingRemedies = async () => {
        try {
            setLoading(true);
            const response = await api.get('/remedies/admin/pending');
            setPendingRemedies(response.data || []);
        } catch (error) {
            console.error('Error fetching pending remedies:', error);
            toast.error('Failed to fetch pending remedies');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (remedyId) => {
        try {
            setProcessingId(remedyId);
            await api.patch(`/remedies/admin/${remedyId}/status`, { status: 'approved' });
            toast.success(t('admin.approveSuccess'));
            setPendingRemedies(prev => prev.filter(r => r._id !== remedyId));
        } catch (error) {
            console.error('Error approving remedy:', error);
            toast.error('Failed to approve remedy');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectionModal.remedyId) return;
        
        try {
            setProcessingId(rejectionModal.remedyId);
            await api.patch(`/remedies/admin/${rejectionModal.remedyId}/status`, { 
                status: 'rejected',
                rejectionReason: rejectionReason || 'Does not meet quality standards'
            });
            toast.success(t('admin.rejectSuccess'));
            setPendingRemedies(prev => prev.filter(r => r._id !== rejectionModal.remedyId));
            setRejectionModal({ open: false, remedyId: null });
            setRejectionReason('');
        } catch (error) {
            console.error('Error rejecting remedy:', error);
            toast.error('Failed to reject remedy');
        } finally {
            setProcessingId(null);
        }
    };

    if (!user || user.role !== 'admin') {
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                            <FiShield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                {t('admin.title')}
                            </h1>
                            <p className="text-sm text-[var(--color-text-tertiary)]">
                                {t('admin.subtitle')}
                            </p>
                        </div>
                    </div>
                    <motion.button
                        onClick={fetchPendingRemedies}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                   bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                                   text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
                                   transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {t('admin.refresh')}
                    </motion.button>
                </div>

                {/* Pending Count */}
                <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2">
                        <FiClock className="w-5 h-5 text-amber-500" />
                        <span className="font-medium text-amber-500">
                            {pendingRemedies.length} {pendingRemedies.length === 1 ? t('admin.pendingRemedy') : t('admin.pendingRemedies')}
                        </span>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-3 border-[var(--color-primary-500)] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : pendingRemedies.length === 0 ? (
                    <div className="text-center py-20">
                        <FiCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {t('admin.allCaughtUp')}
                        </h2>
                        <p className="text-[var(--color-text-tertiary)]">
                            {t('admin.noPendingRemedies')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pendingRemedies.map((remedy) => (
                                <motion.div
                                    key={remedy._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                        {/* Remedy Info */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                                {remedy.title}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                                                {remedy.description}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <div className="flex items-center gap-1 text-[var(--color-text-tertiary)]">
                                                    <FiUser className="w-4 h-4" />
                                                    <span>{remedy.createdBy?.name || t('admin.unknownUser')}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[var(--color-text-tertiary)]">
                                                    <FiCalendar className="w-4 h-4" />
                                                    <span>{new Date(remedy.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--color-primary-500)]/10 text-[var(--color-primary-500)]">
                                                    {remedy.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                onClick={() => handleApprove(remedy._id)}
                                                disabled={processingId === remedy._id}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                                           bg-green-500 text-white font-medium
                                                           hover:bg-green-600 transition-colors
                                                           disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiCheck className="w-4 h-4" />
                                                {t('admin.approve')}
                                            </motion.button>
                                            <motion.button
                                                onClick={() => setRejectionModal({ open: true, remedyId: remedy._id })}
                                                disabled={processingId === remedy._id}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg
                                                           bg-red-500 text-white font-medium
                                                           hover:bg-red-600 transition-colors
                                                           disabled:opacity-50 disabled:cursor-not-allowed"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <FiX className="w-4 h-4" />
                                                {t('admin.reject')}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Rejection Modal */}
            <AnimatePresence>
                {rejectionModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setRejectionModal({ open: false, remedyId: null })}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--color-bg-card)] rounded-2xl p-6 max-w-md w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <FiAlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                    {t('admin.rejectRemedy')}
                                </h3>
                            </div>
                            
                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                {t('admin.rejectionReason')}
                            </p>
                            
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder={t('admin.rejectionPlaceholder')}
                                className="w-full p-3 rounded-xl border border-[var(--color-border-primary)]
                                           bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]
                                           placeholder-[var(--color-text-tertiary)] resize-none"
                                rows={3}
                            />
                            
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setRejectionModal({ open: false, remedyId: null })}
                                    className="px-4 py-2 rounded-lg text-[var(--color-text-secondary)]
                                               hover:bg-[var(--color-bg-hover)] transition-colors"
                                >
                                    {t('admin.cancel')}
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={processingId}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium
                                               hover:bg-red-600 transition-colors
                                               disabled:opacity-50"
                                >
                                    {t('admin.confirmReject')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPanel;
