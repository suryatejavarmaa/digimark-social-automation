import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Send } from 'lucide-react';
import { StartupSequence } from './components/StartupSequence';
import { AuthScreen } from './components/AuthScreen';
import { LoginForm } from './components/LoginForm';
import { OnboardingStep1 } from './components/OnboardingStep1';
import { OnboardingStep2 } from './components/OnboardingStep2';
import { OnboardingStep3 } from './components/OnboardingStep3';
import { Dashboard } from './components/Dashboard';
import { AITextInput } from './components/AITextInput';
import { AITextResults } from './components/AITextResults';
import { FinalizeTextPost } from './components/FinalizeTextPost';
import { ImageInput } from './components/ImageInput';
import { ImageResults } from './components/ImageResults';
import { FinalizeImagePost } from './components/FinalizeImagePost';
import { RedirectingScreen } from './components/RedirectingScreen';
import { RedirectingImage } from './components/RedirectingImage';
import { ConnectModalOverlay } from './components/ConnectModalOverlay';
import { MultiPlatformFailureModal } from './components/MultiPlatformFailureModal';
import { ScheduleSuccessModal } from './components/ScheduleSuccessModal';
import { AllNotifications } from './components/AllNotifications';
import { AdSetupSelection } from './components/AdSetupSelection';
import { StrategyBuilder } from './components/StrategyBuilder';
import { ExecutionSetup } from './components/ExecutionSetup';

import { SocialService } from './services/SocialService';
import { UserService } from './services/UserService';
import { AIService } from './services/AIService';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, storage } from './lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

// ==================== TYPE DEFINITIONS ====================
type ViewState =
  | 'startup'
  | 'auth'
  | 'login'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'dashboard'
  | 'captionInput'
  | 'textResults'
  | 'finalizeText'
  | 'redirectText'
  | 'imageInput'
  | 'imageResults'
  | 'finalizeImage'
  | 'redirectImage'
  | 'notifications'
  | 'adSetup'
  | 'strategyBuilder'
  | 'executionSetup';

