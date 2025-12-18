# Quick Reference Guide - Cyan Branding & Styling

## 🎨 COLOR VALUES

```typescript
// CYAN BRANDING SYSTEM
const COLORS = {
  primary: '#00d4ff',           // Main cyan
  primaryHover: '#00bce6',      // Hover state
  primaryRGBA: 'rgba(0, 212, 255, ...)', // For shadows
  
  // OPACITIES
  bg10: 'rgba(0, 212, 255, 0.10)',  // Background tint
  bg20: 'rgba(0, 212, 255, 0.20)',  // Stronger bg
  border30: 'rgba(0, 212, 255, 0.30)', // Light border
  border50: 'rgba(0, 212, 255, 0.50)', // Medium border
  
  // SHADOWS
  glow: 'rgba(0, 212, 255, 0.50)',  // Outer glow
  depth: 'rgba(0, 212, 255, 0.30)', // Inner shadow
};
```

---

## 🔘 BUTTON PATTERNS

### Primary Action Button (Full Width)
```tsx
<motion.button
  onClick={handler}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={!isValid}
  className={`w-full rounded-full py-4 transition-all ${
    isValid 
      ? 'bg-[#00d4ff] hover:bg-[#00bce6] text-white' 
      : 'bg-white/10 text-white/40 cursor-not-allowed opacity-50'
  }`}
  style={isValid ? {
    fontSize: '1.125rem',
    fontWeight: 600,
    boxShadow: '0 0 40px rgba(0, 212, 255, 0.5), 0 8px 32px rgba(0, 212, 255, 0.3)',
  } : {
    fontSize: '1.125rem',
    fontWeight: 600,
  }}
>
  Button Text
</motion.button>
```

### Secondary Button
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="w-full py-4 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 transition-all"
>
  <span style={{ fontSize: '1rem', fontWeight: 600 }}>
    Secondary Action
  </span>
</motion.button>
```

### Small Icon Button
```tsx
<button className="w-12 h-12 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 hover:border-[#00d4ff]/50 transition-all group">
  <RefreshCw className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff]" />
</button>
```

---

## 🎚️ TOGGLE SWITCHES

```tsx
<motion.div
  className={`w-14 h-8 rounded-full transition-all ${
    isActive ? 'bg-[#00d4ff]' : 'bg-white/10'
  }`}
  style={isActive ? {
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
  } : {}}
>
  <motion.div
    className={`absolute top-1 w-6 h-6 rounded-full ${
      isActive ? 'bg-white' : 'bg-white/40'
    }`}
    animate={{
      left: isActive ? '28px' : '4px',
    }}
    transition={{
      type: 'spring',
      stiffness: 500,
      damping: 30,
    }}
  />
</motion.div>
```

---

## 🏷️ SELECTION CARDS

### Platform/Option Selector
```tsx
<div
  onClick={() => toggleSelection(id)}
  className={`rounded-2xl border backdrop-blur-xl p-5 transition-all cursor-pointer ${
    isSelected
      ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10'
      : 'border-white/20 bg-[rgba(45,45,45,0.3)]'
  }`}
>
  {/* Card content */}
</div>
```

### Tag Button
```tsx
<motion.button
  onClick={() => toggle(tag)}
  className={`px-4 py-2 rounded-full border transition-all ${
    isSelected
      ? 'border-[#00d4ff] bg-[#00d4ff]/20 text-[#00d4ff]'
      : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40'
  }`}
  style={isSelected ? {
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
  } : {}}
>
  {tag}
</motion.button>
```

---

## ⏳ LOADING ANIMATION

```tsx
const [isGenerating, setIsGenerating] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsGenerating(false);
  }, 2500);
  return () => clearTimeout(timer);
}, []);

return (
  <AnimatePresence mode="wait">
    {isGenerating ? (
      <motion.div 
        key="loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex-1 flex flex-col items-center justify-center space-y-6"
      >
        {/* Glow background */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#00d4ff] blur-3xl opacity-20 rounded-full" />
          
          {/* Rotating icon */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative z-10 w-20 h-20 rounded-full border-t-2 border-r-2 border-[#00d4ff] flex items-center justify-center"
          >
            <BrainCircuit className="w-8 h-8 text-[#00d4ff]" />
          </motion.div>
        </div>
        
        {/* Text */}
        <div className="text-center space-y-2">
          <h3 className="text-white" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
            AI is processing...
          </h3>
          <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
            Please wait
          </p>
        </div>
      </motion.div>
    ) : (
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Result content */}
      </motion.div>
    )}
  </AnimatePresence>
);
```

---

## 📦 CARD PATTERNS

### Glassmorphic Card
```tsx
<div
  className="rounded-3xl border border-white/20 backdrop-blur-xl p-6"
  style={{
    background: 'rgba(45, 45, 45, 0.3)',
  }}
>
  {/* Card content */}
</div>
```

### Preview Card with Icon
```tsx
<div className="rounded-3xl border border-white/20 backdrop-blur-xl p-6 shadow-2xl">
  {/* Header */}
  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#00d4ff]" />
    </div>
    <div>
      <p className="text-white/80" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
        Title
      </p>
      <p className="text-white/60" style={{ fontSize: '0.75rem' }}>
        Subtitle
      </p>
    </div>
  </div>
  
  {/* Content */}
  <div>
    {/* Your content */}
  </div>
</div>
```

---

## 🎬 MOTION PATTERNS

### Page Entrance
```tsx
<motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.6, delay: 0.1 }}
>
  {/* Content */}
