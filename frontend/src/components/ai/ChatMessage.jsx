// ============================================
// HOMELY - Chat Message Component
// ============================================
// Individual chat message bubble with markdown support
// ============================================

import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import { GiHerbsBundle } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';

// --------------------------------------------
// MARKDOWN STYLES
// --------------------------------------------

// Custom styles for markdown content
const markdownStyles = `
    .markdown-content {
        line-height: 1.6;
    }
    .markdown-content p {
        margin-bottom: 0.75rem;
    }
    .markdown-content p:last-child {
        margin-bottom: 0;
    }
    .markdown-content strong {
        font-weight: 600;
    }
    .markdown-content em {
        font-style: italic;
    }
    .markdown-content ul, .markdown-content ol {
        margin: 0.5rem 0;
        padding-left: 1.5rem;
    }
    .markdown-content ul {
        list-style-type: disc;
    }
    .markdown-content ol {
        list-style-type: decimal;
    }
    .markdown-content li {
        margin-bottom: 0.25rem;
    }
    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
    }
    .markdown-content h1 {
        font-size: 1.25rem;
    }
    .markdown-content h2 {
        font-size: 1.125rem;
    }
    .markdown-content h3 {
        font-size: 1rem;
    }
    .markdown-content code {
        background: rgba(0,0,0,0.1);
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        font-size: 0.875em;
    }
    .markdown-content pre {
        background: rgba(0,0,0,0.1);
        padding: 0.75rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 0.5rem 0;
    }
    .markdown-content blockquote {
        border-left: 3px solid currentColor;
        padding-left: 1rem;
        margin: 0.5rem 0;
        opacity: 0.8;
    }
    .markdown-content hr {
        border: none;
        border-top: 1px solid currentColor;
        opacity: 0.2;
        margin: 1rem 0;
    }
    .markdown-content a {
        text-decoration: underline;
        opacity: 0.9;
    }
    .markdown-content a:hover {
        opacity: 1;
    }
`;

// --------------------------------------------
// CHAT MESSAGE COMPONENT
// --------------------------------------------

const ChatMessage = ({ message, userName = 'You', compact = false }) => {
    // Determine if user message based on role
    const isUser = message.role === 'user';
    const isTyping = message.isTyping;
    
    return (
        <>
            {/* Inject markdown styles */}
            <style>{markdownStyles}</style>
            
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
                {/* Avatar */}
                <div className={`flex-shrink-0 ${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-full 
                               flex items-center justify-center
                               ${isUser 
                                   ? 'bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]/50' 
                                   : 'bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-primary-600)]'
                               }`}>
                    {isUser ? (
                        <FiUser className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-[var(--color-primary-600)]`} />
                    ) : (
                        <GiHerbsBundle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                    )}
                </div>
                
                {/* Message Bubble */}
                <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} rounded-2xl
                                   ${isUser 
                                       ? 'bg-[var(--color-primary-500)] text-white rounded-tr-sm' 
                                       : 'bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded-tl-sm'
                                   }`}>
                        {isTyping ? (
                            <div className="flex gap-1.5 py-1 px-2">
                                <motion.span
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                    className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
                                />
                                <motion.span
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                    className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
                                />
                                <motion.span
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                    className="w-2 h-2 rounded-full bg-[var(--color-text-tertiary)]"
                                />
                            </div>
                        ) : (
                            <div className="markdown-content text-sm md:text-base">
                                {/* Display attached image if present */}
                                {message.image && (
                                    <div className="mb-2 rounded-lg overflow-hidden max-w-[250px]">
                                        <img 
                                            src={message.image} 
                                            alt="Attached" 
                                            className="w-full h-auto object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                                {isUser ? (
                                    // User messages as plain text
                                    <span className="whitespace-pre-wrap">{message.content}</span>
                                ) : (
                                    // AI messages with markdown formatting
                                    <ReactMarkdown>
                                        {message.content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Timestamp */}
                    {message.timestamp && !isTyping && (
                        <span className={`text-xs text-[var(--color-text-tertiary)] mt-1 block
                                        ${isUser ? 'text-right' : 'text-left'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default ChatMessage;
