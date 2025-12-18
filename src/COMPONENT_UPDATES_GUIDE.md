# Component Navigation Props Update Guide

## ✅ COMPLETED Components

1. **App.tsx** - Master controller with all navigation handlers
2. **Dashboard.tsx** - Accepts `onSocialCaptionClick` and `onSocialGraphicClick`
3. **OnboardingStep1.tsx** - Accepts `onNext` with validation
4. **OnboardingStep2.tsx** - Accepts `onNext` with validation
5. **OnboardingStep3.tsx** - Accepts `onComplete` and `onSkip`

## 📋 REMAINING Components to Update

### 6. AITextInput.tsx
**Required Props:**
- `onGenerate?: () => void` - Triggered when "Generate Content" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface AITextInputProps {
  onGenerate?: () => void;
  onBack?: () => void;
}

export function AITextInput({ onGenerate, onBack }: AITextInputProps = {}) {
  // ... existing state ...
  
  // Find the "Generate" button and add:
  <button onClick={onGenerate}>Generate Content</button>
  
  // Find the back button and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

### 7. AITextResults.tsx
**Required Props:**
- `onPostToSocials?: () => void` - Triggered when "Post to Socials" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface AITextResultsProps {
  onPostToSocials?: () => void;
  onBack?: () => void;
}

export function AITextResults({ onPostToSocials, onBack }: AITextResultsProps = {}) {
  // Find the "Post to Socials" button and add:
  <button onClick={onPostToSocials}>Post to Socials</button>
  
  // Find the back button and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

### 8. FinalizeTextPost.tsx
**Required Props:**
- `onPublish?: () => void` - Triggered when "Publish to Selected" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface FinalizeTextPostProps {
  onPublish?: () => void;
  onBack?: () => void;
}

export function FinalizeTextPost({ onPublish, onBack }: FinalizeTextPostProps = {}) {
  // ... existing state ...
  
  // Find the "Publish" button (around line 173) and add onClick:
  <button 
    onClick={onPublish}
    disabled={selectedPlatforms.length === 0}
  >
    Publish to {selectedPlatforms.length} Selected
  </button>
  
  // Find the back/arrow button (around line 42) and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

### 9. AIImageInput.tsx
**Required Props:**
- `onGenerate?: () => void` - Triggered when "Generate Images" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface AIImageInputProps {
  onGenerate?: () => void;
  onBack?: () => void;
}

export function AIImageInput({ onGenerate, onBack }: AIImageInputProps = {}) {
  // ... existing state ...
  
  // Find the "Generate" button and add:
  <button onClick={onGenerate}>Generate Images</button>
  
  // Find the back button and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

### 10. AIImageResult.tsx
**Required Props:**
- `onPostToSocials?: () => void` - Triggered when "Post to Socials" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface AIImageResultProps {
  onPostToSocials?: () => void;
  onBack?: () => void;
}

export function AIImageResult({ onPostToSocials, onBack }: AIImageResultProps = {}) {
  // Find the "Post to Socials" button and add:
  <button onClick={onPostToSocials}>Post to Socials</button>
  
  // Find the back button and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

### 11. FinalizePost.tsx
**Required Props:**
- `onPublish?: () => void` - Triggered when "Publish to Selected" button is clicked
- `onBack?: () => void` - Triggered when back button is clicked

**Changes Needed:**
```typescript
interface FinalizePostProps {
  onPublish?: () => void;
  onBack?: () => void;
}

export function FinalizePost({ onPublish, onBack }: FinalizePostProps = {}) {
  // ... existing state ...
  
  // Find the "Publish" button and add onClick:
  <button 
    onClick={onPublish}
    disabled={selectedPlatforms.length === 0}
  >
    Publish to {selectedPlatforms.length} Selected
  </button>
  
  // Find the back/arrow button and add:
  <button onClick={onBack}><ArrowLeft /></button>
}
```

## 🎯 Implementation Pattern

For each component, follow this pattern:

1. **Add Interface** at the top of the file (before the export):
   ```typescript
   interface ComponentNameProps {
     onAction?: () => void;
     onBack?: () => void;
   }
   ```

2. **Update Function Signature**:
   ```typescript
   export function ComponentName({ onAction, onBack }: ComponentNameProps = {}) {
   ```

3. **Wire Up Existing Buttons**:
   - Find existing button elements in the JSX
   - Add `onClick={onAction}` or `onClick={onBack}` to the appropriate buttons
   - DO NOT create new buttons or overlays
   - DO NOT change the visual design

## 📝 Example: Dashboard.tsx (COMPLETED)

```typescript
interface DashboardProps {
  onSocialCaptionClick?: () => void;
  onSocialGraphicClick?: () => void;
}

export function Dashboard({ onSocialCaptionClick, onSocialGraphicClick }: DashboardProps = {}) {
  const handleActionClick = (actionId: string) => {
    if (actionId === 'post' && onSocialCaptionClick) {
      onSocialCaptionClick();
    } else if (actionId === 'image' && onSocialGraphicClick) {
      onSocialGraphicClick();
    }
  };

  return (
    // ... JSX ...
    <motion.button
      onClick={() => handleActionClick(action.id)}
      // ... rest of props ...
    >
      {action.title}
    </motion.button>
  );
}
```

## 🔧 LoadingSplashScreen Fix

The LoadingSplashScreen needs a fix to keep the logo STATIC:

```typescript
// In LoadingSplashScreen.tsx
// Remove or disable the logo animation
// Only animate the spinner
<div className="static-logo">  {/* No motion.div wrapper */}
  <GeometricLogo />
</div>
<Spinner />  {/* Only this should animate */}
```

## ✅ Testing Checklist

After updating each component:

1. ✅ Component accepts props without errors
2. ✅ onClick handlers are attached to existing UI elements
3. ✅ No new buttons or overlays added
4. ✅ Navigation flows correctly in App.tsx
5. ✅ Dev navigation panel works for quick testing
