import { motion } from 'motion/react';
import { ArrowLeft, Linkedin, Instagram, Twitter, Facebook } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Platform {
  id: string;
  name: string;
  icon: typeof Linkedin;
  color: string;
}

const platforms: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0077b5' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#e4405f' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: '#1da1f2' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877f2' },
];

export function FinalizePost() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'twitter']);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const sampleCaption = "Just launched our new AI-powered marketing suite! 🚀 Excited to share how we're revolutionizing digital content creation with cutting-edge technology. The future is here and it's powered by innovation.";
  const truncatedCaption = sampleCaption.slice(0, 120) + '...';

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
              Select Channels
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Content Preview Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-4"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <div className="flex gap-4">
                {/* Image Thumbnail */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1762278804855-ebc8fbbc3105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaCUyMGNvbmNlcHQlMjBuZW9ufGVufDF8fHx8MTc2NDMwMzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Post preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Caption Preview */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 leading-relaxed line-clamp-3" style={{ fontSize: '0.875rem' }}>
                    {truncatedCaption}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Platform Selection List */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3"
          >
            {platforms.map((platform, index) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatforms.includes(platform.id);

              return (
                <motion.div
                  key={platform.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
                >
                  <div
                    className={`rounded-2xl border backdrop-blur-xl p-5 transition-all ${
                      isSelected
                        ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10'
                        : 'border-white/20 bg-[rgba(45,45,45,0.3)]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Platform Info */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white/10' : 'bg-white/5'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/50'}`} />
                        </div>
                        <span
                          className={`${isSelected ? 'text-white' : 'text-white/60'}`}
                          style={{ fontSize: '1.125rem', fontWeight: 600 }}
                        >
                          {platform.name}
                        </span>
                      </div>

                      {/* Toggle Switch */}
                      <button
                        onClick={() => togglePlatform(platform.id)}
                        className="relative"
                      >
                        <motion.div
                          className={`w-14 h-8 rounded-full transition-all ${
                            isSelected ? 'bg-[#00d4ff]' : 'bg-white/10'
                          }`}
                          style={{}}
                        >
                          <motion.div
                            className={`absolute top-1 w-6 h-6 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-white/40'
                            }`}
                            animate={{
                              left: isSelected ? '28px' : '4px',
                            }}
                            transition={{
                              type: 'spring',
                              stiffness: 500,
                              damping: 30,
                            }}
                          />
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Footer Action */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={selectedPlatforms.length === 0}
            className={`w-full rounded-2xl p-5 flex items-center justify-center transition-all ${
              selectedPlatforms.length === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-[#00d4ff] text-white hover:bg-[#00bce6]'
            }`}
            style={{}}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {selectedPlatforms.length === 0
                ? 'Select at least one channel'
                : `Publish to ${selectedPlatforms.length} Selected Channel${
                    selectedPlatforms.length > 1 ? 's' : ''
                  }`}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
