import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { GoogleIcon } from './icons/GoogleIcon';
import { AppleIcon } from './icons/AppleIcon';

interface AuthScreenProps {
  onLoginClick?: () => void;
  onCreateAccountClick?: () => void;
}

export function AuthScreen({ onLoginClick, onCreateAccountClick }: AuthScreenProps = {}) {
  return (
    <div className="h-full w-full bg-[#1a1a1a] flex items-center justify-center px-6 py-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Glass-effect card */}
        <div
          className="rounded-3xl border border-white/20 backdrop-blur-xl p-8"
          style={{
            background: 'rgba(45, 45, 45, 0.1)',
          }}
        >
          {/* Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white text-center mb-8"
            style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: '1.2' }}
          >
            Welcome to the Future of Marketing
          </motion.h1>

          {/* Primary Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={onCreateAccountClick}
            className="w-full py-4 rounded-full bg-[#00d4ff] text-white transition-all hover:bg-[#00bce6] active:scale-95"
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            Create New Account
          </motion.button>

          {/* Secondary Button */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={onLoginClick}
            className="w-full py-4 rounded-full bg-transparent border-2 border-white text-white mt-4 transition-all hover:bg-white/10 active:scale-95"
            style={{
              fontSize: '1.125rem',
              fontWeight: 600,
            }}
          >
            Log In
          </motion.button>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center gap-4 my-8"
          >
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/60" style={{ fontSize: '0.875rem' }}>
              Or continue with
            </span>
            <div className="flex-1 h-px bg-white/20" />
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            <button
              className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/50 active:scale-95"
              aria-label="Continue with Google"
            >
              <GoogleIcon className="w-6 h-6" />
            </button>

            <button
              className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/50 active:scale-95"
              aria-label="Continue with Apple"
            >
              <AppleIcon className="w-6 h-6" />
            </button>

            <button
              className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center transition-all hover:bg-white/10 hover:border-white/50 active:scale-95"
              aria-label="Continue with Email"
            >
              <Mail className="w-6 h-6 text-white" />
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
