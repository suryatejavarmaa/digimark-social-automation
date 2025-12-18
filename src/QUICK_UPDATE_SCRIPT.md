# Quick Component Updates - Cyan Rebrand

## AIImageInput.tsx Changes:

1. Add interface at top:
```typescript
interface AIImageInputProps {
  onGenerate?: () => void;
  onBack?: () => void;
}

export function AIImageInput({ onGenerate, onBack }: AIImageInputProps = {}) {
  // ... existing state ...
  const isValid = prompt.trim() !== '' && selectedRatio && selectedStyles.length > 0;
```

2. Update back button (line ~48):
```typescript
<button onClick={onBack} className="...">
```

3. Update Generate button (find the button with "Generate" text):
- Change `bg-[#2979FF]` to `bg-[#00d4ff]`
- Add `hover:bg-[#00bce6]`
- Add `onClick={onGenerate}`
- Add `disabled={!isValid}`
- Update boxShadow from `rgba(41, 121, 255, ...)` to `rgba(0, 212, 255, ...)`

## AIImageResult.tsx Changes:

1. Add interface:
```typescript
interface AIImageResultProps {
  onPostToSocials?: () => void;
  onBack?: () => void;
}

export function AIImageResult({ onPostToSocials, onBack }: AIImageResultProps = {}) {
```

2. Update back button with `onClick={onBack}`

3. Update "Post to Socials" button:
- Add `onClick={onPostToSocials}`
- Change `bg-[#2979FF]` to `bg-[#00d4ff]`
- Add `hover:bg-[#00bce6]`
- Update boxShadow from `rgba(41, 121, 255, ...)` to `rgba(0, 212, 255, ...)`

## FinalizePost.tsx (Image) Changes:

1. Add interface:
```typescript
interface FinalizePostProps {
  onPublish?: () => void;
  onBack?: () => void;
}

export function FinalizePost({ onPublish, onBack }: FinalizePostProps = {}) {
  // ... existing state with togglePlatform ...
```

2. Update back button with `onClick={onBack}`

3. Update toggle switches:
- Change `bg-[#2979FF]` to `bg-[#00d4ff]`
- Update boxShadow from `rgba(41, 121, 255, ...)` to `rgba(0, 212, 255, ...)`

4. Update Publish button:
- Add `onClick={onPublish}`
- Change `bg-[#2979FF]` to `bg-[#00d4ff]`
- Add `hover:bg-[#00bce6]`
- Update boxShadow from `rgba(41, 121, 255, ...)` to `rgba(0, 212, 255, ...)`

## AuthScreen.tsx & LoginForm.tsx:

Both need cyan button updates:
- Change all `bg-[#2979FF]` to `bg-[#00d4ff]`
- Add `hover:bg-[#00bce6]` where missing
- Update all boxShadow from `rgba(41, 121, 255, ...)` to `rgba(0, 212, 255, ...)`
