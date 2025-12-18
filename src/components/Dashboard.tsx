import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Calendar, User, FileText, Image, Video, RefreshCw, Sparkles, LogOut, Settings, HelpCircle, ChevronRight, Megaphone } from 'lucide-react';
import { AnalyticsChart } from './AnalyticsChart';
import { RecentActivity } from './RecentActivity';
import { CalendarView } from './CalendarView';
import { NotificationDropdown } from './NotificationDropdown';

const quickActions = [
  {
    id: 'post',
    title: 'Social post',
    icon: FileText,
    gradient: 'from-[#bfdbfe] to-[#dbeafe]',
    shadow: 'rgba(191, 219, 254, 0.3)',
    isNew: false,
  },
  {
    id: 'image',
    title: 'Business Poster',
    icon: Image,
    gradient: 'from-[#fbcfe8] to-[#fce7f3]',
    shadow: 'rgba(251, 207, 232, 0.3)',
    isNew: false,
  },
  {
    id: 'video',
    title: 'Social Reel',
    icon: Video,
    gradient: 'from-[#ddd6fe] to-[#ede9fe]',
    shadow: 'rgba(221, 214, 254, 0.3)',
    isNew: false,
  },
  {
    id: 'repurpose',
    title: 'Content Remix',
    icon: RefreshCw,
    gradient: 'from-[#bfdbfe] via-[#e9d5ff] to-[#fbcfe8]',
    shadow: 'rgba(191, 219, 254, 0.4)',
    isNew: true,
  },
];

interface DashboardProps {
  userId: string;
  onSocialCaptionClick?: () => void;
  onSocialGraphicClick?: () => void;
  onNotificationsClick?: () => void;
  onAdsClick?: () => void;
  userProfile?: any;
  onLogout?: () => void;
}

