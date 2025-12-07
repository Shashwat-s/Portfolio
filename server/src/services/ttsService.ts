/**
 * Text-to-Speech Service
 * 
 * Uses Google Cloud Text-to-Speech API for natural-sounding voice.
 * Returns audio as base64-encoded MP3.
 */

import textToSpeech from '@google-cloud/text-to-speech';
import { getConfig } from '../config/env.js';

// Cache client instance
let ttsClient: textToSpeech.TextToSpeechClient | null = null;

function getClient(): textToSpeech.TextToSpeechClient {
    if (!ttsClient) {
        ttsClient = new textToSpeech.TextToSpeechClient();
    }
    return ttsClient;
}

export interface TTSOptions {
    /** Voice name (default: en-US-Neural2-J - natural male voice) */
    voiceName?: string;
    /** Language code (default: en-US) */
    languageCode?: string;
    /** Speaking rate (0.25 to 4.0, default: 1.0) */
    speakingRate?: number;
    /** Pitch (-20.0 to 20.0, default: 0) */
    pitch?: number;
}

export interface TTSResponse {
    /** Base64-encoded audio content */
    audioContent: string;
    /** Audio format */
    audioType: 'audio/mp3';
}

/**
 * Convert text to speech using Google Cloud TTS
 */
export async function synthesizeSpeech(
    text: string,
    options: TTSOptions = {}
): Promise<TTSResponse> {
    const {
        voiceName = 'en-US-Neural2-J', // Natural male voice
        languageCode = 'en-US',
        speakingRate = 1.0,
        pitch = 0,
    } = options;

    const client = getClient();

    try {
        console.log(`🔊 TTS: Synthesizing "${text.slice(0, 50)}..."`);

        const [response] = await client.synthesizeSpeech({
            input: { text },
            voice: {
                languageCode,
                name: voiceName,
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate,
                pitch,
            },
        });

        if (!response.audioContent) {
            throw new Error('No audio content received from TTS API');
        }

        // Convert to base64
        const audioBase64 = Buffer.from(response.audioContent as Uint8Array).toString('base64');

        console.log(`✅ TTS: Generated ${audioBase64.length} bytes of audio`);

        return {
            audioContent: audioBase64,
            audioType: 'audio/mp3',
        };
    } catch (error) {
        console.error('❌ TTS error:', error);
        throw error;
    }
}

/**
 * List available voices (for debugging/selection)
 */
export async function listVoices(): Promise<string[]> {
    const client = getClient();
    const [response] = await client.listVoices({ languageCode: 'en-US' });

    return (response.voices || [])
        .filter(voice => voice.name?.includes('Neural2') || voice.name?.includes('Wavenet'))
        .map(voice => `${voice.name} (${voice.ssmlGender})`);
}
