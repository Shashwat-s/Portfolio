import { useState, useCallback, useRef } from 'react';
import { synthesizeSpeech } from '@/lib/apiClient';

/**
 * useCloudTTS Hook
 * 
 * Uses Google Cloud Text-to-Speech for natural, consistent voice.
 * Returns audio as playable audio element.
 */

interface UseCloudTTSOptions {
    /** Callback when speech starts */
    onStart?: () => void;
    /** Callback when speech ends */
    onEnd?: () => void;
    /** Callback on error */
    onError?: (error: string) => void;
}

interface UseCloudTTSReturn {
    /** Whether currently speaking */
    isSpeaking: boolean;
    /** Whether TTS is loading */
    isLoading: boolean;
    /** Speak the given text */
    speak: (text: string) => Promise<void>;
    /** Stop speaking */
    stop: () => void;
}

/**
 * Clean text for speech - remove markdown and special characters
 */
function cleanTextForSpeech(text: string): string {
    return text
        // Remove bold/italic markers
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/__/g, '')
        .replace(/_/g, ' ')
        // Remove bullet points
        .replace(/^[-•]\s*/gm, '')
        .replace(/^\d+\.\s*/gm, '')  // numbered lists
        // Remove headers
        .replace(/^#+\s*/gm, '')
        // Remove links [text](url) -> text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove inline code
        .replace(/`([^`]+)`/g, '$1')
        // Remove extra whitespace
        .replace(/\n+/g, '. ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Global audio unlock state - shared across all instances
let audioUnlocked = false;

/**
 * Unlock audio playback on mobile browsers
 * Must be called from a user gesture (click/touch)
 */
function unlockAudio(): void {
    if (audioUnlocked) return;

    try {
        // Create a silent audio and play it to unlock the audio context
        const silentAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYM/UsJAAAAAAD/+1DEAAAGAAGn9AAAIgAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7UMQwgAAADSAAAAAAAAANIAAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
        silentAudio.volume = 0.01;
        silentAudio.play().then(() => {
            audioUnlocked = true;
            console.log('🔊 Audio context unlocked for mobile');
        }).catch(() => {
            // Ignore - will try again on next interaction
        });
    } catch (e) {
        // Ignore
    }
}

// Set up global listeners to unlock audio on first user interaction
if (typeof window !== 'undefined') {
    const unlockHandler = () => {
        unlockAudio();
    };

    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
    window.addEventListener('click', unlockHandler, { once: true });
}

export function useCloudTTS(
    options: UseCloudTTSOptions = {}
): UseCloudTTSReturn {
    const { onStart, onEnd, onError } = options;

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setIsSpeaking(false);
    }, []);

    const speak = useCallback(async (text: string) => {
        // Stop any current audio
        stop();

        // Clean the text for speech
        const cleanedText = cleanTextForSpeech(text);
        if (!cleanedText.trim()) return;

        setIsLoading(true);

        try {
            console.log('🔊 Cloud TTS: Requesting speech for:', cleanedText.slice(0, 50) + '...');

            const response = await synthesizeSpeech(cleanedText);


            if (!response.success || !response.audioContent) {
                throw new Error(response.error || 'TTS failed');
            }

            // Create audio from base64
            const audioData = `data:${response.audioType};base64,${response.audioContent}`;
            const audio = new Audio(audioData);
            audioRef.current = audio;

            // Set up event handlers
            audio.onplay = () => {
                console.log('🔊 Cloud TTS: Playing audio');
                setIsSpeaking(true);
                onStart?.();
            };

            audio.onended = () => {
                console.log('🔊 Cloud TTS: Audio ended');
                setIsSpeaking(false);
                audioRef.current = null;
                onEnd?.();
            };

            audio.onerror = (e) => {
                console.error('🔊 Cloud TTS: Audio playback error', e);
                setIsSpeaking(false);
                audioRef.current = null;
                onError?.('Audio playback failed');
            };

            // Play the audio
            try {
                await audio.play();
            } catch (playError) {
                // If play fails (mobile autoplay restriction), try to recover
                console.warn('🔊 Cloud TTS: Play failed, audio may be blocked by browser:', playError);
                // Store the audio to play on next user interaction
                const playOnInteraction = () => {
                    audio.play().catch(console.error);
                    window.removeEventListener('touchstart', playOnInteraction);
                    window.removeEventListener('click', playOnInteraction);
                };
                window.addEventListener('touchstart', playOnInteraction, { once: true, passive: true });
                window.addEventListener('click', playOnInteraction, { once: true });
            }
        } catch (error) {
            console.error('🔊 Cloud TTS error:', error);
            const errorMessage = error instanceof Error ? error.message : 'TTS failed';
            onError?.(errorMessage);
            setIsSpeaking(false);
        } finally {
            setIsLoading(false);
        }
    }, [stop, onStart, onEnd, onError]);

    return {
        isSpeaking,
        isLoading,
        speak,
        stop,
    };
}

