import { useState } from 'react';
import { motion } from 'motion/react';
import { ConnectToPublishModal } from './ConnectToPublishModal';

export function ConnectModalDemo() {
  const [showModal, setShowModal] = useState(true);
  const [platform, setPlatform] = useState<'linkedin' | 'twitter' | 'instagram'>('linkedin');

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Connect to Publish Modal
        </h1>
        <p className="text-white/70" style={{ fontSize: '1rem' }}>
          This modal appears when users try to post without connecting their account first.
        </p>

        {/* Platform Selection */}
        <div className="space-y-3">
          <p className="text-white/60" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
            Select Platform:
          </p>
          <div className="flex gap-3 justify-center">
            {(['linkedin', 'twitter', 'instagram'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  platform === p
                    ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                    : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                }`}
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="rounded-2xl bg-[#00d4ff] px-8 py-4 transition-all"
        >
          <span className="text-[#1a1a1a]" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            Show Modal
          </span>
        </motion.button>
      </div>

      {/* Modal */}
      <ConnectToPublishModal
        isOpen={showModal}
        platform={platform}
        onConnect={() => {
          console.log('Connected to', platform);
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
