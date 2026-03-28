# 📚 MOARL — Mother of All Real-Time Libraries
### Google Play Store App · React Native + Expo

---

```
 ███╗   ███╗ ██████╗  █████╗ ██████╗ ██╗     
 ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║     
 ██╔████╔██║██║   ██║███████║██████╔╝██║     
 ██║╚██╔╝██║██║   ██║██╔══██║██╔══██╗██║     
 ██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║███████╗
 ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
Mother of All Real-Time Libraries
```

---

## 🌍 Overview

MOARL is a **production-ready React Native app** for Google Play Store that provides free access to 50M+ books from 247 world libraries, powered by DeepSeek AI and Anthropic Claude.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native 0.74 + Expo 51 |
| Navigation | React Navigation v6 (Stack + Bottom Tabs) |
| AI Engine | Anthropic Claude API (claude-sonnet-4-20250514) |
| Book Data | Open Library API (real-time, 50M+ books) |
| Styling | LinearGradient + StyleSheet |
| Build | EAS Build (Expo Application Services) |
| Store | Google Play Store |
| State | React Context API |
| Security | Expo SecureStore |

## 📱 App Screens

| Screen | Features |
|--------|----------|
| `AuthScreen` | Login, Register, Guest, Social Auth |
| `HomeScreen` | Hero, Quick Actions, Book Carousels, Live Counter |
| `DiscoverScreen` | Real-time Open Library search, Filters |
| `AIScreen` | Full Claude AI chat, Quick Prompts |
| `DeepSeekScreen` | 10 AI tools, Direct query interface |
| `BookDetailScreen` | Full book info, Sources, Share |
| `BookReaderScreen` | Immersive reader, 3 themes, Font size, Progress |
| `ShelfScreen` | Personal library, Reading progress |
| `LibrariesScreen` | 16+ world library partners |
| `ProfileScreen` | User stats, Settings, Logout |
| `NotificationsScreen` | Library updates, AI recommendations |

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/moarl-app
cd MOARL-App
npm install
npx expo start
```

## 🔑 API Key Setup

Edit `src/services/AIService.js`:
```javascript
const API_KEY = 'sk-ant-YOUR_KEY_HERE';
```

## 📦 Build for Play Store

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
eas submit --platform android
```

See `DEPLOYMENT_GUIDE.md` for complete instructions.

## 📁 Project Structure

```
MOARL-App/
├── App.js                    # Root + Navigation
├── app.json                  # Expo config + Android metadata
├── eas.json                  # Build profiles (dev/preview/production)
├── package.json              # Dependencies
├── DEPLOYMENT_GUIDE.md       # Play Store deployment steps
├── PLAY_STORE_LISTING.md     # Store copy + metadata
└── src/
    ├── screens/
    │   ├── AuthScreen.js
    │   ├── HomeScreen.js
    │   ├── DiscoverScreen.js
    │   ├── AIScreen.js
    │   ├── BookDetailScreen.js
    │   ├── BookReaderScreen.js
    │   ├── ShelfScreen.js
    │   ├── LibrariesScreen.js
    │   ├── DeepSeekScreen.js
    │   ├── ProfileScreen.js
    │   └── NotificationsScreen.js
    ├── components/
    │   ├── BookCard.js
    │   └── CategoryPill.js
    └── services/
        ├── AppContext.js     # Global state + data
        └── AIService.js      # Claude API + Open Library
```

## 🌟 Features

- **50M+ Books** via Open Library API (real-time search)
- **247 World Libraries** — LC, British Library, Vatican, India & more
- **AI Librarian** — Claude-powered literary assistant with memory
- **DeepSeek Tools** — Book DNA, Research Agent, Knowledge Graph, etc.
- **Immersive Reader** — Dark / Sepia / Light themes, adjustable font
- **Personal Shelf** — Save, track progress, manage downloads
- **100% Free** — No ads, no paywalls, no subscriptions

## 📄 License

MIT License — Free to use, modify, and deploy commercially.

---

*Built with ❤️ by MOARL · Powered by Anthropic Claude + DeepSeek AI*