export function Dashboard({ userId, onSocialCaptionClick, onSocialGraphicClick, onNotificationsClick, onAdsClick, userProfile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'calendar'>('home');

  // Handler to determine which action was clicked
  const handleActionClick = (actionId: string) => {
    if (actionId === 'post' && onSocialCaptionClick) {
      onSocialCaptionClick();
    } else if (actionId === 'image' && onSocialGraphicClick) {
      onSocialGraphicClick();
    }
  };

  return (
    <div className="h-full w-full bg-[#1a1a1a] overflow-auto pb-24">
      <div className="flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="sticky top-0 z-20 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-6 py-6 flex items-center justify-between">
            <div>
              <motion.p
                className="text-white/60 mb-1"
                style={{ fontSize: '0.875rem' }}
              >
                {activeTab === 'home' ? 'Good Morning,' : activeTab === 'calendar' ? 'Plan your content,' : 'My Profile'}
              </motion.p>
              <motion.h1
                className="text-white"
                style={{ fontSize: '1.5rem', fontWeight: 700 }}
              >
                {activeTab === 'home' ? (userProfile?.businessName || 'Digi Mark') : activeTab === 'calendar' ? 'Schedule' : (userProfile?.fullName || 'User')}
              </motion.h1>
            </div>
            <NotificationDropdown userId={userId} onSeeAllClick={onNotificationsClick} />
          </div>
        </motion.div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Actions */}
              <div className="px-6 py-6">
                <h2 className="text-white/80 mb-4" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.id}
                        onClick={() => handleActionClick(action.id)}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`h-28 rounded-2xl bg-gradient-to-br ${action.gradient} p-4 flex flex-col items-center justify-center transition-all relative`}
                        style={{
                          boxShadow: `0 8px 32px ${action.shadow}`,
                        }}
                      >
                        {action.isNew && (
                          <div className="absolute top-2 right-2 bg-[#333333] text-white px-2 py-0.5 rounded-full" style={{ fontSize: '0.625rem', fontWeight: 700 }}>
                            NEW
                          </div>
                        )}
                        {action.id === 'repurpose' ? (
                          <div className="relative mb-2">
                            <RefreshCw className="w-8 h-8 text-[#333333]" />
                            <Sparkles className="w-4 h-4 text-[#333333] absolute -top-1 -right-1" />
                          </div>
                        ) : (
                          <Icon className="w-8 h-8 text-[#333333] mb-2" />
                        )}
                        <span className="text-[#333333]" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                          {action.title}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Analytics Overview */}
              <div className="px-6 pb-6">
                <h2 className="text-white/80 mb-4" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  Analytics Overview
                </h2>
                <div
                  className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
                  style={{
                    background: 'rgba(45, 45, 45, 0.1)',
                  }}
                >
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-white/60 mb-1" style={{ fontSize: '0.75rem' }}>
                        Followers
                      </p>
                      <p className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                        12.4K
                      </p>
                      <p className="text-[#10b981]" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        +8.2%
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 mb-1" style={{ fontSize: '0.75rem' }}>
                        Reach
                      </p>
                      <p className="text-white" style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                        45.8K
                      </p>
                      <p className="text-[#10b981]" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        +12.5%
                      </p>
                    </div>
                  </div>

                  {/* Chart */}
                  <div>
                    <p className="text-white/80 mb-3" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                      Engagement (Last 7 Days)
                    </p>
                    <AnalyticsChart />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="px-6 pb-6">
                <h2 className="text-white/80 mb-4" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
                  Recent Activity
                </h2>
                <RecentActivity />
              </div>
            </motion.div>
          ) : activeTab === 'calendar' ? (
            <CalendarView key="calendar" userId={userId} />
          ) : (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-6 space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0055ff] flex items-center justify-center mb-4 shadow-xl shadow-[#00d4ff]/20">
                  <span className="text-3xl font-bold text-white">
                    {userProfile?.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{userProfile?.fullName || 'User Name'}</h2>
                <p className="text-white/60 text-sm mb-4">{userProfile?.email || 'user@example.com'}</p>
                <div className="px-4 py-2 bg-white/10 rounded-full text-xs font-semibold text-white/80 border border-white/10">
                  {userProfile?.role || 'Owner'} • {userProfile?.businessName || 'Business'}
                </div>
              </div>

              {/* Settings List */}
              <div className="space-y-3">
                <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-white font-medium">Account Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </button>

                <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-white font-medium">Help & Support</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40" />
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-400 font-semibold hover:bg-red-500/20 transition-all mt-8"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10 z-30"
      >
        <div className="flex items-center justify-around px-6 py-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${activeTab === 'home' ? 'text-[#00d4ff]' : 'text-white/60'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab === 'home' ? 'bg-[#00d4ff]' : 'bg-white/5 hover:bg-white/10'}`}>
              <Home className={`w-6 h-6 ${activeTab === 'home' ? 'text-white' : 'text-white'}`} />
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>
              Home
            </span>
          </button>

          <button
            onClick={onAdsClick}
            className="flex flex-col items-center gap-1 transition-all hover:scale-110"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
              <Megaphone className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/60" style={{ fontSize: '0.625rem', fontWeight: 600 }}>
              ADs
            </span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${activeTab === 'calendar' ? 'text-[#00d4ff]' : 'text-white/60'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab === 'calendar' ? 'bg-[#00d4ff]' : 'bg-white/5 hover:bg-white/10'}`}>
              <Calendar className={`w-6 h-6 ${activeTab === 'calendar' ? 'text-white' : 'text-white'}`} />
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>
              Calendar
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${activeTab === 'profile' ? 'text-[#00d4ff]' : 'text-white/60'}`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTab === 'profile' ? 'bg-[#00d4ff]' : 'bg-white/5 hover:bg-white/10'}`}>
              <User className={`w-6 h-6 ${activeTab === 'profile' ? 'text-white' : 'text-white'}`} />
            </div>
            <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>
              Profile
            </span>
          </button>
        </div>
      </motion.div>
    </div >
  );
}
