/**
 * Agent Service
 * 
 * connects to Google Cloud Conversational Agents (Dialogflow CX)
 * to process user queries and return responses.
 */

import { SessionsClient } from '@google-cloud/dialogflow-cx';
import { getConfig } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

// Cache client instance
let sessionsClient: SessionsClient | null = null;

function getClient(): SessionsClient {
    const config = getConfig();
    if (!sessionsClient) {
        sessionsClient = new SessionsClient({
            apiEndpoint: `${config.gcpLocation}-dialogflow.googleapis.com`,
        });
    }
    return sessionsClient;
}

export interface AgentResponse {
    sessionId: string;
    message: string;
    sources?: string[];
}

/**
 * Query the Agent
 */
export async function queryAgent(
    message: string,
    sessionId: string
): Promise<AgentResponse> {
    const config = getConfig();
    const client = getClient();

    // Construct session path
    const sessionPath = client.projectLocationAgentSessionPath(
        config.gcpProjectId,
        config.gcpLocation,
        config.gcpAgentId,
        sessionId
    );

    try {
        const [response] = await client.detectIntent({
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                },
                languageCode: 'en',
            },
        });

        const result = response.queryResult;
        const answer = result?.responseMessages?.[0]?.text?.text?.[0] || 'I am not sure how to respond to that.';

        // Extract sources if available (from data store response)
        // Note: Actual source extraction depends on how the Agent returns citations.
        const sources: string[] = [];
        const matchType = result?.match?.matchType as string;
        if (matchType === 'KNOWLEDGE_SEARCH' || matchType === 'KNOWLEDGE_CONNECTOR') {
            // In a real implementation, we would parse response.queryResult.match.knowledgeAnswers
            // to get citations. For MVP, we'll mark it as a portfolio source.
            sources.push('Portfolio Knowledge Base');
        }

        return {
            sessionId,
            message: answer,
            sources,
        };
    } catch (error) {
        console.error('❌ Agent query error:', error);
        throw error;
    }
}
