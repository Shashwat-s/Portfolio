import { create } from 'zustand';
import { ChatMessage, ChatResponse } from '@shared/types';
import { sendChatMessage } from '@/lib/apiClient';
import { useAppStore } from '@/store/appStore';

/**
 * Chat State Store
 * 
 * Manages conversation history and API interactions for the AI chat feature.
 */

interface ChatState {
    // Conversation state
    messages: ChatMessage[];
    sessionId: string;

    // Loading state
    isLoading: boolean;
    error: string | null;

    // Panel visibility
    isPanelOpen: boolean;

    // Actions
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    sendMessage: (content: string) => Promise<ChatResponse | null>;
    clearMessages: () => void;
    togglePanel: () => void;
    setError: (error: string | null) => void;
}

// Generate a simple session ID
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Keywords that indicate user wants to see specific sections
const PROJECT_KEYWORDS = ['project', 'projects', 'what have you built', 'what did you build', 'show me your work', 'portfolio', 'your work'];
const EDUCATION_KEYWORDS = ['education', 'degree', 'university', 'college', 'school', 'study', 'studied', 'academic', 'cgpa', 'gpa'];
const EXPERIENCE_KEYWORDS = ['experience', 'job', 'intern', 'internship', 'career', 'company', 'employed', 'worked at'];
const CONTACT_KEYWORDS = ['contact', 'email', 'linkedin', 'github', 'reach', 'hire', 'connect', 'get in touch', 'phone', 'message'];

// Check if the message is asking about specific topics
const isProjectQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return PROJECT_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

const isEducationQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return EDUCATION_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

const isExperienceQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return EXPERIENCE_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

const isContactQuery = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    return CONTACT_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
};

export const useChatStore = create<ChatState>((set, get) => ({
    // Initial state
    messages: [],
    sessionId: generateSessionId(),
    isLoading: false,
    error: null,
    isPanelOpen: false,

    // Add a message to the conversation
    addMessage: (message) => {
        const newMessage: ChatMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            timestamp: new Date(),
        };
        set((state) => ({
            messages: [...state.messages, newMessage],
        }));
    },

    // Send a message to the AI and get a response
    sendMessage: async (content) => {
        const { sessionId, messages, addMessage, setError } = get();

        // Add user message
        addMessage({ role: 'user', content });

        // Check for topic-related queries and show corresponding overlays
        setTimeout(() => {
            if (isProjectQuery(content)) {
                useAppStore.getState().showProjects();
            } else if (isEducationQuery(content)) {
                useAppStore.getState().showEducation();
            } else if (isExperienceQuery(content)) {
                useAppStore.getState().showExperience();
            } else if (isContactQuery(content)) {
                useAppStore.getState().showContact();
            }
        }, 500); // Small delay so the AI response comes first

        // Set loading state
        set({ isLoading: true, error: null });


        try {
            // Prepare recent history (last 5 messages)
            const recentHistory = messages.slice(-5).map(({ role, content }) => ({
                role,
                content,
            }));

            // Send to API
            const response = await sendChatMessage({
                sessionId,
                message: content,
                history: recentHistory,
            });

            if (response.success && response.data) {
                // Add assistant response
                addMessage({ role: 'assistant', content: response.data.message });
                return response.data;
            } else {
                throw new Error(response.error || 'Failed to get response');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);

            // Add error as assistant message
            addMessage({
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
            });

            return null;
        } finally {
            set({ isLoading: false });
        }
    },

    // Clear all messages
    clearMessages: () => {
        set({
            messages: [],
            sessionId: generateSessionId(),
            error: null,
        });
    },

    // Toggle chat panel visibility
    togglePanel: () => {
        set((state) => ({ isPanelOpen: !state.isPanelOpen }));
    },

    // Set error state
    setError: (error) => set({ error }),
}));
