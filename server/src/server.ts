import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { chatRouter } from './routes/chatRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import ttsRouter from './routes/ttsRoutes.js';

/**
 * Express Application Factory
 * 
 * Creates and configures the Express application with:
 * - Security middleware (helmet, cors)
 * - JSON parsing
 * - API routes
 * - Error handling
 */

export async function createServer() {
    const app = express();

    // Security middleware
    app.use(helmet());
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Body parsing
    app.use(express.json({ limit: '1mb' }));

    // Health check endpoint
    app.get('/api/health', (_req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
        });
    });

    // API routes
    app.use('/api/chat', chatRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/tts', ttsRouter);


    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            error: 'Not Found',
            message: 'The requested endpoint does not exist',
        });
    });

    // Global error handler
    const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
        console.error('❌ Server error:', err);

        res.status(err.status || 500).json({
            error: err.message || 'Internal Server Error',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    };

    app.use(errorHandler);

    return app;
}
