import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import ChatWindow from './components/ChatWindow';
import DiagramParser from './components/DiagramParser';
import EquationSolver from './components/EquationSolver';
import { BookOpen } from 'lucide-react';

function App() {
    const [activeTab, setActiveTab] = useState('chat');

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header className="text-center space-y-2 mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-accent">
                        Intro to Computer Vision
                    </h1>
                    <p className="text-slate-400 text-lg">
                        AI-Powered Study Companion & RAG System
                    </p>
                </header>

                {/* Navigation Tabs */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'chat'
                            ? 'bg-accent text-white shadow-lg shadow-accent/25'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        Chat with Docs
                    </button>
                    <button
                        onClick={() => setActiveTab('diagram')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'diagram'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        Analyze Diagrams
                    </button>
                    <button
                        onClick={() => setActiveTab('equation')}
                        className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'equation'
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        Solve Equations
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Upload Area */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold mb-4 text-white">Materials</h2>
                            <UploadArea />

                            <div className="mt-8">
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                                    Features
                                </h3>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                        Gemini 2.5 Flash Integration
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                        Context-Aware Answers
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                        PDF & Text Support
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {activeTab === 'chat' && <ChatWindow />}
                        {activeTab === 'diagram' && <DiagramParser />}
                        {activeTab === 'equation' && <EquationSolver />}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;
