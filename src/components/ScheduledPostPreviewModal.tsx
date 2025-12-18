import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface ScheduledPostPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        content?: string;
        caption?: string;
        mediaUrl?: string;
        imageUrl?: string;
        platforms?: string[];
        scheduledAt?: string;
    } | null;
}

export function ScheduledPostPreviewModal({ isOpen, onClose, post }: ScheduledPostPreviewModalProps) {
    if (!post) return null;

    const imageUrl = post.mediaUrl || post.imageUrl;
    const caption = post.content || post.caption || '';

    // Hide scroll when modal opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1a1a1a] rounded-2xl max-w-sm w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/30"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <h3 className="text-white font-semibold">Preview Post</h3>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                            >
                                <X className="w-4 h-4 text-white/80" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Image Preview */}
                            {imageUrl && (
                                <div className="rounded-xl overflow-hidden mb-4 bg-black/20">
                                    <img
                                        src={imageUrl}
                                        alt="Post preview"
                                        className="w-full h-auto"
                                    />
                                </div>
                            )}

                            {/* Caption Label */}
                            <div className="mb-2">
                                <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">
                                    CAPTION
                                </p>
                            </div>

                            {/* Caption Text */}
                            <div className="bg-white/5 rounded-xl p-3 mb-4 max-h-32 overflow-y-auto">
                                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                                    {caption}
                                </p>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-4 pb-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#00d4ff] hover:bg-[#00b8e6] text-white font-semibold text-sm transition-all shadow-lg shadow-[#00d4ff]/30 flex items-center justify-center gap-2"
                            >
                                Close ✓
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
