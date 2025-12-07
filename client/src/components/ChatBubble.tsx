import { motion } from 'framer-motion';
import type { ChatMessage } from '@shared/types';

/**
 * ChatBubble Component
 * 
 * Displays a single chat message with appropriate styling
 * based on the message role (user vs assistant).
 */

interface ChatBubbleProps {
    message: ChatMessage;
    index?: number;
}

export default function ChatBubble({ message, index = 0 }: ChatBubbleProps) {
    const isUser = message.role === 'user';

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        }).format(new Date(date));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, x: isUser ? 20 : -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
            ${isUser
                            ? 'bg-primary-500 text-white'
                            : 'bg-gradient-to-br from-dark-600 to-dark-700 text-primary-400'
                        }
          `}
                >
                    {isUser ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ) : (
                        <span className="text-sm font-bold">S</span>
                    )}
                </div>

                {/* Message Content */}
                <div
                    className={`
            rounded-2xl px-4 py-3 
            ${isUser
                            ? 'bg-primary-500 text-white rounded-br-md'
                            : 'glass-card text-dark-100 rounded-bl-md'
                        }
          `}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                    {/* Timestamp */}
                    <p
                        className={`
              text-[10px] mt-1 opacity-60
              ${isUser ? 'text-right' : 'text-left'}
            `}
                    >
                        {formatTime(message.timestamp)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
