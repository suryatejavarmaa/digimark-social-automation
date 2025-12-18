import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface PosterTemplatesProps {
    userId: string;
    companyName: string;
    companySummary: string;
    onTemplateSelect: (template: string) => void;
}

export function PosterTemplates({ userId, companyName, companySummary, onTemplateSelect }: PosterTemplatesProps) {
    const [templates, setTemplates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateTemplates();
    }, [userId, companyName, companySummary]);

    const generateTemplates = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/api/generate-poster-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    companyName,
                    companySummary,
                    count: 8
                })
            });

            const data = await response.json();
            if (data.templates && data.templates.length > 0) {
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error('Error generating poster templates:', error);
            // Fallback templates
            setTemplates([
                "Black Friday Sale Banner",
                "New Year Celebration",
                "Christmas Special Offer",
                "Product Launch Poster",
                "Grand Opening",
                "Festival Wishes",
                "Team Achievement",
                "Customer Testimonial"
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00d4ff]" />
                    <h4 className="text-white/60 text-sm font-medium">Quick Poster Ideas</h4>
                </div>
                <button
                    onClick={generateTemplates}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white/80 text-xs font-medium transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Templates as Horizontal Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {loading ? (
                    // Loading Skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 h-9 w-36 bg-white/5 rounded-full animate-pulse"
                        />
                    ))
                ) : (
                    templates.map((template, index) => (
                        <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onTemplateSelect(template)}
                            className="flex-shrink-0 px-4 py-2 bg-white/5 hover:bg-[#00d4ff]/10 border border-white/10 hover:border-[#00d4ff]/30 rounded-full text-white/70 hover:text-[#00d4ff] text-sm font-medium transition-all whitespace-nowrap"
                        >
                            {template}
                        </motion.button>
                    ))
                )}
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
