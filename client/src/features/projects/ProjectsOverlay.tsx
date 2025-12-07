import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import type { Project } from '@shared/types';

/**
 * ProjectsOverlay Component
 * 
 * Displays glassmorphic project cards over the particle sphere.
 * The sphere remains visible in the background.
 */

// Real projects data from portfolio-rag-data
const PROJECTS: Project[] = [
    {
        id: 'ai-portfolio',
        title: 'AI Portfolio',
        description: 'Immersive, voice-controlled portfolio with interactive 3D particle sphere and AI conversations.',
        longDescription: '12,000+ particles in a galaxy-like formation using Three.js. Voice control for navigation and questions powered by Google Conversational Agents. Particles respond to mouse movement and pulse when AI speaks.',
        technologies: ['React', 'TypeScript', 'Three.js', 'Google Cloud', 'Web Speech API', 'TailwindCSS'],
        featured: true,
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'aroh',
        title: 'Aroh - Rise With People Like You',
        description: 'Social platform for personal growth combining Instagram, Strava, Discord, Duolingo, and Notion.',
        longDescription: 'Fun onboarding in under 60 seconds. Social feed with photos, videos, voice posts. Custom reactions, Groups & Circles with streaks, Project Rooms for collaboration, and Journeys for visualizing growth.',
        technologies: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Socket.io', 'JWT'],
        featured: true,
        order: 2,
        githubUrl: 'https://github.com/Shashwat-s/Aroh',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'ai-wardrobe',
        title: 'AI Wardrobe',
        description: 'AI-powered virtual try-on application for clothes using your photos.',
        longDescription: 'Firebase authentication, profile management with full-body photos, wardrobe organization, AI virtual try-on using advanced VTON technology. Mobile-first responsive design.',
        technologies: ['React', 'Vite', 'Node.js', 'Firebase', 'Google Gemini AI', 'TailwindCSS'],
        featured: true,
        order: 3,
        githubUrl: 'https://github.com/Shashwat-s/ai-wardrobe',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'route-fly',
        title: 'Route-Fly',
        description: 'GPX-powered route visualization with cinematic flyover animations and video export.',
        longDescription: 'Convert running, cycling, or hiking paths into smooth flyover animations. 3D flyover with cinematic camera movement, HD video recording at 60 FPS, multiple export formats for Instagram and YouTube.',
        technologies: ['React', 'Vite', 'Maplibre GL', 'MediaRecorder API', 'Node.js', 'TailwindCSS'],
        featured: false,
        order: 4,
        githubUrl: 'https://github.com/Shashwat-s/Route-Fly',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'ai-interview',
        title: 'AI Interview App',
        description: 'AI-powered interview preparation and practice application.',
        longDescription: 'Practice interviews with AI-generated questions and feedback. Prepare for technical and behavioral interviews.',
        technologies: ['JavaScript', 'AI/ML'],
        featured: false,
        order: 5,
        githubUrl: 'https://github.com/Shashwat-s/ai-interview-app',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'slasher',
        title: 'Slasher',
        description: 'A React web application built with modern web technologies.',
        longDescription: 'Built with React, Vite, and TypeScript for optimal performance and developer experience.',
        technologies: ['React', 'Vite', 'TypeScript'],
        featured: false,
        order: 6,
        githubUrl: 'https://github.com/Shashwat-s/Slasher',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
];

export default function ProjectsOverlay() {
    const { showProjectDetail, goBack } = useAppStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20 overflow-y-auto"
        >
            {/* Very subtle backdrop - sphere stays visible */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 min-h-screen py-20 px-4 sm:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">My Projects</h1>
                    <p className="text-gray-300 text-lg drop-shadow">
                        Click on a project to learn more
                    </p>
                </motion.div>

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={goBack}
                    className="absolute top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </motion.button>

                {/* Projects Grid - Glassmorphic cards */}
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROJECTS.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 40, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                            onClick={() => showProjectDetail(project.id)}
                            className="group cursor-pointer"
                        >
                            <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/15 hover:border-cyan-400/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10">
                                {/* Featured badge */}
                                {project.featured && (
                                    <span className="inline-block px-3 py-1 mb-4 text-xs font-medium text-cyan-400 bg-cyan-400/20 rounded-full border border-cyan-400/30">
                                        ⭐ Featured
                                    </span>
                                )}

                                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                    {project.title}
                                </h3>

                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Tech stack */}
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.slice(0, 3).map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-1 text-xs text-cyan-300/80 bg-cyan-400/10 rounded border border-cyan-400/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.technologies.length > 3 && (
                                        <span className="px-2 py-1 text-xs text-gray-400 bg-white/5 rounded">
                                            +{project.technologies.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* GitHub link indicator */}
                                {project.githubUrl && (
                                    <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                        </svg>
                                        <span>View on GitHub</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
