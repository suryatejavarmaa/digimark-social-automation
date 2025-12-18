import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Linkedin, Instagram, Twitter, Facebook, FileText, Send, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { SchedulePickerModal } from './SchedulePickerModal';
import { ConnectToPublishModal } from './ConnectToPublishModal';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../lib/firebase';

interface Platform {
  id: string;
  name: string;
  icon: typeof Linkedin;
}

const platforms: Platform[] = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter },
  { id: 'facebook', name: 'Facebook', icon: Facebook },
  { id: 'instagram', name: 'Instagram', icon: Instagram },
];

interface FinalizeTextPostProps {
  onPublish?: (platforms: string[], data: any) => void;
  onBack?: () => void;
  caption?: string;
  userId?: string | null;
}

export function FinalizeTextPost({ onPublish, onBack, caption, userId }: FinalizeTextPostProps = {}) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [editedCaption, setEditedCaption] = useState(caption || "🚀 Excited to share our Q4 digital marketing insights! Our latest campaign achieved 247% increase in engagement. The future of AI in marketing is here.");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [linkedInConnected, setLinkedInConnected] = useState(false);
  const [twitterConnected, setTwitterConnected] = useState(false);
  const [platformToConnect, setPlatformToConnect] = useState<'linkedin' | 'twitter' | null>(null);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        return prev.filter(p => p !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Check LinkedIn and Twitter connection status (EXACT COPY from FinalizeImagePost)
  useEffect(() => {
    const checkConnection = async () => {
      if (!userId) return;

      const db = getFirestore();

      // Check LinkedIn
      if (selectedPlatforms.includes('linkedin')) {
        try {
          const tokenRef = doc(db, 'users', userId, 'tokens', 'linkedin');
          const tokenDoc = await getDoc(tokenRef);
          setLinkedInConnected(tokenDoc.exists() && !!tokenDoc.data()?.access_token);
        } catch (error) {
          console.error('Error checking LinkedIn connection:', error);
          setLinkedInConnected(false);
        }
      }

      // Check Twitter
      if (selectedPlatforms.includes('twitter')) {
        try {
          const tokenRef = doc(db, 'users', userId, 'tokens', 'twitter');
          const tokenDoc = await getDoc(tokenRef);
          setTwitterConnected(tokenDoc.exists() && !!tokenDoc.data()?.access_token);
        } catch (error) {
          console.error('Error checking Twitter connection:', error);
          setTwitterConnected(false);
        }
      }
    };
    checkConnection();
  }, [userId, selectedPlatforms]);

  // Check if platforms are connected before publishing/scheduling (EXACT COPY from FinalizeImagePost)
  const checkPlatformConnections = (): boolean => {
    // Check LinkedIn
    if (selectedPlatforms.includes('linkedin') && !linkedInConnected) {
      setPlatformToConnect('linkedin');
      setShowConnectModal(true);
      return false;
    }

    // Check Twitter
    if (selectedPlatforms.includes('twitter') && !twitterConnected) {
      setPlatformToConnect('twitter');
      setShowConnectModal(true);
      return false;
    }

    return true;
  };

  // Handle Schedule button click (EXACT COPY from FinalizeImagePost)
  const handleScheduleClick = () => {
    if (selectedPlatforms.length > 0) {
      if (checkPlatformConnections()) {
        setShowScheduleModal(true);
      }
    }
  };

  // Handle Publish button click (EXACT COPY from FinalizeImagePost)
  const handlePublishClick = () => {
    if (selectedPlatforms.length > 0) {
      if (checkPlatformConnections() && onPublish) {
        onPublish(selectedPlatforms, { caption: editedCaption });
      }
    }
  };

  // Handle OAuth connection (EXACT COPY from FinalizeImagePost)
  const handleConnectPlatform = () => {
    const currentUserId = userId || auth.currentUser?.uid;

    if (!currentUserId) {
      console.error('[OAuth] No user ID found!');
      alert('❌ Please log in first before connecting.');
      return;
    }

    const platform = platformToConnect;
    if (!platform) return;

    const redirectOrigin = window.location.origin;
    const oauthUrl = `http://127.0.0.1:5001/auth/${platform}?userId=${currentUserId}&redirect_origin=${redirectOrigin}`;

    console.log(`[OAuth] Redirecting to ${platform}:`, oauthUrl);
    console.log('[OAuth] User ID:', currentUserId);
    console.log('[OAuth] Redirect origin:', redirectOrigin);

    window.location.href = oauthUrl;
  };

  const handleSchedule = async (scheduledDate: Date) => {
    if (onPublish) {
      onPublish(selectedPlatforms, {
        caption: editedCaption,
        scheduledAt: scheduledDate.toISOString(),
        isScheduled: true
      });
    }
    setShowScheduleModal(false);
  };

  return (
    <div className="h-full w-full bg-[#101010] overflow-auto pb-8 flex flex-col">
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
            Select Channels
          </h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6 overflow-y-auto">
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
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl flex items-center justify-center border border-[#00d4ff]/30 bg-[#00d4ff]/10">
                  <FileText className="w-8 h-8 text-[#00d4ff]" />
                </div>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <textarea
                  value={editedCaption}
                  onChange={(e) => setEditedCaption(e.target.value)}
                  className="w-full h-full bg-transparent text-white/90 leading-relaxed resize-none focus:outline-none"
                  style={{ fontSize: '0.875rem', minHeight: '80px' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Selection */}
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
                  className={`rounded-2xl border backdrop-blur-xl p-5 transition-all cursor-pointer ${isSelected
                      ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10'
                      : 'border-white/20 bg-[rgba(45,45,45,0.3)]'
                    }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/10' : 'bg-white/5'}`}>
                        <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/50'}`} />
                      </div>
                      <span className={`${isSelected ? 'text-white' : 'text-white/60'}`} style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                        {platform.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlatform(platform.id);
                      }}
                      className="relative"
                    >
                      <motion.div className={`w-14 h-8 rounded-full transition-all ${isSelected ? 'bg-[#00d4ff]' : 'bg-white/10'}`}>
                        <motion.div
                          className={`absolute top-1 w-6 h-6 rounded-full ${isSelected ? 'bg-white' : 'bg-white/40'}`}
                          animate={{ left: isSelected ? '28px' : '4px' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </button>
                  </div>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-white/60" style={{ fontSize: '0.75rem' }}>
                          <FileText className="w-4 h-4" />
                          <span>
                            {platform.id === 'instagram' && 'Optimized for Instagram Captions'}
                            {platform.id === 'linkedin' && 'Optimized for LinkedIn Articles'}
                            {platform.id === 'twitter' && 'Optimized for Twitter/X Threads'}
                            {platform.id === 'facebook' && 'Optimized for Facebook Posts'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent"
      >
        <div className="flex gap-3">
          <motion.button
            onClick={handleScheduleClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={selectedPlatforms.length === 0}
            className={`flex-1 rounded-2xl p-5 flex items-center justify-center transition-all border ${selectedPlatforms.length === 0
                ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                : 'bg-white/10 border-[#00d4ff]/30 text-white hover:bg-white/20'
              }`}
          >
            <Clock className="w-5 h-5 mr-2" />
            <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>Schedule</span>
          </motion.button>
          <motion.button
            onClick={handlePublishClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={selectedPlatforms.length === 0}
            className={`flex-1 rounded-2xl p-5 flex items-center justify-center transition-all ${selectedPlatforms.length === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed'
                : 'bg-[#00d4ff] text-white hover:bg-[#00bce6]'
              }`}
          >
            <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              {selectedPlatforms.length === 0 ? 'Select a channel' : 'Publish'}
            </span>
            {selectedPlatforms.length > 0 && <Send className="w-5 h-5 ml-2" />}
          </motion.button>
        </div>
      </motion.div>

      <SchedulePickerModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleSchedule}
      />

      <ConnectToPublishModal
        isOpen={showConnectModal}
        platform={platformToConnect || 'linkedin'}
        onConnect={handleConnectPlatform}
        onCancel={() => setShowConnectModal(false)}
      />
    </div>
  );
}