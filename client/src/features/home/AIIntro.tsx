import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useCloudTTS } from '@/features/voice/useCloudTTS';

/**
 * AIIntro Component
 * 
 * Shows "Touch anywhere" splash with transparent background (sphere visible).
 * On touch/click, the text fades out and AI starts speaking the intro.
 */

const INTRO_MESSAGE = "Welcome! My name is Shashwat Sharma. I am a software developer and I make ideas come real. What do you want to know about me?";

export default function AIIntro() {
    const { hasSpokenIntro, setSpeaking, setHasSpokenIntro } = useAppStore();
    const hasTriggeredRef = useRef(false);

    // Use Google Cloud TTS for natural, consistent voice
    const { speak } = useCloudTTS({
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
    });

    // Handle touch/click to start
    const handleStart = () => {
        if (hasTriggeredRef.current || hasSpokenIntro) return;
        hasTriggeredRef.current = true;

        console.log('🔊 AIIntro: User touched, starting intro speech');
        speak(INTRO_MESSAGE);
        setHasSpokenIntro(true);
    };

    return (
        <AnimatePresence>
            {!hasSpokenIntro && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={handleStart}
                    onTouchStart={handleStart}
                    className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                >
                    {/* Content - no background, sphere visible */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-center px-8"
                    >
                        {/* Subtle glassmorphic card */}
                        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                            {/* Animated hand icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeInOut"
                                }}
                                className="text-6xl mb-6"
                            >
                                👆
                            </motion.div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-lg">
                                Touch anywhere to begin
                            </h1>

                            <p className="text-gray-400 text-sm">
                                Experience my AI-powered portfolio
                            </p>

                            {/* Pulsing ring animation */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 2,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 rounded-3xl border-2 border-cyan-400/30 pointer-events-none"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

