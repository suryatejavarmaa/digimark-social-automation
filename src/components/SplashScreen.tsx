import { motion } from 'motion/react';
import { GeometricLogo } from './GeometricLogo';

export function SplashScreen() {
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
    </div>
  );
}
