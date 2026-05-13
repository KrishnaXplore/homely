// ============================================
// HOMELY - AI Assistant Page
// ============================================
// Full-page AI chat interface for health queries
// ============================================

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    FiArrowLeft, 
    FiTrash2, 
    FiInfo,
    FiAlertCircle 
} from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import aiService from '../services/aiService';
import ChatMessage from '../components/ai/ChatMessage';
import ChatInput from '../components/ai/ChatInput';
import SuggestedQuestions from '../components/ai/SuggestedQuestions';
import toast from 'react-hot-toast';

// --------------------------------------------
// AI ASSISTANT PAGE COMPONENT
// --------------------------------------------

const AIAssistantPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { language, t } = useLanguage();
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    // Generate welcome message based on language
    const getWelcomeMessage = useCallback(() => {
        const disclaimerText = {
            en: `Hello! 👋 I'm your **Homely AI Assistant**, here to help you discover natural remedies and answer your health-related questions.

I can help you with:
- 🌿 Finding natural remedies for common ailments
- 🍵 Suggesting herbal teas and their benefits
- 💡 Sharing traditional wellness practices
- ⚠️ Providing safety information about natural remedies

**Disclaimer:** I provide general information only. Always consult a healthcare professional for medical advice.

How can I assist you today?`,
            hi: `नमस्ते! 👋 मैं आपका **होमली AI सहायक** हूँ, प्राकृतिक उपचारों की खोज करने और आपके स्वास्थ्य संबंधी प्रश्नों का उत्तर देने में मदद के लिए यहाँ हूँ।

मैं आपकी मदद कर सकता हूँ:
- 🌿 आम बीमारियों के लिए प्राकृतिक उपचार खोजने में
- 🍵 हर्बल चाय और उनके लाभों का सुझाव देने में
- 💡 पारंपरिक स्वास्थ्य प्रथाओं को साझा करने में
- ⚠️ प्राकृतिक उपचारों के बारे में सुरक्षा जानकारी प्रदान करने में

**अस्वीकरण:** मैं केवल सामान्य जानकारी प्रदान करता हूँ। चिकित्सा सलाह के लिए हमेशा स्वास्थ्य पेशेवर से परामर्श करें।

आज मैं आपकी कैसे मदद कर सकता हूँ?`,
            kn: `ನಮಸ್ಕಾರ! 👋 ನಾನು ನಿಮ್ಮ **ಹೋಮ್ಲಿ AI ಸಹಾಯಕ**, ನೈಸರ್ಗಿಕ ಪರಿಹಾರಗಳನ್ನು ಕಂಡುಹಿಡಿಯಲು ಮತ್ತು ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ.

ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:
- 🌿 ಸಾಮಾನ್ಯ ಕಾಯಿಲೆಗಳಿಗೆ ನೈಸರ್ಗಿಕ ಪರಿಹಾರಗಳನ್ನು ಹುಡುಕುವುದು
- 🍵 ಗಿಡಮೂಲಿಕೆ ಚಹಾಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರಯೋಜನಗಳನ್ನು ಸೂಚಿಸುವುದು
- 💡 ಸಾಂಪ್ರದಾಯಿಕ ಆರೋಗ್ಯ ಅಭ್ಯಾಸಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳುವುದು
- ⚠️ ನೈಸರ್ಗಿಕ ಪರಿಹಾರಗಳ ಬಗ್ಗೆ ಸುರಕ್ಷತಾ ಮಾಹಿತಿ ಒದಗಿಸುವುದು

**ಹಕ್ಕುತ್ಯಾಗ:** ನಾನು ಸಾಮಾನ್ಯ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ಒದಗಿಸುತ್ತೇನೆ. ವೈದ್ಯಕೀಯ ಸಲಹೆಗಾಗಿ ಯಾವಾಗಲೂ ಆರೋಗ್ಯ ವೃತ್ತಿಪರರನ್ನು ಸಂಪರ್ಕಿಸಿ.

ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
        };
        return {
            id: 'welcome',
            role: 'assistant',
            content: disclaimerText[language] || disclaimerText.en,
            timestamp: new Date(),
        };
    }, [language]);

    // State
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDisclaimer, setShowDisclaimer] = useState(true);
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
        scrollToBottom();
    }, [messages, scrollToBottom]);

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

    const handleSendMessage = async (content, imageData = null) => {
        if ((!content.trim() && !imageData) || isLoading) return;

        // Check authentication
        if (!isAuthenticated) {
            toast.error('Please log in to use the AI Assistant');
            navigate('/login', { state: { from: '/ai-assistant' } });
            return;
        }

        // Clear any previous error
        setError(null);

        // Create user message
        const userMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: content.trim() || (imageData ? 'Please analyze this image.' : ''),
            timestamp: new Date(),
            image: imageData?.image || null, // Store image for display
        };

        // Add user message to state
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Add typing indicator
        const typingMessage = {
            id: 'typing',
            role: 'assistant',
            isTyping: true,
        };
        setMessages(prev => [...prev, typingMessage]);

        try {
            // Get conversation history
            const conversationHistory = formatConversationHistory();

            // Call AI service with optional image data
            const response = await aiService.chat(
                content.trim() || 'Please analyze this image.',
                conversationHistory,
                null,
                language,
                imageData?.image || null // Pass image base64 if available
            );

            // Extract the message from the response
            // API returns { success: true, data: { message: "...", remainingRequests: N } }
            const aiMessage = response?.data?.message || 
                              response?.message || 
                              response?.reply || 
                              'I apologize, but I could not process your request.';

            // Update remaining requests count
            if (response?.data?.remainingRequests !== undefined) {
                setRemainingRequests(response.data.remainingRequests);
            }

            // Remove typing indicator and add AI response
            setMessages(prev => {
                const filtered = prev.filter(msg => msg.id !== 'typing');
                return [
                    ...filtered,
                    {
                        id: `ai-${Date.now()}`,
                        role: 'assistant',
                        content: aiMessage,
                        timestamp: new Date(),
                        suggestedRemedies: response?.data?.suggestedRemedies || response?.suggestedRemedies || [],
                    },
                ];
            });
        } catch (err) {
            console.error('AI Chat Error:', err);
            
            // Remove typing indicator
            setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
            
            // Set error
            const errorMessage = err.response?.data?.message || 
                                 err.message || 
                                 'Failed to get a response. Please try again.';
            
            // Check if it's a rate limit error (429)
            if (err.response?.status === 429) {
                setRemainingRequests(0);
            }
            
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------------------
    // CLEAR CHAT HANDLER
    // ----------------------------------------

    const handleClearChat = () => {
        setMessages([getWelcomeMessage()]);
        setError(null);
        toast.success(t('ai.chatCleared'));
    };

    // ----------------------------------------
    // SUGGESTED QUESTION HANDLER
    // ----------------------------------------

    const handleSuggestedQuestion = (question) => {
        handleSendMessage(question);
    };

    // ----------------------------------------
    // RENDER
    // ----------------------------------------

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col"
        >
            {/* Header */}
            <header className="sticky top-0 z-20 bg-[var(--color-bg-secondary)]/80 backdrop-blur-md 
                              border-b border-[var(--color-border-primary)]">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Back Button & Title */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-xl bg-[var(--color-bg-card)] 
                                      border border-[var(--color-border-primary)]
                                      hover:border-[var(--color-primary-500)] transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </motion.button>

                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-700)]
                                           flex items-center justify-center text-white shadow-md">
                                <GiHerbsBundle className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="font-semibold text-[var(--color-text-primary)]">
                                    {t('ai.pageTitle')}
                                </h1>
                                <p className="text-xs text-[var(--color-text-tertiary)]">
                                    {t('ai.poweredBy')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDisclaimer(!showDisclaimer)}
                            className="p-2 rounded-xl bg-[var(--color-bg-card)] 
                                      border border-[var(--color-border-primary)]
                                      hover:border-[var(--color-warning-500)] transition-colors
                                      text-[var(--color-warning-500)]"
                            title={t('ai.medicalDisclaimer')}
                        >
                            <FiInfo className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearChat}
                            className="p-2 rounded-xl bg-[var(--color-bg-card)] 
                                      border border-[var(--color-border-primary)]
                                      hover:border-[var(--color-error-500)] transition-colors
                                      text-[var(--color-error-500)]"
                            title={t('ai.clearChat')}
                        >
                            <FiTrash2 className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </header>

            {/* Disclaimer Banner */}
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-[var(--color-warning-50)] dark:bg-[var(--color-warning-900)]/20 
                                  border-b border-[var(--color-warning-200)] dark:border-[var(--color-warning-800)]
                                  overflow-hidden"
                    >
                        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center gap-2 text-sm">
                            <FiAlertCircle className="w-4 h-4 text-[var(--color-warning-500)] flex-shrink-0" />
                            <p className="text-[var(--color-warning-700)] dark:text-[var(--color-warning-300)]">
                                <strong>{t('ai.disclaimer')}:</strong> {t('ai.disclaimerText')}
                            </p>
                            <button
                                onClick={() => setShowDisclaimer(false)}
                                className="ml-auto text-[var(--color-warning-500)] hover:underline flex-shrink-0"
                            >
                                {t('ai.dismiss')}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Messages Area */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto"
            >
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
                    {/* Messages */}
                    <AnimatePresence mode="popLayout">
                        {messages.map((message) => (
                            <ChatMessage
                                key={message.id}
                                message={message}
                                userName={user?.name}
                            />
                        ))}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-3 rounded-xl 
                                      bg-[var(--color-error-50)] dark:bg-[var(--color-error-900)]/20
                                      border border-[var(--color-error-200)] dark:border-[var(--color-error-800)]
                                      text-[var(--color-error-600)] dark:text-[var(--color-error-400)] text-sm"
                        >
                            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {/* Suggested Questions - Show only if no user messages yet */}
                    {messages.length === 1 && (
                        <SuggestedQuestions 
                            onSelect={handleSuggestedQuestion}
                            className="mt-8"
                        />
                    )}

                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 bg-gradient-to-t from-[var(--color-bg-primary)] 
                           via-[var(--color-bg-primary)] to-transparent pt-4">
                <div className="max-w-4xl mx-auto px-4 pb-6">
                    {/* Remaining Requests Indicator */}
                    {remainingRequests !== null && remainingRequests !== -1 && (
                        <div className={`text-sm mb-3 text-center py-2 px-4 rounded-xl ${
                            remainingRequests === 0 || isLimitReached
                                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                : remainingRequests <= 2 
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                    : 'bg-[var(--color-bg-card)] text-[var(--color-text-tertiary)] border border-[var(--color-border-primary)]'
                        }`}>
                            {remainingRequests === 0 || isLimitReached
                                ? `🚫 ${t('ai.limitReached')} - Resets at 12 AM`
                                : `💬 ${remainingRequests} ${t('ai.requestsRemaining')}`
                            }
                        </div>
                    )}
                    {isLimitReached && remainingRequests === null && (
                        <div className="text-sm mb-3 text-center py-2 px-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                            🚫 {t('ai.limitReached')} - Resets at 12 AM
                        </div>
                    )}
                    {remainingRequests === -1 && (
                        <div className="text-sm mb-3 text-center py-2 px-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/20">
                            ✨ {t('ai.unlimitedRequests')} (Admin)
                        </div>
                    )}
                    <ChatInput
                        onSend={handleSendMessage}
                        disabled={isLoading || remainingRequests === 0 || isLimitReached}
                        placeholder={
                            !isAuthenticated 
                                ? t('ai.loginRequired')
                                : (remainingRequests === 0 || isLimitReached)
                                    ? `🚫 ${t('ai.limitReached')} - Resets at 12 AM`
                                    : t('ai.placeholder')
                        }
                    />

                    {/* Not Authenticated Warning */}
                    {!isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 text-center"
                        >
                            <p className="text-sm text-[var(--color-text-tertiary)]">
                                {t('nav.please')}{' '}
                                <button
                                    onClick={() => navigate('/login', { state: { from: '/ai-assistant' } })}
                                    className="text-[var(--color-primary-500)] hover:underline font-medium"
                                >
                                    {t('nav.login')}
                                </button>
                                {' '}{t('nav.or')}{' '}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="text-[var(--color-primary-500)] hover:underline font-medium"
                                >
                                    {t('nav.signup')}
                                </button>
                                {' '}{t('ai.loginToChatWith')}
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AIAssistantPage;
