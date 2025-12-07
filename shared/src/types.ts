// ========================================
// Shared Types - AI Portfolio
// ========================================
// These types are shared between client and server

// ----------------------------------------
// Voice Command Types
// ----------------------------------------
export enum VoiceCommand {
    GO_HOME = 'GO_HOME',
    SHOW_PROJECTS = 'SHOW_PROJECTS',
    SHOW_EDUCATION = 'SHOW_EDUCATION',
    SHOW_EXPERIENCE = 'SHOW_EXPERIENCE',
    GO_BACK = 'GO_BACK',
    ASK_AI = 'ASK_AI',
    UNKNOWN = 'UNKNOWN',
}

export interface ParsedCommand {
    type: VoiceCommand;
    originalText: string;
    /** For ASK_AI commands, this contains the question to send to the AI */
    query?: string;
    /** Optional target, e.g., a specific project name */
    target?: string;
}

// ----------------------------------------
// Portfolio Data Types
// ----------------------------------------
export interface Project {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    imageUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
    achievements?: string[];
    gpa?: string;
    order: number;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    responsibilities: string[];
    technologies: string[];
    order: number;
}

// ----------------------------------------
// Chat & API Types
// ----------------------------------------
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatRequest {
    sessionId: string;
    message: string;
    /** Optional mode hint from frontend */
    mode?: 'nav' | 'qa';
    /** Recent chat history for context */
    history?: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface ChatResponse {
    sessionId: string;
    message: string;
    /** If the response includes navigation, specify the command */
    navigationCommand?: VoiceCommand;
    /** Sources used for the response (for RAG transparency) */
    sources?: string[];
}

// ----------------------------------------
// Embedding Types (for RAG)
// ----------------------------------------
export interface EmbeddingDocument {
    id: string;
    /** Reference to the source document (project, education, etc.) */
    sourceId: string;
    sourceType: 'project' | 'education' | 'experience' | 'general';
    /** The text content that was embedded */
    content: string;
    /** Title for display in sources */
    title: string;
    /** The embedding vector */
    embedding: number[];
    createdAt: Date;
}

// ----------------------------------------
// API Response Wrapper
// ----------------------------------------
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
