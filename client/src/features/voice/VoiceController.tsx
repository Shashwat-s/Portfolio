import { useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { VoiceCommand } from '@shared/types';
import { useSpeechToText } from './useSpeechToText';
import { useCloudTTS } from './useCloudTTS';
import { parseCommand, isNavigationCommand } from '@/lib/commandParser';
import { useAppStore } from '@/store/appStore';
import { useChatStore } from '@/features/chat/chatStore';

/**
 * VoiceController Component
 * 
 * Main voice interaction controller. Renders the microphone button
 * and handles voice commands for navigation and AI questions.
 * Uses Google Cloud TTS for natural, consistent voice.
 */

export default function VoiceController() {
    const [showTranscript, setShowTranscript] = useState(false);

    const {
        processCommand,
        setListening,
        setSpeaking,
        setTranscript,
    } = useAppStore();

    const { sendMessage } = useChatStore();

    // Google Cloud Text-to-Speech for natural voice
    const { speak, stop, isSpeaking } = useCloudTTS({
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
    });

    // Handle speech result
    const handleSpeechResult = useCallback(
        async (finalTranscript: string) => {
            console.log('🎤 Voice input:', finalTranscript);
            setTranscript(finalTranscript);
            setShowTranscript(true);

            // Hide transcript after a delay
            setTimeout(() => setShowTranscript(false), 3000);

            // Parse the command
            const parsed = parseCommand(finalTranscript);
            console.log('📋 Parsed:', parsed);

            if (isNavigationCommand(parsed.type)) {
                // Handle navigation with voice feedback
                processCommand(parsed.type);

                switch (parsed.type) {
                    case VoiceCommand.GO_HOME:
                        speak('Going home');
                        break;
                    case VoiceCommand.SHOW_PROJECTS:
                        speak('Here are my projects');
                        break;
                    case VoiceCommand.SHOW_EDUCATION:
                        speak('Here is my education background');
                        break;
                    case VoiceCommand.GO_BACK:
                        speak('Going back');
                        break;
                }
            } else if (parsed.type === VoiceCommand.ASK_AI) {
                // Send to AI
                const response = await sendMessage(parsed.query || finalTranscript);

                if (response?.message) {
                    speak(response.message);
                }
            } else {
                // Unknown command
                speak("I didn't catch that. Try saying 'show projects' or ask me a question.");
            }
        },
        [processCommand, sendMessage, setTranscript, speak]
    );

    // Speech-to-text
    const {
        transcript,
        isListening,
        isSupported,
        startListening,
        stopListening,
    } = useSpeechToText({
        onResult: handleSpeechResult,
        continuous: true,  // Keep listening until user clicks stop
    });

    // Sync listening state
    useEffect(() => {
        setListening(isListening);
    }, [isListening, setListening]);

    // Sync speaking state
    useEffect(() => {
        setSpeaking(isSpeaking);
    }, [isSpeaking, setSpeaking]);

    // Toggle listening
    const handleToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    if (!isSupported) {
        return null;
    }

    return (
        <>
            {/* Transcript Display */}
            {(showTranscript || isListening) && transcript && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="fixed bottom-28 right-6 z-50 max-w-xs px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20"
                >
                    <p className="text-sm text-white/80 italic">"{transcript}"</p>
                </motion.div>
            )}

            {/* Speaking Indicator - Click to interrupt and speak */}
            {isSpeaking && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => {
                        // Stop speaking and start listening
                        stop();
                        startListening();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="fixed bottom-28 right-6 z-50 px-4 py-2 rounded-2xl bg-cyan-500/20 backdrop-blur-lg border border-cyan-400/30 flex items-center gap-2 cursor-pointer hover:bg-cyan-500/30 transition-colors"
                    title="Click to interrupt and speak"
                >
                    <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-4 bg-cyan-400 rounded-full"
                                animate={{ height: [16, 24, 16] }}
                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-cyan-300">Speaking... <span className="text-cyan-400/60 text-xs">(tap to interrupt)</span></span>
                </motion.button>
            )}

            {/* Microphone Button */}
            <motion.button
                onClick={handleToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full
          flex items-center justify-center shadow-2xl
          transition-all duration-300
          ${isListening
                        ? 'bg-red-500 shadow-red-500/30'
                        : 'bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-cyan-500/30'
                    }
        `}
            >
                {/* Pulse rings */}
                {isListening && (
                    <>
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-red-500"
                            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                        />
                    </>
                )}

                {/* Icon */}
                <svg
                    className="w-7 h-7 text-white relative z-10"
                    fill={isListening ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {isListening ? (
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                    )}
                </svg>
            </motion.button>

        </>
    );
}
