import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

/**
 * ExperienceOverlay Component
 * 
 * Displays work experience as a beautiful timeline overlay.
 * Glassmorphic design with particle sphere visible in background.
 */

// Real experience data from user's profile
const EXPERIENCE = [
    {
        id: 'genpact-lead',
        company: 'Genpact',
        role: 'Lead Consultant',
        type: 'Full-time',
        location: 'Bengaluru, Karnataka, India',
        period: 'Mar 2025 - Present',
        duration: '10 mos',
        workMode: 'Hybrid',
        icon: '🚀',
        description: 'Leading technical initiatives and consulting on enterprise solutions.',
        skills: ['C#', 'PHP', 'JavaScript'],
        isCurrent: true,
    },
    {
        id: 'genpact-senior',
        company: 'Genpact',
        role: 'Senior Associate',
        type: 'Full-time',
        location: 'Bengaluru, Karnataka, India',
        period: 'Jul 2022 - Present',
        duration: '3 yrs 6 mos',
        workMode: 'Hybrid',
        icon: '💼',
        description: 'Developing and maintaining web applications, working on front-end and back-end solutions.',
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        isCurrent: true,
    },
    {
        id: 'enquero',
        company: 'Enquero',
        role: 'Software Engineer Intern',
        type: 'Internship',
        location: 'Hyderabad, Telangana, India',
        period: 'Jan 2022 - Jul 2022',
        duration: '7 mos',
        icon: '💻',
        description: 'Gained hands-on experience in software development and engineering practices.',
        skills: ['Software Development', 'Engineering'],
        isCurrent: false,
    },
    {
        id: 'mettl',
        company: 'Mettl (Mercer)',
        role: 'Intern',
        type: 'Internship',
        location: 'India',
        period: 'Apr 2021 - Jun 2021',
        duration: '3 mos',
        icon: '🔬',
        description: 'Researched Augmented Reality applications for assessments. Created a working AR quiz in Unity.',
        skills: ['Unity', 'AR/VR', 'Research', 'C#'],
        isCurrent: false,
        highlights: [
            'Researched AR applications for assessments',
            'Built working AR Quiz prototype in Unity',
        ],
    },
];

const OTHER_ACTIVITIES = [
    {
        id: 'design-team',
        title: 'Designing Team Member',
        organization: 'College',
        icon: '🎨',
        description: 'Active member of the college designing team, creating visual content and graphics.',
    },
    {
        id: 'campus-life',
        title: 'Campus Life Member',
        organization: 'College',
        icon: '🎭',
        description: 'Engaged in campus life activities, organizing events and fostering community.',
    },
];


export default function ExperienceOverlay() {
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
                        💼 My Experience
                    </h1>
                    <p className="text-gray-300 text-lg drop-shadow">
                        Professional journey and responsibilities
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

                {/* Experience Cards */}
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Work Experience */}
                    {EXPERIENCE.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                            className={`p-6 rounded-2xl bg-white/5 border backdrop-blur-lg hover:bg-white/10 transition-all duration-300 ${exp.isCurrent ? 'border-green-400/30 hover:border-green-400/50' : 'border-white/10 hover:border-cyan-400/30'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${exp.isCurrent ? 'bg-green-500/20 border border-green-400/30' : 'bg-cyan-500/20 border border-cyan-400/30'
                                    }`}>
                                    {exp.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                                        {exp.isCurrent && (
                                            <span className="px-2 py-0.5 text-xs text-green-400 bg-green-400/20 rounded-full border border-green-400/30">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-lg text-cyan-400 font-medium">{exp.company}</p>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-400">
                                        <span>{exp.type}</span>
                                        <span>•</span>
                                        <span>{exp.duration}</span>
                                        {exp.workMode && (
                                            <>
                                                <span>•</span>
                                                <span>{exp.workMode}</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-1">{exp.location}</p>
                                </div>
                                <span className="px-3 py-1 text-xs text-gray-400 bg-white/5 rounded-full border border-white/10">
                                    {exp.period}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 mb-4">{exp.description}</p>

                            {/* Highlights (if any) */}
                            {exp.highlights && exp.highlights.length > 0 && (
                                <div className="mb-4">
                                    <ul className="space-y-2">
                                        {exp.highlights.map((highlight: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                <svg className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {exp.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 text-sm text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 rounded-lg"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                    ))}

                    {/* Other Activities Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.4 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">
                            🌟 Other Activities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {OTHER_ACTIVITIES.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 hover:border-purple-400/30 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{activity.icon}</span>
                                        <div>
                                            <h3 className="font-semibold text-white">{activity.title}</h3>
                                            <p className="text-sm text-purple-400">{activity.organization}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300">{activity.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
