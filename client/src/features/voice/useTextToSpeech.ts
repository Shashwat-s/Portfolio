import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useTextToSpeech Hook
 * 
 * Wraps the Web Speech API's speechSynthesis interface.
 * Returns speaking state and speak function.
 * 
 * This abstraction allows us to later swap to Google Cloud Text-to-Speech
 * without changing the component code.
 */

interface UseTextToSpeechOptions {
    /** Voice to use (by name) */
    voiceName?: string;
    /** Speech rate (0.1 to 10, default: 1) */
    rate?: number;
    /** Pitch (0 to 2, default: 1) */
    pitch?: number;
    /** Volume (0 to 1, default: 1) */
    volume?: number;
    /** Callback when speech starts */
    onStart?: () => void;
    /** Callback when speech ends */
    onEnd?: () => void;
    /** Callback on error */
    onError?: (error: string) => void;
}

interface UseTextToSpeechReturn {
    /** Whether currently speaking */
    isSpeaking: boolean;
    /** Whether speech synthesis is supported */
    isSupported: boolean;
    /** Available voices */
    voices: SpeechSynthesisVoice[];
    /** Speak the given text */
    speak: (text: string) => void;
    /** Stop speaking */
    stop: () => void;
    /** Pause speaking */
    pause: () => void;
    /** Resume speaking */
    resume: () => void;
}

export function useTextToSpeech(
    options: UseTextToSpeechOptions = {}
): UseTextToSpeechReturn {
    const {
        voiceName,
        rate = 1,
        pitch = 1,
        volume = 1,
        onStart,
        onEnd,
        onError,
    } = options;

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Load available voices
    useEffect(() => {
        if (!isSupported) return;

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
        };

        // Load immediately if available
        loadVoices();

        // Also listen for voiceschanged event (Chrome loads voices async)
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
    }, [isSupported]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (isSupported) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported]);

    const speak = useCallback(
        (text: string) => {
            if (!isSupported) {
                onError?.('Speech synthesis is not supported in this browser');
                return;
            }

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // Configure utterance
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = volume;

            // Set voice if specified
            if (voiceName) {
                const voice = voices.find((v) => v.name === voiceName);
                if (voice) {
                    utterance.voice = voice;
                }
            } else {
                // Prefer a natural-sounding male English voice for consistency
                // Priority: Google UK Male > Google US > Any English male > Any English
                const preferredVoice =
                    voices.find((v) => v.name.includes('Google UK English Male')) ||
                    voices.find((v) => v.name.includes('Google US English') && v.name.toLowerCase().includes('male')) ||
                    voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
                    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ||
                    voices.find((v) => v.lang.startsWith('en'));

                if (preferredVoice) {
                    utterance.voice = preferredVoice;
                    console.log('🔊 Using voice:', preferredVoice.name);
                }
            }

            // Event handlers
            utterance.onstart = () => {
                setIsSpeaking(true);
                onStart?.();
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                onEnd?.();
            };

            utterance.onerror = (event) => {
                setIsSpeaking(false);
                onError?.(`Speech error: ${event.error}`);
            };

            utteranceRef.current = utterance;

            // Speak
            window.speechSynthesis.speak(utterance);
        },
        [isSupported, voices, voiceName, rate, pitch, volume, onStart, onEnd, onError]
    );

    const stop = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, [isSupported]);

    const pause = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.pause();
        }
    }, [isSupported]);

    const resume = useCallback(() => {
        if (isSupported) {
            window.speechSynthesis.resume();
        }
    }, [isSupported]);

    return {
        isSpeaking,
        isSupported,
        voices,
        speak,
        stop,
        pause,
        resume,
    };
}
