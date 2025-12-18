import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface RedirectingImageProps {
  platform?: string;
  imageUrl?: string;
}

export function RedirectingImage({
  platform = 'Instagram',
  imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
}: RedirectingImageProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate redirect completion logic
    const timer = setTimeout(() => {
      setIsComplete(true);

      // Actual redirection logic
      let url = '';
      const targetPlatform = platform.toLowerCase();

      if (targetPlatform.includes('instagram')) {
        url = 'https://www.instagram.com/';
      } else if (targetPlatform.includes('twitter') || targetPlatform.includes('x')) {
        url = 'https://twitter.com/compose/tweet';
      } else if (targetPlatform.includes('linkedin')) {
        url = 'https://www.linkedin.com/feed/';
      } else {
        url = 'https://www.instagram.com/';
      }

      // Uncomment this line to enable actual redirection
      // window.location.href = url;
      console.log(`Redirecting to ${url}`);

    }, 3000);
    return () => clearTimeout(timer);
  }, [platform]);

  // The specific neon cyan color from the reference image
  const cyanColor = '#00d4ff';

  return (
    <div className="h-full w-full bg-[#1a1a1a] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background subtle radial glow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, ${cyanColor}15 0%, transparent 70%)`,
        }}
      />

      {/* Central Animation Container */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Outer Ripples - Circular to match reference */}
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-full border-2"
            style={{ borderColor: cyanColor }}
            initial={{ width: 100, height: 100, opacity: 0.8 }}
            animate={{
              width: [100, 240, 320],
              height: [100, 240, 320],
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

        {/* Center Circular Container with Image */}
        <motion.div
          // Changed to rounded-full for perfect circle
          className="relative w-24 h-24 rounded-full flex items-center justify-center border-2 z-10 overflow-hidden"
          style={{
            borderColor: cyanColor,
            background: `linear-gradient(135deg, ${cyanColor}33 0%, ${cyanColor}1a 100%)`,
            // intense glow based on reference image
            boxShadow: `0 0 60px ${cyanColor}99, inset 0 0 30px ${cyanColor}33`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            boxShadow: [
              `0 0 60px ${cyanColor}99, inset 0 0 30px ${cyanColor}33`,
              `0 0 80px ${cyanColor}cc, inset 0 0 40px ${cyanColor}4d`,
              `0 0 60px ${cyanColor}99, inset 0 0 30px ${cyanColor}33`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src={imageUrl}
            alt="Generated Content"
            // object-cover ensures the image fills the circle perfectly
            className="w-full h-full object-cover opacity-90"
          />
          {/* Cyan overlay to blend image into theme */}
          <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: `${cyanColor}20` }} />
        </motion.div>

        {/* Small Arrow Icon Circle - Exact style match */}
        <motion.div
          className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center z-20"
          style={{
            backgroundColor: cyanColor,
            boxShadow: `0 0 20px ${cyanColor}80`,
          }}
          animate={{
            y: [-2, -4, -2],
            x: [-2, 2, -2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Black arrow icon for contrast, matching reference */}
          <ArrowUpRight className="w-5 h-5 text-[#1a1a1a]" strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Status Text Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center space-y-4 relative z-10"
      >
        {/* Main Headline */}
        <h1 className="text-white" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Opening {platform}...
        </h1>

        {/* Loading Dots - Matching reference style */}
        <div className="flex items-center justify-center gap-2 h-6">
          {!isComplete ? (
            [0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cyanColor }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))
          ) : (
            /* Success State (Optional, keeps UI feeling responsive) */
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" style={{ color: cyanColor }} />
              <span className="text-white/80 text-sm">Ready</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Bottom Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
          Check {platform} for your post
        </p>
      </motion.div>
    </div>
  );
}