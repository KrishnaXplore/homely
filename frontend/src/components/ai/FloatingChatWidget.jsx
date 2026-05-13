// ============================================
// HOMELY - Floating Chat Widget
// ============================================
// Collapsible AI chat bubble for quick access
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FiMessageCircle, 
    FiX, 
    FiMaximize2,
    FiMinus 
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import aiService from '../../services/aiService';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SuggestedQuestions from './SuggestedQuestions';
import toast from 'react-hot-toast';

// --------------------------------------------
// FLOATING CHAT WIDGET COMPONENT
// --------------------------------------------

const FloatingChatWidget = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();
    const { language, t } = useLanguage();
    const messagesEndRef = useRef(null);

    // Hide widget on AI Assistant page
    const isOnAIAssistantPage = location.pathname === '/ai-assistant';

    // Generate welcome message based on language
    const getWelcomeMessage = useCallback(() => ({
        id: 'welcome',
        role: 'assistant',
        content: t('ai.welcomeMessage'),
        timestamp: new Date(),
    }), [t]);

    // State
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [remainingRequests, setRemainingRequests] = useState(null); // null = unknown, -1 = unlimited
    const [isLimitReached, setIsLimitReached] = useState(false);

    // ----------------------------------------
    // RATE LIMIT PERSISTENCE
    // ----------------------------------------
    
    // Check localStorage for persisted rate limit state on mount
    useEffect(() => {
        const checkRateLimitState = () => {
            try {
                const storedData = localStorage.getItem('homely_ai_rate_limit');
                if (storedData) {
                    const { limitReached, resetDate, userId } = JSON.parse(storedData);
                    
                    // Only apply if it's for the same user
                    if (userId === user?._id || userId === user?.id) {
                        const now = new Date();
                        const reset = new Date(resetDate);
                        
                        // Check if we've passed midnight (reset time)
                        if (now >= reset) {
                            // Clear the stored limit - it's a new day
                            localStorage.removeItem('homely_ai_rate_limit');
                            setIsLimitReached(false);
                            setRemainingRequests(null);
                        } else if (limitReached) {
                            // Limit still applies
                            setIsLimitReached(true);
                            setRemainingRequests(0);
                        }
                    }
                }
            } catch (e) {
                console.error('Error reading rate limit state:', e);
            }
        };
        
        checkRateLimitState();
        
        // Also set up an interval to check at midnight
        const checkInterval = setInterval(checkRateLimitState, 60000); // Check every minute
        
        return () => clearInterval(checkInterval);
    }, [user]);

    // Persist rate limit state when it changes
    useEffect(() => {
        if (remainingRequests === 0 && user) {
            // Calculate next midnight
            const now = new Date();
            const resetDate = new Date(now);
            resetDate.setDate(resetDate.getDate() + 1);
            resetDate.setHours(0, 0, 0, 0);
            
            localStorage.setItem('homely_ai_rate_limit', JSON.stringify({
                limitReached: true,
                resetDate: resetDate.toISOString(),
                userId: user._id || user.id,
            }));
            setIsLimitReached(true);
        }
    }, [remainingRequests, user]);

    // Initialize welcome message when language changes
    useEffect(() => {
        setMessages([getWelcomeMessage()]);
    }, [language, getWelcomeMessage]);

    // ----------------------------------------
    // SCROLL TO BOTTOM
    // ----------------------------------------

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
            setUnreadCount(0);
        }
    }, [messages, isOpen, isMinimized, scrollToBottom]);

    // ----------------------------------------
    // FORMAT CONVERSATION HISTORY
    // ----------------------------------------

    const formatConversationHistory = useCallback(() => {
        return messages
            .filter(msg => msg.id !== 'welcome')
            .map(msg => ({
                role: msg.role,
                content: msg.content,
            }));
    }, [messages]);

    // ----------------------------------------
    // SEND MESSAGE HANDLER
    // ----------------------------------------

    const handleSendMessage = async (content, options = {}) => {
        // Content can be text message, and options can contain image data
        const messageText = typeof content === 'string' ? content.trim() : '';
        const imageData = options?.image || null;
        
        if ((!messageText && !imageData) || isLoading) return;

        if (!isAuthenticated) {
            toast.error(t('ai.loginRequired'));
            setIsOpen(false);
            navigate('/login', { state: { from: '/ai-assistant' } });
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: messageText || t('ai.analyzeImage') || 'Please analyze this image',
            timestamp: new Date(),
            image: imageData, // Include image for display in chat
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const typingMessage = {
            id: 'typing',
            role: 'assistant',
            isTyping: true,
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            const conversationHistory = formatConversationHistory();
            
            // Pass image to AI service if provided
            const response = await aiService.chat(
                messageText || 'Please analyze this image and tell me what you see.',
                conversationHistory, 
                null, 
                language,
                imageData // Pass image for vision analysis
            );

            // Extract the message from the response
            // API returns { success: true, data: { message: "...", remainingRequests: N } }
            const aiMessage = response?.data?.message || 
                              response?.message || 
                              response?.reply || 
                              'Sorry, I could not process that.';

            // Update remaining requests count
            if (response?.data?.remainingRequests !== undefined) {
                setRemainingRequests(response.data.remainingRequests);
            }

            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== 'typing');
                return [
                    ...filtered,
                    {
                        id: `ai-${Date.now()}`,
                        role: 'assistant',
                        content: aiMessage,
                        timestamp: new Date(),
                    },
                ];
            });

            // Increment unread if minimized
            if (isMinimized) {
                setUnreadCount(prev => prev + 1);
            }
        } catch (err) {
            console.error('AI Chat Error:', err);
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
            
            // Check if it's a rate limit error (429)
            if (err.response?.status === 429) {
                toast.error(t('ai.limitReachedDesc'));
                setRemainingRequests(0);
            } else {
                toast.error(err.response?.data?.message || 'Failed to get a response');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------
    // TOGGLE HANDLERS
    // ----------------------------------------

    const toggleChat = () => {
        setIsOpen(prev => !prev);
        if (!isOpen) {
            setIsMinimized(false);
            setUnreadCount(0);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(prev => !prev);
        if (isMinimized) {
            setUnreadCount(0);
        }
    };

    const openFullPage = () => {
        setIsOpen(false);
        navigate('/ai-assistant');
    };

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    // Don't render on AI Assistant page
    if (isOnAIAssistantPage) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-[calc(100vw-2rem)]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            y: 0,
                            height: isMinimized ? 'auto' : '500px',
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="mb-4 w-[calc(100vw-2rem)] sm:w-[380px] bg-[var(--color-bg-secondary)] 
                                  rounded-2xl shadow-2xl border border-[var(--color-border-primary)]
                                  overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 
                                       bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-primary-600)] text-white">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white/20 
                                               flex items-center justify-center">
                                    <GiHerbsBundle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">{t('ai.title')}</h3>
                                    <p className="text-xs text-white/70">{t('ai.naturalRemediesExpert')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={openFullPage}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                    title={t('ai.openFullPage')}
                                >
                                    <FiMaximize2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleMinimize}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                    title={isMinimized ? t('ai.expand') : t('ai.minimize')}
                                >
                                    <FiMinus className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleChat}
                                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                                    title={t('ai.close')}
                                >
                                    <FiX className="w-4 h-4" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Chat Content - Hidden when minimized */}
                        <AnimatePresence>
                            {!isMinimized && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    exit={{ height: 0 }}
                                    className="flex-1 flex flex-col overflow-hidden"
                                >
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                        {messages.map((message) => (
                                            <ChatMessage
                                                key={message.id}
                                                message={message}
                                                userName={user?.name}
                                                compact
                                            />
                                        ))}

                                        {/* Suggested Questions - Only at start */}
                                        {messages.length === 1 && (
                                            <SuggestedQuestions 
                                                onSelect={handleSendMessage}
                                                className="mt-2"
                                            />
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Input */}
                                    <div className="p-3 border-t border-[var(--color-border-primary)]">
                                        {/* Remaining Requests Indicator */}
                                        {remainingRequests !== null && remainingRequests !== -1 && (
                                            <div className={`text-xs mb-2 text-center ${
                                                remainingRequests === 0 || isLimitReached
                                                    ? 'text-red-500' 
                                                    : remainingRequests <= 2 
                                                        ? 'text-amber-500' 
                                                        : 'text-[var(--color-text-tertiary)]'
                                            }`}>
                                                {remainingRequests === 0 || isLimitReached
                                                    ? `🚫 ${t('ai.limitReached')} - Resets at 12 AM`
                                                    : `${remainingRequests} ${t('ai.requestsRemaining')}`
                                                }
                                            </div>
                                        )}
                                        {isLimitReached && remainingRequests === null && (
                                            <div className="text-xs mb-2 text-center text-red-500">
                                                🚫 {t('ai.limitReached')} - Resets at 12 AM
                                            </div>
                                        )}
                                        {remainingRequests === -1 && (
                                            <div className="text-xs mb-2 text-center text-green-500">
                                                ✨ {t('ai.unlimitedRequests')}
                                            </div>
                                        )}
                                        <ChatInput
                                            onSend={handleSendMessage}
                                            disabled={isLoading || !isAuthenticated || remainingRequests === 0 || isLimitReached}
                                            placeholder={
                                                !isAuthenticated 
                                                    ? t('ai.loginToChat')
                                                    : (remainingRequests === 0 || isLimitReached)
                                                        ? `🚫 ${t('ai.limitReached')} - Resets at 12 AM`
                                                        : t('ai.askMeAnything')
                                            }
                                            compact
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Action Button - Only show when chat is closed */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleChat}
                        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center
                                   text-white transition-all"
                        style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
                    >
                        <FiMessageCircle className="w-6 h-6" />

                        {/* Unread Badge */}
                        {unreadCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full 
                                          bg-[var(--color-error-500)] text-white text-xs
                                          flex items-center justify-center font-medium"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </motion.span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingChatWidget;
