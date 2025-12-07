/**
 * Environment Configuration
 * 
 * Loads and validates environment variables.
 * Provides typed access to configuration values.
 */

interface EnvConfig {
    // Server
    port: number;
    nodeEnv: 'development' | 'production' | 'test';
    corsOrigin: string;

    // Firebase
    firebaseProjectId: string;
    firebaseServiceAccountPath?: string;

    // GCP / Vertex AI
    gcpProjectId: string;
    gcpLocation: string;
    gcpAgentId: string;
    vertexAiModel: string;
    vertexAiEmbeddingModel: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

function getOptionalEnvVar(key: string): string | undefined {
    return process.env[key];
}

/**
 * Load configuration from environment variables.
 * 
 * For development, uses sensible defaults.
 * For production, requires all variables to be set.
 */
export function loadConfig(): EnvConfig {
    const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['nodeEnv'];
    const isDev = nodeEnv === 'development';

    return {
        // Server
        port: parseInt(process.env.PORT || '3001', 10),
        nodeEnv,
        corsOrigin: getEnvVar('CORS_ORIGIN', isDev ? '*' : ''),

        // Firebase
        firebaseProjectId: getEnvVar('FIREBASE_PROJECT_ID', isDev ? 'demo-project' : ''),
        firebaseServiceAccountPath: getOptionalEnvVar('FIREBASE_SERVICE_ACCOUNT_PATH'),

        // GCP / Vertex AI
        gcpProjectId: getEnvVar('GCP_PROJECT_ID', isDev ? 'demo-project' : ''),
        gcpLocation: getEnvVar('GCP_LOCATION', 'us-central1'),
        gcpAgentId: getEnvVar('GCP_AGENT_ID', ''),
        vertexAiModel: getEnvVar('VERTEX_AI_MODEL', 'gemini-1.5-flash'),
        vertexAiEmbeddingModel: getEnvVar('VERTEX_AI_EMBEDDING_MODEL', 'text-embedding-004'),
    };
}

// Singleton config instance
let config: EnvConfig | null = null;

export function getConfig(): EnvConfig {
    if (!config) {
        config = loadConfig();
    }
    return config;
}
