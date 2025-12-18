import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { UserService } from '../services/UserService';

interface LoginFormProps {
  onBack: () => void;
  onLogin?: () => void;
}

export function LoginForm({ onBack, onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      await UserService.login(email, password);
      // Success! App.tsx auth listener will handle the rest (redirecting to dashboard)
      if (onLogin) onLogin();
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full w-full bg-[#101010] flex flex-col px-6 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        onClick={onBack}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </motion.button>

      {/* Content Container */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Frosted Glass Card */}
          <div
            className="rounded-3xl border border-white/20 backdrop-blur-xl p-8"
            style={{
              background: 'rgba(45, 45, 45, 0.1)',
            }}
          >
            {/* Header */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white text-center mb-8"
              style={{ fontSize: '2rem', fontWeight: 700 }}
            >
              Welcome Back
            </motion.h1>

            {/* Email/Username Field */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4"
            >
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6 relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 pr-12 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </motion.div>

            {/* Log In Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full py-4 rounded-full bg-[#00d4ff] text-white transition-all hover:bg-[#00bce6] active:scale-95 mb-4 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </motion.button>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <button className="text-white/60 hover:text-white/80 transition-colors" style={{ fontSize: '0.875rem' }}>
                Forgot Password?
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
