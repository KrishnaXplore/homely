// ============================================
// HOMELY - Chat Input Component
// ============================================
// Message input with voice and file upload
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMic, FiPaperclip, FiX, FiFile, FiImage, FiMicOff } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import toast from 'react-hot-toast';

// Language codes for Speech Recognition
const SPEECH_LANG_CODES = {
    en: 'en-US',
    hi: 'hi-IN',
    kn: 'kn-IN',
};

// Detect mobile device
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
};

// --------------------------------------------
// VOICE RECORDING ANIMATION COMPONENT
// --------------------------------------------

const VoiceRecordingAnimation = () => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-1">
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                className="w-2 h-2 bg-red-500 rounded-full"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-red-500 rounded-full"
            />
        </div>
        <span className="text-sm text-red-500 font-medium">Recording...</span>
        <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 bg-red-500 rounded-full ml-1"
        />
    </div>
);

// --------------------------------------------
// CHAT INPUT COMPONENT
// --------------------------------------------

const ChatInput = ({ 
    onSend, 
    disabled = false, 
    placeholder,
    className = '',
    compact = false
}) => {
    const { t, language } = useLanguage();
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [attachedImageBase64, setAttachedImageBase64] = useState(null);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [recordingDuration, setRecordingDuration] = useState(0);
    
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);
    const finalTranscriptRef = useRef('');
    const isListeningRef = useRef(false);
    const recordingTimerRef = useRef(null);
    const lastProcessedTranscriptRef = useRef(''); // Track last processed to avoid duplicates
    const isMobile = useRef(isMobileDevice());
    
    /**
     * Stop recording helper function
     */
    const stopRecordingFn = () => {
        isListeningRef.current = false;
        setIsRecording(false);
        setInterimTranscript('');
        setRecordingDuration(0);
        
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }
    };
    
    /**
     * Initialize Speech Recognition once on mount
     */
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported');
            return;
        }
        
        const recognition = new SpeechRecognition();
        // Disable continuous mode on mobile to prevent duplicate results
        recognition.continuous = !isMobile.current;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        
        console.log('Speech recognition initialized, mobile mode:', isMobile.current, 'continuous:', recognition.continuous);
        
        recognition.onstart = () => {
            console.log('Speech recognition started');
            lastProcessedTranscriptRef.current = ''; // Reset on new session
        };
        
        recognition.onresult = (event) => {
            let interimText = '';
            let finalText = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                const confidence = event.results[i][0].confidence;
                
                console.log(`Transcript: "${transcript}", Final: ${event.results[i].isFinal}, Confidence: ${confidence}`);
                
                if (event.results[i].isFinal) {
                    // On mobile, check for duplicate transcripts
                    if (isMobile.current) {
                        // Avoid exact duplicate processing
                        const normalizedTranscript = transcript.trim().toLowerCase();
                        const normalizedLast = lastProcessedTranscriptRef.current.trim().toLowerCase();
                        
                        if (normalizedTranscript === normalizedLast) {
                            console.log('Skipping duplicate transcript on mobile');
                            continue;
                        }
                        lastProcessedTranscriptRef.current = transcript;
                    }
                    finalText += transcript + ' ';
                } else {
                    interimText += transcript;
                }
            }
            
            if (finalText) {
                finalTranscriptRef.current += finalText;
                setMessage(finalTranscriptRef.current.trim());
                setInterimTranscript('');
            } else if (interimText) {
                setInterimTranscript(interimText);
            }
        };
        
        recognition.onend = () => {
            console.log('Speech recognition ended, isListening:', isListeningRef.current, 'isMobile:', isMobile.current);
            
            // On mobile, don't auto-restart - let user manually control
            if (isMobile.current) {
                if (isListeningRef.current) {
                    // Recognition ended naturally on mobile - stop recording
                    stopRecordingFn();
                    if (finalTranscriptRef.current.trim()) {
                        toast.success(t('ai.voiceRecorded') || 'Voice recorded successfully!');
                    }
                }
                return;
            }
            
            // On desktop, auto-restart if still supposed to be listening
            if (isListeningRef.current) {
                setTimeout(() => {
                    if (isListeningRef.current && recognitionRef.current) {
                        try {
                            console.log('Restarting speech recognition...');
                            recognitionRef.current.start();
                        } catch (e) {
                            console.error('Failed to restart recognition:', e);
                            stopRecordingFn();
                        }
                    }
                }, 100);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            if (event.error === 'no-speech') {
                // No speech detected - this is normal, just continue
                console.log('No speech detected, continuing to listen...');
                return;
            }
            
            if (event.error === 'aborted') {
                // User stopped - not an error
                return;
            }
            
            if (event.error === 'not-allowed') {
                toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
                stopRecordingFn();
            } else if (event.error === 'network') {
                toast.error('Network error. Please check your internet connection.');
                stopRecordingFn();
            } else if (event.error === 'audio-capture') {
                toast.error('No microphone found. Please connect a microphone.');
                stopRecordingFn();
            } else {
                console.log('Non-critical error, continuing...');
                // For other errors, try to continue listening
            }
        };
        
        recognition.onspeechstart = () => {
            console.log('Speech detected - user is talking');
        };
        
        recognition.onspeechend = () => {
            console.log('Speech ended - user stopped talking');
        };
        
        recognition.onaudiostart = () => {
            console.log('Audio capture started');
        };
        
        recognition.onaudioend = () => {
            console.log('Audio capture ended');
        };
        
        recognitionRef.current = recognition;
        
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    // Ignore
                }
            }
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
        };
    }, []);
    
    /**
     * Auto-resize textarea
     */
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [message, interimTranscript]);
    
    /**
     * Handle voice input toggle
     */
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            toast.error(t('ai.voiceNotSupported') || 'Voice input is not supported in your browser. Try Chrome or Edge.');
            return;
        }
        
        if (!recognitionRef.current) {
            toast.error('Speech recognition not initialized. Please refresh the page.');
            return;
        }
        
        if (isRecording) {
            // Stop recording
            stopRecordingFn();
            
            if (finalTranscriptRef.current.trim()) {
                toast.success(t('ai.voiceRecorded') || 'Voice recorded successfully!');
            } else {
                toast.info('No speech detected. Please try again and speak clearly.');
            }
        } else {
            // Start recording
            const speechLang = SPEECH_LANG_CODES[language] || 'en-US';
            recognitionRef.current.lang = speechLang;
            
            // Store current message for appending
            finalTranscriptRef.current = message ? message + ' ' : '';
            setInterimTranscript('');
            setRecordingDuration(0);
            
            try {
                isListeningRef.current = true;
                recognitionRef.current.start();
                setIsRecording(true);
                
                // Start recording timer
                recordingTimerRef.current = setInterval(() => {
                    setRecordingDuration(prev => prev + 1);
                }, 1000);
                
                const langName = language === 'hi' ? 'हिंदी' : language === 'kn' ? 'ಕನ್ನಡ' : 'English';
                toast.success(
                    `🎤 Listening in ${langName}... Speak clearly!`, 
                    { duration: 3000 }
                );
            } catch (err) {
                console.error('Failed to start voice input:', err);
                stopRecordingFn();
                toast.error(t('ai.voiceStartFailed') || 'Failed to start voice input. Please try again.');
            }
        }
    };
    
    /**
     * Convert file to base64 for image analysis
     */
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };
    
    /**
     * Compress image for mobile devices to reduce size and ensure compatibility
     * @param {File} file - The image file to compress
     * @param {number} maxWidth - Maximum width (default 1200px)
     * @param {number} quality - JPEG quality 0-1 (default 0.8)
     * @returns {Promise<string>} - Compressed base64 string
     */
    const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    // Calculate new dimensions
                    let { width, height } = img;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    
                    // Create canvas and draw resized image
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to base64 (always JPEG for better compression)
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    
                    console.log(`Image compressed: ${file.size} bytes -> ~${Math.round(compressedBase64.length * 0.75)} bytes`);
                    console.log(`Dimensions: ${img.width}x${img.height} -> ${width}x${height}`);
                    
                    resolve(compressedBase64);
                };
                img.onerror = (error) => reject(error);
            };
            reader.onerror = (error) => reject(error);
        });
    };
    
    /**
     * Handle file attachment
     */
    const handleFileClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(t('ai.fileTooLarge') || 'File too large. Maximum size is 5MB.');
            return;
        }
        
        // Check file type (images only for analysis)
        const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const allowedTypes = [...imageTypes, 'application/pdf', 'text/plain'];
        
        if (!allowedTypes.includes(file.type)) {
            toast.error(t('ai.unsupportedFileType') || 'Unsupported file type. Please upload images or PDF files.');
            return;
        }
        
        setAttachedFile(file);
        
        // Convert image to base64 for vision analysis
        if (imageTypes.includes(file.type)) {
            try {
                // On mobile or for large images, compress for better compatibility
                const shouldCompress = isMobile.current || file.size > 1024 * 1024; // Compress on mobile or if > 1MB
                
                let base64;
                if (shouldCompress) {
                    console.log('Compressing image for mobile/large file...');
                    base64 = await compressImage(file, 1200, 0.85);
                } else {
                    base64 = await fileToBase64(file);
                }
                
                setAttachedImageBase64(base64);
                toast.success(t('ai.imageAttached') || `Image attached: ${file.name}. I can analyze this image!`);
            } catch (err) {
                console.error('Error converting image:', err);
                setAttachedImageBase64(null);
                toast.success(`File attached: ${file.name}`);
            }
        } else {
            setAttachedImageBase64(null);
            toast.success(`File attached: ${file.name}`);
        }
        
        // Reset input
        e.target.value = '';
    };
    
    const removeAttachment = () => {
        setAttachedFile(null);
        setAttachedImageBase64(null);
    };
    
    /**
     * Handle send message
     */
    const handleSend = () => {
        if ((message.trim() || attachedFile) && !disabled) {
            let finalMessage = message.trim();
            
            // If there's an attached image, include base64 for vision analysis
            if (attachedFile && attachedImageBase64) {
                // Send message with image data
                onSend(finalMessage || t('ai.analyzeImage') || 'Please analyze this image and tell me what you see.', {
                    image: attachedImageBase64,
                    fileName: attachedFile.name,
                });
            } else if (attachedFile) {
                // Non-image file - just mention it
                const fileInfo = `[Attached: ${attachedFile.name}]`;
                finalMessage = finalMessage 
                    ? `${finalMessage}\n\n${fileInfo}` 
                    : `I'm sharing this file: ${attachedFile.name}. Can you help me with information related to it?`;
                onSend(finalMessage);
            } else {
                // Text only
                onSend(finalMessage);
            }
            
            setMessage('');
            setAttachedFile(null);
            setAttachedImageBase64(null);
            
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };
    
    /**
     * Handle key press
     */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    const isImage = attachedFile?.type.startsWith('image/');
    
    // Format recording duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className={`relative ${className}`}>
            {/* Voice Recording Indicator */}
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-3 flex items-center justify-center gap-3"
                    >
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
                            {/* Sound wave animation */}
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="w-1 bg-red-500 rounded-full"
                                        animate={{
                                            height: ['8px', '20px', '8px'],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-red-500 font-medium">
                                Recording {formatDuration(recordingDuration)}
                            </span>
                            <motion.div
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-red-500 rounded-full"
                            />
                        </div>
                        <button
                            onClick={stopRecordingFn}
                            className="px-3 py-1 text-sm text-red-500 hover:text-red-600 
                                     hover:bg-red-500/10 rounded-full transition-colors"
                        >
                            Stop
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {/* Attached File Preview */}
            <AnimatePresence>
                {attachedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mb-2 p-2 rounded-xl bg-[var(--color-bg-tertiary)] 
                                   border border-[var(--color-border-primary)]
                                   flex items-center gap-3"
                    >
                        {isImage ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)]">
                                <img 
                                    src={URL.createObjectURL(attachedFile)} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]
                                           flex items-center justify-center">
                                <FiFile className="w-6 h-6 text-[var(--color-primary-500)]" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                                {attachedFile.name}
                            </p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">
                                {(attachedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={removeAttachment}
                            className="p-1.5 rounded-lg hover:bg-[var(--color-bg-hover)] 
                                       text-[var(--color-text-tertiary)] hover:text-[var(--color-error-500)]
                                       transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="flex items-end gap-2 p-2 rounded-2xl
                           bg-[var(--color-bg-card)] border border-[var(--color-border-primary)]
                           focus-within:border-[var(--color-primary-500)] transition-colors">
                {/* Attachment Button */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={handleFileClick}
                    disabled={disabled}
                    className={`p-2 rounded-xl transition-colors
                               ${attachedFile 
                                   ? 'text-[var(--color-primary-500)] bg-[var(--color-primary-100)] dark:bg-[var(--color-primary-900)]' 
                                   : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                               }`}
                    title="Attach file"
                >
                    <FiPaperclip className="w-5 h-5" />
                </button>
                
                {/* Input Container */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={isRecording ? message + interimTranscript : message}
                        onChange={(e) => {
                            if (!isRecording) {
                                setMessage(e.target.value);
                            }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={isRecording ? "🎤 Listening... Speak now!" : (placeholder || t('ai.placeholder'))}
                        disabled={disabled}
                        readOnly={isRecording}
                        rows={1}
                        className={`w-full resize-none bg-transparent py-2 px-2
                                   text-[var(--color-text-primary)] 
                                   placeholder-[var(--color-text-tertiary)]
                                   focus:outline-none max-h-[150px]
                                   ${isRecording ? 'cursor-default' : ''}`}
                    />
                </div>
                
                {/* Voice Button with Recording Animation */}
                <motion.button
                    type="button"
                    onClick={handleVoiceInput}
                    disabled={disabled}
                    whileHover={{ scale: isRecording ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-2 rounded-xl transition-all flex items-center justify-center
                               ${isRecording 
                                   ? 'text-white bg-red-500' 
                                   : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                               }`}
                    title={isRecording ? "Stop recording" : "Voice input"}
                >
                    {isRecording ? (
                        <>
                            {/* Pulsing rings animation */}
                            <motion.span
                                className="absolute inset-0 rounded-xl bg-red-500"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.span
                                className="absolute inset-0 rounded-xl bg-red-500"
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            />
                            <FiMicOff className="w-5 h-5 relative z-10" />
                        </>
                    ) : (
                        <FiMic className="w-5 h-5" />
                    )}
                </motion.button>
                
                {/* Send Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleSend}
                    disabled={(!message.trim() && !attachedFile) || disabled}
                    className={`p-3 rounded-xl transition-all
                               ${(message.trim() || attachedFile) && !disabled
                                   ? 'text-white shadow-lg'
                                   : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed'
                               }`}
                    style={(message.trim() || attachedFile) && !disabled 
                        ? { background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' } 
                        : {}}
                >
                    <FiSend className="w-5 h-5" />
                </motion.button>
            </div>
            
            {/* Helper Text */}
            {!compact && (
                <p className="text-xs text-[var(--color-text-tertiary)] mt-2 text-center">
                    {t('ai.enterToSend')}
                </p>
            )}
        </div>
    );
};

export default ChatInput;
