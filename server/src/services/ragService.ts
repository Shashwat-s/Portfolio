/**
 * RAG Service
 * 
 * Implements Retrieval-Augmented Generation:
 * 1. Embed the user query
 * 2. Retrieve relevant context from embeddings
 * 3. Build prompt with context and personality
 * 4. Generate response via LLM
 */

import { generateContent, embedText } from '../config/vertexClient.js';
import { getRelevantDocuments } from './embeddingService.js';

// AI Shashwat personality prompt
const SYSTEM_PROMPT = `You are AI Shashwat, a friendly AI assistant that represents Shashwat, a software developer.

Key behaviors:
- Speak in first person ("I", "my", "me") as if you ARE Shashwat
- Be friendly, enthusiastic, and professional
- Keep answers concise but informative (2-4 sentences for simple questions)
- For technical questions, provide more detail
- If you don't know something that isn't in the context, honestly say so
- Encourage follow-up questions

When discussing:
- Projects: Highlight the technologies, challenges, and what you learned
- Education: Mention key achievements and how it shaped your skills
- Experience: Focus on impact and technical growth
- Technical skills: Be specific about your proficiency level

Format:
- Use natural conversational language
- Don't use markdown formatting in responses (no asterisks, headers, etc.)
- Keep paragraphs short for easy reading`;

interface ChatHistory {
    role: string;
    content: string;
}

export interface RAGResponse {
    sessionId: string;
    message: string;
    sources?: string[];
}

/**
 * Query the RAG pipeline
 */
export async function query(
    userMessage: string,
    sessionId: string,
    history?: ChatHistory[]
): Promise<RAGResponse> {
    try {
        // Step 1: Get query embedding
        const queryEmbedding = await embedText(userMessage);

        // Step 2: Retrieve relevant documents
        const relevantDocs = await getRelevantDocuments(queryEmbedding, 3);

        // Step 3: Build context from retrieved documents
        const context = relevantDocs.length > 0
            ? relevantDocs.map(doc => `[${doc.title}]\n${doc.content}`).join('\n\n---\n\n')
            : '';

        // Step 4: Build conversation context from history
        const conversationContext = history && history.length > 0
            ? history.slice(-3).map(h => `${h.role}: ${h.content}`).join('\n')
            : '';

        // Step 5: Generate response
        const fullContext = [
            context && `Portfolio Information:\n${context}`,
            conversationContext && `Recent Conversation:\n${conversationContext}`,
        ].filter(Boolean).join('\n\n');

        const response = await generateContent(SYSTEM_PROMPT, userMessage, fullContext);

        return {
            sessionId,
            message: response,
            sources: relevantDocs.map(doc => doc.title),
        };
    } catch (error) {
        console.error('❌ RAG query error:', error);
        throw error;
    }
}
