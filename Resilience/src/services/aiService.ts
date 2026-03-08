/**
 * AI Service Module — Client-side interface to the backend chat API.
 * 
 * Calls the Express backend at /api/chat which proxies to OpenRouter
 * and persists conversations in MongoDB. The API key never touches the client.
 */

// ─── Type Definitions ────────────────────────────────────────────────────────

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    reasoning_details?: unknown;
}

export interface AIResponse {
    content: string;
    reasoning_details?: unknown;
    error?: string;
}

// ─── Session Management ──────────────────────────────────────────────────────

function getSessionId(): string {
    let id = sessionStorage.getItem('krishi_session');
    if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem('krishi_session', id);
    }
    return id;
}

// ─── Service Functions ───────────────────────────────────────────────────────

/**
 * Sends the conversation to the backend for AI processing.
 * The backend handles the OpenRouter API call and MongoDB persistence.
 */
export async function sendMessage(conversationHistory: ChatMessage[]): Promise<AIResponse> {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: conversationHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    ...(msg.reasoning_details ? { reasoning_details: msg.reasoning_details } : {})
                })),
                sessionId: getSessionId()
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            return {
                content: '',
                error: err.error || `Service temporarily unavailable (${response.status}). Please try again.`
            };
        }

        const result = await response.json();

        if (result.error) {
            return { content: '', error: result.error };
        }

        return {
            content: result.content || '',
            reasoning_details: result.reasoning_details
        };

    } catch (error) {
        console.error('[AI Service] Network error:', error);
        return {
            content: '',
            error: 'Unable to reach the AI service. Please check your connection and try again.'
        };
    }
}

/**
 * Suggested questions for quick-start interaction.
 */
export const SUGGESTED_QUESTIONS: string[] = [
    'Which crops should I plant this season in Haryana?',
    'How will changing rainfall affect my wheat crop?',
    'What are climate-resilient farming practices?',
    'Best irrigation strategy during drought?',
    'How to protect crops from rising temperatures?',
    'What government schemes are available for farmers?'
];
