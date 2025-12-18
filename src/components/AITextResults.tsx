import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Wand2, Copy, Share2, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AITextResultsProps {
  generatedContent?: string;
  onPostToSocials?: () => void;
  onBack?: () => void;
  onRegenerate?: (newPrompt?: string) => void;
  initialPrompt?: string; // We might need the initial prompt to show in the edit box
}

export function AITextResults({ generatedContent, onPostToSocials, onBack, onRegenerate, initialPrompt = '' }: AITextResultsProps = {}) {
  // ==================== STATE ====================
  const [isGenerating, setIsGenerating] = useState(true);
  const [captionText, setCaptionText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState(initialPrompt);

  // Update editPrompt when initialPrompt changes
  useEffect(() => {
    if (initialPrompt) setEditPrompt(initialPrompt);
  }, [initialPrompt]);

  // ==================== LOADING ANIMATION ====================
  useEffect(() => {
    // Simulate a short "processing" delay even if content is ready, for effect
    const timer = setTimeout(() => {
      setIsGenerating(false);
      setCaptionText(generatedContent || '');
    }, 1500);
    return () => clearTimeout(timer);
  }, [generatedContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(captionText);
  };

  const handleEditSubmit = () => {
    setIsEditing(false);
    setIsGenerating(true);
    if (onRegenerate) onRegenerate(editPrompt);
  };

  return (
    <div className="h-full w-full bg-[#101010] flex flex-col relative">
      {/* Edit Prompt Modal Overlay */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-white text-lg font-bold mb-4">Refine Your Prompt</h3>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff] resize-none mb-6"
                placeholder="Describe what you want..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="flex-1 py-3 rounded-xl bg-[#00d4ff] text-white font-semibold hover:bg-[#00bce6] transition-all flex items-center justify-center gap-2"
                >
                  <Wand2 className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="px-6 py-6 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {isGenerating ? 'Generating Caption...' : 'Your Caption'}
          </h1>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6 flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            /* ==================== LOADING STATE ==================== */
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center space-y-6"
            >
              {/* Animated Loader Icon */}
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

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <h3 className="text-white" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                  AI is writing your caption...
                </h3>
                <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
                  Crafting the perfect message
                </p>
              </div>
            </motion.div>
          ) : (
            /* ==================== RESULT STATE ==================== */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex flex-col h-full overflow-y-auto pb-4"
            >
              {/* Caption Preview Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex-1 mb-6 min-h-[300px]"
              >
                <div
                  className="rounded-3xl border border-white/20 backdrop-blur-xl p-6 h-full shadow-2xl flex flex-col"
                  style={{ background: 'rgba(45, 45, 45, 0.3)' }}
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10 flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Share2 className="w-5 h-5 text-[#00d4ff]" />
                    </div>
                    <div>
                      <p className="text-white/80" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Caption Preview
                      </p>
                      <p className="text-white/60" style={{ fontSize: '0.75rem' }}>
                        Edit as needed
                      </p>
                    </div>
                  </div>

                  <textarea
                    value={captionText}
                    onChange={(e) => setCaptionText(e.target.value)}
                    className="flex-1 w-full bg-transparent text-white/90 resize-none focus:outline-none leading-relaxed"
                    style={{ fontSize: '1rem', lineHeight: '1.6' }}
                    placeholder="Your generated caption will appear here..."
                  />
                </div>
              </motion.div>

              {/* AI Enhancement Tools */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center gap-4 mb-6 flex-shrink-0"
              >
                <button
                  onClick={() => {
                    setIsGenerating(true); // Show loader immediately
                    if (onRegenerate) onRegenerate();
                  }}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/20 hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all group"
                >
                  <RefreshCw className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff] transition-colors" />
                  <span className="text-white/80 font-medium group-hover:text-white transition-colors">Regenerate</span>
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/20 hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all group"
                >
                  <Wand2 className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff] transition-colors" />
                  <span className="text-white/80 font-medium group-hover:text-white transition-colors">Refine Prompt</span>
                </button>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-3 flex-shrink-0"
              >
                {/* Copy Button */}
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-white/5 border border-white/20 py-4 flex items-center justify-center gap-2 transition-all hover:bg-white/10 hover:border-white/30"
                >
                  <Copy className="w-5 h-5 text-white/80" />
                  <span className="text-white/80" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    Copy Text
                  </span>
                </motion.button>

                {/* Post to Socials Button */}
                <motion.button
                  onClick={onPostToSocials}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-full bg-[#00d4ff] py-4 flex items-center justify-center gap-2 transition-all hover:bg-[#00bce6]"
                  style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <Share2 className="w-5 h-5 text-white" />
                  <span className="text-white">Post to Socials</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
