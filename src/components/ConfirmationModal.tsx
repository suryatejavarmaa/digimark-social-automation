import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'warning' | 'success' | 'info' | 'danger';
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}: ConfirmationModalProps) {

    const icons = {
        warning: <AlertCircle className="w-12 h-12 text-yellow-400" />,
        danger: <AlertCircle className="w-12 h-12 text-red-400" />,
        success: <CheckCircle className="w-12 h-12 text-green-400" />,
        info: <Info className="w-12 h-12 text-blue-400" />
    };

    const buttonColors = {
        warning: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30',
        success: 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30',
        info: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30'
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

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
                        className="bg-[#2d2d2d] rounded-3xl max-w-md w-full border border-white/10 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="mb-4">
                                {icons[type]}
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2">
                                {title}
                            </h2>

                            <p className="text-white/60 text-sm">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 rounded-xl transition-all border border-white/10"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={`flex-1 font-semibold py-3 rounded-xl transition-all border ${buttonColors[type]}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Simple Alert Modal (for success/error messages)
interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

export function AlertModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info'
}: AlertModalProps) {
    const icons = {
        success: <CheckCircle className="w-12 h-12 text-green-400" />,
        error: <AlertCircle className="w-12 h-12 text-red-400" />,
        info: <Info className="w-12 h-12 text-blue-400" />
    };

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
                        className="bg-[#2d2d2d] rounded-3xl max-w-md w-full border border-white/10 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="mb-4">
                                {icons[type]}
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2">
                                {title}
                            </h2>

                            <p className="text-white/60 text-sm mb-6">
                                {message}
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-[#00d4ff] hover:bg-[#00b8e6] text-white font-semibold py-3 rounded-xl transition-all"
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
