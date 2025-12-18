import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Download, Share2, Wand2, BrainCircuit, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

// Shimmer Loading Component
function ImageWithShimmer({ src, alt }: { src: string; alt: string }) {
  const [loadingState, setLoadingState] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className="relative w-full h-full bg-black/50">
      {/* Spinning Loader */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer spinning ring */}
            <div className="w-8 h-8 border-2 border-transparent border-t-[#00d4ff] border-r-[#00d4ff] rounded-full animate-spin" />
            {/* Inner pulsing dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loadingState === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoadingState('loaded')}
        onError={() => setLoadingState('error')}
      />

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="text-white/50 text-xs">Failed</span>
        </div>
      )}
    </div>
  );
}

interface ImageResultsProps {
  generatedImageUrls?: string[];
  prompts?: string[];
  onPostToSocials?: (url: string, prompt: string) => void;
  onBack?: () => void;
  onRegenerate?: (newPrompt?: string) => void;
  isGenerating?: boolean;
}

export function ImageResults({ generatedImageUrls = [], prompts = [], onPostToSocials, onBack, onRegenerate, isGenerating = false }: ImageResultsProps = {}) {
  // ==================== LOADING STATE ====================
  // Controlled by parent via isGenerating prop
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Enhance Popup State
  const [isEnhanceOpen, setIsEnhanceOpen] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');

  // Map the passed URLs to the format needed
  const generatedImages = generatedImageUrls.length > 0
    ? generatedImageUrls.map((url, index) => ({
      id: index + 1,
      url: url,
      prompt: prompts[index] || 'Generated Image',
    }))
    : [];

  const currentImage = generatedImages[selectedImageIndex];

  const handleRegenerateClick = () => {
    if (onRegenerate) onRegenerate();
  };

  const handleEnhanceClick = () => {
    setEnhancedPrompt(currentImage?.prompt || '');
    setIsEnhanceOpen(true);
  };

  const handleEnhanceSubmit = () => {
    setIsEnhanceOpen(false);
    if (onRegenerate) onRegenerate(enhancedPrompt);
  };

  const handleSave = async () => {
    if (!currentImage?.url) return;

    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback for same-origin or if fetch fails
      const link = document.createElement('a');
      link.href = currentImage.url;
      link.download = `generated-image-${Date.now()}.png`;
      link.target = "_blank"; // Open in new tab if download fails
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="h-full w-full bg-[#101010] text-white flex flex-col overflow-hidden relative">
      {/* 1. Fixed Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-shrink-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
            {isGenerating ? 'Generating Images...' : 'Generated Images'}
          </h1>
        </div>
        {!isGenerating && generatedImages.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-white/60" style={{ fontSize: '0.875rem' }}>
              {selectedImageIndex + 1} / {generatedImages.length}
            </span>
          </div>
        )}
      </motion.div>

      {/* 2. Main Content with Loading State */}
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
                AI is creating your images...
              </h3>
              <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
                Crafting the perfect visual
              </p>
            </div>
          </motion.div>
        ) : (
          /* ==================== RESULT STATE ==================== */
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 overflow-y-auto px-6 py-6 pb-32"
          >
            {/* Large Image Display */}
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl mb-6 relative w-full max-h-[55vh] flex items-center justify-center bg-black"
            >
              {currentImage && (
                <img
                  src={currentImage.url}
                  alt={currentImage.prompt}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>

            {/* Image Thumbnails */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
                Generated Variations
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {generatedImages.map((image, index) => (
                  <motion.button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all relative ${selectedImageIndex === index
                      ? 'border-[#00d4ff] shadow-lg shadow-[#00d4ff]/30'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <ImageWithShimmer src={image.url} alt={`Variation ${index + 1}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quick Tools - REMOVED DOWNLOAD, ADDED REGENERATE & ENHANCE */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRegenerateClick}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-xs text-white/70">Regenerate</span>
                </button>

                <button
                  onClick={handleEnhanceClick}
                  className="flex flex-col items-center gap-2 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
                >
                  <Wand2 className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-xs text-white/70">Enhance</span>
                </button>
              </div>
            </motion.div>

            {/* Prompt Info */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6"
            >
              <h3 className="text-white/60 mb-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                PROMPT USED
              </h3>
              <p className="text-white/90" style={{ fontSize: '0.875rem' }}>
                {currentImage?.prompt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Footer Actions - Fixed at Bottom */}
      {!isGenerating && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-white/10 bg-[#101010]/95 backdrop-blur-xl z-30"
        >
          <div className="flex gap-3">
            {/* Secondary Button - Save (Download) */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5 text-white" />
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>Save</span>
            </motion.button>

            {/* Primary Button - Post to Socials */}
            <motion.button
              onClick={() => {
                if (currentImage && onPostToSocials) {
                  onPostToSocials(currentImage.url, currentImage.prompt);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-[2] py-4 bg-[#00d4ff] rounded-full hover:bg-[#00bce6] transition-all flex items-center justify-center gap-2"
              style={{
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <Share2 className="w-5 h-5 text-white" />
              <span>Post to Socials</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ENHANCE POPUP OVERLAY */}
      <AnimatePresence>
        {isEnhanceOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#00d4ff]" />
                  Enhance Prompt
                </h3>
                <button
                  onClick={() => setIsEnhanceOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              <textarea
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00d4ff]/50 mb-6 resize-none"
                placeholder="Edit your prompt here..."
              />

              <button
                onClick={handleEnhanceSubmit}
                className="w-full py-4 bg-[#00d4ff] rounded-xl text-white font-bold flex items-center justify-center gap-2 hover:bg-[#00bce6] transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Generate New Version
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
