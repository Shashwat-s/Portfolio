import { Request, Response } from 'express';
import { queryAgent } from '../services/agentService.js';

/**
 * Chat Controller
 * 
 * Handles chat requests and routes to Google Conversational Agent.
 */

interface ChatRequestBody {
    sessionId: string;
    message: string;
    mode?: 'nav' | 'qa';
    history?: Array<{ role: string; content: string }>;
}

/**
 * Handle chat request
 */
export async function handleChat(req: Request, res: Response): Promise<void> {
    try {
        const { sessionId, message } = req.body as ChatRequestBody;

        // Validate request
        if (!message || typeof message !== 'string') {
            res.status(400).json({
                success: false,
                error: 'Message is required and must be a string',
            });
            return;
        }

        if (!sessionId || typeof sessionId !== 'string') {
            res.status(400).json({
                success: false,
                error: 'SessionId is required and must be a string',
            });
            return;
        }

        console.log(`📨 Chat request [${sessionId}]: "${message.slice(0, 50)}..."`);

        // Process through Agent
        const response = await queryAgent(message, sessionId);

        console.log(`✅ Chat response [${sessionId}]: "${response.message.slice(0, 50)}..."`);

        res.json({
            success: true,
            ...response,
        });
    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
