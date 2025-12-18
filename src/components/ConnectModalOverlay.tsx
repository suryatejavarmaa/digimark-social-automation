import { motion } from 'motion/react';
import { Link2Off } from 'lucide-react';

interface ConnectModalOverlayProps {
    title: string;
    description: string;
    buttonText: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConnectModalOverlay({
    title,
    description,
    buttonText,
    onCancel,
    onConfirm,
}: ConnectModalOverlayProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop with blur */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative z-10 mx-6 w-full max-w-md"
            >
                <div
                    className="rounded-3xl border border-white/10 backdrop-blur-xl p-8"
                    style={{
                        background: 'rgba(26, 26, 26, 0.95)',
                    }}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                            <Link2Off className="w-10 h-10 text-[#00d4ff]" />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-center text-white mb-3" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        {title}
                    </h2>

                    {/* Description */}
                    <p className="text-center text-white/60 mb-8" style={{ fontSize: '1rem', lineHeight: 1.5 }}>
                        {description}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-4 rounded-xl bg-[#00d4ff] text-white hover:bg-[#00bce6] transition-all font-bold shadow-lg shadow-[#00d4ff]/20"
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
