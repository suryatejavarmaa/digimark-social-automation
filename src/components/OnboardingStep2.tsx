import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { StepIndicator } from './StepIndicator';
import { ArrowLeft } from 'lucide-react';

const styleCards = [
  { id: 'minimal', label: 'Minimal', description: 'Clean & Simple' },
  { id: 'luxury', label: 'Luxury', description: 'Premium & Elegant' },
  { id: 'bold', label: 'Bold', description: 'Eye-Catching' },
  { id: 'cyber', label: 'Cyber', description: 'Tech & Futuristic' },
  { id: 'organic', label: 'Organic', description: 'Natural & Warm' },
];

interface OnboardingStep2Props {
  onNext?: (data: any) => void;
  onBack?: () => void;
}

export function OnboardingStep2({ onNext, onBack }: OnboardingStep2Props = {}) {
  const [primaryColor, setPrimaryColor] = useState('#00d4ff');
  const [accentColor, setAccentColor] = useState('#ff00ff');
  const [selectedStyle, setSelectedStyle] = useState('minimal');
  const [voiceTone, setVoiceTone] = useState(50); // 0-100 scale
  const [businessDescription, setBusinessDescription] = useState('');

  // Validation: All fields required
  const isValid = primaryColor && accentColor && selectedStyle;

  const handleNext = () => {
    if (onNext) {
      onNext({
        primaryColor,
        accentColor,
        selectedStyle,
        voiceTone,
        businessDescription
      });
    }
  };

  const colorInputRef1 = useRef<HTMLInputElement>(null);
  const colorInputRef2 = useRef<HTMLInputElement>(null);

  return (
    <div className="h-full w-full bg-[#101010] overflow-auto">
      <div className="min-h-full flex flex-col px-6 py-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Step Indicator */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 px-4"
        >
          <StepIndicator currentStep={2} totalSteps={3} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white mt-8 mb-8"
          style={{ fontSize: '2rem', fontWeight: 700 }}
        >
          Train Your AI
        </motion.h1>

        {/* Visual Identity Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Visual Identity
          </h2>
          <div
            className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
            style={{
              background: 'rgba(45, 45, 45, 0.1)',
            }}
          >
            {/* Color Pickers */}
            <div className="mb-6">
              <label className="block text-white/70 mb-3" style={{ fontSize: '0.875rem' }}>
                Brand Colors
              </label>
              <div className="flex items-center gap-4">
                {/* Primary Color */}
                <div className="flex-1">
                  <button
                    onClick={() => colorInputRef1.current?.click()}
                    className="w-full h-24 rounded-2xl border-2 border-white/20 relative overflow-hidden transition-all hover:border-[#00d4ff] hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
                      boxShadow: `0 8px 24px ${primaryColor}40`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/90 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        Primary
                      </span>
                    </div>
                  </button>
                  <input
                    ref={colorInputRef1}
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="sr-only"
                  />
                </div>

                {/* Accent Color */}
                <div className="flex-1">
                  <button
                    onClick={() => colorInputRef2.current?.click()}
                    className="w-full h-24 rounded-2xl border-2 border-white/20 relative overflow-hidden transition-all hover:border-[#00d4ff] hover:scale-105 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                      boxShadow: `0 8px 24px ${accentColor}40`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/90 text-xs bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        Accent
                      </span>
                    </div>
                  </button>
                  <input
                    ref={colorInputRef2}
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="sr-only"
                  />
                </div>
              </div>
            </div>

            {/* Style Cards - Horizontal Scroll */}
            <div>
              <label className="block text-white/70 mb-3" style={{ fontSize: '0.875rem' }}>
                Visual Style
              </label>
              <div className="overflow-x-auto -mx-2 px-2 pb-2 scrollbar-hide">
                <div className="flex gap-3 min-w-max">
                  {styleCards.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`flex-shrink-0 w-28 rounded-xl border-2 p-4 transition-all ${selectedStyle === style.id
                        ? 'border-[#00d4ff] bg-[#00d4ff]/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                    >
                      <div
                        className={`mb-2 transition-colors ${selectedStyle === style.id ? 'text-[#00d4ff]' : 'text-white'
                          }`}
                        style={{ fontSize: '0.9375rem', fontWeight: 600 }}
                      >
                        {style.label}
                      </div>
                      <div className="text-white/50 text-xs">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Brand Voice Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Brand Voice
          </h2>
          <div
            className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
            style={{
              background: 'rgba(45, 45, 45, 0.1)',
            }}
          >
            <label className="block text-white/70 mb-4" style={{ fontSize: '0.875rem' }}>
              Tone
            </label>

            {/* Slider Labels */}
            <div className="flex justify-between mb-3">
              <span
                className={`transition-colors ${voiceTone < 50 ? 'text-[#00d4ff]' : 'text-white/50'
                  }`}
                style={{ fontSize: '0.8125rem', fontWeight: 600 }}
              >
                Professional
              </span>
              <span
                className={`transition-colors ${voiceTone >= 50 ? 'text-[#00d4ff]' : 'text-white/50'
                  }`}
                style={{ fontSize: '0.8125rem', fontWeight: 600 }}
              >
                Friendly
              </span>
            </div>

            {/* Slider */}
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={voiceTone}
                onChange={(e) => setVoiceTone(Number(e.target.value))}
                className="w-full h-2 bg-[#1a1a1a] rounded-full appearance-none cursor-pointer slider-thumb"
                style={{
                  background: `linear-gradient(to right, #00d4ff ${voiceTone}%, #1a1a1a ${voiceTone}%)`,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Description Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex-1 mb-6"
        >
          <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
            About Your Business
          </h2>
          <div
            className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
            style={{
              background: 'rgba(45, 45, 45, 0.1)',
            }}
          >
            <label className="block text-white/70 mb-3" style={{ fontSize: '0.875rem' }}>
              What does your business do?
            </label>
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="Describe your business, products, or services..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all resize-none"
              style={{ fontSize: '1rem' }}
            />
          </div>
        </motion.div>

        {/* Next Step Button */}
        <motion.button
          onClick={handleNext}
          disabled={!isValid}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`w-full py-4 rounded-full text-white transition-all active:scale-95 ${isValid
            ? 'bg-[#00d4ff] hover:bg-[#00bce6]'
            : 'bg-white/10 cursor-not-allowed opacity-50'
            }`}
          style={{
            fontSize: '1.125rem',
            fontWeight: 600,
          }}
        >
          Next Step
        </motion.button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #00d4ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 212, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
