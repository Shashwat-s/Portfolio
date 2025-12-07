/**
 * Portfolio Types
 * 
 * Server-side type definitions for portfolio data.
 */

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

export interface EmbeddingDocument {
    id: string;
    sourceId: string;
    sourceType: 'project' | 'education' | 'experience' | 'general';
    content: string;
    title: string;
    embedding: number[];
    createdAt: Date;
}
