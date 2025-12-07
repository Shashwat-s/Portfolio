import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import type { Project } from '@shared/types';

/**
 * ProjectDetailOverlay Component
 * 
 * Full detail view for a single project.
 * Glassmorphic design with sphere visible in background.
 */

// Real projects data from portfolio-rag-data (matching ProjectsOverlay)
const PROJECTS: Project[] = [
    {
        id: 'ai-portfolio',
        title: 'AI Portfolio',
        description: 'Immersive, voice-controlled portfolio with interactive 3D particle sphere and AI conversations.',
        longDescription: '12,000+ particles in a galaxy-like formation using Three.js. Voice control for navigation and questions powered by Google Conversational Agents. Particles respond to mouse movement and pulse when AI speaks. Single-canvas architecture with smooth overlay transitions.',
        technologies: ['React', 'TypeScript', 'Three.js', 'Google Cloud', 'Web Speech API', 'TailwindCSS', 'Framer Motion', 'Zustand'],
        featured: true,
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
    {
        id: 'aroh',
        title: 'Aroh - Rise With People Like You',
        description: 'Social platform for personal growth combining Instagram, Strava, Discord, Duolingo, and Notion.',
        longDescription: 'Fun onboarding completed in under 60 seconds with tap-based selections. Social feed with photo, video, text, and voice posts. Custom reactions: ✊ Respect, 🔥 Hype, 🚀 Boost, ❤️ Support. Groups & Circles with daily check-ins and streaks. Project Rooms for goal collaboration with task boards. Journeys - visual timelines of personal growth. Gamification with streaks, badges, and progress stats.',
        technologies: ['React Native', 'Expo', 'Expo Router', 'Node.js', 'Express.js', 'MongoDB', 'Socket.io', 'JWT', 'Zustand'],
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
        longDescription: 'User authentication with Firebase (Google Sign-in and Email/Password). Profile management with full-body photo uploads. Wardrobe management for organizing topwear and bottomwear. AI virtual try-on using advanced VTON technology. Mobile-first responsive design. Outfit saving and management. Real-time preview when selecting clothing items.',
        technologies: ['React 18', 'Vite', 'TailwindCSS', 'React Router', 'Node.js', 'Express', 'Google Gemini AI', 'Firebase', 'Sharp'],
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
        longDescription: 'GPX file upload from any source (Strava, Garmin, etc.). 3D flyover animation with cinematic camera movement. High-speed playback adjustable from 50x to 500x. HD video recording at 60 FPS, 12 Mbps. Multiple export formats: 9:16 (Instagram) or 16:9 (YouTube). Free OpenStreetMap tiles (no API keys required). Tile preloading to prevent black boxes during recording.',
        technologies: ['React 18', 'Vite', 'TailwindCSS', 'Maplibre GL', 'MediaRecorder API', 'Node.js', 'Express', 'gpxparser'],
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
        longDescription: 'Practice interviews with AI-generated questions and real-time feedback. Prepare for technical and behavioral interviews with personalized questions based on your resume and target role.',
        technologies: ['JavaScript', 'AI/ML', 'Web Speech API'],
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
        longDescription: 'Built with React, Vite, and TypeScript for optimal performance and developer experience. Features modern build tooling and best practices.',
        technologies: ['React', 'Vite', 'TypeScript'],
        featured: false,
        order: 6,
        githubUrl: 'https://github.com/Shashwat-s/Slasher',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
    },
];

interface ProjectDetailOverlayProps {
    projectId: string;
}

export default function ProjectDetailOverlay({ projectId }: ProjectDetailOverlayProps) {
    const { goBack } = useAppStore();

    const project = PROJECTS.find(p => p.id === projectId);

    if (!project) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-30 flex items-center justify-center"
            >
                <p className="text-white">Project not found</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 flex items-center justify-center p-4 overflow-y-auto"
        >
            {/* Subtle backdrop - sphere visible */}
            <div
                className="absolute inset-0 bg-black/40"
                onClick={goBack}
            />

            {/* Content Card - Glassmorphic */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
                className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-8"
            >
                {/* Close button - sticky so it's always visible */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goBack();
                    }}
                    className="sticky top-0 float-right z-50 text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>


                {/* Header */}
                <div className="mb-6">
                    {project.featured && (
                        <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-cyan-400 bg-cyan-400/20 rounded-full border border-cyan-400/30">
                            ⭐ Featured Project
                        </span>
                    )}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        {project.title}
                    </h1>
                    <p className="text-lg text-gray-300">
                        {project.description}
                    </p>
                </div>

                {/* Description */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">About</h2>
                    <p className="text-gray-300 leading-relaxed">
                        {project.longDescription}
                    </p>
                </div>

                {/* Technologies */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-white mb-3">Technologies Used</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 text-sm text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 rounded-lg"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                    <div className="flex flex-wrap gap-4">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-medium rounded-xl transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                View on GitHub
                            </a>
                        )}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
