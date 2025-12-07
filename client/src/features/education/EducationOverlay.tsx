import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

/**
 * EducationOverlay Component
 * 
 * Displays education history as a beautiful timeline overlay.
 * Glassmorphic design with particle sphere visible in background.
 */

// Real education data from portfolio-rag-data
const EDUCATION = [
    {
        id: 'btech',
        institution: 'SRM Institute of Science and Technology',
        location: 'Ramapuram, Chennai',
        degree: 'B.Tech',
        field: 'Computer Science',
        year: '2022',
        grade: '9.14 CGPA',
        icon: '🎓',
        highlights: [
            'Specialized in Computer Science and Engineering',
            'Strong foundation in algorithms and data structures',
            'Active in college designing team and campus life',
        ],
    },
    {
        id: 'intermediate',
        institution: 'St Stephen Sr. Sec. School',
        location: 'Chamba, HP Board',
        degree: 'Intermediate',
        field: '10+2 (Science)',
        year: '2016',
        grade: '86%',
        icon: '📚',
        highlights: [
            'Science stream with focus on Mathematics',
            'Strong academic performance',
        ],
    },
    {
        id: 'highschool',
        institution: 'Dayanand Anglo Vedic (DAV)',
        location: 'Chamba, CBSE',
        degree: 'High School',
        field: '10th Standard',
        year: '2014',
        grade: '9.0 CGPA',
        icon: '🏫',
        highlights: [
            'CBSE curriculum',
            'Excellent academic record',
        ],
    },
];

export default function EducationOverlay() {
    const { goBack } = useAppStore();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-20 overflow-y-auto"
        >
            {/* Subtle backdrop - sphere visible */}
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
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        🎓 My Education
                    </h1>
                    <p className="text-gray-300 text-lg drop-shadow">
                        My academic journey and achievements
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

                {/* Education Timeline */}
                <div className="max-w-3xl mx-auto">
                    {EDUCATION.map((edu, index) => (
                        <motion.div
                            key={edu.id}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ delay: 0.2 + index * 0.15, duration: 0.4 }}
                            className="relative pl-8 pb-12 last:pb-0"
                        >
                            {/* Timeline line */}
                            {index < EDUCATION.length - 1 && (
                                <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-cyan-900/30" />
                            )}

                            {/* Timeline dot */}
                            <div className="absolute left-0 top-2 w-6 h-6 rounded-full bg-black/50 border-2 border-cyan-500 flex items-center justify-center backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            </div>

                            {/* Card */}
                            <div className="ml-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300">
                                {/* Year badge */}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{edu.icon}</span>
                                    <span className="px-3 py-1 text-sm text-cyan-400 bg-cyan-400/20 rounded-full border border-cyan-400/30">
                                        {edu.year}
                                    </span>
                                    <span className="px-3 py-1 text-sm text-green-400 bg-green-400/20 rounded-full border border-green-400/30">
                                        {edu.grade}
                                    </span>
                                </div>

                                <h3 className="text-xl font-semibold text-white mb-1">
                                    {edu.institution}
                                </h3>
                                <p className="text-gray-400 text-sm mb-2">{edu.location}</p>
                                <p className="text-cyan-400 font-medium mb-4">
                                    {edu.degree} in {edu.field}
                                </p>

                                {edu.highlights && edu.highlights.length > 0 && (
                                    <ul className="space-y-2">
                                        {edu.highlights.map((highlight, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                <svg className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

