// ============================================
// HOMELY - Profile Page
// ============================================
// User profile with settings, saved remedies, and account management
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { 
    FiUser, 
    FiMail, 
    FiLock, 
    FiHeart,
    FiBookmark,
    FiEdit2,
    FiCheck,
    FiX,
    FiLogOut,
    FiTrash2,
    FiAlertCircle,
    FiStar,
    FiImage,
    FiCrop
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import remedyService from '../services/remedyService';
import authService from '../services/authService';
import { RemedyCard } from '../components/remedy';
import { Button, Input, LoadingSpinner } from '../components/common';
import toast from 'react-hot-toast';

// --------------------------------------------
// CROP HELPER FUNCTION
// --------------------------------------------

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

const getCroppedImg = async (imageSrc, pixelCrop, isAvatar = false) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // For avatar, use a smaller fixed size to reduce file size
    // For banner, cap at reasonable dimensions
    const maxWidth = isAvatar ? 300 : 1200;
    const maxHeight = isAvatar ? 300 : 400;
    
    let outputWidth = pixelCrop.width;
    let outputHeight = pixelCrop.height;
    
    // Scale down if needed
    if (outputWidth > maxWidth) {
        const ratio = maxWidth / outputWidth;
        outputWidth = maxWidth;
        outputHeight = Math.round(outputHeight * ratio);
    }
    if (outputHeight > maxHeight) {
        const ratio = maxHeight / outputHeight;
        outputHeight = maxHeight;
        outputWidth = Math.round(outputWidth * ratio);
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw the cropped image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        outputWidth,
        outputHeight
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => reject(new Error('Failed to read blob'));
            },
            'image/jpeg',
            0.85
        );
    });
};

// --------------------------------------------
// STAT CARD COMPONENT
// --------------------------------------------

