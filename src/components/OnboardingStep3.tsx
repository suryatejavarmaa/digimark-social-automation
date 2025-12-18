import { useState } from 'react';
import { motion } from 'motion/react';
import { Instagram, Facebook, Linkedin, Twitter, ArrowLeft } from 'lucide-react';
import { StepIndicator } from './StepIndicator';

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
}

interface OnboardingStep3Props {
  onComplete?: (data: any) => void;
  onSkip?: () => void;
  onBack?: () => void;
}

export function OnboardingStep3({ onComplete, onSkip, onBack }: OnboardingStep3Props = {}) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E1306C', connected: false },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', connected: false },
    { id: 'twitter', name: 'X (Twitter)', icon: Twitter, color: '#000000', connected: false },
  ]);

  const toggleConnection = (platformId: string) => {
    setPlatforms(platforms.map(platform =>
      platform.id === platformId
        ? { ...platform, connected: !platform.connected }
        : platform
    ));
  };

  const handleComplete = () => {
    if (onComplete) {
      const connectedSocials = platforms
        .filter(p => p.connected)
        .map(p => p.id);

      onComplete({ connectedSocials });
    }
  };

  return (
    <div className="h-full w-full bg-[#101010] overflow-auto">
      <div className="min-h-full flex flex-col px-6 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 px-4"
        >
          <StepIndicator currentStep={3} totalSteps={3} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white mt-8 mb-2"
          style={{ fontSize: '2rem', fontWeight: 700 }}
        >
          Connect Channels
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/60 mb-8"
          style={{ fontSize: '0.9375rem' }}
        >
          Link your social accounts to publish content directly. You can also connect these later in Settings.
        </motion.p>

        {/* Platform Cards */}
        <div className="flex-1 mb-6">
          <div className="space-y-4">
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <motion.div
                  key={platform.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <div
                    className="rounded-2xl border border-white/20 backdrop-blur-xl p-5"
                    style={{
                      background: 'rgba(45, 45, 45, 0.1)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {/* Platform Info */}
                      <div className="flex items-center gap-4">
                        {/* Platform Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}10 100%)`,
                            border: `1px solid ${platform.color}40`,
                          }}
                        >
                          <Icon className="w-6 h-6" style={{ color: platform.color }} />
                        </div>

                        {/* Platform Name */}
                        <div>
                          <div className="text-white" style={{ fontSize: '1rem', fontWeight: 600 }}>
                            {platform.name}
                          </div>
                          {platform.connected && (
                            <div className="text-[#00d4ff] text-xs mt-0.5">
                              Connected
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => toggleConnection(platform.id)}
                        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${platform.connected
                          ? 'bg-[#00d4ff]'
                          : 'bg-white/10'
                          }`}
                        style={{
                          boxShadow: platform.connected
                            ? '0 4px 16px rgba(0, 212, 255, 0.4)'
                            : 'none',
                        }}
                      >
                        <motion.div
                          className="absolute top-1 w-6 h-6 rounded-full bg-white"
                          animate={{
                            left: platform.connected ? '30px' : '4px',
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
                          style={{
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3">
          {/* Complete Setup Button */}
          <motion.button
            onClick={handleComplete}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="w-full py-4 rounded-full bg-[#00d4ff] text-white transition-all hover:bg-[#00bce6] active:scale-95"
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            Complete Setup
          </motion.button>

          {/* Skip for now Button */}
          <motion.button
            onClick={onSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full py-3 text-white/60 hover:text-white transition-colors"
            style={{
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Skip for now
          </motion.button>
        </div>
      </div>
    </div>
  );
}
