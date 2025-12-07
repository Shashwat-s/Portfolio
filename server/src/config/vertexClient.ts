/**
 * Vertex AI Client Configuration
 * 
 * Provides helpers for calling Vertex AI services:
 * - Text generation (Gemini)
 * - Text embeddings
 */

import { getConfig } from './env.js';

// Vertex AI types
interface GenerateContentRequest {
    contents: Array<{
        role: string;
        parts: Array<{ text: string }>;
    }>;
    generationConfig?: {
        temperature?: number;
        topK?: number;
        topP?: number;
        maxOutputTokens?: number;
    };
    systemInstruction?: {
        parts: Array<{ text: string }>;
    };
}

interface EmbeddingsRequest {
    instances: Array<{ content: string }>;
}

/**
 * Check if Vertex AI is properly configured
 */
export function isVertexAiConfigured(): boolean {
    return !!(
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        process.env.GCP_PROJECT_ID
    );
}

/**
 * Get Vertex AI endpoint URLs
 */
export function getVertexAiEndpoints() {
    const config = getConfig();
    const baseUrl = `https://${config.gcpLocation}-aiplatform.googleapis.com/v1`;
    const projectPath = `projects/${config.gcpProjectId}/locations/${config.gcpLocation}`;

    return {
        // Gemini endpoint
        generateContent: `${baseUrl}/${projectPath}/publishers/google/models/${config.vertexAiModel}:generateContent`,
        // Embedding endpoint
        embedText: `${baseUrl}/${projectPath}/publishers/google/models/${config.vertexAiEmbeddingModel}:predict`,
    };
}

/**
 * Get Google Cloud auth token
 * 
 * Note: This requires either GOOGLE_APPLICATION_CREDENTIALS or
 * running on a GCP environment with proper IAM.
 */
async function getAuthToken(): Promise<string | null> {
    try {
        // Try to get token from metadata server (when running on GCP)
        const metadataUrl = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
        const response = await fetch(metadataUrl, {
            headers: { 'Metadata-Flavor': 'Google' },
        });

        if (response.ok) {
            const data = await response.json();
            return data.access_token;
        }
    } catch {
        // Not running on GCP, try other methods
    }

    // For local development, we'd typically use google-auth-library
    // For MVP, return null and fall back to mock
    console.log('⚠️ Unable to get GCP auth token - using mock mode');
    return null;
}

/**
 * Call Vertex AI Gemini for text generation
 */
export async function generateContent(
    systemPrompt: string,
    userMessage: string,
    context?: string
): Promise<string> {
    const token = await getAuthToken();

    if (!token) {
        // Return mock response for development
        return mockGenerateContent(userMessage, context);
    }

    const endpoints = getVertexAiEndpoints();

    const request: GenerateContentRequest = {
        systemInstruction: {
            parts: [{ text: systemPrompt }],
        },
        contents: [
            {
                role: 'user',
                parts: [{ text: context ? `Context:\n${context}\n\nQuestion: ${userMessage}` : userMessage }],
            },
        ],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
        },
    };

    const response = await fetch(endpoints.generateContent, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Vertex AI error: ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
}

/**
 * Generate text embeddings via Vertex AI
 */
export async function embedText(text: string): Promise<number[]> {
    const token = await getAuthToken();

    if (!token) {
        // Return mock embedding for development
        return mockEmbedText(text);
    }

    const endpoints = getVertexAiEndpoints();

    const request: EmbeddingsRequest = {
        instances: [{ content: text }],
    };

    const response = await fetch(endpoints.embedText, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Vertex AI embedding error: ${error}`);
    }

    const data = await response.json();
    return data.predictions?.[0]?.embeddings?.values || [];
}

// ========================================
// Mock Implementations for Development
// ========================================

/**
 * Mock content generation for development without Vertex AI
 */
function mockGenerateContent(message: string, context?: string): string {
    const lowerMessage = message.toLowerCase();

    // Check for specific topics
    if (lowerMessage.includes('project')) {
        return "I've worked on several exciting projects! My AI Portfolio uses React, TypeScript, and Vertex AI to create an interactive experience. I've also built Harmonize, a social platform for matching long-term friends, and an AI Comic Turner that generates comic books from text prompts. Each project taught me something new about building great software.";
    }

    if (lowerMessage.includes('education') || lowerMessage.includes('study') || lowerMessage.includes('school')) {
        return "I completed my Master's degree in Computer Science from Stanford University, focusing on AI and Machine Learning. Before that, I earned my Bachelor's in Computer Science from IIT. My education gave me a strong foundation in algorithms, data structures, and software engineering principles.";
    }

    if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job')) {
        return "I have experience working with cutting-edge technologies including React, TypeScript, Node.js, and various cloud platforms. I've built full-stack applications, worked on AI/ML projects, and contributed to open-source software. I love solving complex problems and building products that make a difference.";
    }

    if (lowerMessage.includes('tech') || lowerMessage.includes('stack') || lowerMessage.includes('skill')) {
        return "My tech stack includes React, TypeScript, and Node.js for web development. I work with Google Cloud Platform, Firebase, and Vertex AI for cloud and AI services. I'm also proficient in Python for machine learning, and I enjoy exploring new technologies like WebRTC for real-time communication.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm AI Shashwat, here to tell you about my work, projects, and experience. What would you like to know?";
    }

    // Default response with context awareness
    if (context) {
        return `Based on my portfolio information, ${context.slice(0, 200)}... Is there something specific you'd like to know more about?`;
    }

    return "I'm happy to tell you about my projects, education, or technical experience. What interests you most?";
}

/**
 * Mock embedding generation for development
 * Returns a deterministic embedding based on text hash
 */
function mockEmbedText(text: string): number[] {
    // Generate a pseudo-random embedding based on text content
    const embedding: number[] = [];
    const seed = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    for (let i = 0; i < 768; i++) { // Standard embedding dimension
        // Simple pseudo-random number generation
        const value = Math.sin(seed * (i + 1)) * 10000;
        embedding.push(value - Math.floor(value));
    }

    // Normalize the embedding
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / magnitude);
}
