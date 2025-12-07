import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionLayout from '@/components/SectionLayout';
import ProjectCard from '@/components/ProjectCard';
import VoiceIndicator from '@/components/VoiceIndicator';
import type { Project } from '@shared/types';

/**
 * ProjectsScreen Component
 * 
 * Displays a grid of project cards with filtering and detail view.
 */

// Mock data for MVP - will be replaced with Firestore data
const MOCK_PROJECTS: Project[] = [
    {
        id: '1',
        title: 'AI Portfolio',
        description: 'An interactive, voice-controlled portfolio website powered by AI. Features a stunning particle sphere and natural language interaction.',
        longDescription: 'This portfolio showcases my work using cutting-edge AI technology. Users can interact via voice commands or text to learn about my projects, experience, and background.',
        technologies: ['React', 'TypeScript', 'Vertex AI', 'Firebase', 'TailwindCSS'],
        featured: true,
        order: 1,
        githubUrl: 'https://github.com/shashwat',
        liveUrl: 'https://shashwat.dev',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: '2',
        title: 'Harmonize',
        description: 'A social platform for matching long-term friends based on life alignment through an intelligent survey and AI-powered matching.',
        technologies: ['React', 'Node.js', 'Express', 'Socket.io', 'PostgreSQL'],
        featured: true,
        order: 2,
        githubUrl: 'https://github.com/shashwat/harmonize',
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2023-11-01'),
    },
    {
        id: '3',
        title: 'AI Comic Turner',
        description: 'Generate comic books from text prompts using AI. Features realistic page-turning animations and AI-powered panel generation.',
        technologies: ['React', 'Vertex AI', 'Gemini', 'TailwindCSS'],
        featured: false,
        order: 3,
        liveUrl: 'https://comic.shashwat.dev',
        createdAt: new Date('2023-10-01'),
        updatedAt: new Date('2023-10-01'),
    },
    {
        id: '4',
        title: 'WebRTC Calling App',
        description: 'Real-time video and audio calling application with WebRTC. Features echo cancellation and synchronized call timers.',
        technologies: ['React Native', 'WebRTC', 'Firebase', 'Node.js'],
        featured: false,
        order: 4,
        createdAt: new Date('2023-09-01'),
        updatedAt: new Date('2023-09-01'),
    },
    {
        id: '5',
        title: 'AI Wardrobe',
        description: 'Virtual try-on application using AI. Upload photos and see how different clothes look on you with automatic background removal.',
        technologies: ['React', 'Python', 'TensorFlow', 'GCP'],
        featured: false,
        order: 5,
        createdAt: new Date('2023-08-01'),
        updatedAt: new Date('2023-08-01'),
    },
    {
        id: '6',
        title: 'Gesture-Controlled Particles',
        description: 'Interactive 3D particle system controlled by hand gestures. Features dual-hand controls for drawing and manipulating shapes.',
        technologies: ['Three.js', 'MediaPipe', 'GLSL', 'TypeScript'],
        featured: false,
        order: 6,
        createdAt: new Date('2023-07-01'),
        updatedAt: new Date('2023-07-01'),
    },
];

export default function ProjectsScreen() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');

    const filteredProjects = filter === 'featured'
        ? MOCK_PROJECTS.filter(p => p.featured)
        : MOCK_PROJECTS;

    return (
        <SectionLayout
            title="Projects"
            subtitle={`${filteredProjects.length} projects to explore`}
        >
            {/* Filter Tabs */}
            <div className="flex justify-center gap-2 mb-8">
                {(['all', 'featured'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${filter === f
                                ? 'bg-primary-500 text-white'
                                : 'bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700'
                            }
            `}
                    >
                        {f === 'all' ? 'All Projects' : 'Featured'}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onClick={() => setSelectedProject(project)}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Header */}
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedProject.title}
                            </h2>

                            {selectedProject.featured && (
                                <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-sm rounded-full mb-4">
                                    Featured Project
                                </span>
                            )}

                            {/* Description */}
                            <p className="text-dark-300 mb-6 leading-relaxed">
                                {selectedProject.longDescription || selectedProject.description}
                            </p>

                            {/* Tech Stack */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-dark-200 mb-2">Technologies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 bg-dark-800 text-dark-300 text-sm rounded-md"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex gap-4">
                                {selectedProject.liveUrl && (
                                    <a
                                        href={selectedProject.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Live
                                    </a>
                                )}
                                {selectedProject.githubUrl && (
                                    <a
                                        href={selectedProject.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-ghost flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                        View Code
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Voice Indicator */}
            <VoiceIndicator position="bottom-right" />
        </SectionLayout>
    );
}
