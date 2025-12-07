import { Router, Request, Response } from 'express';
import { synthesizeSpeech, listVoices } from '../services/ttsService.js';

/**
 * TTS Routes
 * 
 * Provides text-to-speech API endpoints.
 */

const router = Router();

interface TTSRequestBody {
    text: string;
    voiceName?: string;
    speakingRate?: number;
    pitch?: number;
}

/**
 * POST /api/tts
 * Convert text to speech
 */
router.post('/', async (req: Request, res: Response) => {
    try {
        const { text, voiceName, speakingRate, pitch } = req.body as TTSRequestBody;

        if (!text || typeof text !== 'string') {
            res.status(400).json({
                success: false,
                error: 'Text is required and must be a string',
            });
            return;
        }

        // Limit text length
        if (text.length > 5000) {
            res.status(400).json({
                success: false,
                error: 'Text too long. Maximum 5000 characters.',
            });
            return;
        }

        const result = await synthesizeSpeech(text, {
            voiceName,
            speakingRate,
            pitch,
        });

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('TTS API error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'TTS failed',
        });
    }
});

/**
 * GET /api/tts/voices
 * List available voices
 */
router.get('/voices', async (_req: Request, res: Response) => {
    try {
        const voices = await listVoices();
        res.json({
            success: true,
            voices,
        });
    } catch (error) {
        console.error('List voices error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list voices',
        });
    }
});

export default router;