export default function App() {
  // ==================== STATE MANAGEMENT ====================
  const [currentView, setCurrentView] = useState<ViewState>('startup');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin', 'instagram', 'facebook', 'youtube', 'twitter']);
  const [generatedImageUrls, setGeneratedImageUrls] = useState<string[]>([]);
  const [imagePrompts, setImagePrompts] = useState<string[]>([]);

  // Onboarding Data State
  const [onboardingData, setOnboardingData] = useState<any>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // New loading state

  // Ads State
  const [selectedAdType, setSelectedAdType] = useState<'adsetup' | 'brand' | 'lead' | 'seo' | null>(null);
  const [adStrategyData, setAdStrategyData] = useState<any>({});

  // Content State
  const [generatedCaption, setGeneratedCaption] = useState('');


  // Store last params for regeneration
  const [lastTextParams, setLastTextParams] = useState<{ prompt: string, platform: string, tones: string[] } | null>(null);

  // Schedule Success Modal State
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  const [scheduleSuccessData, setScheduleSuccessData] = useState<{ time: string; platforms: string[] }>({ time: '', platforms: [] });

  // ==================== 0. AUTH LISTENER ====================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user.uid);
        setUserId(user.uid);

        // Fetch Profile
        try {
          const profile = await UserService.getUserProfile(user.uid);
          if (profile) {
            setOnboardingData(profile);
            setOnboardingData(profile);

            // Check for pending restoration state (from OAuth redirect)
            const savedStateJson = sessionStorage.getItem('PENDING_PUBLISH_STATE');
            if (savedStateJson) {
              try {
                const savedState = JSON.parse(savedStateJson);
                console.log("Restoring pending state...", savedState);

                // Restore Data
                if (savedState.selectedImageForPost) setSelectedImageForPost(savedState.selectedImageForPost);
                if (savedState.selectedPromptForPost) setSelectedPromptForPost(savedState.selectedPromptForPost);
                if (savedState.selectedCaptionForPost) setSelectedCaptionForPost(savedState.selectedCaptionForPost);

                if (savedState.lastImageParams) setLastImageParams(savedState.lastImageParams);
                if (savedState.lastTextParams) setLastTextParams(savedState.lastTextParams);

                if (savedState.generatedImageUrls) setGeneratedImageUrls(savedState.generatedImageUrls);
                if (savedState.imagePrompts) setImagePrompts(savedState.imagePrompts);
                if (savedState.generatedCaption) setGeneratedCaption(savedState.generatedCaption);

                if (savedState.publishData) setPublishData(savedState.publishData);
                if (savedState.publishingQueue) setPublishingQueue(savedState.publishingQueue);

                // Restore View
                setCurrentView(savedState.currentView);

                // Clear saved state
                sessionStorage.removeItem('PENDING_PUBLISH_STATE');
              } catch (e) {
                console.error("Failed to restore state:", e);
                setCurrentView('dashboard');
              }
            } else {
              setCurrentView('dashboard');
            }
          } else {
            // User exists in Auth but no profile? Edge case, maybe go to step1
            setCurrentView('step1');
          }
        } catch (err) {
          console.error("Error fetching profile on load:", err);
        }
      } else {
        console.log("No user signed in.");
        // If we were in dashboard, kick out? Or just let them be if they are in startup
        // For now, we only auto-redirect if we find a user.
      }
    });

    return () => unsubscribe();
  }, []);


  // ==================== 1. STARTUP SEQUENCE ====================

  // StartupSequence handles logo animation + loading internally
  // When complete, it calls this handler to navigate to Auth
  const handleStartupComplete = () => {
    // Only go to auth if we haven't already auto-logged in
    if (currentView === 'startup' && !userId) {
      setCurrentView('auth');
    }
  };

  // ==================== 2. ONBOARDING FLOW HANDLERS ====================

  const handleCreateAccount = () => setCurrentView('step1');
  const handleLogin = () => setCurrentView('login');
  const handleLoginToDashboard = () => setCurrentView('dashboard');
  const handleBackToAuth = () => setCurrentView('auth');

  const handleStep1Next = (data: any) => {
    setOnboardingData((prev: any) => ({ ...prev, ...data }));
    setCurrentView('step2');
  };

  const handleStep2Next = (data: any) => {
    setOnboardingData((prev: any) => ({ ...prev, ...data }));
    setCurrentView('step3');
  };

  const handleStep2Back = () => setCurrentView('step1');
  const handleStep3Back = () => setCurrentView('step2');

  const saveAndNavigateToDashboard = async (additionalData: any = {}) => {
    // This is now the FINAL step of onboarding (Step 3)
    // We need to SIGN UP the user here using the data collected

    // NOTE: We need to capture Email/Password in Step 1 or Step 3.
    // Assuming we will update Step 1 to capture Email/Password.

    const finalData = { ...onboardingData, ...additionalData };
    console.log('Final Onboarding Data for Signup:', finalData);

    try {
      // We need email and password from the data
      if (!finalData.email || !finalData.password) {
        alert("Missing email or password for signup!");
        return;
      }

      // Create User & Save Profile
      const newUserId = await UserService.signUp(finalData.email, finalData.password, finalData);
      setUserId(newUserId);
      setCurrentView('dashboard');

      // 4. Trigger Automatic Website Summarization
      if (finalData.websiteUrl) {
        console.log("Triggering automatic website summarization...");
        fetch('http://127.0.0.1:5001/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: finalData.websiteUrl,
            userId: newUserId // Link summary to this user
          }),
        })
          .then(res => res.json())
          .then(data => console.log("✅ Summarization started:", data))
          .catch(err => console.error("❌ Summarization trigger failed:", err));
      }

    } catch (error: any) {
      console.error("Signup failed:", error);

      // Handle email already in use
      if (error.message && error.message.includes('email-already-in-use')) {
        const signInConfirm = window.confirm(
          `An account with email "${finalData.email}" already exists.\n\nWould you like to sign in instead?`
        );

        if (signInConfirm && finalData.password) {
          try {
            const existingUserId = await UserService.login(finalData.email, finalData.password);
            setUserId(existingUserId);
            setCurrentView('dashboard');
            alert("Signed in successfully!");
            return;
          } catch (signInError: any) {
            alert("Sign in failed: " + signInError.message);
          }
        }
      } else {
        alert("Signup failed: " + error.message);
      }
    }
  };

  const handleStep3Complete = (data: any) => {
    saveAndNavigateToDashboard(data);
  };

  const handleStep3Skip = () => {
    // Save with empty connected socials if skipped
    saveAndNavigateToDashboard({ connectedSocials: [] });
  };

  // ==================== 3. LOGOUT HANDLER ====================
  const handleLogout = async () => {
    try {
      await UserService.logout();
      setUserId(null);
      setOnboardingData({});
      setCurrentView('auth');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ==================== 4. DASHBOARD NAVIGATION ====================

  // ==================== 5. TEXT WORKFLOW HANDLERS ====================

  const handleTextGenerate = (text: string, params?: { prompt: string, platform: string, tones: string[] }) => {
    setGeneratedCaption(text);
    if (params) {
      setLastTextParams(params);
    }
    setCurrentView('textResults');
  };

  const handleRegenerate = async (newPrompt?: string) => {
    if (!lastTextParams) return;

    // Update params if a new prompt is provided
    const currentParams = newPrompt
      ? { ...lastTextParams, prompt: newPrompt }
      : lastTextParams;

    if (newPrompt) {
      setLastTextParams(currentParams);
    }

    try {
      const result = await AIService.generateCaption(
        currentParams.prompt,
        currentParams.platform,
        currentParams.tones,
        userId
      );
      setGeneratedCaption(result);
    } catch (e) {
      console.error("Regeneration failed", e);
    }
  };

  const handleTextPost = () => {
    setSelectedCaptionForPost(generatedCaption);
    setCurrentView('finalizeText');
  };

  // Auto-redirect from redirectText to dashboard after 3s
  useEffect(() => {
    if (currentView === 'redirectText') {
      const timer = setTimeout(() => {
        setCurrentView('dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // ==================== 5. IMAGE WORKFLOW HANDLERS ====================

  const [lastImageParams, setLastImageParams] = useState<{ prompt: string, style: string, ratio: string } | null>(null);

  // State for the selected image to post
  const [selectedImageForPost, setSelectedImageForPost] = useState<string | null>(null);
  const [selectedPromptForPost, setSelectedPromptForPost] = useState<string | null>(null);
  const [selectedCaptionForPost, setSelectedCaptionForPost] = useState<string>("");

  const [isGeneratingImages, setIsGeneratingImages] = useState(false);

  const handleImageGenerate = async (urls: string[], prompts: string[], params?: { prompt: string, style: string, ratio: string }) => {
    // 1. Store params immediately
    if (params) {
      setLastImageParams(params);
    }

    // 2. Switch to results view immediately to show loader
    setCurrentView('imageResults');
    setIsGeneratingImages(true);
    setGeneratedImageUrls([]); // Clear previous images

    // 3. If URLs are already provided (legacy/direct), just set them
    if (urls.length > 0) {
      setGeneratedImageUrls(urls);
      setImagePrompts(prompts);
      setIsGeneratingImages(false);
      return;
    }

    // 4. Otherwise, perform generation here (Async)
    if (params && userId) {
      try {
        const result = await AIService.generateImage(
          params.prompt,
          params.style,
          params.ratio,
          userId
        );
        setGeneratedImageUrls(result.images);
        setImagePrompts(result.prompts);
      } catch (error) {
        console.error("Generation failed:", error);
        // Handle error (maybe show toast)
      } finally {
        setIsGeneratingImages(false);
      }
    }
  };

  const handleImageRegenerate = async (newPrompt?: string) => {
    if (!lastImageParams) return;

    const currentParams = newPrompt
      ? { ...lastImageParams, prompt: newPrompt }
      : lastImageParams;

    // Update params if changed
    if (newPrompt) setLastImageParams(currentParams);

    setIsGeneratingImages(true); // Start loading
    try {
      setGeneratedImageUrls([]);

      const result = await AIService.generateImage(
        currentParams.prompt,
        currentParams.style,
        currentParams.ratio,
        userId
      );
      setGeneratedImageUrls(result.images);
      setImagePrompts(result.prompts);
    } catch (e) {
      console.error("Image Regeneration failed", e);
    } finally {
      setIsGeneratingImages(false); // Stop loading
    }
  };

  const handleImagePost = (url?: string, prompt?: string) => {
    if (url) setSelectedImageForPost(url);
    if (prompt) setSelectedPromptForPost(prompt);
    setCurrentView('finalizeImage');
  };

  // ==================== 6. PUBLISHING & CONNECTION FLOW ====================

  const [publishingQueue, setPublishingQueue] = useState<string[]>([]);
  const [currentPlatformToConnect, setCurrentPlatformToConnect] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishData, setPublishData] = useState<{ imageUrl?: string, prompt?: string, caption?: string } | null>(null);

  // Check URL params for successful connection callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get('connected');
    const success = params.get('success');
    const username = params.get('username'); // Twitter username from callback

    if (connectedPlatform) {
      console.log(`Connected to ${connectedPlatform}!`);
      SocialService.connect(connectedPlatform);

      // Show success message for LinkedIn OAuth
      if (connectedPlatform === 'linkedin' && success === 'true') {
        alert('✅ LinkedIn connected successfully! You can now schedule posts for automatic publishing.');
      }

      // Store Twitter username if provided
      if (connectedPlatform === 'twitter' && username) {
        localStorage.setItem('twitter_username', username);
        console.log(`Saved Twitter username: @${username}`);
      }

      // Store Facebook username if provided
      if (connectedPlatform === 'facebook' && username) {
        localStorage.setItem('facebook_username', username);
        console.log(`Saved Facebook username: ${username}`);
      }

      // Clear params
      window.history.replaceState({}, '', window.location.pathname);

      // If we were in the middle of a flow, we might want to resume
      // For now, user is back on dashboard or wherever they left off
    }
  }, []);

  const handleStartPublishing = (platforms: string[], data: { imageUrl?: string, prompt?: string, caption?: string }) => {
    setPublishData(data);
    // Skip connection check as per user request - go straight to preview/manual publish
    handleExecutePublish(platforms, data);
  };

  const handleConnectConfirm = () => {
    if (!currentPlatformToConnect) return;

    // SAVE STATE before redirecting so we can return to the preview page
    const stateToSave = {
      currentView,
      selectedImageForPost,
      selectedPromptForPost,
      selectedCaptionForPost,
      lastImageParams,
      lastTextParams,
      generatedImageUrls,
      imagePrompts,
      generatedCaption,
      publishData,
      publishingQueue
    };
    sessionStorage.setItem('PENDING_PUBLISH_STATE', JSON.stringify(stateToSave));

    // Redirect to backend auth with userId and current origin
    const origin = encodeURIComponent(window.location.origin);
    window.location.href = `http://127.0.0.1:5001/auth/${currentPlatformToConnect}?userId=${userId}&redirect_origin=${origin}`;
  };

  const handleConnectCancel = () => {
    setCurrentPlatformToConnect(null);
    setPublishingQueue([]);
  };

  // New State for Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<{ platforms: string[], data: any } | null>(null);
  const [publishResult, setPublishResult] = useState<any>(null);

  // Multi-Platform Failure Modal State
  const [showMultiPlatformFailure, setShowMultiPlatformFailure] = useState(false);
  const [failedPlatforms, setFailedPlatforms] = useState<string[]>([]);

  const handleExecutePublish = (platforms: string[], data: any) => {
    // Instead of posting immediately, show the preview modal
    setPreviewData({ platforms, data });
    setShowPreviewModal(true);
    setPublishResult(null); // Reset previous results
  };

  const confirmPublish = async () => {
    if (!previewData) return;

    setIsPublishing(true);
    const { platforms, data } = previewData;
    const finalMediaUrl = data.imageUrl;

    try {
      // Check if this is a scheduled post
      if (data.isScheduled && data.scheduledAt) {
        console.log('[Schedule] Scheduling post for:', data.scheduledAt);

        const response = await fetch('http://127.0.0.1:5001/schedule-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            platforms,
            content: data.caption || data.prompt,
            mediaUrl: finalMediaUrl,
            scheduledAt: data.scheduledAt
          })
        });

        const result = await response.json();
        console.log('[Schedule] Result:', result);

        if (result.success) {
          // Show custom modal instead of browser alert
          setScheduleSuccessData({
            time: new Date(data.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
            platforms: platforms
          });
          setShowScheduleSuccess(true);
          setShowPreviewModal(false);
        } else {
          // Keep error alert for now (can be customized later)
          alert(`❌ Failed to schedule post: ${result.error}`);
        }

        return; // Exit early for scheduled posts
      }

      // Original immediate publish logic
      // Step 1: Auto-download image - REMOVED for LinkedIn/Facebook as per user request.
      // Instagram download is handled in the "Post Manually" button.

      /* 
      const needsManualDownload = platforms.some(p => p !== 'twitter' && p !== 'facebook' && p !== 'instagram');
  
      if (finalMediaUrl && needsManualDownload) {
         // Logic removed to prevent auto-download on "Confirm" click
      }
      */

      // Step 2: Call backend to publish
      const response = await fetch('http://127.0.0.1:5001/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          platforms,
          content: data.caption || data.prompt,
          mediaUrl: finalMediaUrl
        })
      });
      const result = await response.json();
      console.log("Publish result:", result);

      // Check for multi-platform failure
      if (result.multiPlatformFailed && platforms.length > 1) {
        console.log("All platforms failed, showing retry modal");
        setFailedPlatforms(platforms);
        setShowMultiPlatformFailure(true);
        setShowPreviewModal(false);
        return;
      }

      setPublishResult(result); // Store result to show in modal

    } catch (error) {
      console.error("Publishing/Scheduling failed:", error);
      alert("❌ Operation failed. Please try again.");
      setShowPreviewModal(false); // Close on critical error
    } finally {
      setIsPublishing(false);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewData(null);
    setPublishResult(null);
  };

  // Retry publishing for single platform after multi-platform failure
  const handleRetryPlatform = async (platform: string) => {
    if (!previewData) return;

    console.log(`Retrying single platform: ${platform}`);

    // Close failure modal and show preview modal again
    setShowMultiPlatformFailure(false);
    setShowPreviewModal(true);
    setIsPublishing(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          platforms: [platform], // Only retry single platform
          content: previewData.data.caption || previewData.data.prompt,
          mediaUrl: previewData.data.imageUrl
        })
      });
      const result = await response.json();
      console.log(`Single platform ${platform} result:`, result);
      setPublishResult(result);
    } catch (error) {
      console.error(`Failed to publish to ${platform}:`, error);
      alert(`❌ Failed to publish to ${platform}. Please try again.`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Auto-redirect from redirectImage to dashboard after 3s
  useEffect(() => {
    if (currentView === 'redirectImage' || currentView === 'redirectText') {
      const timer = setTimeout(() => {
        setCurrentView('dashboard');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // ==================== BACK NAVIGATION HELPERS ====================

  const handleBackToDashboard = () => setCurrentView('dashboard');
  const handleBackToTextResults = () => setCurrentView('textResults');
  const handleBackToImageResults = () => setCurrentView('imageResults');

  // ==================== ADS WORKFLOW HANDLERS ====================

  const handleAdSetupSelect = (type: 'adsetup' | 'brand' | 'lead' | 'seo') => {
    setSelectedAdType(type);
    setCurrentView('strategyBuilder');
  };

  const handleStrategyComplete = (data: any) => {
    setAdStrategyData(data);
    setCurrentView('executionSetup');
  };

  const handleLaunchCampaign = (campaignData: any) => {
    console.log('Launching Campaign:', campaignData);
    // Future implementation: Send to backend
    setCurrentView('dashboard');
  };

  // ==================== RENDER LOGIC ====================

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1a1a1a]">
      {/* Main View Rendering */}
      <AnimatePresence mode="wait">
        {/* STARTUP: Unified logo animation + loading sequence */}
        {currentView === 'startup' && (
          <StartupSequence key="startup" onComplete={handleStartupComplete} />
        )}

        {/* AUTH & ONBOARDING */}
        {currentView === 'auth' && (
          <AuthScreen
            key="auth"
            onLoginClick={handleLogin}
            onCreateAccountClick={handleCreateAccount}
          />
        )}

        {currentView === 'login' && (
          <LoginForm key="login" onBack={handleBackToAuth} onLogin={handleLoginToDashboard} />
        )}

        {currentView === 'step1' && (
          <OnboardingStep1
            key="step1"
            onNext={handleStep1Next}
            onBack={handleBackToAuth}
          />
        )}

        {currentView === 'step2' && (
          <OnboardingStep2
            key="step2"
            onNext={handleStep2Next}
            onBack={handleStep2Back}
          />
        )}

        {currentView === 'step3' && (
          <OnboardingStep3
            key="step3"
            onComplete={handleStep3Complete}
            onSkip={handleStep3Skip}
            onBack={handleStep3Back}
          />
        )}

        {/* DASHBOARD */}
        {currentView === 'dashboard' && (
          <Dashboard
            key="dashboard"
            userId={userId || ''}
            onSocialCaptionClick={() => setCurrentView('captionInput')}
            onSocialGraphicClick={() => setCurrentView('imageInput')}
            onNotificationsClick={() => setCurrentView('notifications')}
            onAdsClick={() => setCurrentView('adSetup')}
            userProfile={onboardingData}
            onLogout={handleLogout}
          />
        )}

        {/* ADS WORKFLOW */}
        {currentView === 'adSetup' && (
          <AdSetupSelection
            key="adSetup"
            onSelect={handleAdSetupSelect}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'strategyBuilder' && selectedAdType && (
          <StrategyBuilder
            key="strategyBuilder"
            adType={selectedAdType}
            onComplete={handleStrategyComplete}
            onBack={() => setCurrentView('adSetup')}
          />
        )}

        {currentView === 'executionSetup' && (
          <ExecutionSetup
            key="executionSetup"
            strategyData={adStrategyData}
            onLaunch={handleLaunchCampaign}
            onBack={() => setCurrentView('strategyBuilder')}
          />
        )}

        {/* NOTIFICATIONS */}
        {currentView === 'notifications' && (
          <AllNotifications
            key="notifications"
            userId={userId || ''}
            onBack={() => setCurrentView('dashboard')}
          />
        )}


        {/* WEBSITE SUMMARIZER - Removed as per request (Automatic now) */}

        {/* TEXT WORKFLOW */}
        {currentView === 'captionInput' && (
          <AITextInput
            key="captionInput"
            userId={userId}
            onGenerate={handleTextGenerate}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'textResults' && (
          <AITextResults
            key="textResults"
            generatedContent={generatedCaption}
            onPostToSocials={handleTextPost}
            onBack={handleBackToDashboard}
            onRegenerate={handleRegenerate}
            initialPrompt={lastTextParams?.prompt}
          />
        )}

        {currentView === 'finalizeText' && (
          <FinalizeTextPost
            key="finalizeText"
            onPublish={handleStartPublishing}
            onBack={handleBackToTextResults}
            caption={selectedCaptionForPost}
            userId={userId}
          />
        )}

        {currentView === 'redirectText' && (
          <RedirectingScreen key="redirectText" platform="linkedin" />
        )}

        {/* IMAGE WORKFLOW */}
        {currentView === 'imageInput' && (
          <ImageInput
            key="imageInput"
            onGenerate={handleImageGenerate}
            onBack={handleBackToDashboard}
            userId={userId}
          />
        )}

        {currentView === 'imageResults' && (
          <ImageResults
            key="imageResults"
            generatedImageUrls={generatedImageUrls}
            prompts={imagePrompts}
            onPostToSocials={handleImagePost}
            onBack={() => setCurrentView('imageInput')}
            onRegenerate={handleImageRegenerate}
            isGenerating={isGeneratingImages}
          />
        )}

        {currentView === 'finalizeImage' && (
          <FinalizeImagePost
            key="finalizeImage"
            onPublish={handleStartPublishing}
            onBack={handleBackToImageResults}
            imageUrl={selectedImageForPost}
            prompt={selectedPromptForPost}
            userId={userId}
          />
        )}

        {currentView === 'redirectImage' && (
          <RedirectingImage key="redirectImage" platform="Instagram" />
        )}
      </AnimatePresence>

      {/* Connect Platform Modal Overlay */}
      {currentPlatformToConnect && (
        <ConnectModalOverlay
          title={`Connect ${currentPlatformToConnect.charAt(0).toUpperCase() + currentPlatformToConnect.slice(1)}`}
          description={
            currentPlatformToConnect === 'twitter' && localStorage.getItem('twitter_username')
              ? `Currently connected as @${localStorage.getItem('twitter_username')}. Do you want to switch accounts or continue with this account?`
              : currentPlatformToConnect === 'facebook' && localStorage.getItem('facebook_username')
                ? `Currently connected as ${localStorage.getItem('facebook_username')}. Do you want to switch accounts or continue with this account?`
                : `${currentPlatformToConnect.charAt(0).toUpperCase() + currentPlatformToConnect.slice(1)} requires authentication to publish. Connect your account to continue.`
          }
          buttonText={
            (currentPlatformToConnect === 'twitter' && localStorage.getItem('twitter_username')) ||
              (currentPlatformToConnect === 'facebook' && localStorage.getItem('facebook_username'))
              ? 'Switch Account'
              : `Connect ${currentPlatformToConnect.charAt(0).toUpperCase() + currentPlatformToConnect.slice(1)} Now`
          }
          onCancel={handleConnectCancel}
          onConfirm={handleConnectConfirm}
        />
      )}


      {/* PREVIEW MODAL */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
              <h3 className="text-lg font-bold text-white">
                {publishResult ? 'Publishing Results' : 'Preview Post'}
              </h3>
              {!isPublishing && (
                <button onClick={closePreviewModal} className="text-white/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content */}
            <div className="p-5 max-h-[60vh] overflow-y-auto bg-[#1a1a1a]">

              {/* Image Preview */}
              {previewData.data.imageUrl && (
                <div className="mb-5 rounded-xl overflow-hidden border border-white/10 bg-black flex justify-center aspect-square">
                  <img src={previewData.data.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Caption Preview (Before Publishing) */}
              {!publishResult && (
                <div className="mb-4">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2 block ml-1">CAPTION</label>
                  <div className="bg-[#262626] p-4 rounded-xl text-white/90 text-sm whitespace-pre-wrap border border-white/5">
                    {previewData.data.caption || previewData.data.prompt}
                  </div>
                </div>
              )}

              {/* Results View (After Publishing) */}
              {publishResult && (
                <div className="space-y-4">
                  {Object.entries(publishResult.results).map(([platform, res]: [string, any]) => {
                    // isSuccess only for ACTUAL auto-posts, not manual fallbacks
                    const isSuccess = (res.action === 'post_published' || res.action === 'tweet_posted' || res.action === 'auto_posted');

                    return (
                      <div key={platform} className={`p-5 rounded-xl border ${isSuccess ? 'bg-[#00d4ff]/10 border-[#00d4ff]/30' : 'bg-red-500/10 border-red-500/30'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="capitalize font-bold text-white text-lg">{platform}</span>
                            {isSuccess ? (
                              <span className="text-[#00d4ff] text-sm font-bold bg-[#00d4ff]/20 px-3 py-1 rounded-full">✓ Successfully Posted</span>
                            ) : (
                              <span className="text-red-400 text-sm font-bold bg-red-500/20 px-3 py-1 rounded-full">❌ Auto-Post Failed</span>
                            )}
                          </div>
                        </div>

                        {/* Success Message - Only for REAL auto-posts, not fallbacks */}
                        {isSuccess && (res.action === 'post_published' || res.action === 'tweet_posted' || res.action === 'auto_posted') && (
                          <p className="text-[#00d4ff] text-sm mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse"></span>
                            Your post has been published successfully!
                          </p>
                        )}

                        {/* Success Actions - View Live Post */}
                        {(res.action === 'post_published' || res.action === 'tweet_posted' || res.action === 'auto_posted') && res.url && (
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 hover:underline"
                          >
                            View Live Post <ExternalLink size={14} />
                          </a>
                        )}

                        {/* Manual / Fallback Actions */}
                        {(res.action === 'share_dialog' || res.action === 'manual_fallback' || res.action === 'manual') && (
                          <div className="mt-2">
                            <p className="text-xs text-white/70 mb-3">
                              {res.error ? `Error: ${res.error}` : 'Automatic posting not supported or failed.'}
                            </p>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(res.optimizedCaption || previewData.data.caption);
                                  alert("Caption copied!");
                                }}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white transition-colors"
                              >
                                Copy Caption
                              </button>

                              <button
                                onClick={async () => {
                                  // 1. Always Copy Caption for Manual Posts (Instagram & Facebook)
                                  const captionToCopy = res.optimizedCaption || previewData.data.caption;
                                  try {
                                    await navigator.clipboard.writeText(captionToCopy);
                                    console.log("Caption copied to clipboard");
                                  } catch (err) {
                                    console.error("Failed to copy caption:", err);
                                  }

                                  // 2. Special Handling for Instagram: Force Download Image
                                  if (platform === 'instagram' && previewData.data.imageUrl) {
                                    try {
                                      console.log("Downloading image for Instagram...");
                                      const response = await fetch(previewData.data.imageUrl);
                                      const blob = await response.blob();
                                      const downloadUrl = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = downloadUrl;
                                      link.download = `instagram-post-${Date.now()}.jpg`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(downloadUrl);

                                      alert("📸 Instagram Manual Mode:\n\n1. Image is DOWNLOADING to your system...\n2. Caption is COPIED to clipboard!\n\nPaste the caption and upload the image on the Instagram window.");
                                    } catch (downloadError) {
                                      console.warn("Could not download image automatically:", downloadError);
                                      // Fallback
                                      window.open(previewData.data.imageUrl, '_blank');
                                      alert("Could not auto-download image. It has been opened in a new tab. Please save it manually.\n\nCaption is copied!");
                                    }
                                  }

                                  // 3. Open the Platform URL
                                  const width = 600;
                                  const height = 700;
                                  const left = window.screen.width / 2 - width / 2;
                                  const top = window.screen.height / 2 - height / 2;
                                  window.open(res.url, `Share to ${platform}`, `width=${width},height=${height},top=${top},left=${left}`);
                                }}
                                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs text-white transition-colors flex items-center gap-1"
                              >
                                Post Manually <ExternalLink size={12} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Manual Posting for FAILED platforms */}
                        {!isSuccess && res.status === 'failed' && (
                          <div className="mt-3">
                            <p className="text-xs text-white/50 mb-2">
                              {res.error || 'Unable to publish automatically'}
                            </p>
                            <button
                              onClick={async () => {
                                // 1. Copy caption
                                const captionToCopy = previewData.data.caption;
                                try {
                                  await navigator.clipboard.writeText(captionToCopy);
                                  console.log("Caption copied to clipboard");
                                } catch (err) {
                                  console.error("Failed to copy caption:", err);
                                }

                                // 2. Handle Instagram image download
                                if (platform === 'instagram' && previewData.data.imageUrl) {
                                  try {
                                    console.log("Downloading image for Instagram...");
                                    const response = await fetch(previewData.data.imageUrl);
                                    const blob = await response.blob();
                                    const downloadUrl = window.URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = downloadUrl;
                                    link.download = `instagram-post-${Date.now()}.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(downloadUrl);
                                    alert("📸 Caption copied! Image is downloading...");
                                  } catch (downloadError) {
                                    console.warn("Could not download image:", downloadError);
                                    window.open(previewData.data.imageUrl, '_blank');
                                    alert("Caption copied! Image opened in new tab.");
                                  }
                                }

                                // 3. Generate fallback URL
                                let fallbackUrl = '';
                                const encodedContent = encodeURIComponent(captionToCopy || '');
                                const encodedImage = previewData.data.imageUrl ? encodeURIComponent(previewData.data.imageUrl) : '';

                                switch (platform) {
                                  case 'linkedin':
                                    fallbackUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedImage || 'https://linkedin.com'}`;
                                    break;
                                  case 'twitter':
                                    fallbackUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
                                    break;
                                  case 'facebook':
                                    fallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedImage || 'https://facebook.com'}`;
                                    break;
                                  case 'instagram':
                                    fallbackUrl = 'https://www.instagram.com/';
                                    break;
                                }

                                // 4. Open URL
                                if (fallbackUrl) {
                                  const width = 600;
                                  const height = 700;
                                  const left = window.screen.width / 2 - width / 2;
                                  const top = window.screen.height / 2 - height / 2;
                                  window.open(fallbackUrl, `Share to ${platform}`, `width=${width},height=${height},top=${top},left=${left}`);
                                }
                              }}
                              className="px-4 py-2 bg-[#00d4ff] hover:bg-[#00bce6] rounded-lg text-sm text-white font-medium transition-all flex items-center gap-2"
                            >
                              <ExternalLink size={14} />
                              Post Manually
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-white/10 bg-[#1a1a1a] flex justify-end items-center gap-4">
              {!publishResult ? (
                <>
                  <button
                    onClick={closePreviewModal}
                    className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPublish}
                    disabled={isPublishing}
                    className="px-6 py-2.5 rounded-full bg-[#00d4ff] hover:bg-[#00bce6] text-black font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        Confirm & Post <Send size={14} className="text-black" />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={closePreviewModal}
                  className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
                >
                  Close
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Multi-Platform Failure Modal */}
      <MultiPlatformFailureModal
        isOpen={showMultiPlatformFailure}
        onClose={() => setShowMultiPlatformFailure(false)}
        onRetry={handleRetryPlatform}
        failedPlatforms={failedPlatforms}
      />

      {/* Schedule Success Modal */}
      <ScheduleSuccessModal
        isOpen={showScheduleSuccess}
        onClose={() => setShowScheduleSuccess(false)}
        scheduledTime={scheduleSuccessData.time}
        platforms={scheduleSuccessData.platforms}
      />
    </div>
  );
}
