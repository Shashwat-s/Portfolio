import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { useCloudTTS } from '@/features/voice/useCloudTTS';
import ProfileCard from '@/components/ProfileCard';
import cardImage from '@/photos/card.PNG';
import codePattern from '@/assets/code-pattern.svg';

/**
 * AIIntro Component
 * 
 * Shows a ProfileCard with Shashwat's info and photo.
 * On touch/click, the card fades out and AI starts speaking the intro.
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
                    {/* ProfileCard with Shashwat's info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ProfileCard
                            name="Shashwat Sharma"
                            title="Software Engineer"
                            handle="shashwat_sharma"
                            status="Available"
                            avatarUrl={cardImage}
                            iconUrl={codePattern}
                            showUserInfo={true}
                            enableTilt={true}
                            enableMobileTilt={true}
                            behindGlowColor="rgba(0, 200, 255, 0.5)"
                            bottomMessage="Touch anywhere to start talking with me"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

