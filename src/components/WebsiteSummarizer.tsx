import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface WebsiteSummarizerProps {
    onBack: () => void;
}

export function WebsiteSummarizer({ onBack }: WebsiteSummarizerProps) {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSummarize = async () => {
        if (!url) return;

        setIsLoading(true);
        setError(null);
        setSummary(null);

        try {
            const response = await fetch('http://localhost:5001/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to summarize');
            }

            setSummary(data.summary);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Make sure the local server is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-[#1a1a1a] flex flex-col">
            {/* Header */}
            <div className="px-6 py-6 flex items-center gap-4 border-b border-white/10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <h1 className="text-white text-xl font-bold">Website Summarizer</h1>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {/* Input Section */}
                <div className="mb-8">
                    <label className="block text-white/60 text-sm mb-2">Website URL</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com/article"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 transition-all"
                        />
                    </div>
                    <motion.button
                        onClick={handleSummarize}
                        disabled={isLoading || !url}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`mt-4 w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${isLoading || !url
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-[#00d4ff] text-white hover:bg-[#00bce6]'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing Content...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Summarize with AI
                            </>
                        )}
                    </motion.button>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 mb-6"
                    >
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-red-200 text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Results Section */}
                {summary && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
                            <h2 className="text-white font-semibold">AI Summary</h2>
                        </div>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/80 leading-relaxed whitespace-pre-line">
                                {summary}
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function Sparkles(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M9 9h4" />
        </svg>
    );
}
