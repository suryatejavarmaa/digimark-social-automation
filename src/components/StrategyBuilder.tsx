import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Target, FileText, TrendingUp, BarChart3, CheckCircle2, RotateCw } from 'lucide-react';

interface StrategyBuilderProps {
    adType: 'adsetup' | 'brand' | 'lead' | 'seo';
    onComplete: (data: any) => void;
    onBack: () => void;
}

const steps = [
    { id: 1, title: 'Strategy' },
    { id: 2, title: 'Budget' },
    { id: 3, title: 'Review' }
];

const recommendationTemplates = [
    'Video-first storytelling focusing on brand values and community engagement.',
    'Product-centric carousels highlighting unique features and limited-time offers.',
    'Testimonial-based social proof ads targeting high-intent decision makers.',
    'Educational infographics focused on solving specific pain points for your audience.',
    'Interactive lead forms with automated follow-ups for maximum conversion.'
];

export const StrategyBuilder: React.FC<StrategyBuilderProps> = ({ adType, onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [budget, setBudget] = useState(50);
    const [duration, setDuration] = useState(7);
    const [strategyData, setStrategyData] = useState({
        targetAudience: 'Business Professionals aged 25-45',
        platforms: ['LinkedIn'],
        contentRecommendation: recommendationTemplates[0]
    });

    const nextStep = () => {
        if (currentStep < 3) setCurrentStep(currentStep + 1);
        else onComplete({ ...strategyData, budget, duration, adType });
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
        else onBack();
    };

    const refreshRecommendation = () => {
        const currentIndex = recommendationTemplates.indexOf(strategyData.contentRecommendation);
        const nextIndex = (currentIndex + 1) % recommendationTemplates.length;
        setStrategyData({ ...strategyData, contentRecommendation: recommendationTemplates[nextIndex] });
    };

    const adTypeDisplay = {
        adsetup: 'Ads Setup',
        brand: 'Brand Awareness',
        lead: 'Lead Generation',
        seo: 'SEO Operation'
    }[adType];

    return (
        <div className="h-full w-full bg-[#101010] flex flex-col overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="sticky top-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10"
            >
                <div className="px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={prevStep}
                            className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <div>
                            <h1 className="text-white" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {adTypeDisplay}
                            </h1>
                            <p className="text-[#00d4ff] text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                Step {currentStep} of {steps.length}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Progress Bar (Slimmer) */}
            <div className="px-6 py-4 bg-[#101010]/50 border-b border-white/5 flex justify-center">
                <div className="flex items-center gap-4">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        return (
                            <div key={step.id} className="flex items-center gap-2">
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${isCompleted ? 'bg-[#00d4ff] text-white' :
                                        isActive ? 'bg-[#00d4ff]/20 border border-[#00d4ff] text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.3)]' :
                                            'bg-white/5 border border-white/10 text-white/40'
                                        }`}
                                >
                                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-[#00d4ff]' : 'text-white/40'}`}>
                                    {step.title}
                                </span>
                                {step.id < steps.length && (
                                    <div className="w-4 h-[1px] bg-white/10 mx-1" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto px-6 py-6 pb-32">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div
                                className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                                style={{
                                    background: 'rgba(45, 45, 45, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                                        <Target className="w-5 h-5 text-[#00d4ff]" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Generated Strategy</h3>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-bold block mb-2">Target Audience</label>
                                        <textarea
                                            value={strategyData.targetAudience}
                                            onChange={(e) => setStrategyData({ ...strategyData, targetAudience: e.target.value })}
                                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white text-sm focus:border-[#00d4ff] focus:outline-none transition-colors"
                                            rows={2}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-bold block mb-3">Platform Focus</label>
                                        <div className="flex flex-wrap gap-1.5">
                                            {['Facebook', 'LinkedIn', 'Google', 'X'].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => {
                                                        const newPlatforms = strategyData.platforms.includes(p)
                                                            ? strategyData.platforms.filter(i => i !== p)
                                                            : [...strategyData.platforms, p];
                                                        setStrategyData({ ...strategyData, platforms: newPlatforms });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-full text-[9px] font-bold border-2 transition-all ${strategyData.platforms.includes(p)
                                                        ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]'
                                                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-bold">Recommendation</label>
                                            <button
                                                onClick={refreshRecommendation}
                                                className="flex items-center gap-1 text-[#00d4ff] hover:text-[#00bce6] transition-colors text-[8px] uppercase font-bold px-2 py-0.5 bg-[#00d4ff]/10 rounded-lg border border-[#00d4ff]/20"
                                            >
                                                <RotateCw className="w-2.5 h-2.5" />
                                                Refresh
                                            </button>
                                        </div>
                                        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5 flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center shrink-0 border border-[#00d4ff]/20">
                                                <FileText className="w-5 h-5 text-[#00d4ff]" />
                                            </div>
                                            <p className="text-white text-sm leading-relaxed font-medium">
                                                {strategyData.contentRecommendation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div
                                className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                                style={{
                                    background: 'rgba(45, 45, 45, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                                        <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Budget & Reach</h3>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <div className="flex justify-between items-center mb-5">
                                            <label className="text-white font-bold text-sm tracking-wide">Daily Budget</label>
                                            <span className="text-[#00d4ff] font-black text-2xl">${budget}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="10"
                                            max="500"
                                            step="10"
                                            value={budget}
                                            onChange={(e) => setBudget(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
                                        />
                                        <div className="flex justify-between text-[11px] text-white/40 font-bold mt-3">
                                            <span>$10</span>
                                            <span>$500</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-5">
                                            <label className="text-white font-bold text-sm tracking-wide">Duration (Days)</label>
                                            <span className="text-[#00d4ff] font-black text-2xl">{duration}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="30"
                                            value={duration}
                                            onChange={(e) => setDuration(parseInt(e.target.value))}
                                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00d4ff]"
                                        />
                                        <div className="flex justify-between text-[11px] text-white/40 font-bold mt-3">
                                            <span>1 Day</span>
                                            <span>30 Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-2xl p-5">
                                    <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black mb-1">Estimated Reach</p>
                                    <p className="text-2xl font-black text-white">{(budget * 120).toLocaleString()}+</p>
                                </div>
                                <div className="bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-2xl p-5">
                                    <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black mb-1">Expected ROI</p>
                                    <p className="text-2xl font-black text-white">3.4x</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div
                                className="rounded-2xl border-2 border-white/20 backdrop-blur-xl p-5"
                                style={{
                                    background: 'rgba(45, 45, 45, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/20">
                                        <BarChart3 className="w-5 h-5 text-[#00d4ff]" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg">Final Review</h3>
                                </div>

                                <div className="space-y-5">
                                    <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                                        <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black">Ad Objective</p>
                                        <p className="text-white text-base font-bold">{adTypeDisplay}</p>
                                    </div>

                                    <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                                        <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black">Target Platforms</p>
                                        <p className="text-white text-base font-bold">{strategyData.platforms.join(', ')}</p>
                                    </div>

                                    <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                                        <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black">Audience</p>
                                        <p className="text-white text-sm font-medium leading-relaxed">{strategyData.targetAudience}</p>
                                    </div>

                                    <div className="flex flex-col gap-1 pb-4 border-b border-white/5">
                                        <p className="text-[#00d4ff] text-[10px] uppercase tracking-widest font-black">Budget Plan</p>
                                        <div className="flex items-end gap-2">
                                            <p className="text-white text-base font-bold">${budget}/day</p>
                                            <p className="text-white/40 text-xs mb-0.5">for {duration} days</p>
                                            <div className="ml-auto">
                                                <p className="text-[#00d4ff] text-lg font-black">${budget * duration} Total</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#00d4ff]/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-5 h-5 text-[#00d4ff]" />
                                    </div>
                                    <p className="text-[#00d4ff] text-xs font-bold leading-tight">
                                        Strategy optimized for high conversion potential based on niche analysis.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent">
                <button
                    onClick={nextStep}
                    className="w-full h-14 rounded-2xl bg-[#00d4ff] text-white font-black shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center gap-3 group active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                    {currentStep === 3 ? (
                        <>
                            <BarChart3 className="w-5 h-5" />
                            <span>Confirm & Proceed</span>
                        </>
                    ) : (
                        <>
                            <span>Next Step</span>
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
