import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useSpeechToText } from '@/features/voice/useSpeechToText';
import { parseCommand } from '@/lib/commandParser';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/features/chat/chatStore';
import { useTextToSpeech } from '@/features/voice/useTextToSpeech';
import { VoiceCommand } from '@shared/types';

/**
 * VoiceIndicator Component
 * 
 * Visual indicator for voice recording status.
 * Shows a microphone button that pulses when listening.
 * Also displays the current transcript while listening.
 */

interface VoiceIndicatorProps {
    /** Position on screen */
    position?: 'bottom-right' | 'bottom-center' | 'top-right';
}

export default function VoiceIndicator({
    position = 'bottom-right',
}: VoiceIndicatorProps) {
    const navigate = useNavigate();
    const { isSpeaking, processCommand, setTranscript, setSpeaking } = useAppStore();
    const { sendMessage } = useChatStore();

    const { speak } = useTextToSpeech({
        rate: 1,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
    });

    const handleSpeechResult = async (finalTranscript: string) => {
        setTranscript(finalTranscript);

        const parsed = parseCommand(finalTranscript);

        if (parsed.type === VoiceCommand.GO_HOME) {
            navigate('/');
            speak('Going home');
        } else if (parsed.type === VoiceCommand.SHOW_PROJECTS) {
            navigate('/projects');
            speak('Here are my projects');
        } else if (parsed.type === VoiceCommand.SHOW_EDUCATION) {
            navigate('/education');
            speak('Here is my education background');
        } else if (parsed.type === VoiceCommand.GO_BACK) {
            navigate(-1);
            speak('Going back');
        } else if (parsed.type === VoiceCommand.ASK_AI && parsed.query) {
            const response = await sendMessage(parsed.query);
            if (response?.message) {
                speak(response.message);
            }
        } else {
            processCommand(parsed.type);
        }
    };

    const {
        transcript,
        startListening,
        stopListening,
        isSupported,
        isListening: localIsListening,
    } = useSpeechToText({
        onResult: handleSpeechResult,
        continuous: false,
    });

    const positionClasses = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
        'top-right': 'top-6 right-6',
    };

    const handleToggle = () => {
        if (localIsListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className={`fixed ${positionClasses[position]} z-50 flex flex-col items-end gap-3`}>
            {/* Transcript Display */}
            {localIsListening && transcript && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="glass-card px-4 py-2 max-w-xs"
                >
                    <p className="text-sm text-dark-200 italic">"{transcript}"</p>
                </motion.div>
            )}

            {/* Speaking Indicator */}
            {isSpeaking && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card px-4 py-2 flex items-center gap-2"
                >
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-3 bg-primary-500 rounded-full"
                                animate={{
                                    height: [12, 20, 12],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.5,
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-dark-300">Speaking...</span>
                </motion.div>
            )}

            {/* Microphone Button */}
            <motion.button
                onClick={handleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 shadow-lg
          ${localIsListening
                        ? 'bg-red-500 shadow-red-500/30'
                        : 'bg-gradient-to-br from-primary-500 to-primary-600 shadow-primary-500/30'
                    }
        `}
                title={localIsListening ? 'Stop listening' : 'Start listening'}
            >
                {/* Pulse Ring */}
                {localIsListening && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{
                                scale: [1, 1.5],
                                opacity: [0.5, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                            }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{
                                scale: [1, 1.3],
                                opacity: [0.3, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                delay: 0.3,
                            }}
                        />
                    </>
                )}

                {/* Microphone Icon */}
                <svg
                    className="w-6 h-6 text-white relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {localIsListening ? (
                        // Stop icon
                        <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
                    ) : (
                        // Microphone icon
                        <>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                        </>
                    )}
                </svg>
            </motion.button>
        </div>
    );
}
