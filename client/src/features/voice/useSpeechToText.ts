import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * useSpeechToText Hook
 * 
 * Wraps the Web Speech API's SpeechRecognition interface.
 * Returns transcript, listening state, and control functions.
 * 
 * This abstraction allows us to later swap to Google Cloud Speech-to-Text
 * without changing the component code.
 */

interface UseSpeechToTextOptions {
    /** Language for recognition (default: 'en-US') */
    language?: string;
    /** Whether to return interim results (default: true) */
    interimResults?: boolean;
    /** Whether to restart after a result (default: false) */
    continuous?: boolean;
    /** Callback when a final result is received */
    onResult?: (transcript: string) => void;
    /** Callback on error */
    onError?: (error: string) => void;
}

interface UseSpeechToTextReturn {
    /** Current transcript */
    transcript: string;
    /** Whether currently listening */
    isListening: boolean;
    /** Whether speech recognition is supported */
    isSupported: boolean;
    /** Current error if any */
    error: string | null;
    /** Start listening */
    startListening: () => void;
    /** Stop listening */
    stopListening: () => void;
    /** Reset transcript */
    resetTranscript: () => void;
}

// Get the SpeechRecognition API (browser prefixed)
const SpeechRecognition =
    typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

export function useSpeechToText(
    options: UseSpeechToTextOptions = {}
): UseSpeechToTextReturn {
    const {
        language = 'en-US',
        interimResults = true,
        continuous = false,
        onResult,
        onError,
    } = options;

    const [transcript, setTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const isSupported = SpeechRecognition !== null;

    // Initialize recognition instance
    useEffect(() => {
        if (!isSupported) {
            console.warn('🎤 Speech recognition is NOT supported in this browser');
            return;
        }

        console.log('🎤 Initializing speech recognition...');
        const recognition = new SpeechRecognition!();
        recognition.lang = language;
        recognition.interimResults = interimResults;
        recognition.continuous = continuous;

        recognition.onstart = () => {
            console.log('🎤 Speech recognition STARTED');
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            console.log('🎤 Speech recognition ENDED');
            setIsListening(false);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            console.log('🎤 Speech recognition RESULT received:', event.results);
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                } else {
                    interimTranscript += result[0].transcript;
                }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            console.log('🎤 Transcript:', currentTranscript, '| Final:', !!finalTranscript);
            setTranscript(currentTranscript);

            if (finalTranscript && onResult) {
                onResult(finalTranscript);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.error('🎤 Speech recognition ERROR:', event.error);
            const errorMessage = getErrorMessage(event.error);
            setError(errorMessage);
            setIsListening(false);

            if (onError) {
                onError(errorMessage);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, interimResults, continuous, isSupported]);  // Removed onResult, onError to prevent re-init

    const startListening = useCallback(() => {
        console.log('🎤 startListening called. isSupported:', isSupported);
        if (!isSupported) {
            setError('Speech recognition is not supported in this browser');
            return;
        }

        setError(null);
        setTranscript('');

        try {
            console.log('🎤 Calling recognition.start()...');
            recognitionRef.current?.start();
        } catch (err) {
            // May throw if already started
            console.warn('🎤 Recognition already started or error:', err);
        }
    }, [isSupported]);

    const stopListening = useCallback(() => {
        recognitionRef.current?.stop();
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        transcript,
        isListening,
        isSupported,
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
}

/**
 * Convert SpeechRecognition error codes to user-friendly messages
 */
function getErrorMessage(error: string): string {
    const messages: Record<string, string> = {
        'no-speech': 'No speech was detected. Please try again.',
        'audio-capture': 'No microphone was found or microphone access was denied.',
        'not-allowed': 'Microphone permission was denied. Please allow access.',
        'network': 'A network error occurred. Please check your connection.',
        'aborted': 'Speech recognition was aborted.',
        'service-not-allowed': 'Speech recognition service is not allowed.',
    };
    return messages[error] || `Speech recognition error: ${error}`;
}

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}
