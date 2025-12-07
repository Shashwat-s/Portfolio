import { motion } from 'framer-motion';
import type { Project } from '@shared/types';

/**
 * ProjectCard Component
 * 
 * Displays a project with image, title, description, and tech stack.
 * Features glassmorphism styling and hover animations.
 */

interface ProjectCardProps {
    project: Project;
    onClick?: () => void;
    index?: number;
}

export default function ProjectCard({ project, onClick, index = 0 }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={onClick}
            className="glass-card overflow-hidden cursor-pointer card-hover group"
        >
            {/* Project Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-900/50 to-dark-800 overflow-hidden">
                {project.imageUrl ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-20">🚀</div>
                    </div>
                )}

                {/* Featured Badge */}
                {project.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-primary-500/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                        Featured
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {project.title}
                </h3>

                <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 bg-dark-800/80 text-dark-300 text-xs rounded-md"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-dark-800/80 text-dark-400 text-xs rounded-md">
                            +{project.technologies.length - 4}
                        </span>
                    )}
                </div>

                {/* Links */}
                {(project.liveUrl || project.githubUrl) && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-dark-700/50">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Live Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-dark-400 hover:text-dark-200 text-sm flex items-center gap-1 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                Code
                            </a>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