</motion.div>
```

### Stagger Children
```tsx
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
  >
    {item.content}
  </motion.div>
))}
```

### Button Interactions
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Click Me
</motion.button>
```

---

## 📱 LAYOUT PATTERNS

### Full Page Layout
```tsx
<div className="h-full w-full bg-[#101010] flex flex-col">
  {/* Header - Sticky */}
  <motion.div className="sticky top-0 z-20 bg-[#101010]/80 backdrop-blur-xl border-b border-white/10">
    <div className="px-6 py-6 flex items-center">
      {/* Header content */}
    </div>
  </motion.div>

  {/* Main Content - Scrollable */}
  <div className="flex-1 px-6 py-6 overflow-y-auto">
    {/* Content */}
  </div>

  {/* Footer - Sticky (optional) */}
  <div className="sticky bottom-0 px-6 py-6 bg-gradient-to-t from-[#101010] via-[#101010] to-transparent">
    {/* Footer content */}
  </div>
</div>
```

### Back Button Header
```tsx
<div className="px-6 py-6 flex items-center">
  <button 
    onClick={onBack}
    className="mr-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
  >
    <ArrowLeft className="w-5 h-5 text-white" />
  </button>
  <h1 className="text-white" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
    Page Title
  </h1>
</div>
```

---

## 🎨 ICON PATTERNS

### Icon with State
```tsx
<Icon className={`w-5 h-5 ${
  isActive ? 'text-[#00d4ff]' : 'text-white/60'
}`} />
```

### Icon with Hover
```tsx
<button className="group">
  <Icon className="w-5 h-5 text-white/60 group-hover:text-[#00d4ff] transition-colors" />
</button>
```

---

## 📋 COMMON IMPORTS

```tsx
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Wand2, 
  Copy, 
  Share2, 
  BrainCircuit,
  Sparkles 
} from 'lucide-react';
import { useState, useEffect } from 'react';
```

---

## ⚡ QUICK TIPS

1. **Always use Motion for buttons:**
   ```tsx
   <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
   ```

2. **Cyan for all primary actions:**
   ```tsx
   bg-[#00d4ff] hover:bg-[#00bce6]
   ```

3. **Add glow to important buttons:**
   ```tsx
   boxShadow: '0 0 40px rgba(0, 212, 255, 0.5), 0 8px 32px rgba(0, 212, 255, 0.3)'
   ```

4. **Use AnimatePresence for state changes:**
   ```tsx
   <AnimatePresence mode="wait">
   ```

5. **Consistent spacing:**
   - Cards: `p-6`
   - Buttons: `py-4`
   - Gaps: `gap-6` or `space-y-6`

6. **Glassmorphic effect:**
   ```tsx
   backdrop-blur-xl border border-white/20
   background: 'rgba(45, 45, 45, 0.3)'
   ```

---

## 🎯 COPY-PASTE READY SNIPPETS

### Complete Primary Button
```tsx
<motion.button
  onClick={handleAction}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  disabled={!isValid}
  className={`w-full rounded-full py-4 transition-all ${
    isValid 
      ? 'bg-[#00d4ff] hover:bg-[#00bce6] text-white' 
      : 'bg-white/10 text-white/40 cursor-not-allowed opacity-50'
  }`}
  style={isValid ? {
    fontSize: '1.125rem',
    fontWeight: 600,
    boxShadow: '0 0 40px rgba(0, 212, 255, 0.5), 0 8px 32px rgba(0, 212, 255, 0.3)',
  } : { fontSize: '1.125rem', fontWeight: 600 }}
>
  Action Text
</motion.button>
```

### Complete Loading State
```tsx
<motion.div 
  key="loader"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="flex-1 flex flex-col items-center justify-center space-y-6"
>
  <div className="relative">
    <div className="absolute inset-0 bg-[#00d4ff] blur-3xl opacity-20 rounded-full" />
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="relative z-10 w-20 h-20 rounded-full border-t-2 border-r-2 border-[#00d4ff] flex items-center justify-center"
    >
      <BrainCircuit className="w-8 h-8 text-[#00d4ff]" />
    </motion.div>
  </div>
  <div className="text-center space-y-2">
    <h3 className="text-white" style={{ fontSize: '1.125rem', fontWeight: 700 }}>
      Processing...
    </h3>
    <p className="text-white/50" style={{ fontSize: '0.875rem' }}>
      Please wait
    </p>
  </div>
</motion.div>
```

---

## ✅ CHECKLIST FOR NEW COMPONENTS

- [ ] Import motion and AnimatePresence
- [ ] Use cyan primary color (#00d4ff)
- [ ] Add hover state (#00bce6)
- [ ] Include button glow effect
- [ ] Add Motion animations
- [ ] Use glassmorphic backgrounds
- [ ] Implement loading state if needed
- [ ] Add proper disabled states
- [ ] Test responsive layout
- [ ] Verify accessibility (contrast)

---

This quick reference contains all the patterns you need to maintain consistency across the Digi Mark app! 🎨✨
