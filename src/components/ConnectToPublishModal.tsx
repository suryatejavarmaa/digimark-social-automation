import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Twitter, Instagram, AlertCircle, X } from 'lucide-react';

interface ConnectToPublishModalProps {
  isOpen: boolean;
  platform?: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
  onConnect: () => void;
  onCancel: () => void;
}

export function ConnectToPublishModal({
  isOpen,
  platform = 'linkedin',
  onConnect,
  onCancel,
}: ConnectToPublishModalProps) {
  const platformConfig = {
    linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
    twitter: { name: 'Twitter/X', icon: Twitter, color: '#1da1f2' },
    instagram: { name: 'Instagram', icon: Instagram, color: '#e4405f' },
    facebook: { name: 'Facebook', icon: Instagram, color: '#1877f2' },
  };

  const currentPlatform = platformConfig[platform];
  const PlatformIcon = currentPlatform.icon;

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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div
              className="w-full max-w-md rounded-3xl border border-white/20 backdrop-blur-xl p-8 relative"
              style={{
                background: 'rgba(30, 30, 30, 0.95)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onCancel}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              {/* Icon with Warning Badge */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Platform Icon Circle */}
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center border-2"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: currentPlatform.color,
                      boxShadow: `0 0 40px ${currentPlatform.color}40`,
                    }}
                  >
                    <PlatformIcon className="w-12 h-12 text-white" />
                  </div>

                  {/* Warning Badge */}
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-4 border-[#1e1e1e]"
                    style={{
                      boxShadow: '0 4px 20px rgba(251, 191, 36, 0.5)',
                    }}
                  >
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2
                className="text-white text-center mb-3"
                style={{ fontSize: '1.75rem', fontWeight: 700 }}
              >
                Connect Account to Post
              </h2>

              {/* Subtext */}
              <p
                className="text-white/70 text-center mb-8"
                style={{ fontSize: '1rem', lineHeight: '1.5' }}
              >
                You need to link your {currentPlatform.name} account to publish this content
                directly.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Primary Action - Connect Now & Post */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConnect}
                  className="w-full rounded-2xl bg-[#00d4ff] p-4 flex items-center justify-center gap-2 transition-all"
                >
                  <PlatformIcon className="w-5 h-5 text-[#1a1a1a]" />
                  <span className="text-[#1a1a1a]" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                    Connect Now & Post
                  </span>
                </motion.button>

                {/* Secondary Action - Cancel */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="w-full rounded-2xl bg-white/5 border border-white/20 p-4 flex items-center justify-center transition-all hover:bg-white/10"
                >
                  <span className="text-white/80" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Cancel
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
