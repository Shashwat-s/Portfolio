import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * SectionLayout Component
 * 
 * Wrapper layout for section pages (projects, education, etc.)
 * Provides consistent styling, navigation, and page transitions.
 */

interface SectionLayoutProps {
    /** Page title */
    title: string;
    /** Optional subtitle */
    subtitle?: string;
    /** Page content */
    children: ReactNode;
    /** Show back button */
    showBack?: boolean;
}

export default function SectionLayout({
    title,
    subtitle,
    children,
    showBack = true,
}: SectionLayoutProps) {
    const navigate = useNavigate();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen bg-dark-950"
            >
                {/* Background Gradient */}
                <div className="fixed inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-950 -z-10" />
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent -z-10" />

                {/* Header */}
                <header className="sticky top-0 z-40 backdrop-blur-md bg-dark-950/80 border-b border-dark-800/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            {/* Back Button */}
                            {showBack && (
                                <motion.button
                                    onClick={() => navigate('/')}
                                    whileHover={{ x: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span className="text-sm font-medium">Back</span>
                                </motion.button>
                            )}

                            {/* Title */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center flex-1"
                            >
                                <h1 className="text-2xl font-display font-bold text-white">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-sm text-dark-400 mt-1">{subtitle}</p>
                                )}
                            </motion.div>

                            {/* Spacer for centering */}
                            {showBack && <div className="w-16" />}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </motion.div>
        </AnimatePresence>
    );
}
