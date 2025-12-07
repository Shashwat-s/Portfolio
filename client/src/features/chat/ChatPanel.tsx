import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from './chatStore';
import ChatBubble from '@/components/ChatBubble';

/**
 * ChatPanel Component
 * 
 * Overlay chat UI that displays conversation history and input.
 * Can be toggled open/closed.
 */

export default function ChatPanel() {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        isLoading,
        isPanelOpen,
        togglePanel,
        sendMessage,
        error
    } = useChatStore();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (isPanelOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isPanelOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue.trim();
        setInputValue('');
        await sendMessage(message);
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                onClick={togglePanel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full
          flex items-center justify-center shadow-lg
          transition-all duration-300
          ${isPanelOpen
                        ? 'bg-dark-700 text-white'
                        : 'bg-gradient-to-br from-dark-700 to-dark-800 text-primary-400 hover:text-primary-300'
                    }
        `}
                title={isPanelOpen ? 'Close chat' : 'Open chat'}
            >
                {isPanelOpen ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                )}

                {/* Unread indicator */}
                {!isPanelOpen && messages.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {messages.length > 9 ? '9+' : messages.length}
                    </span>
                )}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isPanelOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 left-6 z-50 w-[350px] sm:w-[400px] max-h-[70vh] glass-card overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">S</span>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">AI Shashwat</h3>
                                    <p className="text-dark-400 text-xs">Ask me anything</p>
                                </div>
                            </div>

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-1.5 h-1.5 bg-primary-500 rounded-full"
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[200px] max-h-[400px]">
                            {messages.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-dark-500 text-sm">
                                        No messages yet. Start by asking a question!
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        {[
                                            'Tell me about your projects',
                                            'What technologies do you use?',
                                            "What's your background?",
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => sendMessage(suggestion)}
                                                className="block w-full text-left px-3 py-2 text-sm text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors"
                                            >
                                                "{suggestion}"
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <ChatBubble key={message.id} message={message} index={index} />
                                ))
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="text-center py-2">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-dark-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="input flex-1 text-sm py-2"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !inputValue.trim()}
                                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
