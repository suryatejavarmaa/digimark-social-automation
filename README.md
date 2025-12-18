# DigiMark - AI Social Media Automation

AI-powered social media content generation and automation platform. Generate captions, images, and reels using AI, then publish directly to LinkedIn, Facebook, X (Twitter), and Instagram.

## Features

- 🤖 **AI Caption Generation** - Generate engaging captions using Groq/Gemini AI
- 🖼️ **AI Image Generation** - Create stunning images with Hugging Face models
- 🎬 **AI Reels Generation** - Generate video reels with FFmpeg
- 📱 **Multi-Platform Publishing** - Post to LinkedIn, Facebook, X, Instagram
- 📅 **Post Scheduling** - Schedule posts for later
- 🔗 **OAuth Integration** - Seamless social media account connection

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Node.js, Express
- **AI**: Groq, Gemini, Hugging Face
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth, OAuth 2.0

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/suryatejavarmaa/digimark-social-automation.git
   cd digimark-social-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   copy .env.example .env
   
   # Then edit .env and add your API keys
   ```

4. **Start the development server**
   ```bash
   # Terminal 1: Start backend
   node server/index.js
   
   # Terminal 2: Start frontend
   npm run dev
   ```

5. **Open the app**
   
   Visit `http://localhost:5173` in your browser

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following keys:

| Variable | Description | Get it from |
|----------|-------------|-------------|
| `GEMINI_API_KEY` | Google Gemini AI API key | [Google AI Studio](https://aistudio.google.com/) |
| `GROQ_API_KEY` | Groq AI API key | [Groq Console](https://console.groq.com/) |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | [Hugging Face](https://huggingface.co/settings/tokens) |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth Client ID | [LinkedIn Developers](https://www.linkedin.com/developers/) |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth Secret | [LinkedIn Developers](https://www.linkedin.com/developers/) |
| `FACEBOOK_APP_ID` | Facebook App ID | [Meta Developers](https://developers.facebook.com/) |
| `FACEBOOK_APP_SECRET` | Facebook App Secret | [Meta Developers](https://developers.facebook.com/) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `TWITTER_CLIENT_ID` | Twitter/X API Key | [Twitter Developer Portal](https://developer.twitter.com/) |
| `TWITTER_CLIENT_SECRET` | Twitter/X API Secret | [Twitter Developer Portal](https://developer.twitter.com/) |
| `REDIRECT_URI` | OAuth redirect URI | `http://localhost:5001/auth/callback` |

---

## 📁 Project Structure

```
├── src/                  # React frontend
│   ├── components/       # UI components
│   ├── services/         # API services
│   └── App.tsx           # Main app component
├── server/               # Node.js backend
│   ├── index.js          # Main server file
│   └── schedulerService.js
├── .env.example          # Environment template
├── package.json          # Dependencies
└── vite.config.ts        # Vite configuration
```

---

## 📝 License

This project is for educational/demo purposes.

---

## 👤 Author

**Surya Teja Varma**