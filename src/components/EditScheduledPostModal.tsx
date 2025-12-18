import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditScheduledPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: string;
        content?: string;
        caption?: string;
        mediaUrl?: string;
        imageUrl?: string;
        platforms: string[];
        scheduledAt: string;
    } | null;
    onSave: (updatedPost: any) => Promise<void>;
}

export function EditScheduledPostModal({ isOpen, onClose, post, onSave }: EditScheduledPostModalProps) {
    const [caption, setCaption] = useState('');
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [scheduledDate, setScheduledDate] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (post) {
            setCaption(post.content || post.caption || '');
            setPlatforms(post.platforms || []);

            // Parse scheduled date/time
            const date = new Date(post.scheduledAt);
            setScheduledDate(date.toISOString().split('T')[0]);
            setScheduledTime(date.toTimeString().slice(0, 5));
        }
    }, [post]);

    // Hide scroll and header/footer when modal opens
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (!post) return null;

    const imageUrl = post.mediaUrl || post.imageUrl;

    const handlePlatformToggle = (platform: string) => {
        setPlatforms(prev =>
            prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);

            // Combine date and time
            const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);

            await onSave({
                id: post.id,
                content: caption,
                caption: caption,
                mediaUrl: imageUrl,
                imageUrl: imageUrl,
                platforms: platforms,
                scheduledAt: scheduledDateTime.toISOString()
            });
            onClose();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const platformConfig = {
        linkedin: { name: 'LinkedIn' },
        twitter: { name: 'X' },
        facebook: { name: 'Facebook' },
        instagram: { name: 'Instagram' }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1a1a1a] rounded-2xl max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/30"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
                            <h2 className="text-white font-semibold">Edit Post</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <X className="w-4 h-4 text-white/80" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-4">
                            {/* Image Preview */}
                            {imageUrl && (
                                <div className="rounded-xl overflow-hidden bg-black/20">
                                    <img src={imageUrl} alt="Post" className="w-full h-auto" />
                                </div>
                            )}

                            {/* Caption */}
                            <div>
                                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Caption
                                </label>
                                <textarea
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder-white/40 focus:border-[#00d4ff] focus:outline-none resize-none"
                                    rows={4}
                                    placeholder="Enter caption..."
                                />
                            </div>

                            {/* Platforms */}
                            <div>
                                <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                    Platforms
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.entries(platformConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            onClick={() => handlePlatformToggle(key)}
                                            className={`p-2 rounded-xl border text-sm font-medium transition-all ${platforms.includes(key)
                                                ? 'border-[#00d4ff] bg-[#00d4ff]/10 text-[#00d4ff]'
                                                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                                                }`}
                                        >
                                            {config.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#00d4ff] focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 block">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:border-[#00d4ff] focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 pb-4 flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isSaving}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving || platforms.length === 0}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#00d4ff] hover:bg-[#00b8e6] text-white font-semibold text-sm transition-all shadow-lg shadow-[#00d4ff]/30 disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save ✓'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
