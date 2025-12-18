import { motion, AnimatePresence } from 'motion/react';
import { Link2Off } from 'lucide-react';

interface ConnectionRequiredModalProps {
  platform?: string;
  isOpen: boolean;
  onConnect: () => void;
  onCancel: () => void;
}

export function ConnectionRequiredModal({
  platform = 'Instagram',
  isOpen,
  onConnect,
  onCancel,
}: ConnectionRequiredModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onCancel}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 25,
              }}
              className="w-full max-w-md rounded-3xl border-2 border-[#00d4ff] backdrop-blur-2xl p-8 relative"
              style={{
                background: 'rgba(25, 25, 25, 0.95)',
                boxShadow:
                  '0 0 60px rgba(0, 212, 255, 0.4), 0 20px 60px rgba(0, 0, 0, 0.6)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Broken Link Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                className="flex justify-center mb-6"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.2), rgba(244, 67, 54, 0.2))',
                  }}
                >
                  {/* Pulsing glow effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 87, 34, 0.3), transparent)',
                    }}
                  />
                  <Link2Off
                    className="w-10 h-10 relative z-10"
                    style={{ color: '#FF5722' }}
                  />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-white text-center mb-4"
                style={{ fontSize: '1.75rem', fontWeight: 700 }}
              >
                Connect {platform} to Post
              </motion.h2>

              {/* Body Text */}
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="text-white/70 text-center mb-8 leading-relaxed"
                style={{ fontSize: '0.9375rem' }}
              >
                You must link your business {platform} account before you can publish content to
                this channel.
              </motion.p>

              {/* Actions - Vertical Stack */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-3"
              >
                {/* Primary Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConnect}
                  className="w-full rounded-2xl bg-[#00d4ff] hover:bg-[#00bce6] p-4 flex items-center justify-center transition-all"
                  style={{
                    boxShadow:
                      '0 0 40px rgba(0, 212, 255, 0.5), 0 8px 24px rgba(0, 212, 255, 0.3)',
                  }}
                >
                  <span className="text-white" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    Connect {platform} Now
                  </span>
                </motion.button>

                {/* Secondary Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="w-full rounded-2xl bg-white/5 border border-white/20 p-4 flex items-center justify-center hover:bg-white/10 transition-all backdrop-blur-xl"
                >
                  <span className="text-white/80" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Cancel Selection
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
