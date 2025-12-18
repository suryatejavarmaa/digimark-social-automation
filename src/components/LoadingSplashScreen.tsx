import { motion } from 'motion/react';
import { GeometricLogo } from './GeometricLogo';

export function LoadingSplashScreen() {
  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <GeometricLogo />
      </motion.div>
      
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        className="mt-8 text-white tracking-wider"
        style={{ fontWeight: 700, fontSize: '2rem' }}
      >
        Digi Mark
      </motion.h1>

      {/* Loading Progress Bar */}
      <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden relative">
        {/* Glow effect background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-30 blur-xl"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Progress bar */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] rounded-full"
          style={{
            boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff80',
          }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </div>

      {/* Initializing text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mt-4 text-white/60 tracking-wide"
        style={{ fontSize: '0.875rem' }}
      >
        Initializing System...
      </motion.p>
    </div>
  );
}