const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => (
    <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        className="bg-[var(--color-bg-card)] rounded-2xl p-5 border border-[var(--color-border-primary)]
                   hover:border-[var(--color-primary-500)] transition-all"
    >
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 dark:bg-${color}-900/30
                        flex items-center justify-center mb-3`}>
            <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
        <p className="text-sm text-[var(--color-text-tertiary)]">{label}</p>
    </motion.div>
);

// --------------------------------------------
// PROFILE PAGE COMPONENT
// --------------------------------------------

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, updateUser } = useAuth();
    const { t } = useLanguage();
    
    // Profile tabs with translations
    const TABS = [
        { id: 'overview', label: t('profile.overview'), icon: FiUser },
        { id: 'myRemedies', label: t('profile.myRemedies'), icon: GiHerbsBundle },
        { id: 'saved', label: t('profile.savedRemedies'), icon: FiBookmark },
        { id: 'favorites', label: t('profile.favorites'), icon: FiHeart },
    ];
    
    // Refs for file inputs
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);
    
    // State
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [savedRemedies, setSavedRemedies] = useState([]);
    const [favoriteRemedies, setFavoriteRemedies] = useState([]);
    const [myRemedies, setMyRemedies] = useState([]);
    const [showAvatarOptions, setShowAvatarOptions] = useState(false);
    const [showBannerOptions, setShowBannerOptions] = useState(false);
    const [bannerImage, setBannerImage] = useState(null);
    
    // Crop state
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropImage, setCropImage] = useState(null);
    const [cropType, setCropType] = useState(null); // 'avatar' or 'banner'
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    
    const [stats, setStats] = useState({
        savedCount: 0,
        favoritesCount: 0,
        reviewsCount: 0,
        remediesCreated: 0,
    });
    
    // Edit form state
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
    });
    
    // Password change state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    
    // ----------------------------------------
    // REDIRECT IF NOT AUTHENTICATED
    // ----------------------------------------
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/profile' } });
        }
    }, [isAuthenticated, navigate]);
    
    // ----------------------------------------
    // LOAD USER DATA
    // ----------------------------------------
    
    useEffect(() => {
        if (user) {
            setEditForm({
                name: user.name || '',
                email: user.email || '',
            });
            loadUserData();
        }
    }, [user]);
    
    const loadUserData = async () => {
        setIsLoading(true);
        try {
            // Load saved, favorite, and user's created remedies
            const [savedRes, favoritesRes, myRemediesRes] = await Promise.all([
                remedyService.getSavedRemedies().catch(() => ({ data: [] })),
                remedyService.getFavoriteRemedies().catch(() => ({ data: [] })),
                user?._id ? remedyService.getUserRemedies(user._id).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
            ]);
            
            setSavedRemedies(savedRes.data || []);
            setFavoriteRemedies(favoritesRes.data || []);
            setMyRemedies(myRemediesRes.data || []);
            
            setStats({
                savedCount: savedRes.data?.length || 0,
                favoritesCount: favoritesRes.data?.length || 0,
                reviewsCount: user?.reviewsCount || 0,
                remediesCreated: myRemediesRes.data?.length || 0,
            });
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // ----------------------------------------
    // HANDLERS
    // ----------------------------------------
    
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await authService.updateProfile(editForm);
            if (updateUser) {
                updateUser(response.data?.user || { ...user, ...editForm });
            }
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        
        setIsLoading(true);
        
        try {
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Password changed successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setIsChangingPassword(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
        toast.success('Logged out successfully');
    };
    
    const handleRemoveSaved = async (remedyId) => {
        try {
            await remedyService.unsaveRemedy(remedyId);
            setSavedRemedies(prev => prev.filter(r => r._id !== remedyId));
            setStats(prev => ({ ...prev, savedCount: prev.savedCount - 1 }));
            toast.success('Remedy removed from saved');
        } catch (error) {
            toast.error('Failed to remove remedy');
        }
    };
    
    const handleRemoveFavorite = async (remedyId) => {
        try {
            await remedyService.unfavoriteRemedy(remedyId);
            setFavoriteRemedies(prev => prev.filter(r => r._id !== remedyId));
            setStats(prev => ({ ...prev, favoritesCount: prev.favoritesCount - 1 }));
            toast.success('Remedy removed from favorites');
        } catch (error) {
            toast.error('Failed to remove remedy');
        }
    };
    
    // ----------------------------------------
    // IMAGE HANDLERS
    // ----------------------------------------
    
    const handleAvatarClick = () => {
        setShowAvatarOptions(prev => !prev);
        setShowBannerOptions(false);
    };
    
    const handleBannerClick = () => {
        setShowBannerOptions(prev => !prev);
        setShowAvatarOptions(false);
    };
    
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);
    
    const handleFileSelect = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }
        
        // Read file and open crop modal
        const reader = new FileReader();
        reader.onloadend = () => {
            setCropImage(reader.result);
            setCropType(type);
            setCropModalOpen(true);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };
        reader.readAsDataURL(file);
        
        // Reset input
        e.target.value = '';
    };
    
    const handleCropSave = async () => {
        try {
            setIsLoading(true);
            const isAvatar = cropType === 'avatar';
            const croppedImage = await getCroppedImg(cropImage, croppedAreaPixels, isAvatar);

            if (cropType === 'avatar') {
                try {
                    const response = await authService.updateProfile({ avatar: croppedImage });
                    // Handle different response structures
                    const updatedUser = response.data?.user || response.user || response.data || { ...user, avatar: croppedImage };
                    if (updateUser) {
                        updateUser(updatedUser);
                    }
                    toast.success('Profile image updated!');
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    toast.error('Failed to update profile image');
                }
            } else if (cropType === 'banner') {
                try {
                    const response = await authService.updateProfile({ banner: croppedImage });
                    const updatedUser = response.data?.user || response.user || response.data || { ...user, banner: croppedImage };
                    if (updateUser) {
                        updateUser(updatedUser);
                    }
                    setBannerImage(croppedImage);
                    toast.success('Banner image updated!');
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    toast.error('Failed to update banner image');
                }
            }

            setCropModalOpen(false);
            setCropImage(null);
            setCropType(null);
            setShowAvatarOptions(false);
            setShowBannerOptions(false);
        } catch (error) {
            console.error('Crop error:', error);
            toast.error('Failed to process image. Please try a smaller image.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCropCancel = () => {
        setCropModalOpen(false);
        setCropImage(null);
        setCropType(null);
    };
    
    const handleAvatarChange = (e) => handleFileSelect(e, 'avatar');
    const handleBannerChange = (e) => handleFileSelect(e, 'banner');
    
    const handleDeleteAvatar = async () => {
        try {
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=22c55e&color=fff`;

            try {
                const response = await authService.updateProfile({ avatar: defaultAvatar });
                const updatedUser = response.data?.user || response.user || response.data || { ...user, avatar: defaultAvatar };
                if (updateUser) {
                    updateUser(updatedUser);
                }
                toast.success('Profile image removed!');
            } catch (apiError) {
                console.error('API Error:', apiError);
                toast.error('Failed to remove profile image');
            }

            setShowAvatarOptions(false);
        } catch (error) {
            console.error('Delete avatar error:', error);
            toast.error('Failed to remove profile image');
        }
    };
    
    const handleDeleteBanner = async () => {
        try {
            const response = await authService.updateProfile({ banner: null });
            const updatedUser = response.data?.user || response.user || response.data || { ...user, banner: null };
            if (updateUser) {
                updateUser(updatedUser);
            }
            setBannerImage(null);
            toast.success('Banner image removed!');
            setShowBannerOptions(false);
        } catch (error) {
            console.error('Delete banner error:', error);
            toast.error('Failed to remove banner image');
        }
    };
    
    // Load banner from user data
    useEffect(() => {
        if (user?.banner) {
            setBannerImage(user.banner);
        } else {
            setBannerImage(null);
        }
    }, [user?.banner]);
    
    // Close options when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Don't close if clicking on the options buttons themselves
            if (e.target.closest('.image-options')) return;
            
            // Close options after a small delay to allow click handlers to fire
            setTimeout(() => {
                if (!e.target.closest('.avatar-container') && showAvatarOptions) {
                    setShowAvatarOptions(false);
                }
                if (!e.target.closest('.banner-container') && showBannerOptions) {
                    setShowBannerOptions(false);
                }
            }, 100);
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showAvatarOptions, showBannerOptions]);
    
    // ----------------------------------------
    // RENDER HELPERS
    // ----------------------------------------
    
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };
    
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };
    
    // ----------------------------------------
    // RENDER TABS CONTENT
    // ----------------------------------------
    
    const renderOverview = () => (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={FiBookmark} label={t('profile.savedRemedies')} value={stats.savedCount} color="primary" />
                <StatCard icon={FiHeart} label={t('profile.favorites')} value={stats.favoritesCount} color="error" />
                <StatCard icon={FiStar} label={t('profile.reviewsGiven')} value={stats.reviewsCount} color="warning" />
                <StatCard icon={GiHerbsBundle} label={t('profile.remediesCreated')} value={stats.remediesCreated} color="success" />
            </div>
            
            {/* Profile Info */}
            <div className="bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border-primary)]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {t('profile.accountInfo')}
                    </h2>
                    {!isEditing && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="gap-2"
                        >
                            <FiEdit2 className="w-4 h-4" />
                            {t('profile.editProfile')}
                        </Button>
                    )}
                </div>
                
                {isEditing ? (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <Input
                            label={t('profile.fullName')}
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            required
                        />
                        <Input
                            label={t('profile.email')}
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            required
                            disabled
                            helper={t('profile.emailCannotChange')}
                        />
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" loading={isLoading}>
                                <FiCheck className="w-4 h-4 mr-2" />
                                {t('profile.save')}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditForm({
                                        name: user?.name || '',
                                        email: user?.email || '',
                                    });
                                }}
                            >
                                <FiX className="w-4 h-4 mr-2" />
                                {t('profile.cancel')}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                            <FiUser className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                            <div>
                                <p className="text-xs text-[var(--color-text-tertiary)]">{t('profile.fullName')}</p>
                                <p className="text-[var(--color-text-primary)] font-medium">{user?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                            <FiMail className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                            <div>
                                <p className="text-xs text-[var(--color-text-tertiary)]">{t('profile.email')}</p>
                                <p className="text-[var(--color-text-primary)] font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-tertiary)]">
                            <GiHerbsBundle className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                            <div>
                                <p className="text-xs text-[var(--color-text-tertiary)]">{t('profile.memberSince')}</p>
                                <p className="text-[var(--color-text-primary)] font-medium">
                                    {formatDate(user?.createdAt || new Date())}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
    
    const renderSavedRemedies = () => (
        <div>
            {savedRemedies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRemedies.map((remedy) => (
                        <div key={remedy._id} className="relative group">
                            <RemedyCard remedy={remedy} />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveSaved(remedy._id)}
                                className="absolute top-3 right-3 p-2 rounded-full 
                                          bg-[var(--color-error-500)] text-white opacity-0 
                                          group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <FiX className="w-4 h-4" />
                            </motion.button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={FiBookmark}
                    title={t('profile.noSaved')}
                    description={t('profile.noSavedDescription')}
                    action={
                        <Button onClick={() => navigate('/dashboard')}>
                            {t('profile.browseRemedies')}
                        </Button>
                    }
                />
            )}
        </div>
    );
    
    const renderFavorites = () => (
        <div>
            {favoriteRemedies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRemedies.map((remedy) => (
                        <div key={remedy._id} className="relative group">
                            <RemedyCard remedy={remedy} />
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRemoveFavorite(remedy._id)}
                                className="absolute top-3 right-3 p-2 rounded-full 
                                          bg-[var(--color-error-500)] text-white opacity-0 
                                          group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <FiX className="w-4 h-4" />
                            </motion.button>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={FiHeart}
                    title={t('profile.noFavorites')}
                    description={t('profile.noFavoritesDescription')}
                    action={
                        <Button onClick={() => navigate('/dashboard')}>
                            {t('profile.discoverRemedies')}
                        </Button>
                    }
                />
            )}
        </div>
    );
    
    const renderMyRemedies = () => {
        // Helper function to get status badge
        const getStatusBadge = (status) => {
            const statusConfig = {
                pending: { 
                    text: t('profile.pending'), 
                    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
                    icon: '⏳'
                },
                approved: { 
                    text: t('profile.approved'), 
                    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                    icon: '✓'
                },
                rejected: { 
                    text: t('profile.rejected'), 
                    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                    icon: '✕'
                },
            };
            return statusConfig[status] || statusConfig.pending;
        };

        return (
            <div>
                {myRemedies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myRemedies.map((remedy) => {
                            const badge = getStatusBadge(remedy.status);
                            return (
                                <div key={remedy._id} className="relative">
                                    <RemedyCard remedy={remedy} />
                                    {/* Status badge */}
                                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${badge.className} shadow-sm`}>
                                        {badge.icon} {badge.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={GiHerbsBundle}
                        title={t('profile.noMyRemedies')}
                        description={t('profile.noMyRemediesDescription')}
                        action={
                            <Button onClick={() => navigate('/remedies/create')}>
                                {t('profile.createRemedy')}
                            </Button>
                        }
                    />
                )}
            </div>
        );
    };
    
    // ----------------------------------------
    // LOADING STATE
    // ----------------------------------------
    
    if (!user) {
        return <LoadingSpinner fullScreen text={t('profile.loading')} />;
    }
    
    // ----------------------------------------
    // RENDER
    // ----------------------------------------
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[var(--color-bg-primary)] pt-20 pb-12"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Profile Header */}
                <div className="relative mb-8">
                    {/* Hidden file inputs */}
                    <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={handleBannerChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    {/* Cover Background */}
                    <div 
                        className="banner-container h-32 sm:h-48 rounded-2xl overflow-hidden relative cursor-pointer group"
                        onClick={handleBannerClick}
                    >
                        {bannerImage ? (
                            <img 
                                src={bannerImage} 
                                alt="Banner" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[var(--color-primary-400)]">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0" 
                                         style={{ 
                                             backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                             backgroundSize: '20px 20px'
                                         }} 
                                    />
                                </div>
                            </div>
                        )}
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 
                                       transition-opacity flex items-center justify-center">
                            <span className="text-white font-medium">{t('profile.clickToEditBanner')}</span>
                        </div>
                        
                        {/* Banner Options */}
                        <AnimatePresence>
                            {showBannerOptions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="image-options absolute top-2 right-2 flex gap-2 z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => bannerInputRef.current?.click()}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                                  text-white shadow-lg hover:opacity-90 
                                                  transition-colors text-sm font-medium"
                                        style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                                    >
                                        <FiCrop className="w-4 h-4" />
                                        {t('profile.editProfile')}
                                    </button>
                                    <button
                                        onClick={handleDeleteBanner}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                                  text-white shadow-lg hover:opacity-90 
                                                  transition-colors text-sm font-medium"
                                        style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        {t('profile.delete')}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Profile Avatar & Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 
                                   -mt-16 sm:-mt-12 px-4 sm:px-8">
                        {/* Avatar */}
                        <div className="avatar-container relative">
                            {/* Avatar Options - positioned to the left */}
                            <AnimatePresence>
                                {showAvatarOptions && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="image-options absolute right-full top-1/2 -translate-y-1/2 mr-3 flex gap-2 z-10"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() => avatarInputRef.current?.click()}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                                      text-white shadow-lg hover:opacity-90 
                                                      transition-colors text-sm font-medium whitespace-nowrap"
                                            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                                        >
                                            <FiCrop className="w-4 h-4" />
                                            {t('profile.editProfile')}
                                        </button>
                                        <button
                                            onClick={handleDeleteAvatar}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                                      text-white shadow-lg hover:opacity-90 
                                                      transition-colors text-sm font-medium whitespace-nowrap"
                                            style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            {t('profile.delete')}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                onClick={handleAvatarClick}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 
                                           border-[var(--color-bg-primary)] overflow-hidden
                                           bg-gradient-to-br from-[var(--color-primary-400)] to-[var(--color-primary-600)]
                                           flex items-center justify-center shadow-xl cursor-pointer
                                           hover:ring-2 hover:ring-[var(--color-primary-500)] transition-all"
                            >
                                {user?.avatar && !user.avatar.includes('ui-avatars.com') ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl sm:text-4xl font-bold text-white">
                                        {getInitials(user?.name)}
                                    </span>
                                )}
                            </motion.div>
                        </div>
                        
                        {/* Name & Email */}
                        <div className="text-center sm:text-left sm:pb-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
                                {user?.name}
                            </h1>
                            <p className="text-[var(--color-text-tertiary)]">{user?.email}</p>
                        </div>
                    </div>
                </div>
                
                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
                    {TABS.map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            style={activeTab === tab.id 
                                ? { background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }
                                : { background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }
                            }
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium 
                                       whitespace-nowrap transition-all text-white shadow-lg
                                       ${activeTab === tab.id
                                           ? 'shadow-[#14532d]/30'
                                           : 'shadow-green-500/20 hover:shadow-green-500/40'
                                       }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </motion.button>
                    ))}
                </div>
                
                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'myRemedies' && renderMyRemedies()}
                        {activeTab === 'saved' && renderSavedRemedies()}
                        {activeTab === 'favorites' && renderFavorites()}
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Crop Modal */}
            <AnimatePresence>
                {cropModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                        onClick={handleCropCancel}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--color-bg-card)] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-[var(--color-border-primary)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                    <FiCrop className="w-5 h-5 text-[var(--color-primary-500)]" />
                                    {t('profile.crop')} {cropType === 'avatar' ? t('nav.profile') : t('profile.banner')} {t('profile.image')}
                                </h3>
                                <button
                                    onClick={handleCropCancel}
                                    className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-[var(--color-text-tertiary)]" />
                                </button>
                            </div>
                            
                            {/* Crop Area */}
                            <div className="relative h-80 bg-black">
                                <Cropper
                                    image={cropImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={cropType === 'avatar' ? 1 : 3}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                            
                            {/* Zoom Slider */}
                            <div className="p-4 border-t border-[var(--color-border-primary)]">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[var(--color-text-tertiary)]">{t('profile.zoom')}:</span>
                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="flex-1 h-2 bg-[var(--color-bg-tertiary)] rounded-lg appearance-none cursor-pointer
                                                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                                                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                                                  [&::-webkit-slider-thumb]:bg-[var(--color-primary-500)]"
                                    />
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="p-4 border-t border-[var(--color-border-primary)] flex gap-3 justify-end">
                                <button
                                    onClick={handleCropCancel}
                                    className="px-4 py-2 rounded-lg border border-[var(--color-border-primary)]
                                              text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]
                                              transition-colors font-medium"
                                >
                                    {t('profile.cancel')}
                                </button>
                                <button
                                    onClick={handleCropSave}
                                    className="px-4 py-2 rounded-lg text-white font-medium
                                              transition-colors flex items-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                                >
                                    <FiCheck className="w-4 h-4" />
                                    {t('profile.save')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --------------------------------------------
// EMPTY STATE COMPONENT
// --------------------------------------------

const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[var(--color-bg-tertiary)] 
                       flex items-center justify-center mb-4">
            <Icon className="w-10 h-10 text-[var(--color-text-tertiary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            {title}
        </h3>
        <p className="text-[var(--color-text-tertiary)] mb-6 max-w-sm">
            {description}
        </p>
        {action}
    </div>
);

export default ProfilePage;
