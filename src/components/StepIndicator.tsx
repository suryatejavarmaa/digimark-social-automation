import { motion } from 'motion/react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  // Calculate progress percentage for the connecting line
  // If totalSteps is 3:
  // Step 1: 0%
  // Step 2: 50%
  // Step 3: 100%
  const progress = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Step Text */}
      <div className="mb-6 text-white/60" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
        Step {currentStep} of {totalSteps}
      </div>

      <div className="relative w-full flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#00d4ff] to-[#00bce6] z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Dots */}
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${isActive
                ? 'border-[#00d4ff] bg-[#101010] shadow-[0_0_15px_rgba(0,212,255,0.5)] scale-110'
                : isCompleted
                  ? 'border-[#00d4ff] bg-[#00d4ff] text-[#101010]'
                  : 'border-white/20 bg-[#101010] text-white/40'
                }`}
            >
              {isCompleted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                  {stepNumber}
                </span>
              )}

              {/* Pulse effect for active step */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-[#00d4ff] animate-ping opacity-20" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
