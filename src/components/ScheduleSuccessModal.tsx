import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Calendar, X } from 'lucide-react';

interface ScheduleSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    scheduledTime: string;
    platforms: string[];
}

export function ScheduleSuccessModal({ isOpen, onClose, scheduledTime, platforms }: ScheduleSuccessModalProps) {
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
                        className="bg-[#1a1a1a] rounded-3xl p-6 max-w-md w-full shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/30"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4 text-white/60" />
                        </button>

                        {/* Success Icon */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Post Scheduled!
                            </h2>
                            <p className="text-white/60 text-sm">
                                Your post has been successfully scheduled
                            </p>
                        </div>

                        {/* Schedule Details */}
                        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Calendar className="w-5 h-5 text-[#00d4ff]" />
                                <span className="text-white/40 text-xs font-medium uppercase tracking-wide">
                                    Scheduled For
                                </span>
                            </div>
                            <p className="text-white font-semibold text-lg">
                                {scheduledTime}
                            </p>
                        </div>

                        {/* Platforms */}
                        {platforms && platforms.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                                <span className="text-white/40 text-xs font-medium uppercase tracking-wide block mb-2">
                                    Platforms
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {platforms.map((platform) => (
                                        <span
                                            key={platform}
                                            className="px-3 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full text-[#00d4ff] text-xs font-medium capitalize"
                                        >
                                            {platform}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-[#00d4ff] hover:bg-[#00bce6] rounded-2xl text-white font-semibold transition-all"
                        >
                            Got it!
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
