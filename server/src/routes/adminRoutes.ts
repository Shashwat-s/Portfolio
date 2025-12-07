import { Router, Request, Response } from 'express';
import { regenerateEmbeddings } from '../services/embeddingService.js';

/**
 * Admin API Routes
 * 
 * POST /api/admin/embeddings - Regenerate all embeddings
 */

export const adminRouter = Router();

// Regenerate embeddings for all portfolio content
adminRouter.post('/embeddings', async (_req: Request, res: Response) => {
    try {
        const result = await regenerateEmbeddings();
        res.json({
            success: true,
            message: 'Embeddings regenerated successfully',
            count: result.count,
        });
    } catch (error) {
        console.error('❌ Embedding regeneration failed:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Health check for admin endpoints
adminRouter.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', admin: true });
});
