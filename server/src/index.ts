import 'dotenv/config';
import { createServer } from './server.js';

/**
 * Server Entry Point
 * 
 * Initializes and starts the Express server.
 */

const PORT = process.env.PORT || 3001;

async function main() {
    try {
        const app = await createServer();

        app.listen(PORT, () => {
            console.log('🚀 Server running at:');
            console.log(`   - Local:   http://localhost:${PORT}`);
            console.log(`   - Health:  http://localhost:${PORT}/api/health`);
            console.log('');
            console.log('📝 API Endpoints:');
            console.log(`   - POST /api/chat - Send a message to AI Shashwat`);
            console.log(`   - POST /api/admin/embeddings - Regenerate embeddings`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

main();
