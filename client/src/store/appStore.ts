import { create } from 'zustand';
import { VoiceCommand } from '@shared/types';

/**
 * Application State Store
 * 
 * Manages global application state with a view state machine.
 * Supports: home → projects → project-detail, home → education, home → experience
 */

// View state machine
export type ViewState =
    | { view: 'home' }
    | { view: 'projects' }
    | { view: 'project-detail'; projectId: string }
    | { view: 'education' }
    | { view: 'experience' }
    | { view: 'contact' };

interface AppState {
    // Current view state
    viewState: ViewState;

    // Voice state
    isListening: boolean;
    isSpeaking: boolean;

    // Transcript from speech recognition
    currentTranscript: string;

    // Intro spoken flag
    hasSpokenIntro: boolean;

    // Actions
    setView: (view: ViewState) => void;
    goBack: () => void;
    goHome: () => void;
    showProjects: () => void;
    showProjectDetail: (projectId: string) => void;
    showEducation: () => void;
    showExperience: () => void;
    showContact: () => void;

    setListening: (listening: boolean) => void;
    setSpeaking: (speaking: boolean) => void;
    setTranscript: (transcript: string) => void;
    setHasSpokenIntro: (spoken: boolean) => void;

    // Process voice command
    processCommand: (command: VoiceCommand) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    viewState: { view: 'home' },
    isListening: false,
    isSpeaking: false,
    currentTranscript: '',
    hasSpokenIntro: false,

    // View navigation
    setView: (viewState) => set({ viewState }),

    goHome: () => set({ viewState: { view: 'home' } }),

    showProjects: () => set({ viewState: { view: 'projects' } }),

    showProjectDetail: (projectId) => set({ viewState: { view: 'project-detail', projectId } }),

    showEducation: () => set({ viewState: { view: 'education' } }),

    showExperience: () => set({ viewState: { view: 'experience' } }),

    showContact: () => set({ viewState: { view: 'contact' } }),

    // Go back based on current state
    goBack: () => {
        const { viewState } = get();

        switch (viewState.view) {
            case 'project-detail':
                set({ viewState: { view: 'projects' } });
                break;
            case 'projects':
            case 'education':
            case 'experience':
            case 'contact':
                set({ viewState: { view: 'home' } });
                break;
            default:
                // Already home, do nothing
                break;
        }
    },


    // Voice state setters
    setListening: (listening) => set({ isListening: listening }),
    setSpeaking: (speaking) => set({ isSpeaking: speaking }),
    setTranscript: (transcript) => set({ currentTranscript: transcript }),
    setHasSpokenIntro: (spoken) => set({ hasSpokenIntro: spoken }),

    // Process a parsed voice command
    processCommand: (command) => {
        const { goHome, showProjects, showEducation, goBack } = get();

        switch (command) {
            case VoiceCommand.GO_HOME:
                goHome();
                break;
            case VoiceCommand.SHOW_PROJECTS:
                showProjects();
                break;
            case VoiceCommand.SHOW_EDUCATION:
                showEducation();
                break;
            case VoiceCommand.GO_BACK:
                goBack();
                break;
            // ASK_AI and UNKNOWN are handled separately in VoiceCommandRouter
            default:
                break;
        }
    },
}));
