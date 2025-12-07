import SectionLayout from '@/components/SectionLayout';
import EducationCard from '@/components/EducationCard';
import VoiceIndicator from '@/components/VoiceIndicator';
import type { Education } from '@shared/types';

/**
 * EducationScreen Component
 * 
 * Displays education history in a timeline format.
 */

// Mock data for MVP - will be replaced with Firestore data
const MOCK_EDUCATION: Education[] = [
    {
        id: '1',
        institution: 'Stanford University',
        degree: 'Master of Science',
        field: 'Computer Science',
        startDate: new Date('2022-09-01'),
        endDate: new Date('2024-06-01'),
        description: 'Focused on Artificial Intelligence and Machine Learning. Conducted research on natural language processing and conversational AI systems.',
        achievements: [
            'GPA: 3.9/4.0',
            'Published research on conversational AI at EMNLP',
            "Dean's List all quarters",
            'Teaching Assistant for CS229 Machine Learning',
        ],
        gpa: '3.9',
        order: 1,
    },
    {
        id: '2',
        institution: 'Indian Institute of Technology (IIT)',
        degree: 'Bachelor of Technology',
        field: 'Computer Science and Engineering',
        startDate: new Date('2018-07-01'),
        endDate: new Date('2022-05-01'),
        description: 'Comprehensive foundation in computer science with emphasis on algorithms, data structures, and software engineering principles.',
        achievements: [
            'Graduated with First Class Honors',
            'Led the Coding Club for 2 years',
            'Won ACM-ICPC Regional Programming Contest',
            'Summer internship at Google',
        ],
        gpa: '8.7/10',
        order: 2,
    },
    {
        id: '3',
        institution: 'Delhi Public School',
        degree: 'High School Diploma',
        field: 'Science Stream (PCM)',
        startDate: new Date('2016-04-01'),
        endDate: new Date('2018-03-01'),
        description: 'Focused on Physics, Chemistry, and Mathematics. Active participation in science olympiads and coding competitions.',
        achievements: [
            'School topper in Mathematics',
            'National Science Olympiad Gold Medalist',
            'Started coding at age 15',
        ],
        order: 3,
    },
];

export default function EducationScreen() {
    return (
        <SectionLayout
            title="Education"
            subtitle="My academic journey"
        >
            {/* Timeline */}
            <div className="max-w-3xl mx-auto">
                {MOCK_EDUCATION.map((education, index) => (
                    <EducationCard
                        key={education.id}
                        education={education}
                        index={index}
                        isLast={index === MOCK_EDUCATION.length - 1}
                    />
                ))}
            </div>

            {/* Voice Indicator */}
            <VoiceIndicator position="bottom-right" />
        </SectionLayout>
    );
}
