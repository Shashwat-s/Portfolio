import { motion } from 'framer-motion';
import type { Education } from '@shared/types';

/**
 * EducationCard Component
 * 
 * Displays education information with a timeline-style layout.
 * Features institution name, degree, dates, and achievements.
 */

interface EducationCardProps {
    education: Education;
    onClick?: () => void;
    index?: number;
    isLast?: boolean;
}

export default function EducationCard({
    education,
    onClick,
    index = 0,
    isLast = false,
}: EducationCardProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
        }).format(new Date(date));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            onClick={onClick}
            className="relative pl-8 pb-8 cursor-pointer group"
        >
            {/* Timeline Line */}
            {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-900/30" />
            )}

            {/* Timeline Dot */}
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-dark-900 border-2 border-primary-500 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary-400 group-hover:bg-white transition-colors" />
            </div>

            {/* Card Content */}
            <div className="glass-card p-5 ml-4 card-hover">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                            {education.institution}
                        </h3>
                        <p className="text-primary-400 font-medium">
                            {education.degree} in {education.field}
                        </p>
                    </div>

                    {/* Date Badge */}
                    <div className="flex-shrink-0 px-3 py-1 bg-dark-800/80 rounded-full text-sm text-dark-300">
                        {formatDate(education.startDate)} — {education.endDate ? formatDate(education.endDate) : 'Present'}
                    </div>
                </div>

                {/* Description */}
                {education.description && (
                    <p className="text-dark-300 text-sm mb-4">
                        {education.description}
                    </p>
                )}

                {/* GPA */}
                {education.gpa && (
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-dark-400 text-sm">GPA:</span>
                        <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-sm rounded">
                            {education.gpa}
                        </span>
                    </div>
                )}

                {/* Achievements */}
                {education.achievements && education.achievements.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-dark-200">Achievements</h4>
                        <ul className="space-y-1">
                            {education.achievements.map((achievement, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                                    <svg className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {achievement}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
