import React, { useState, useRef } from 'react';
import { Upload, FileImage, Loader2, AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const DiagramParser = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleClear = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleParse = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/parse-diagram', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data.explanation);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to parse diagram. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-xl h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                    </div>
                    Diagram Parser
                </h2>
                {file && (
                    <button
                        onClick={handleClear}
                        className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700/50 rounded-full"
                        title="Clear"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-6 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                    {!preview ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center hover:border-purple-400 hover:bg-slate-700/20 transition-all cursor-pointer relative group flex-1 flex flex-col items-center justify-center min-h-[200px]"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="bg-slate-700/50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-purple-400" />
                            </div>
                            <p className="text-lg font-medium text-slate-200 mb-1">Upload Diagram</p>
                            <p className="text-sm text-slate-400">Drag & drop or click to browse</p>
                            <p className="text-xs text-slate-500 mt-4">Supports PNG, JPG, WEBP</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg group"
                        >
                            <img src={preview} alt="Preview" className="w-full h-64 object-cover object-center" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Click 'Parse' to analyze</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleParse}
                    disabled={!file || loading}
                    className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg
                        ${!file || loading
                            ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Analyzing Diagram...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Parse Diagram
                        </>
                    )}
                </button>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>{error}</div>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden flex-1 flex flex-col min-h-[300px]"
                        >
                            <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-700/50 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <h3 className="font-semibold text-slate-200">Analysis Result</h3>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[500px] prose prose-invert prose-sm max-w-none custom-scrollbar">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiagramParser;
