import { motion } from 'motion/react';

export function GeometricLogo() {
  return (
    <div className="relative w-32 h-32">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-[#00d4ff] opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-4 rounded-full bg-[#00d4ff] opacity-40 blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Geometric shapes */}
      <svg
        viewBox="0 0 128 128"
        className="relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon */}
        <motion.path
          d="M64 8 L96 26 L96 62 L64 80 L32 62 L32 26 Z"
          stroke="#00d4ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 8px #00d4ff)',
          }}
        />

        {/* Inner diamond */}
        <motion.path
          d="M64 36 L80 52 L64 68 L48 52 Z"
          fill="#00d4ff"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: 'easeOut',
          }}
          style={{
            transformOrigin: 'center',
            filter: 'drop-shadow(0 0 12px #00d4ff)',
          }}
        />

        {/* Connecting lines */}
        <motion.line
          x1="64"
          y1="8"
          x2="64"
          y2="36"
          stroke="#00d4ff"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: 'easeOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 6px #00d4ff)',
          }}
        />

        <motion.line
          x1="96"
          y1="26"
          x2="80"
          y2="52"
          stroke="#00d4ff"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{
            duration: 0.6,
            delay: 0.9,
            ease: 'easeOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 6px #00d4ff)',
          }}
        />

        <motion.line
          x1="32"
          y1="26"
          x2="48"
          y2="52"
          stroke="#00d4ff"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{
            duration: 0.6,
            delay: 1.0,
            ease: 'easeOut',
          }}
          style={{
            filter: 'drop-shadow(0 0 6px #00d4ff)',
          }}
        />

        {/* Pulsing center dot */}
        <motion.circle
          cx="64"
          cy="52"
          r="3"
          fill="#ffffff"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [1, 0.6, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            transformOrigin: 'center',
            filter: 'drop-shadow(0 0 8px #ffffff)',
          }}
        />
      </svg>
    </div>
  );
}
