import { VoiceCommand, ParsedCommand } from '@shared/types';

/**
 * Command Parser
 * 
 * Converts raw text (from speech recognition or text input) into structured
 * commands that the application can act upon.
 * 
 * This abstracts the natural language processing so we can later enhance it
 * with more sophisticated NLP or move it to the backend.
 */

// Navigation patterns - order matters (more specific first)
const NAVIGATION_PATTERNS: Array<{ patterns: RegExp[]; command: VoiceCommand }> = [
    {
        command: VoiceCommand.SHOW_PROJECTS,
        patterns: [
            /\b(show|display|view|go to|open|see)\s*(my\s+)?projects?\b/i,
            /\bprojects?\s*(page|section|view)\b/i,
            /\bwhat\s+.*projects\b/i,
            /\btell\s+me\s+about\s+(your|the)?\s*projects?\b/i,
        ],
    },
    {
        command: VoiceCommand.SHOW_EDUCATION,
        patterns: [
            /\b(show|display|view|go to|open|see)\s*(my\s+)?education\b/i,
            /\beducation\s*(page|section|view|background)\b/i,
            /\btell\s+me\s+about\s+(your|the)?\s*education\b/i,
            /\b(where|what)\s+did\s+you\s+(study|go\s+to\s+school)\b/i,
            /\b(university|college|degree|school)\b/i,
        ],
    },
    {
        command: VoiceCommand.SHOW_EXPERIENCE,
        patterns: [
            /\b(show|display|view|go to|open|see)\s*(my\s+)?experience\b/i,
            /\bexperience\s*(page|section|view)\b/i,
            /\b(work|job|career)\s*(history|experience)?\b/i,
            /\btell\s+me\s+about\s+(your|the)?\s*(work\s+)?experience\b/i,
            /\bwhere\s+have\s+you\s+worked\b/i,
        ],
    },
    {
        command: VoiceCommand.GO_HOME,
        patterns: [
            /\b(go\s+)?(back\s+)?home\b/i,
            /\b(go\s+to\s+|show\s+)?main\s*(page|screen)?\b/i,
            /\bstart\s*over\b/i,
            /\breset\b/i,
        ],
    },
    {
        command: VoiceCommand.GO_BACK,
        patterns: [
            /\bgo\s*back\b/i,
            /\bback\b/i,
            /\breturn\b/i,
            /\bprevious\b/i,
            /\bundo\b/i,
        ],
    },
];

/**
 * Parse raw text into a structured command
 */
export function parseCommand(text: string): ParsedCommand {
    const normalizedText = text.trim().toLowerCase();

    // Check for navigation commands
    for (const { patterns, command } of NAVIGATION_PATTERNS) {
        for (const pattern of patterns) {
            if (pattern.test(normalizedText)) {
                return {
                    type: command,
                    originalText: text,
                };
            }
        }
    }

    // If no navigation command matched, treat as AI question
    // Look for question-like patterns
    const isQuestion =
        /^(what|who|how|why|when|where|tell|explain|describe|can you|could you|would you)/i.test(normalizedText) ||
        normalizedText.endsWith('?') ||
        normalizedText.length > 10; // Longer inputs are likely questions

    if (isQuestion) {
        return {
            type: VoiceCommand.ASK_AI,
            originalText: text,
            query: text,
        };
    }

    // Default to unknown
    return {
        type: VoiceCommand.UNKNOWN,
        originalText: text,
    };
}

/**
 * Check if a command is a navigation command
 */
export function isNavigationCommand(command: VoiceCommand): boolean {
    return [
        VoiceCommand.GO_HOME,
        VoiceCommand.SHOW_PROJECTS,
        VoiceCommand.SHOW_EDUCATION,
        VoiceCommand.SHOW_EXPERIENCE,
        VoiceCommand.GO_BACK,
    ].includes(command);
}

/**
 * Get a friendly description of a command
 */
export function getCommandDescription(command: VoiceCommand): string {
    const descriptions: Record<VoiceCommand, string> = {
        [VoiceCommand.GO_HOME]: 'Going home',
        [VoiceCommand.SHOW_PROJECTS]: 'Showing projects',
        [VoiceCommand.SHOW_EDUCATION]: 'Showing education',
        [VoiceCommand.SHOW_EXPERIENCE]: 'Showing experience',
        [VoiceCommand.GO_BACK]: 'Going back',
        [VoiceCommand.ASK_AI]: 'Asking AI',
        [VoiceCommand.UNKNOWN]: 'Unknown command',
    };
    return descriptions[command];
}
