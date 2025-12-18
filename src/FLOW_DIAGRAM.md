# Digi Mark - Complete Application Flow

## 🚀 STARTUP SEQUENCE (NEW - UNIFIED)

```
┌─────────────────────────────────────────────────────────────┐
│                    StartupSequence.tsx                      │
│                                                             │
│  Phase 1: LOGO (1.5s)                                      │
│  ┌──────────────┐                                          │
│  │   [LOGO]     │  ← Animates ONCE                         │
│  │  Digi Mark   │                                          │
│  └──────────────┘                                          │
│                                                             │
│  Phase 2: LOADING (2s)                                     │
│  ┌──────────────┐                                          │
│  │   [LOGO]     │  ← STATIC (no re-animation)             │
│  │  Digi Mark   │                                          │
│  └──────────────┘                                          │
│  ▓▓▓▓▓▓▓▓▓▓░░░░  ← Loading bar (0% → 100%)                │
│   Loading...                                               │
│                                                             │
│  Phase 3: COMPLETE (0.3s)                                  │
│  → Calls onComplete() → Navigate to 'auth'                 │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 AUTHENTICATION FLOW

```
┌──────────────┐     ┌──────────────┐
│  AuthScreen  │────→│  LoginForm   │
│              │     │              │
│ • Create New │     │ • Email      │
│ • Log In     │     │ • Password   │
│ • Socials    │     │ • Submit     │
└──────┬───────┘     └──────────────┘
       │
       ↓ Create Account
┌──────────────────────────────────────┐
│      ONBOARDING (3 STEPS)            │
└──────────────────────────────────────┘
```

## 📝 ONBOARDING FLOW

```
Step 1: Personal + Business Identity
┌─────────────────────────────┐
│ OnboardingStep1             │
│                             │
│ Personal (Optional):        │
│ • Full Name                 │
│ • Date of Birth             │
│ • Gender                    │
│                             │
│ Business (Required):        │
│ • Role                      │
│ • Business Name *           │
│ • Business Type             │
│ • Owner Name (optional)     │
│ • Website URL *             │
│                             │
│ [Next Step] ← Cyan Button   │
│  (disabled until valid)     │
└──────────┬──────────────────┘
           │
           ↓
Step 2: Brand & AI Settings
┌─────────────────────────────┐
│ OnboardingStep2             │
│                             │
│ • Primary Color             │
│ • Accent Color              │
│ • Visual Style              │
│ • Voice Tone Slider         │
│ • Business Description      │
│                             │
│ [Next Step] ← Cyan Button   │
└──────────┬──────────────────┘
           │
           ↓
Step 3: Social Connections
┌─────────────────────────────┐
│ OnboardingStep3             │
│                             │
│ • Instagram                 │
│ • Facebook                  │
│ • LinkedIn                  │
│ • X (Twitter)               │
│                             │
│ [Complete Setup] ← Cyan     │
│ [Skip for now]              │
└──────────┬──────────────────┘
           │
           ↓
      Dashboard
```

## 🏠 DASHBOARD - Main Hub

```
┌─────────────────────────────────────────────┐
│              DASHBOARD                       │
│                                              │
│  Quick Actions (2x2 Grid):                  │
│  ┌─────────────┬─────────────┐             │
│  │ Social      │ Social      │ ← Click     │
│  │ Caption     │ Graphic     │   handlers  │
│  │ [FileText]  │ [Image]     │             │
│  └─────────────┴─────────────┘             │
│  ┌─────────────┬─────────────┐             │
│  │ Social      │ Content     │             │
│  │ Reel        │ Remix       │             │
│  │ [Video]     │ [RefreshCw] │             │
│  └─────────────┴─────────────┘             │
│                                              │
│  Analytics Overview:                         │
│  • Followers: 12.4K (+8.2%)                 │
│  • Reach: 45.8K (+12.5%)                    │
│  • Chart (7 days)                           │
│                                              │
│  Recent Activity Feed                        │
│                                              │
│  Bottom Navigation:                          │
│  [Home] [Create] [Calendar] [Profile]       │
└─────────────────────────────────────────────┘
```

## 📝 TEXT WORKFLOW (Social Caption)

```
Dashboard
   │
   ↓ Click "Social Caption"
