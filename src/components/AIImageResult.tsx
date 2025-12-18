import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, Pencil, Download, Share2 } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const sampleImages = [
  'https://images.unsplash.com/photo-1762278804855-ebc8fbbc3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMGNvbmNlcHQlMjBuZW9ufGVufDF8fHx8MTc2NDMwMzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1762278804855-ebc8fbbc3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMGNvbmNlcHQlMjBuZW9ufGVufDF8fHx8MTc2NDMwMzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  'https://images.unsplash.com/photo-1762278804855-ebc8fbbc3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMGNvbmNlcHQlMjBuZW9ufGVufDF8fHx8MTc2NDMwMzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
];

export function AIImageResult() {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="h-full w-full bg-[#101010] overflow-auto pb-8">
      <div className="flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-6 py-6 flex items-center">
            <button className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Generated Results
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Primary Preview */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-3 overflow-hidden"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={sampleImages[selectedImage]}
                  alt="Generated AI Image"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* Variations Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex gap-3">
              {sampleImages.map((image, index) => {
                const isSelected = selectedImage === index;
                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 rounded-xl border-2 p-2 transition-all ${
                      isSelected
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    style={
                      isSelected
                        ? {
                            background: 'rgba(0, 212, 255, 0.15)',
                          }
                        : { background: 'rgba(45, 45, 45, 0.3)' }
                    }
                  >
                    <div className="aspect-square rounded-lg overflow-hidden relative">
                      <ImageWithFallback
                        src={image}
                        alt={`Variation ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay for non-selected */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-black/30" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Tools */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-4"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <div className="flex gap-3">
                {/* Regenerate Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Regenerate
                  </span>
                </motion.button>

                {/* Refine Prompt Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/20 hover:bg-white/10 transition-all"
                >
                  <Pencil className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    Refine Prompt
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent"
        >
          <div className="flex gap-3">
            {/* Secondary Button - Save to Device */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-2xl bg-transparent border-2 border-white/30 p-4 flex items-center justify-center gap-2 hover:bg-white/5 transition-all backdrop-blur-xl"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <Download className="w-5 h-5 text-white" />
              <span className="text-white" style={{ fontSize: '1rem', fontWeight: 600 }}>
                Save to Device
              </span>
            </motion.button>

            {/* Primary Button - Post to Socials */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 rounded-2xl bg-[#00d4ff] hover:bg-[#00bce6] p-4 flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-5 h-5 text-white" />
              <span className="text-white" style={{ fontSize: '1rem', fontWeight: 600 }}>
                Post to Socials
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
