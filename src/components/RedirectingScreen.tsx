import { motion } from 'motion/react';
import { Linkedin, Twitter, Instagram, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface RedirectingScreenProps {
  platform?: 'linkedin' | 'twitter' | 'instagram';
  onComplete?: () => void;
}

export function RedirectingScreen({ platform = 'linkedin', onComplete }: RedirectingScreenProps) {
  const platformConfig = {
    linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
    twitter: { name: 'Twitter/X', icon: Twitter, color: '#1da1f2' },
    instagram: { name: 'Instagram', icon: Instagram, color: '#e4405f' },
  };

  const currentPlatform = platformConfig[platform];
  const PlatformIcon = currentPlatform.icon;

  useEffect(() => {
    // Simulate redirect completion after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }

      // Actual redirection logic
      let url = '';
      switch (platform) {
        case 'linkedin':
          url = 'https://www.linkedin.com/feed/';
          break;
        case 'twitter':
          url = 'https://twitter.com/compose/tweet';
          break;
        case 'instagram':
          url = 'https://www.instagram.com/';
          break;
        default:
          url = 'https://www.linkedin.com/feed/';
      }

      // Uncomment this line to enable actual redirection
      // window.location.href = url;
      console.log(`Redirecting to ${url}`);

    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete, platform]);

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow Effect */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Central Ripple Animation */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Outer Ripples */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2 border-[#00d4ff]"
            initial={{ width: 80, height: 80, opacity: 0.8 }}
            animate={{
              width: [80, 200, 280],
              height: [80, 200, 280],
              opacity: [0.8, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Center Circle with Platform Icon */}
        <motion.div
          className="relative w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#00d4ff] z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(0, 191, 255, 0.1) 100%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <PlatformIcon className="w-10 h-10 text-[#00d4ff]" />
        </motion.div>

        {/* Arrow Icon - Exit Symbol */}
        <motion.div
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#00d4ff] flex items-center justify-center z-20"
          animate={{
            y: [-2, -6, -2],
            x: [-2, 2, -2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ArrowUpRight className="w-5 h-5 text-[#1a1a1a]" />
        </motion.div>
      </div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center space-y-4 relative z-10"
      >
        {/* Main Status */}
        <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Opening {currentPlatform.name}...
        </h1>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-[#00d4ff]"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Sub-status with Checkmark */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-2 pt-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle2 className="w-5 h-5 text-[#00ff88]" />
          </motion.div>
          <p className="text-white/70" style={{ fontSize: '1rem' }}>
            Your caption has been copied to clipboard
          </p>
        </motion.div>
      </motion.div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
          Paste your caption in {currentPlatform.name}
        </p>
      </motion.div>
    </div>
  );
}
