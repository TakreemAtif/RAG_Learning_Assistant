import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { chatWithRAG } from '../api/client';

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your Computer Vision study assistant. Upload a chapter or book, and ask me anything about it.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatWithRAG(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center gap-2">
                <Sparkles className="text-accent w-5 h-5" />
                <h2 className="font-semibold text-white">Study Assistant</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-accent'
                            }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-blue-600/20 text-blue-100 rounded-tr-none'
                                : 'bg-slate-700/50 text-slate-100 rounded-tl-none'
                            }`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-slate-800 border-t border-slate-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your study material..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
