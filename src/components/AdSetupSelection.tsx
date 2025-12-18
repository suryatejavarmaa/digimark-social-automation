import React from 'react';
import { motion } from 'motion/react';
import { Target, Users, Search, ChevronRight, ArrowLeft, Settings2, Clock, Sparkles } from 'lucide-react';

interface AdSetupSelectionProps {
    onSelect: (type: 'adsetup' | 'brand' | 'lead' | 'seo') => void;
    onBack: () => void;
}

const adTypes = [
    {
        id: 'adsetup',
        title: 'Ads Setup',
        description: 'Complete technical setup for your ad accounts and tracking pixels.',
        icon: Settings2,
        gradient: 'from-blue-600 to-indigo-600',
        shadow: 'rgba(37, 99, 235, 0.2)',
        isLive: true,
    },
    {
        id: 'brand',
        title: 'Brand Awareness',
        description: 'Increase your brand visibility and reach more potential customers.',
        icon: Target,
        gradient: 'from-[#6366f1] to-[#a855f7]',
        shadow: 'rgba(99, 102, 241, 0.2)',
        isLive: false,
    },
    {
        id: 'lead',
        title: 'Lead Generation',
        description: 'Capture interest and collect contact information from prospects.',
        icon: Users,
        gradient: 'from-[#0ea5e9] to-[#22d3ee]',
        shadow: 'rgba(14, 165, 233, 0.2)',
        isLive: false,
    },
    {
        id: 'seo',
        title: 'SEO Operation',
        description: 'Optimize your online presence for better search engine rankings.',
        icon: Search,
        gradient: 'from-[#10b981] to-[#34d399]',
        shadow: 'rgba(16, 185, 129, 0.2)',
        isLive: false,
    },
];

export const AdSetupSelection: React.FC<AdSetupSelectionProps> = ({ onSelect, onBack }) => {
    return (
        <div className="h-full w-full bg-[#101010] flex flex-col overflow-auto pb-12">
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
                        Ads Campaign
                    </h1>
                </div>
            </motion.div>

            <div className="px-6 py-6 flex-1 space-y-6">
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white/60 text-sm leading-relaxed"
                >
                    Choose your primary campaign objective to let AI build the perfect strategy for your business.
                </motion.p>

                {/* Options List */}
                <div className="space-y-4">
                    {adTypes.map((type, index) => {
                        const Icon = type.icon;
                        return (
                            <motion.button
                                key={type.id}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => type.isLive && onSelect(type.id as any)}
                                className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 backdrop-blur-xl text-left transition-all ${type.isLive
                                    ? 'bg-white/5 border-white/20 hover:border-[#00d4ff]/50 active:scale-[0.98]'
                                    : 'bg-white/5 border-white/20 opacity-60 grayscale-[0.5]'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${type.isLive ? 'bg-[#00d4ff]/10 border border-[#00d4ff]/20' : 'bg-white/5'}`}>
                                    <Icon className={`w-7 h-7 ${type.isLive ? 'text-[#00d4ff]' : 'text-white/40'}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`text-lg font-bold ${type.isLive ? 'text-white' : 'text-white/40'}`}>{type.title}</h3>
                                        {!type.isLive && (
                                            <span className="text-[7px] px-1 py-0 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 rounded-full font-bold uppercase tracking-tighter">
                                                Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-xs leading-relaxed line-clamp-2 ${type.isLive ? 'text-white/60' : 'text-white/20'}`}>
                                        {type.description}
                                    </p>
                                </div>

                                {type.isLive ? (
                                    <ChevronRight className="w-5 h-5 text-white/20" />
                                ) : (
                                    <Clock className="w-5 h-5 text-white/10" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                <div className="pt-4 flex items-center gap-2 justify-center">
                    <Sparkles className="w-4 h-4 text-[#00d4ff]" />
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                        Powered by DigiMark AI
                    </p>
                </div>
            </div>
        </div>
    );
};
