import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
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
  onNext?: (data: any) => void;
  onBack?: () => void;
}

export function OnboardingStep1({ onNext, onBack }: OnboardingStep1Props = {}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Added Email
  const [password, setPassword] = useState(''); // Added Password
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

  // Validation: Business Name, Website, Email, and Password are required
  const isValid = businessName.trim() !== '' &&
    websiteUrl.trim().startsWith('http') &&
    email.includes('@') &&
    password.length >= 6;

  const handleNext = () => {
    if (onNext) {
      onNext({
        fullName,
        email,
        password,
        dateOfBirth,
        gender,
        role,
        businessName,
        businessType,
        ownerName,
        websiteUrl
      });
    }
  };

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
          <StepIndicator currentStep={1} totalSteps={3} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Tell us about you</h1>
          <p className="text-white/60">We need some basic details to set up your profile.</p>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Email & Password Section */}
          <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-white/80 font-semibold mb-2">Account Credentials</h3>

            {/* Email Input */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff] transition-all"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/60 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff] transition-all"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff] transition-all"
              placeholder="Enter your full name"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-white/60 text-sm mb-2">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
              style={{ fontSize: '1rem', colorScheme: 'dark' }}
            />
          </div>

          {/* Gender Dropdown */}
          <div className="mb-4 relative">
            <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
              Gender
            </label>
            <button
              onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
              style={{ fontSize: '1rem' }}
            >
              <span>{selectedGender?.label}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isGenderDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isGenderDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden z-10"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              >
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setGender(option.value);
                      setIsGenderDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors ${gender === option.value
                      ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                      : 'text-white hover:bg-white/5'
                      }`}
                    style={{ fontSize: '1rem' }}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
              Role
            </label>
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
              style={{ fontSize: '1rem' }}
            >
              <span>{selectedRole?.label}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isRoleDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden z-10"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                }}
              >
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setRole(option.value);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors ${role === option.value
                      ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                      : 'text-white hover:bg-white/5'
                      }`}
                    style={{ fontSize: '1rem' }}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Section 2: Business Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-1 mb-6"
        >
          <h2 className="text-white/80 mb-3" style={{ fontSize: '1rem', fontWeight: 600 }}>
            Business Info
          </h2>
          <div
            className="rounded-2xl border border-white/20 backdrop-blur-xl p-6"
            style={{
              background: 'rgba(45, 45, 45, 0.1)',
            }}
          >
            {/* Business Name */}
            <div className="mb-4">
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Name
              </label>
              <input
                type="text"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Business Type Dropdown */}
            <div className="mb-4 relative">
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Type
              </label>
              <button
                onClick={() => setIsBusinessTypeDropdownOpen(!isBusinessTypeDropdownOpen)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white flex items-center justify-between focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              >
                <span>{selectedBusinessType?.label}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isBusinessTypeDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isBusinessTypeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden z-10 max-h-60 overflow-y-auto"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {businessTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setBusinessType(option.value);
                        setIsBusinessTypeDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left transition-colors ${businessType === option.value
                        ? 'bg-[#00d4ff]/20 text-[#00d4ff]'
                        : 'text-white hover:bg-white/5'
                        }`}
                      style={{ fontSize: '1rem' }}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Business Owner Name */}
            <div className="mb-4">
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Business Owner Name <span className="text-white/40">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="If different from you"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-white/70 mb-2" style={{ fontSize: '0.875rem' }}>
                Website URL
              </label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00d4ff] focus:ring-2 focus:ring-[#00d4ff]/20 transition-all"
                style={{ fontSize: '1rem' }}
              />
            </div>
          </div>
        </motion.div >

        {/* Next Step Button */}
        < motion.button
          onClick={handleNext}
          disabled={!isValid}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
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
        </motion.button >
      </div >
    </div >
  );
}
