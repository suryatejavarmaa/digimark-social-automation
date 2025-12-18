import { motion } from 'motion/react';
import { ArrowLeft, Square, RectangleVertical, RectangleHorizontal, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIService } from '../services/AIService';
import { PosterTemplates } from './PosterTemplates';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

type AspectRatio = 'square' | 'portrait' | 'landscape';

const aspectRatios = [
  { id: 'square' as AspectRatio, icon: Square, label: 'Square', sublabel: 'IG Feed', ratio: '1:1' },
  { id: 'portrait' as AspectRatio, icon: RectangleVertical, label: 'Portrait', sublabel: 'Stories', ratio: '9:16' },
  { id: 'landscape' as AspectRatio, icon: RectangleHorizontal, label: 'Landscape', sublabel: 'X/LI', ratio: '16:9' },
];

const visualStyles = [
  'Photorealistic',
  '3D Render',
  'Cyberpunk',
  'Minimalist',
  'Watercolor',
  'Oil Painting',
  'Digital Art',
  'Sketch',
  'Abstract',
  'Anime',
];

interface ImageInputProps {
  onGenerate?: (urls: string[], prompts: string[], params?: { prompt: string, style: string, ratio: string }) => void;
  onBack?: () => void;
  userId?: string | null;
}

export function ImageInput({ onGenerate, onBack, userId }: ImageInputProps = {}) {
  // ==================== LOCAL STATE ====================
  const [prompt, setPrompt] = useState('');
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('portrait');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Fetch user profile
  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  // ==================== VALIDATION ====================
  const isValid = prompt.trim() !== '' && selectedRatio !== null;

  const handleGenerate = async () => {
    if (!isValid || !onGenerate) return;

    // Use the first selected style or default
    const style = selectedStyles.length > 0 ? selectedStyles[0] : 'Photorealistic';

    // Pass params to parent to handle generation and view switching
    // We pass empty arrays for urls/prompts to signal "start generation"
    onGenerate([], [], { prompt, style, ratio: selectedRatio });
  };

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
            <button
              onClick={onBack}
              className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              New AI Graphic
            </h1>
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* The Prompt - Large Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
              Describe Your Image
            </label>
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A futuristic cityscape at night with neon lights and flying cars, cyberpunk aesthetic..."
                className="w-full h-32 bg-transparent text-white placeholder:text-white/40 resize-none focus:outline-none"
                style={{ fontSize: '1rem' }}
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-white/50" style={{ fontSize: '0.875rem' }}>
                  {prompt.length} characters
                </span>
                <Sparkles className="w-5 h-5 text-[#00d4ff]" />
              </div>
            </div>
          </motion.div>

          {/* Poster Templates - BELOW Input */}
          {userId && userProfile && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <PosterTemplates
                userId={userId}
                companyName={userProfile.businessName || userProfile.fullName || 'Your Company'}
                companySummary={userProfile.businessSummary || userProfile.industry || 'A professional business'}
                onTemplateSelect={(template) => setPrompt(template)}
              />
            </motion.div>
          )}

          {/* Aspect Ratio Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {aspectRatios.map((ratio, index) => {
                const Icon = ratio.icon;
                const isSelected = selectedRatio === ratio.id;
                return (
                  <motion.button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isGenerating}
                    className={`rounded-2xl border backdrop-blur-xl p-4 transition-all ${isSelected
                      ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10'
                      : 'border-white/20 bg-[rgba(45,45,45,0.3)]'
                      }`}
                  >
                    <Icon
                      className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-[#00d4ff]' : 'text-white/60'
                        }`}
                    />
                    <p
                      className={`${isSelected ? 'text-white' : 'text-white/70'}`}
                      style={{ fontSize: '0.875rem', fontWeight: 600 }}
                    >
                      {ratio.label}
                    </p>
                    <p className="text-white/50" style={{ fontSize: '0.75rem' }}>
                      {ratio.sublabel}
                    </p>
                    <p className="text-white/40 mt-1" style={{ fontSize: '0.625rem' }}>
                      {ratio.ratio}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Visual Style Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pb-24"
          >
            <label className="block text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
              Visual Style (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {visualStyles.map((style, index) => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <motion.button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isGenerating}
                    className={`px-4 py-2 rounded-full border transition-all ${isSelected
                      ? 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff]'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
                      }`}
                    style={{ fontSize: '0.875rem', fontWeight: 500 }}
                  >
                    {style}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Footer Action - CYAN BRANDED BUTTON */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent"
        >
          <motion.button
            onClick={handleGenerate}
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            disabled={!isValid || isGenerating}
            className={`w-full rounded-2xl p-5 flex items-center justify-center gap-2 transition-all ${!isValid || isGenerating
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[#00d4ff] text-white hover:bg-[#00bce6]'
              }`}
            style={
              isValid
                ? {
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }
                : { fontSize: '1.25rem', fontWeight: 700 }
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
