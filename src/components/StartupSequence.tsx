import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GeometricLogo } from './GeometricLogo';

interface StartupSequenceProps {
  onComplete?: () => void;
}

type SequenceState = 'logo' | 'loading' | 'complete';

export function StartupSequence({ onComplete }: StartupSequenceProps = {}) {
  const [sequenceState, setSequenceState] = useState<SequenceState>('logo');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // ==================== PHASE 1: LOGO ANIMATION ====================
  // Logo animates in, then after 1.5s we move to loading phase
  useEffect(() => {
    if (sequenceState === 'logo') {
      const timer = setTimeout(() => {
        setSequenceState('loading');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [sequenceState]);

  // ==================== PHASE 2: LOADING BAR ANIMATION ====================
  // Animate the loading bar from 0% to 100% over 2 seconds
  useEffect(() => {
    if (sequenceState === 'loading') {
      const duration = 2000; // 2 seconds
      const interval = 20; // Update every 20ms
      const steps = duration / interval;
      const increment = 100 / steps;
      
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += increment;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(progressInterval);
          // Move to complete phase
          setSequenceState('complete');
        }
        setLoadingProgress(currentProgress);
      }, interval);

      return () => clearInterval(progressInterval);
    }
  }, [sequenceState]);

  // ==================== PHASE 3: COMPLETE ====================
  // Once complete, notify parent to navigate to Auth
  useEffect(() => {
    if (sequenceState === 'complete' && onComplete) {
      // Small delay to show 100% before transitioning
      const timer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [sequenceState, onComplete]);

  return (
    <motion.div 
      className="h-full w-full bg-[#1a1a1a] flex flex-col items-center justify-center px-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* LOGO - Animates ONCE, then stays static */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GeometricLogo />
      </motion.div>
      
      {/* APP NAME - Animates ONCE with logo */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="mt-8 text-white tracking-wider"
        style={{ fontWeight: 700, fontSize: '2rem' }}
      >
        Digi Mark
      </motion.h1>

      {/* LOADING BAR - Only appears in 'loading' phase */}
      {(sequenceState === 'loading' || sequenceState === 'complete') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 w-64"
        >
          {/* Loading Bar Container */}
          <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            {/* Animated Progress Bar */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00d4ff] to-[#00bce6] rounded-full"
              style={{
                width: `${loadingProgress}%`,
              }}
              initial={{ width: '0%' }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Loading Text */}
          <motion.p
            className="text-white/60 text-center mt-4"
            style={{ fontSize: '0.875rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {loadingProgress < 100 ? 'Loading...' : 'Ready!'}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}
