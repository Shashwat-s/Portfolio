/// <reference types="vite/client" />
import { ApiResponse, ChatRequest, ChatResponse } from '@shared/types';

/**
 * API Client
 * 
 * Centralized HTTP client for backend API calls.
 * Uses relative URLs in development (proxied by Vite) and absolute URLs in production.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://portfolio-r8fa.onrender.com';

// Timeout for API calls (30 seconds to handle Render cold starts)
const API_TIMEOUT = 30000;

/**
 * Make a typed fetch request with timeout
 */
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    const startTime = Date.now();

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn('⏱️ API timeout - aborting request');
            controller.abort();
        }, API_TIMEOUT);

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);
        const elapsed = Date.now() - startTime;

        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ API Error (${elapsed}ms):`, data.error || response.statusText);
            return {
                success: false,
                error: data.error || `HTTP ${response.status}: ${response.statusText}`,
            };
        }

        console.log(`✅ API Success (${elapsed}ms):`, endpoint);
        return {
            success: true,
            data: data as T,
        };
    } catch (error) {
        const elapsed = Date.now() - startTime;

        if (error instanceof Error && error.name === 'AbortError') {
            console.error(`⏱️ API Timeout after ${elapsed}ms:`, endpoint);
            return {
                success: false,
                error: 'Request timed out. The server may be waking up - please try again.',
            };
        }

        console.error(`❌ API request failed (${elapsed}ms):`, error);
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
