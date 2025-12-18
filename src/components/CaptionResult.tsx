import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Wand2, Copy, Linkedin, Twitter, Instagram, Lock, Sparkles, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ConnectToPublishModal } from './ConnectToPublishModal';

interface CaptionResultProps {
  platform?: 'linkedin' | 'twitter' | 'instagram';
  isConnected?: boolean;
  onBack?: () => void;
  onPostToSocials?: () => void; // Added prop for navigation
}

export function CaptionResult({ platform = 'linkedin', isConnected = false, onBack, onPostToSocials }: CaptionResultProps) {
  // 1. New State for Loading Animation
  const [isGenerating, setIsGenerating] = useState(true);
  
  const [captionText, setCaptionText] = useState("");
  const finalCaption = `🚀 Exciting news from our team!\n\nWe're thrilled to announce the launch of our new summer coffee menu, featuring handcrafted beverages made with locally-sourced ingredients and innovative flavor combinations.\n\nFrom refreshing cold brews to specialty lattes, each drink has been carefully crafted to bring you the perfect summer experience. ☀️\n\nVisit us today and discover your new favorite summer drink!\n\n#Coffee #SummerVibes #LocalBusiness #NewMenu`;

  const [showConnectModal, setShowConnectModal] = useState(false);

  const platformConfig = {
    linkedin: { name: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
    twitter: { name: 'Twitter/X', icon: Twitter, color: '#1da1f2' },
    instagram: { name: 'Instagram', icon: Instagram, color: '#e4405f' },
  };

  const currentPlatform = platformConfig[platform];
  const PlatformIcon = currentPlatform.icon;

  // 2. Simulate AI Generation Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setCaptionText(finalCaption);
    }, 2500); // 2.5 second generation time
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(captionText);
  };

  const handlePost = () => {
    if (!isConnected) {
      setShowConnectModal(true);
    } else {
      if (onPostToSocials) onPostToSocials();
    }
  };

  return (
    <div className="h-full w-full bg-[#101010] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex items-center">
        <button 
          onClick={onBack}
          className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
          {isGenerating ? 'Generating...' : 'Your Caption'}
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6 flex flex-col overflow-hidden relative">
        
        <AnimatePresence mode="wait">
          {isGenerating ? (
            /* LOADING STATE */
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#00d4ff] blur-3xl opacity-20 rounded-full" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="relative z-10 w-20 h-20 rounded-full border-t-2 border-r-2 border-[#00d4ff] flex items-center justify-center"
                >
                   <BrainCircuit className="w-8 h-8 text-[#00d4ff]" />
                </motion.div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-white font-bold text-lg">AI is writing...</h3>
                <p className="text-white/50 text-sm">Optimizing for {currentPlatform.name}</p>
              </div>
            </motion.div>
          ) : (
            /* RESULT STATE */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col h-full overflow-y-auto pb-4"
            >
              {/* Preview Card */}
              <div className="flex-1 mb-6 min-h-[300px]">
                <div
                  className="rounded-3xl border border-white/20 backdrop-blur-xl p-6 h-full shadow-2xl flex flex-col"
                  style={{ background: 'rgba(45, 45, 45, 0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <PlatformIcon className="w-5 h-5 text-white/80" />
                    </div>
                    <div>
                      <p className="text-white/80" style={{ fontSize: '0.875rem', fontWeight: 600 }}>Preview</p>
                      <p className="text-white/60" style={{ fontSize: '0.75rem' }}>{currentPlatform.name}</p>
                    </div>
                  </div>

                  <textarea
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    className="flex-1 w-full bg-transparent text-white/90 resize-none focus:outline-none leading-relaxed"
                    style={{ fontSize: '1rem', lineHeight: '1.6' }}
                  />
                </div>
              </div>

              {/* AI Controls */}
              <div className="flex items-center justify-center gap-4 mb-6 flex-shrink-0">
                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all group">
                  <RefreshCw className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff] transition-colors" />
                </button>
                <button className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all group">
                  <Wand2 className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff] transition-colors" />
                </button>
              </div>

              {/* Action Area */}
              <div className="space-y-3 flex-shrink-0">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-white/5 border border-white/20 py-4 flex items-center justify-center gap-2 transition-all hover:bg-white/10 hover:border-white/30"
                >
                  <Copy className="w-5 h-5 text-white/80" />
                  <span className="text-white/80" style={{ fontSize: '1rem', fontWeight: 600 }}>Copy Text</span>
                </motion.button>

                <motion.button
                  onClick={handlePost}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-[#00d4ff] py-4 flex items-center justify-center gap-2 transition-all hover:bg-[#00bce6]"
                >
                  <PlatformIcon className="w-6 h-6 text-white" />
                  <span className="text-white" style={{ fontSize: '1.125rem', fontWeight: 700 }}>Post to {currentPlatform.name}</span>
                  {!isConnected && <Lock className="w-5 h-5 text-white ml-1" />}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ConnectToPublishModal
        isOpen={showConnectModal}
        platform={platform}
        onConnect={() => setShowConnectModal(false)}
        onCancel={() => setShowConnectModal(false)}
      />
    </div>
  );
}
