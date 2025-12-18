import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

interface MultiPlatformFailureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry: (platform: string) => void;
    failedPlatforms: string[];
}

const platformIcons: Record<string, any> = {
    linkedin: Linkedin,
    twitter: Twitter,
    facebook: Facebook,
    instagram: Instagram
};

const platformNames: Record<string, string> = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter/X',
    facebook: 'Facebook',
    instagram: 'Instagram'
};

export function MultiPlatformFailureModal({
    isOpen,
    onClose,
    onRetry,
    failedPlatforms
}: MultiPlatformFailureModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#2d2d2d] rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Multi-Platform Posting Failed
                                    </h2>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>

                        {/* Message */}
                        <p className="text-white/60 mb-6 text-sm">
                            Unable to post to all platforms simultaneously. Try posting to platforms individually for better results.
                        </p>

                        {/* Platform List */}
                        <div className="space-y-3 mb-6">
                            <p className="text-white/40 text-xs font-medium uppercase tracking-wide mb-3">
                                Try Individual Platforms
                            </p>
                            {failedPlatforms.map((platformId) => {
                                const Icon = platformIcons[platformId];
                                const name = platformNames[platformId];

                                return (
                                    <button
                                        key={platformId}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 hover:border-[#00d4ff]/30 transition-all group"
                                        onClick={() => {
                                            onRetry(platformId);
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                                {Icon && <Icon className="w-5 h-5 text-white/60" />}
                                            </div>
                                            <span className="text-white font-medium">{name}</span>
                                        </div>
                                        <span className="text-[#00d4ff] font-semibold group-hover:translate-x-1 transition-transform">
                                            Try Now →
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Close Button */}
                        <button
                            className="w-full py-3 bg-white/5 rounded-2xl text-white/60 hover:bg-white/10 transition-all"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