┌──────────────────────┐
│  AITextInput         │
│                      │
│ • Platform Selector  │
│ • Prompt Input *     │
│ • Tone Tags          │
│                      │
│ [Generate Caption]   │ ← Cyan, disabled until valid
│  (validation: prompt)│
└──────────┬───────────┘
           │
           ↓ onGenerate()
┌──────────────────────┐
│  AITextResults       │
│                      │
│ • Large Text Card    │
│ • Edit textarea      │
│ • Quick Tools:       │
│   - Regenerate       │
│   - Shorten          │
│   - Expand           │
│                      │
│ [Copy] [Post to      │ ← Cyan button
│        Socials]      │
└──────────┬───────────┘
           │
           ↓ onPostToSocials()
┌──────────────────────┐
│ FinalizeTextPost     │
│                      │
│ • Caption Preview    │
│ • Platform Selection │
│   □ LinkedIn         │ ← Toggle switches
│   ☑ Instagram        │   (cyan when ON)
│   ☑ Twitter/X        │
│   □ Facebook         │
│                      │
│ [Publish to 2        │ ← Cyan, disabled until
│  Selected Channels]  │   ≥1 platform selected
└──────────┬───────────┘
           │
           ↓ onPublish()
┌──────────────────────┐
│  Connect Modal       │ ← Overlay (z-100)
│  (Overlay)           │
│                      │
│  [Link2Off Icon]     │
│                      │
│  "Connect to Publish"│
│                      │
│  Description text    │
│                      │
│  [Connect Now] ← Cyan│
│  [Cancel]            │
└──────────┬───────────┘
           │
           ↓ onConfirm()
┌──────────────────────┐
│ RedirectingScreen    │
│                      │
│  [LinkedIn Icon]     │
│  "Redirecting to     │
│   LinkedIn..."       │
│                      │
│  (Auto-redirect 3s)  │
└──────────┬───────────┘
           │
           ↓ Auto
      Dashboard
```

## 🎨 IMAGE WORKFLOW (Social Graphic)

```
Dashboard
   │
   ↓ Click "Social Graphic"
┌──────────────────────┐
│  ImageInput          │
│                      │
│ • Prompt Input *     │
│ • Aspect Ratio:      │
│   ○ Square           │ ← Radio buttons
│   ● Portrait         │   (cyan when selected)
│   ○ Landscape        │
│ • Style Tags:        │
│   [Photorealistic]   │ ← Pill buttons
│   [Cyberpunk]        │   (cyan when selected)
│   [Minimalist]...    │
│                      │
│ [Generate Image]     │ ← Cyan, disabled until valid
│  (validation: prompt)│
└──────────┬───────────┘
           │
           ↓ onGenerate()
┌──────────────────────┐
│  ImageResults        │
│                      │
│ • Large Image        │
│   Preview (9:16)     │
│                      │
│ • Thumbnail          │
│   Carousel (1/3)     │
│                      │
│ • Quick Actions:     │
│   [Regenerate]       │
│   [Enhance]          │
│   [Download]         │
│                      │
│ • Prompt Info Card   │
│                      │
│ [Save] [Post to      │ ← Cyan button
│        Socials]      │
└──────────┬───────────┘
           │
           ↓ onPostToSocials()
┌──────────────────────┐
│ FinalizeImagePost    │
│                      │
│ • Image Preview      │
│   (small card)       │
│                      │
│ • Caption Input      │
│   "🎨 Check out..."  │
│                      │
│ • Platform Selection │
│   □ LinkedIn         │ ← Toggle switches
│   ☑ Instagram        │   (cyan when ON)
│   □ Twitter/X        │
│   □ Facebook         │
│                      │
│ • Platform Info      │
│   (when selected)    │
│                      │
│ [Publish to 1        │ ← Cyan, disabled until
│  Selected Channel]   │   ≥1 platform selected
└──────────┬───────────┘
           │
           ↓ onPublish()
┌──────────────────────┐
│  Connect Modal       │ ← Overlay (z-100)
│  (Overlay)           │
│                      │
│  [Link2Off Icon]     │
│                      │
│  "Connect Instagram" │
│                      │
│  Description text    │
│                      │
│  [Connect Instagram] │ ← Cyan
│  [Cancel]            │
└──────────┬───────────┘
           │
           ↓ onConfirm()
┌──────────────────────┐
│ RedirectingImage     │
│                      │
│  [Instagram Icon]    │
│  "Redirecting to     │
│   Instagram..."      │
│                      │
│  (Auto-redirect 3s)  │
└──────────┬───────────┘
           │
           ↓ Auto
      Dashboard
