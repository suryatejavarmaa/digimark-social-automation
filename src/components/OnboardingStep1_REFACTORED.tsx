import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { StepIndicator } from './StepIndicator';

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const roleOptions = [
  { value: 'owner', label: 'Owner' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'freelancer', label: 'Freelancer' },
];

const businessTypeOptions = [
  { value: 'clothing', label: 'Clothing & Fashion' },
  { value: 'cafe', label: 'Café & Restaurant' },
  { value: 'tech', label: 'Technology' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'beauty', label: 'Beauty & Cosmetics' },
  { value: 'fitness', label: 'Fitness & Gym' },
  { value: 'retail', label: 'Retail Store' },
  { value: 'agency', label: 'Agency & Consulting' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

interface OnboardingStep1Props {
  onNext?: () => void;
}

export function OnboardingStep1({ onNext }: OnboardingStep1Props = {}) {
  // ==================== LOCAL STATE ====================
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [role, setRole] = useState('owner');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('clothing');
  const [ownerName, setOwnerName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isBusinessTypeDropdownOpen, setIsBusinessTypeDropdownOpen] = useState(false);

  const selectedGender = genderOptions.find(opt => opt.value === gender);
  const selectedRole = roleOptions.find(opt => opt.value === role);
  const selectedBusinessType = businessTypeOptions.find(opt => opt.value === businessType);

  // ==================== VALIDATION ====================
  // Business Name and Website are REQUIRED. Owner Name is OPTIONAL.
  const isValid = businessName.trim() !== '' && websiteUrl.trim() !== '';

  return (
    <div className="h-full w-full bg-[#101010] overflow-auto">
      <div className="min-h-full flex flex-col px-6 py-8">
        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StepIndicator currentStep={1} totalSteps={3} />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-white mt-8 mb-2"
          style={{ fontSize: '2rem', fontWeight: 700 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Tell us about yourself
        </motion.h1>
        <motion.p
          className="text-white/60 mb-8"
          style={{ fontSize: '1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Help us personalize your experience
        </motion.p>

        {/* Form Content */}
        <motion.div
          className="space-y-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h2 className="text-white/80" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Personal Details (Optional)
            </h2>

            {/* Full Name */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Gender Dropdown */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Gender
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                  style={{ fontSize: '1rem' }}
                >
                  <span>{selectedGender?.label}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isGenderDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isGenderDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
                    {genderOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setGender(option.value);
                          setIsGenderDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-all"
                        style={{ fontSize: '1rem' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Business Identity Section */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h2 className="text-white/80" style={{ fontSize: '1.125rem', fontWeight: 600 }}>
              Business Identity <span className="text-red-400">*</span>
            </h2>

            {/* Role Dropdown */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Your Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                  style={{ fontSize: '1rem' }}
                >
                  <span>{selectedRole?.label}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isRoleDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setRole(option.value);
                          setIsRoleDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-all"
                        style={{ fontSize: '1rem' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Business Type Dropdown */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBusinessTypeDropdownOpen(!isBusinessTypeDropdownOpen)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                  style={{ fontSize: '1rem' }}
                >
                  <span>{selectedBusinessType?.label}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isBusinessTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isBusinessTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                    {businessTypeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setBusinessType(option.value);
                          setIsBusinessTypeDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-all"
                        style={{ fontSize: '1rem' }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Business Owner Name (Optional) */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Owner Name (Optional)
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Website URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://acmecorp.com"
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Next Step Button - CYAN BRANDED */}
        <motion.button
          onClick={onNext}
          disabled={!isValid}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={`w-full py-4 rounded-full text-white transition-all active:scale-95 ${
            isValid 
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
    </div>
  );
}
