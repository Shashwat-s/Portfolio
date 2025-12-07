import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

/**
 * ContactOverlay Component
 * 
 * Displays contact information with a beautiful floating card design.
 * Glassmorphic with smooth animations and clickable links.
 */

const CONTACT_INFO = {
    name: 'Shashwat Sharma',
    title: 'Software Developer',
    summary: 'I build intelligent, scalable, and user-focused applications. Always open to discussing new opportunities, collaborations, and innovative projects.',
    email: 'shashwatsharmahpcba@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shashwatsharma1999/',
    github: 'https://github.com/Shashwat-s',
    location: 'Bengaluru, Karnataka, India',
    availability: 'Open to full-time roles, freelance work, and collaboration on innovative technology projects.',
    preferredContact: 'Email or LinkedIn',
};

// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 },
    },
};

export default function ContactOverlay() {
    const { goBack } = useAppStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-20 flex items-center justify-center p-4 overflow-y-auto"
        >
            {/* Subtle backdrop - sphere visible */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30"
                onClick={goBack}
            />

            {/* Content Card */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10 w-full max-w-lg"
            >
                {/* Content - No card background */}
                <div className="p-8 pt-16">
                    {/* Back button - fixed to top left */}
                    <motion.button
                        variants={itemVariants}
                        onClick={goBack}
                        className="fixed top-6 left-6 flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 z-30"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </motion.button>
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-400/50">
                            <img
                                src="/photos/profile photo.png"
                                alt="Shashwat Sharma"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{CONTACT_INFO.name}</h1>
                        <p className="text-cyan-400 font-medium drop-shadow">{CONTACT_INFO.title}</p>
                        <p className="text-gray-300 text-sm mt-1 drop-shadow">📍 {CONTACT_INFO.location}</p>
                    </motion.div>

                    {/* Summary */}
                    <motion.p variants={itemVariants} className="text-gray-200 text-center mb-8 leading-relaxed max-w-md mx-auto drop-shadow">
                        {CONTACT_INFO.summary}
                    </motion.p>

                    {/* Contact Links */}
                    <motion.div variants={itemVariants} className="space-y-3 mb-8">
                        {/* Email */}
                        <a
                            href={`mailto:${CONTACT_INFO.email}`}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-cyan-400/30 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                📧
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-400">Email</p>
                                <p className="text-white font-medium">{CONTACT_INFO.email}</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href={CONTACT_INFO.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-blue-400/30 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                💼
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-400">LinkedIn</p>
                                <p className="text-white font-medium">shashwatsharma1999</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        {/* GitHub */}
                        <a
                            href={CONTACT_INFO.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-purple-400/30 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                🐙
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-400">GitHub</p>
                                <p className="text-white font-medium">Shashwat-s</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </motion.div>

                    {/* Availability Badge */}
                    <motion.div variants={itemVariants} className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            <span className="text-green-400 text-sm font-medium">Available for opportunities</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-2 drop-shadow">
                            Preferred: {CONTACT_INFO.preferredContact}
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
