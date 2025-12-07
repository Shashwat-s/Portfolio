import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { VoiceCommand } from '@shared/types';
import { useSpeechToText } from './useSpeechToText';
import { useTextToSpeech } from './useTextToSpeech';
import { parseCommand, isNavigationCommand } from '@/lib/commandParser';
import { useAppStore } from '@/store/appStore';
import { useChatStore } from '@/features/chat/chatStore';

/**
 * VoiceCommandRouter
 * 
 * This component handles the voice interaction flow:
 * 1. Listens for voice input via useSpeechToText
 * 2. Parses the input into commands via commandParser
 * 3. Routes commands to navigation or AI chat
 * 4. Speaks AI responses via useTextToSpeech
 * 
 * It renders nothing visible but manages the global voice state.
 */
export default function VoiceCommandRouter() {
    const navigate = useNavigate();

    // App state
    const { processCommand, setListening, setSpeaking, setTranscript } = useAppStore();

    // Chat state
    const { sendMessage } = useChatStore();

    // Handle final speech result
    const handleSpeechResult = useCallback(
        async (transcript: string) => {
            console.log('🎤 Speech result:', transcript);
            setTranscript(transcript);

            // Parse the command
            const parsed = parseCommand(transcript);
            console.log('📝 Parsed command:', parsed);

            if (isNavigationCommand(parsed.type)) {
                // Handle navigation
                processCommand(parsed.type);

                // Navigate using React Router
                switch (parsed.type) {
                    case VoiceCommand.GO_HOME:
                        navigate('/');
                        speak('Going home');
                        break;
                    case VoiceCommand.SHOW_PROJECTS:
                        navigate('/projects');
                        speak('Here are my projects');
                        break;
                    case VoiceCommand.SHOW_EDUCATION:
                        navigate('/education');
                        speak('Here is my education background');
                        break;
                    case VoiceCommand.GO_BACK:
                        navigate(-1);
                        speak('Going back');
                        break;
                    default:
                        break;
                }
            } else if (parsed.type === VoiceCommand.ASK_AI) {
                // Send to AI
                const response = await sendMessage(parsed.query || transcript);

                if (response?.message) {
                    // Speak the response
                    speak(response.message);
                }
            } else {
                // Unknown command
                speak("I didn't understand that. Try saying 'show projects' or ask me a question.");
            }
        },
        [navigate, processCommand, sendMessage, setTranscript]
    );

    // Text-to-speech
    const { speak, isSpeaking } = useTextToSpeech({
        rate: 1,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
        onError: (error) => console.error('TTS Error:', error),
    });

    // Speech-to-text
    const { isListening, isSupported, error } = useSpeechToText({
        onResult: handleSpeechResult,
        onError: (error) => console.error('STT Error:', error),
    });

    // Sync listening state
    useEffect(() => {
        setListening(isListening);
    }, [isListening, setListening]);

    // Sync speaking state
    useEffect(() => {
        setSpeaking(isSpeaking);
    }, [isSpeaking, setSpeaking]);

    // Log support status
    useEffect(() => {
        if (!isSupported) {
            console.warn('⚠️ Speech recognition not supported in this browser');
        }
        if (error) {
            console.error('🎤 Speech error:', error);
        }
    }, [isSupported, error]);

    // This component renders nothing
    return null;
}
