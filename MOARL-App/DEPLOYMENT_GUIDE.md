# 📱 MOARL — Google Play Store Deployment Guide
## Complete Step-by-Step Instructions

---

## STEP 1 — Prerequisites

Install the following tools on your machine:

```bash
# Node.js (v18 or higher)
# Download from: https://nodejs.org

# Expo CLI
npm install -g expo-cli

# EAS CLI (Expo Application Services)
npm install -g eas-cli

# Verify installations
node --version   # should be 18+
expo --version
eas --version
```

---

## STEP 2 — Set Up Expo Account

```bash
# Create free account at https://expo.dev
# Then login:
eas login

# Verify login
eas whoami
```

---

## STEP 3 — Install Dependencies

```bash
cd MOARL-App
npm install
```

---

## STEP 4 — Configure Your API Key

Edit `src/services/AIService.js`:
```javascript
const API_KEY = 'sk-ant-YOUR_REAL_KEY_HERE';
```

OR use EAS secrets (recommended for production):
```bash
eas secret:create --scope project --name ANTHROPIC_API_KEY --value sk-ant-your-key
```

---

## STEP 5 — Generate Android Keystore (One-time)

```bash
# Generate keystore for signing your app
keytool -genkey -v \
  -keystore moarl-release.keystore \
  -alias moarl \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# IMPORTANT: Save the keystore + passwords securely!
# You need these for EVERY future update to the Play Store.
```

---

## STEP 6 — Initialize EAS Build

```bash
cd MOARL-App
eas build:configure

# This creates/updates eas.json with your project settings
```

---

## STEP 7 — Build for Play Store

### Option A — Internal Testing APK (fastest, for testing)
```bash
eas build --platform android --profile preview
# Produces an .apk file you can install directly on any Android device
```

### Option B — Production AAB (for Play Store submission)
```bash
eas build --platform android --profile production
# Produces an .aab (Android App Bundle) required by Play Store
```

Build takes ~10-15 minutes on EAS servers. You'll get a download link when done.

---

## STEP 8 — Set Up Google Play Console

1. Go to https://play.google.com/console
2. Pay one-time $25 USD developer registration fee
3. Create a new app:
   - App name: **MOARL — World Library & AI Books**
   - Default language: English (United States)
   - App or game: **App**
   - Free or paid: **Free**
4. Accept all declarations

---

## STEP 9 — Complete Play Store Setup

### Store Listing
Fill in from `PLAY_STORE_LISTING.md`:
- App name, short description, full description
- Screenshots (8 required — phone + tablet)
- Feature graphic (1024×500px)
- App icon (512×512px)
- Category: Books & Reference
- Tags and keywords

### Content Rating
- Complete the IARC questionnaire
- Select: Everyone (no violence, no adult content)
- Expected rating: Everyone / E

### Privacy Policy
- Required! Host at: https://moarl.world/privacy
- Or use a free privacy policy generator:
  https://www.privacypolicygenerator.info

### App Access
- All functionality available without special access

---

## STEP 10 — Upload Your Build

```bash
# Auto-submit to Play Store (requires service account)
eas submit --platform android

# OR upload manually:
# 1. In Play Console → Production → Releases → Create release
# 2. Upload the .aab file from Step 7
# 3. Add release notes
# 4. Review and roll out
```

### Manual Upload Steps:
1. Download your .aab from EAS build dashboard
2. Play Console → Your App → Production
3. Click "Create new release"
4. Upload the .aab file
5. Add release notes (e.g., "Initial release of MOARL v1.0")
6. Click "Review release" → "Start rollout to Production"

---

## STEP 11 — Review Process

- Google review typically takes **1-3 business days**
- You'll receive an email when approved
- First release goes to 100% of users automatically

---

## STEP 12 — Post-Launch

### Update Your App
```bash
# Increment versionCode in app.json (e.g., 1 → 2)
# Then rebuild:
eas build --platform android --profile production
eas submit --platform android
```

### Monitor Performance
- Play Console → Statistics
- Crash reports → Android Vitals
- Reviews → Reply to user feedback

---

## TESTING BEFORE SUBMISSION

### Local Testing with Expo Go
```bash
npx expo start
# Scan QR code with Expo Go app on your Android phone
```

### Internal Testing Track
```bash
eas build --platform android --profile preview
# Upload to Play Console → Internal testing
# Add testers by email
# Share internal testing link
```

### Device Compatibility Test
- Play Console → Pre-launch report (automated testing on 20+ devices)

---

## TROUBLESHOOTING

### Build Fails
```bash
# Clear cache and retry
expo prebuild --clean
eas build --platform android --clear-cache
```

### App Crashes on Launch
```bash
# Check logs
eas build:view
# Or run locally:
npx expo start --android
```

### API Key Not Working
- Ensure API key has sufficient credits
- Check that key is correctly placed in AIService.js
- For production: use EAS secrets

---

## COST SUMMARY

| Item | Cost |
|------|------|
| Google Play Developer Account | $25 (one-time) |
| Expo / EAS Build | Free (limited) / $29/mo (production) |
| Anthropic Claude API | Pay per use (~$0.003/1K tokens) |
| Hosting (if needed) | Free on Netlify/Vercel |
| **Total to launch** | **~$25 one-time** |

---

## ESTIMATED TIMELINE

| Task | Time |
|------|------|
| Install dependencies | 10 min |
| Configure & customize | 30 min |
| EAS build | 15 min |
| Play Console setup | 1-2 hours |
| Google review | 1-3 days |
| **Total to live app** | **~2-3 days** |

---

## SUPPORT & RESOURCES

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Play Console Help: https://support.google.com/googleplay/android-developer
- Anthropic API: https://docs.anthropic.com
- MOARL Portal (Web): Deploy MOARL-portal.html on Netlify free tier

---

*MOARL v1.0 — Mother of All Real-Time Libraries*
*Built with React Native + Expo + DeepSeek AI + Claude API*