```

## 🔄 STATE MANAGEMENT ARCHITECTURE

```
App.tsx (Master Controller)
├── State: currentView (14 possible values)
├── State: isConnectTextModalOpen
├── State: isConnectImageModalOpen
│
├── Handlers: Navigation functions
│   ├── handleStartupComplete()
│   ├── handleCreateAccount()
│   ├── handleStep1Next()
│   ├── handleSocialCaption()
│   ├── handleSocialGraphic()
│   ├── handleTextGenerate()
│   ├── handleImageGenerate()
│   ├── handleTextPublish()
│   ├── handleImagePublish()
│   └── ... (20+ handlers)
│
└── Child Components
    ├── Receive navigation props (onNext, onBack, etc.)
    ├── Manage local UI state (inputs, selections, toggles)
    ├── Call parent handlers via props
    └── Self-validate (isValid state)
```

## 🎨 CYAN BRANDING SYSTEM

```
Primary Action Buttons:
┌───────────────────────────────┐
│  ENABLED STATE                │
│  • bg-[#00d4ff]               │
│  • hover:bg-[#00bce6]         │
│  • boxShadow: rgba(0,212,255) │
│  • text-white                 │
│  • active:scale-95            │
└───────────────────────────────┘

┌───────────────────────────────┐
│  DISABLED STATE               │
│  • bg-white/10                │
│  • opacity-50                 │
│  • cursor-not-allowed         │
│  • no boxShadow               │
└───────────────────────────────┘

Toggle Switches:
┌───────────────────────────────┐
│  ON STATE (Active)            │
│  • bg-[#00d4ff]               │
│  • boxShadow: 0 0 20px cyan   │
│  • white dot at right         │
└───────────────────────────────┘

┌───────────────────────────────┐
│  OFF STATE (Inactive)         │
│  • bg-white/10                │
│  • white/40 dot at left       │
└───────────────────────────────┘
```

## 📊 COMPONENT HIERARCHY

```
App.tsx
│
├── StartupSequence
│   └── GeometricLogo
│
├── AuthScreen
│   ├── GoogleIcon
│   └── AppleIcon
│
├── LoginForm
│
├── OnboardingStep1
│   └── StepIndicator
│
├── OnboardingStep2
│   └── StepIndicator
│
├── OnboardingStep3
│   └── StepIndicator
│
├── Dashboard
│   ├── AnalyticsChart
│   └── RecentActivity
│
├── AITextInput (Text Workflow)
├── AITextResults
├── FinalizeTextPost
├── RedirectingScreen
│
├── ImageInput (Image Workflow)
├── ImageResults
├── FinalizeImagePost
├── RedirectingImage
│
├── ConnectModalOverlay (Reusable)
│
└── DevNavigationPanel (Debug Tool)
```

## 🧪 VALIDATION RULES

```
OnboardingStep1:
  isValid = businessName.trim() !== '' && websiteUrl.trim() !== ''

OnboardingStep2:
  isValid = primaryColor && accentColor && selectedStyle

AITextInput:
  isValid = prompt.trim() !== ''

ImageInput:
  isValid = prompt.trim() !== '' && selectedRatio !== null

FinalizeTextPost:
  isValid = selectedPlatforms.length > 0

FinalizeImagePost:
  isValid = selectedPlatforms.length > 0
```

## ⏱️ TIMING CONFIGURATION

```
StartupSequence:
  • Logo Animation: 0.8s (scale + opacity)
  • Phase 1 Duration: 1.5s
  • Loading Bar: 2s (smooth progress)
  • Complete Delay: 0.3s

Auto-redirects:
  • redirectText → dashboard: 3s
  • redirectImage → dashboard: 3s

Animations:
  • Page transitions: 0.5-0.6s
  • Button interactions: 0.3-0.4s
  • Toggle switches: spring (stiffness: 500, damping: 30)
```

## 🎯 KEY FEATURES

✅ Single logo animation (no double rendering)
✅ Complete text creation workflow
✅ Complete image creation workflow
✅ Proper validation on all input screens
✅ Cyan branding throughout
✅ Glassmorphic design language
✅ Smooth Framer Motion animations
✅ Modal overlays for connection flows
✅ Auto-redirects after publishing
✅ Dev panel for easy testing
✅ Responsive to user input state
✅ Professional error handling (disabled states)
