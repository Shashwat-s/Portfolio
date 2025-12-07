import { AnimatePresence } from 'framer-motion';
import ParticleSphere from './components/ParticleSphere';
import AIIntro from './features/home/AIIntro';
import ProjectsOverlay from './features/projects/ProjectsOverlay';
import ProjectDetailOverlay from './features/projects/ProjectDetailOverlay';
import EducationOverlay from './features/education/EducationOverlay';
import ExperienceOverlay from './features/experience/ExperienceOverlay';
import ContactOverlay from './features/contact/ContactOverlay';
import VoiceController from './features/voice/VoiceController';
import ChatPanel from './features/chat/ChatPanel';
import { useAppStore } from './store/appStore';

/**
 * Main Application Component - Single Canvas Architecture
 * 
 * The particle sphere is ALWAYS rendered as the base layer.
 * Content (projects, education) animates in/out as overlays.
 * Voice is the primary interaction method.
 */
function App() {
    const viewState = useAppStore((state) => state.viewState);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
            {/* Base Layer: Particle Sphere - Always visible */}
            <ParticleSphere />

            {/* Home Layer: AI Intro text when at home */}
            <AnimatePresence>
                {viewState.view === 'home' && <AIIntro />}
            </AnimatePresence>

            {/* Content Overlays */}
            <AnimatePresence mode="wait">
                {viewState.view === 'projects' && <ProjectsOverlay />}
                {viewState.view === 'project-detail' && (
                    <ProjectDetailOverlay projectId={viewState.projectId} />
                )}
                {viewState.view === 'education' && <EducationOverlay />}
                {viewState.view === 'experience' && <ExperienceOverlay />}
                {viewState.view === 'contact' && <ContactOverlay />}
            </AnimatePresence>

            {/* Voice Controller - Always active */}
            <VoiceController />

            {/* Chat Panel - Optional overlay */}
            <ChatPanel />
        </div>
    );
}

export default App;
