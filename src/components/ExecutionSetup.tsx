import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Rocket,
    Calendar,
    Save,
    Settings2,
    Zap,
    ArrowLeft,
    LayoutDashboard,
    FileDown,
    Monitor
} from 'lucide-react';

interface ExecutionSetupProps {
    strategyData: any;
    onLaunch: (data: any) => void;
    onBack: () => void;
}

export const ExecutionSetup: React.FC<ExecutionSetupProps> = ({ strategyData, onLaunch, onBack }) => {
    const [autoOptimize, setAutoOptimize] = useState(true);
    const [aiSuggestions, setAiSuggestions] = useState(true);
    const [budgetReallocation, setBudgetReallocation] = useState(false);
    const [campaignName, setCampaignName] = useState(`${strategyData.adTypeDisplay || 'New'} Campaign - ${new Date().toLocaleDateString()}`);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleLaunch = () => {
        setIsSuccessModalOpen(true);
        // We will call onLaunch after the user interacts with the modal or just let the modal show the success.
    };

    const confirmLaunch = () => {
        onLaunch({
            campaignName,
            autoOptimize,
            aiSuggestions,
            budgetReallocation,
            ...strategyData
        });
    };

    return (
        <div className="h-full w-full bg-[#101010] flex flex-col overflow-auto pb-32">
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
                        Execution Setup
                    </h1>
                </div>
            </motion.div>

            <div className="px-6 py-6 space-y-6">

                {/* Campaign Status Card */}
                <div
                    className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                    style={{
                        background: 'rgba(45, 45, 45, 0.3)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                            <Monitor className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Campaign Info</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-bold block mb-2">Campaign Name</label>
                            <input
                                type="text"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white text-sm font-medium focus:border-[#00d4ff] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-white/5">
                            <span className="text-white/70 text-sm font-medium">Platform Mapping</span>
                            <div className="flex gap-1.5">
                                {strategyData.platforms?.map((p: string) => (
                                    <span key={p} className="text-[10px] px-3 py-1 bg-[#00d4ff]/10 rounded-full text-[#00d4ff] border-2 border-[#00d4ff] font-bold uppercase">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-3 border-t border-white/5">
                            <span className="text-white/70 text-sm font-medium">Content Status</span>
                            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">Ready / Attached</span>
                        </div>
                    </div>
                </div>

                {/* Optimization Settings */}
                <div
                    className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                    style={{
                        background: 'rgba(45, 45, 45, 0.3)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                            <Settings2 className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Optimization</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-bold">Auto-Optimization</span>
                                <span className="text-white/40 text-xs mt-0.5">Let AI tweak bids for best ROI</span>
                            </div>
                            <button
                                onClick={() => setAutoOptimize(!autoOptimize)}
                                className={`w-12 h-6 rounded-full transition-all relative ${autoOptimize ? 'bg-[#00d4ff]' : 'bg-[#1a1a1a]'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoOptimize ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-bold">AI Suggestions</span>
                                <span className="text-white/40 text-xs mt-0.5">Real-time improvements</span>
                            </div>
                            <button
                                onClick={() => setAiSuggestions(!aiSuggestions)}
                                className={`w-12 h-6 rounded-full transition-all relative ${aiSuggestions ? 'bg-[#00d4ff]' : 'bg-[#1a1a1a]'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${aiSuggestions ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-white text-sm font-bold">Budget Reallocation</span>
                                <span className="text-white/40 text-xs mt-0.5">Shift funds to top results</span>
                            </div>
                            <button
                                onClick={() => setBudgetReallocation(!budgetReallocation)}
                                className={`w-12 h-6 rounded-full transition-all relative ${budgetReallocation ? 'bg-[#00d4ff]' : 'bg-[#1a1a1a]'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${budgetReallocation ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output / Readiness */}
                <div
                    className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                    style={{
                        background: 'rgba(45, 45, 45, 0.3)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                            <Zap className="w-5 h-5 text-[#00d4ff]" />
                        </div>
                        <h3 className="text-white font-bold text-lg">Performance Tools</h3>
                    </div>

                    <div className="space-y-4">
                        <button className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                            <div className="p-2 bg-[#00d4ff]/10 rounded-lg group-hover:bg-[#00d4ff]/20 transition-colors">
                                <LayoutDashboard className="w-4 h-4 text-[#00d4ff]" />
                            </div>
                            <span className="text-white font-bold text-sm tracking-wide">Preview Dashboards</span>
                        </button>
                        <button className="flex items-center gap-3 w-full p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 group">
                            <div className="p-2 bg-[#00d4ff]/10 rounded-lg group-hover:bg-[#00d4ff]/20 transition-colors">
                                <FileDown className="w-4 h-4 text-[#00d4ff]" />
                            </div>
                            <span className="text-white font-bold text-sm tracking-wide">Lead Sheet Export Ready</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLaunch}
                        className="w-full h-14 rounded-2xl bg-[#00d4ff] text-white font-black shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                    >
                        <Rocket className="w-5 h-5" />
                        Launch Campaign
                    </motion.button>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                            <Calendar className="w-4 h-4 text-[#00d4ff]" />
                            Schedule
                        </button>
                        <button className="h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                            <Save className="w-4 h-4 text-[#00d4ff]" />
                            Save Draft
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {isSuccessModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-[#1a1a1a] border-2 border-white/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,212,255,0.1)] text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20 mx-auto mb-6">
                                <Rocket className="w-10 h-10 text-[#00d4ff]" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Campaign Ready!</h2>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed">
                                Your campaign strategy has been initiated and is being deployed to selected platforms.
                            </p>
                            <button
                                onClick={confirmLaunch}
                                className="w-full h-14 rounded-2xl bg-[#00d4ff] text-white font-black shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center gap-3 uppercase tracking-widest text-sm active:scale-95 transition-all"
                            >
                                Back to Dashboard
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
