import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sendMessage, SUGGESTED_QUESTIONS } from '../services/aiService.ts';

/**
 * AIChatPanel — Embedded chat interface for the Krishi Mitra AI assistant.
 * Renders as embedded content within a PageOverlay (not floating).
 * No emojis — uses styled typography and subtle indicators.
 */
const AIChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    // Focus input on mount
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 500);
    }, []);

    const handleSend = async (text) => {
        const messageText = text || inputValue.trim();
        if (!messageText || isLoading) return;

        const userMessage = { role: 'user', content: messageText };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendMessage(updatedMessages);

            if (response.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.error,
                    isError: true
                }]);
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.content,
                    reasoning_details: response.reasoning_details
                }]);
            }
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Something went wrong. Please try again.',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const showSuggestions = messages.length === 0 && !isLoading;

    return (
        <div className="embedded-chat">
            {/* Messages Area */}
            <div className="embedded-chat-messages">
                {/* Welcome */}
                {showSuggestions && (
                    <div className="chat-welcome">
                        <div className="chat-welcome-mark">K</div>
                        <h4 className="cinematic-font">Namaste, Kisan Bhai</h4>
                        <p>
                            I am your AI farming companion. Ask me about crops, weather patterns,
                            irrigation, pest management, or any agricultural challenge you face
                            in Haryana or Uttar Pradesh.
                        </p>
                        <div className="chat-suggestions">
                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                <button
                                    key={i}
                                    className="chat-suggestion-chip"
                                    onClick={() => handleSend(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Message Bubbles */}
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-ai'} ${msg.isError ? 'chat-message-error' : ''}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="chat-message-avatar">K</div>
                        )}
                        <div className="chat-message-bubble">
                            <div className="chat-message-content">
                                {formatMessage(msg.content)}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isLoading && (
                    <div className="chat-message chat-message-ai">
                        <div className="chat-message-avatar">K</div>
                        <div className="chat-message-bubble">
                            <div className="chat-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="embedded-chat-input-area">
                <div className="chat-input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        className="chat-input"
                        placeholder="Ask about crops, weather, or farming..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        className="chat-send-btn"
                        onClick={() => handleSend()}
                        disabled={!inputValue.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </div>
                <div className="chat-input-hint">
                    Powered by AI — Responses are advisory. Consult your local KVK for specific guidance.
                </div>
            </div>
        </div>
    );
};

/**
 * Formats AI response text into styled React elements.
 */
function formatMessage(content) {
    if (!content) return null;
    const paragraphs = content.split('\n');

    return paragraphs.map((para, i) => {
        if (!para.trim()) return <br key={i} />;

        if (para.trim().startsWith('•') || para.trim().startsWith('-') || para.trim().startsWith('*')) {
            return (
                <div key={i} className="chat-bullet">
                    {para.trim().replace(/^[•\-*]\s*/, '')}
                </div>
            );
        }

        const boldProcessed = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        if (boldProcessed !== para) {
            return <p key={i} dangerouslySetInnerHTML={{ __html: boldProcessed }} />;
        }

        return <p key={i}>{para}</p>;
    });
}

export default AIChatPanel;
