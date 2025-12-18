import { motion } from 'motion/react';
import { ArrowLeft, ChevronDown, Sparkles, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useState } from 'react';

const postTypes = [
  'New Product',
  'Industry Insight',
  'Motivation',
  'Sale',
  'Behind the Scenes',
  'Customer Story',
];

const toneOptions = ['Professional', 'Witty', 'Urgent', 'Storytelling'];

const platforms = [
  { id: 'linkedin', icon: Linkedin, name: 'LinkedIn' },
  { id: 'twitter', icon: Twitter, name: 'Twitter/X' },
  { id: 'instagram', icon: Instagram, name: 'Instagram' },
];

export function CreateCaption() {
  const [selectedPostType, setSelectedPostType] = useState('New Product');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [prompt, setPrompt] = useState('');

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="h-full w-full bg-[#1a1a1a] overflow-auto pb-8">
      <div className="flex flex-col h-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-20 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-6 py-6 flex items-center">
            <button className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              AI Caption Writer
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Topic Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              What kind of post is this?
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full rounded-2xl border border-white/20 backdrop-blur-xl p-4 flex items-center justify-between transition-all hover:border-white/30"
                style={{
                  background: 'rgba(45, 45, 45, 0.3)',
                }}
              >
                <span className="text-white" style={{ fontSize: '1rem', fontWeight: 500 }}>
                  {selectedPostType}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/60 transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-white/20 backdrop-blur-xl overflow-hidden z-10"
                  style={{
                    background: 'rgba(45, 45, 45, 0.95)',
                  }}
                >
                  {postTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedPostType(type);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full p-4 text-left text-white hover:bg-white/10 transition-all"
                      style={{ fontSize: '1rem', fontWeight: 500 }}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* The Prompt */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Describe Your Content
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your content here (e.g., announcing our new summer coffee menu)..."
              rows={6}
              className="w-full rounded-2xl border border-white/20 backdrop-blur-xl p-4 text-white placeholder:text-white/40 resize-none focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
                fontSize: '1rem',
              }}
            />
          </motion.div>

          {/* Tone Settings */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Tone
            </label>
            <div className="flex flex-wrap gap-2">
              {toneOptions.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-5 py-2.5 rounded-full border transition-all ${
                    selectedTone === tone
                      ? 'bg-[#00d4ff]/20 border-[#00d4ff] text-[#00d4ff]'
                      : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {tone}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Platform Toggle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Platform
            </label>
            <div className="flex gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#00d4ff]/20 border-[#00d4ff]'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    style={{}}
                  >
                    <Icon className={isSelected ? 'w-6 h-6 text-[#00d4ff]' : 'w-6 h-6 text-white/60'} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="px-6 pb-6"
        >
          <button
            className="w-full rounded-2xl bg-[#00d4ff] p-5 flex items-center justify-center gap-2 transition-all hover:bg-[#00bfff] active:scale-98"
          >
            <Sparkles className="w-6 h-6 text-[#1a1a1a]" />
            <span className="text-[#1a1a1a]" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              Generate Content
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
