/**
 * Embedding Service
 * 
 * Handles:
 * - Generating embeddings for portfolio content
 * - Storing and retrieving embeddings
 * - Finding similar documents via cosine similarity
 */

import { embedText } from '../config/vertexClient.js';
import { getPortfolioContent } from './portfolioService.js';

// In-memory embedding store for MVP
// Will be replaced with Firestore in production
interface StoredEmbedding {
    id: string;
    sourceId: string;
    sourceType: 'project' | 'education' | 'experience' | 'general';
    title: string;
    content: string;
    embedding: number[];
}

let embeddingsStore: StoredEmbedding[] = [];
let isInitialized = false;

/**
 * Initialize embeddings from portfolio content
 */
async function initializeEmbeddings(): Promise<void> {
    if (isInitialized) return;

    console.log('🔄 Initializing embeddings...');

    const content = await getPortfolioContent();

    for (const item of content) {
        const embedding = await embedText(item.content);
        embeddingsStore.push({
            id: `emb_${item.id}`,
            sourceId: item.id,
            sourceType: item.type,
            title: item.title,
            content: item.content,
            embedding,
        });
    }

    isInitialized = true;
    console.log(`✅ Initialized ${embeddingsStore.length} embeddings`);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Get relevant documents for a query embedding
 */
export async function getRelevantDocuments(
    queryEmbedding: number[],
    topK: number = 3
): Promise<Array<{ title: string; content: string; score: number }>> {
    // Ensure embeddings are initialized
    await initializeEmbeddings();

    // Calculate similarity scores
    const scored = embeddingsStore.map(doc => ({
        title: doc.title,
        content: doc.content,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort by score and return top K
    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .filter(doc => doc.score > 0.3); // Minimum similarity threshold
}

/**
 * Regenerate all embeddings
 */
export async function regenerateEmbeddings(): Promise<{ count: number }> {
    console.log('🔄 Regenerating all embeddings...');

    embeddingsStore = [];
    isInitialized = false;

    await initializeEmbeddings();

    return { count: embeddingsStore.length };
}

/**
 * Get embedding for a single text
 */
export async function getEmbedding(text: string): Promise<number[]> {
    return embedText(text);
}
