import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw, WandSparkles, Minus, Plus, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';

const sampleCaption = `🚀 Excited to announce our Summer Sale 2025!

We're thrilled to bring you exclusive offers on our entire product line this summer. This is the perfect opportunity to upgrade your toolkit and take your business to the next level.

Our team has been working tirelessly to ensure you get the best value, and we can't wait to see the impact these tools will have on your success. Don't miss out on these limited-time deals!

#SummerSale #BusinessGrowth #Innovation #Marketing #DigitalTransformation #Success`;

export function AITextResult() {
  const [caption, setCaption] = useState(sampleCaption);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerate = () => {
    console.log('Regenerate caption');
  };

  const handleShorten = () => {
    console.log('Shorten caption');
  };

  const handleExpand = () => {
    console.log('Expand caption');
  };

  const handlePostToSocials = () => {
    console.log('Navigate to Post to Socials');
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
            <button className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              Generated Caption
            </h1>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-6 space-y-5">
          {/* Primary Preview - Large Glass Container */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full bg-transparent text-white outline-none resize-none leading-relaxed"
                style={{ fontSize: '1rem', minHeight: '320px' }}
              />
            </div>
          </motion.div>

          {/* Quick Tools - Toolbar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="rounded-2xl border border-white/20 backdrop-blur-xl p-4"
              style={{
                background: 'rgba(45, 45, 45, 0.3)',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Regenerate Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegenerate}
                  className="flex-1 rounded-xl bg-white/5 border border-white/20 p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                >
                  <RefreshCw className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-white/80" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Regenerate
                  </span>
                </motion.button>

                {/* Shorten Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShorten}
                  className="flex-1 rounded-xl bg-white/5 border border-white/20 p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                >
                  <div className="relative">
                    <WandSparkles className="w-5 h-5 text-[#00d4ff]" />
                    <Minus className="w-3 h-3 text-white absolute -bottom-1 -right-1" />
                  </div>
                  <span className="text-white/80" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Shorten
                  </span>
                </motion.button>

                {/* Expand Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExpand}
                  className="flex-1 rounded-xl bg-white/5 border border-white/20 p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                >
                  <div className="relative">
                    <WandSparkles className="w-5 h-5 text-[#00d4ff]" />
                    <Plus className="w-3 h-3 text-white absolute -bottom-1 -right-1" />
                  </div>
                  <span className="text-white/80" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    Expand
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions - Two Button Layout */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent"
        >
          <div className="flex gap-3">
            {/* Secondary Button - Copy to Clipboard */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex-1 rounded-2xl bg-white/5 border-2 border-white/20 p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-all backdrop-blur-xl"
            >
              <Copy className="w-5 h-5 text-white" />
              <span className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>
                {isCopied ? 'Copied!' : 'Copy'}
              </span>
            </motion.button>

            {/* Primary Button - Post to Socials - CYAN WITH GLOW */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePostToSocials}
              className="flex-1 rounded-2xl bg-[#00d4ff] hover:bg-[#00bce6] p-4 flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-5 h-5 text-white" />
              <span className="text-white" style={{ fontSize: '1rem', fontWeight: 700 }}>
                Post to Socials
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
