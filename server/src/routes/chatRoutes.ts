import { Router } from 'express';
import { handleChat } from '../controllers/chatController.js';

/**
 * Chat API Routes
 * 
 * POST /api/chat - Send a message to AI Shashwat
 */

export const chatRouter = Router();

// Main chat endpoint
chatRouter.post('/', handleChat);
