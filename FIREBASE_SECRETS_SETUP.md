# Firebase Secrets Setup for GitHub Pages

## Required GitHub Secrets

To make your GitHub Pages site show demo data like localhost, you need to add these secrets:

### 1. Firebase Client Configuration (for frontend to connect)

Go to: https://github.com/kdfinis/Public-Policy-Polling-Institute/settings/secrets/actions

Add these secrets (use values from your Firebase Console → Project Settings → General → Your apps):

- **VITE_FIREBASE_API_KEY**: Your Firebase API Key
- **VITE_FIREBASE_AUTH_DOMAIN**: `public-policy-poling.firebaseapp.com`
- **VITE_FIREBASE_PROJECT_ID**: `public-policy-poling`
- **VITE_FIREBASE_STORAGE_BUCKET**: `public-policy-poling.appspot.com`
- **VITE_FIREBASE_MESSAGING_SENDER_ID**: Your Messaging Sender ID
- **VITE_FIREBASE_APP_ID**: Your App ID

### 2. Firebase Service Account (for seeding data)

- **FIREBASE_SERVICE_ACCOUNT**: Copy the entire JSON content from your `serviceAccountKey.json` file

## How to Get Firebase Config Values

1. Go to: https://console.firebase.google.com/project/public-policy-poling/settings/general
2. Scroll to "Your apps" section
3. Click on the web app (or create one)
4. Copy the config values

## After Adding Secrets

The workflow will automatically:
1. Build with Firebase config
2. Deploy to GitHub Pages
3. Seed demo data (polls, users, votes)

Your site will then show populated data like localhost!

