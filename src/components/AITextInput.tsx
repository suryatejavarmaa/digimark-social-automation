import { motion } from 'motion/react';
import { ArrowLeft, Linkedin, Twitter, Instagram, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AIService } from '../services/AIService';
import { CaptionTemplates } from './CaptionTemplates';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const platforms = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', name: 'X', icon: Twitter },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
];

const tones = [
  'Professional',
  'Witty',
  'Urgent',
  'Storytelling',
  'Data-Driven',
  'Casual',
  'Inspirational',
  'Educational',
];

interface AITextInputProps {
  onGenerate?: (text: string, params: { prompt: string, platform: string, tones: string[] }) => void;
  onBack?: () => void;
  userId?: string | null;
}

export function AITextInput({ onGenerate, onBack, userId }: AITextInputProps = {}) {
  const [selectedPlatform, setSelectedPlatform] = useState('linkedin');
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [prompt, setPrompt] = useState('');
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

  const isValid = prompt.trim() !== '';

  const toggleTone = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone]
    );
  };

  const handleGenerate = async () => {
    if (!isValid || !onGenerate) return;

    setIsGenerating(true);
    try {
      const result = await AIService.generateCaption(prompt, selectedPlatform, selectedTones, userId);
      onGenerate(result, { prompt, platform: selectedPlatform, tones: selectedTones });
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
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
              New AI Caption
            </h1>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6 space-y-6">
          {/* The Prompt - Large Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-5"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What is this post about? (e.g., launching a new summer sale)..."
                className="w-full bg-transparent text-white placeholder-white/50 outline-none resize-none"
                style={{ fontSize: '1rem', minHeight: '150px' }}
                disabled={isGenerating}
              />
            </div>
          </motion.div>

          {/* Caption Templates - BELOW Input */}
          {userId && userProfile && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <CaptionTemplates
                userId={userId}
                companyName={userProfile.businessName || userProfile.fullName || 'Your Company'}
                companySummary={userProfile.businessSummary || userProfile.industry || 'A professional business'}
                onTemplateSelect={(template) => setPrompt(template)}
              />
            </motion.div>
          )}

          {/* Platform Focus - Medium Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-5"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <h3 className="text-white/90 mb-4" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                Target Platform{' '}
                <span className="text-white/50" style={{ fontSize: '0.875rem', fontWeight: 400 }}>
                  (Optimizes length)
                </span>
              </h3>

              {/* Platform Icons */}
              <div className="flex gap-4">
                {platforms.map((platform, index) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;

                  return (
                    <motion.button
                      key={platform.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPlatform(platform.id)}
                      disabled={isGenerating}
                      className={`flex-1 rounded-2xl p-6 border-2 backdrop-blur-xl transition-all ${isSelected
                        ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                        : 'border-white/20 bg-white/5'
                        }`}
                      style={{}}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Icon
                          className={`w-8 h-8 ${isSelected ? 'text-[#00d4ff]' : 'text-white/60'}`}
                        />
                        <span
                          className={`${isSelected ? 'text-white' : 'text-white/60'}`}
                          style={{ fontSize: '0.8125rem', fontWeight: 600 }}
                        >
                          {platform.name}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Tone Selector - Small Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-5"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <h3 className="text-white/90 mb-4" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                Tone of Voice
              </h3>

              {/* Horizontal Scrolling Chips */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {tones.map((tone, index) => {
                  const isSelected = selectedTones.includes(tone);

                  return (
                    <motion.button
                      key={tone}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.03 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleTone(tone)}
                      disabled={isGenerating}
                      className={`flex-shrink-0 px-5 py-2.5 rounded-full border backdrop-blur-xl transition-all ${isSelected
                        ? 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff]'
                        : 'border-white/20 bg-white/5 text-white/70'
                        }`}
                      style={{}}
                    >
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {tone}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
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
            onClick={handleGenerate}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!isValid || isGenerating}
            className={`w-full rounded-2xl p-5 flex items-center justify-center gap-2 transition-all ${!isValid || isGenerating
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-[#00d4ff] text-white hover:bg-[#00bce6]'
              }`}
            style={{}}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Generate Caption</span>
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
