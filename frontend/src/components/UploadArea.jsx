import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadFile } from '../api/client';

const UploadArea = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    };

    const handleUpload = async (file) => {
        setUploading(true);
        setMessage(null);
        try {
            await uploadFile(file);
            setMessage({ type: 'success', text: `Successfully uploaded ${file.name}` });
            if (onUploadSuccess) onUploadSuccess();
        } catch (error) {
            setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            <motion.div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-accent bg-accent/10' : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.txt,.md"
                    onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                />

                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-slate-700 rounded-full">
                        {uploading ? (
                            <Loader className="w-8 h-8 text-blue-400 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-blue-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            {uploading ? 'Uploading...' : 'Upload Study Material'}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">
                            Drag & drop PDF or Text files here, or click to browse
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadArea;
