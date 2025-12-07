import { ApiResponse, ChatRequest, ChatResponse } from '@shared/types';

/**
 * API Client
 * 
 * Centralized HTTP client for backend API calls.
 * Uses relative URLs in development (proxied by Vite) and absolute URLs in production.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-r8fa.onrender.com';

/**
 * Make a typed fetch request
 */
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.error || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        return {
            success: true,
            data: data as T,
        };
    } catch (error) {
        console.error('API request failed:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Network error',
        };
    }
}

/**
 * Send a chat message to the AI
 */
export async function sendChatMessage(
    request: ChatRequest
): Promise<ApiResponse<ChatResponse>> {
    return fetchApi<ChatResponse>('/api/chat', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

/**
 * Health check
 */
export async function checkHealth(): Promise<ApiResponse<{ status: string }>> {
    return fetchApi<{ status: string }>('/api/health');
}

/**
 * TTS Response type
 */
export interface TTSApiResponse {
    success: boolean;
    audioContent?: string;
    audioType?: string;
    error?: string;
}

/**
 * Convert text to speech using Google Cloud TTS
 */
export async function synthesizeSpeech(text: string): Promise<TTSApiResponse> {
    const response = await fetchApi<{ audioContent: string; audioType: string }>('/api/tts', {
        method: 'POST',
        body: JSON.stringify({ text }),
    });

    if (response.success && response.data) {
        return {
            success: true,
            audioContent: response.data.audioContent,
            audioType: response.data.audioType,
        };
    }

    return {
        success: false,
        error: response.error || 'TTS failed',
    };
}
