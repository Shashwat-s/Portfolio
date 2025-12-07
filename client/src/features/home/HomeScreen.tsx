import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ParticleSphere from '@/components/ParticleSphere';
import VoiceIndicator from '@/components/VoiceIndicator';
import { useTextToSpeech } from '@/features/voice/useTextToSpeech';
import { useAppStore } from '@/store/appStore';

/**
 * HomeScreen Component
 * 
 * Main landing screen with:
 * - Full-screen particle sphere background
 * - Welcome message from AI Shashwat
 * - Voice indicator for speech controls
 * - Intro animation on first load
 */

const INTRO_MESSAGE = "Welcome! My name is Shashwat. I am a software developer and I make ideas come real. What do you want to know about me?";

export default function HomeScreen() {
    const { setSpeaking } = useAppStore();

    const { speak, isSpeaking } = useTextToSpeech({
        rate: 0.95,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
    });

    // Speak intro on first load (optional - uncomment if desired)
    useEffect(() => {
        const hasSpoken = sessionStorage.getItem('intro-spoken');
        if (!hasSpoken) {
            const timer = setTimeout(() => {
                speak(INTRO_MESSAGE);
                sessionStorage.setItem('intro-spoken', 'true');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [speak]);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Particle Background */}
            <ParticleSphere className="fixed inset-0 -z-10" />

            {/* Gradient Overlays */}
            <div className="fixed inset-0 bg-gradient-radial from-transparent via-dark-950/50 to-dark-950 -z-5" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* Main Title */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-8"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-dark-400 text-sm tracking-widest uppercase mb-4"
                    >
                        Move your mouse
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="text-5xl sm:text-7xl font-display font-bold text-white mb-4"
                    >
                        <span className="gradient-text">Shashwat</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="text-xl sm:text-2xl text-dark-300 max-w-xl mx-auto"
                    >
                        Software Developer & Creator
                    </motion.p>
                </motion.div>

                {/* AI Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="glass-card px-6 sm:px-8 py-6 max-w-2xl text-center"
                >
                    <div className="flex items-center justify-center mb-4">
                        <motion.div
                            animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className={`
                w-12 h-12 rounded-full flex items-center justify-center
                ${isSpeaking
                                    ? 'bg-primary-500 glow'
                                    : 'bg-gradient-to-br from-dark-600 to-dark-700'
                                }
              `}
                        >
                            <span className="text-xl font-bold text-white">S</span>
                        </motion.div>
                    </div>

                    <p className="text-dark-200 text-lg leading-relaxed">
                        {INTRO_MESSAGE}
                    </p>

                    {/* Speaking Indicator */}
                    {isSpeaking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center gap-1 mt-4"
                        >
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-primary-400 rounded-full"
                                    animate={{
                                        height: [8, 20, 8],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.6,
                                        delay: i * 0.1,
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Quick Navigation Hints */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="mt-12 flex flex-wrap justify-center gap-3"
                >
                    {['projects', 'education', 'experience'].map((section) => (
                        <a
                            key={section}
                            href={`/${section}`}
                            className="px-4 py-2 text-sm text-dark-400 hover:text-white 
                       border border-dark-700 hover:border-dark-500 
                       rounded-full transition-colors duration-300"
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </a>
                    ))}
                </motion.div>

                {/* Voice Hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="mt-8 text-sm text-dark-500 flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Click the microphone or type to interact
                </motion.p>
            </div>

            {/* Voice Indicator */}
            <VoiceIndicator position="bottom-right" />
        </div>
    );
}
