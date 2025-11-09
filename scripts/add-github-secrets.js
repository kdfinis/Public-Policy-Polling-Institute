#!/usr/bin/env node
/**
 * Script to add Firebase secrets to GitHub
 * Run: node scripts/add-github-secrets.js
 * 
 * Requires: gh CLI authenticated OR GITHUB_TOKEN env var
 */

import { execSync } from 'child_process';
import fs from 'fs';

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const REPO = 'kdfinis/Public-Policy-Polling-Institute';

// Get Firebase client config from Firebase Console
// You need to get these from: https://console.firebase.google.com/project/public-policy-poling/settings/general
const FIREBASE_CONFIG = {
  // Get these from Firebase Console → Project Settings → General → Your apps → Web app
  apiKey: process.env.FIREBASE_API_KEY || '',
  authDomain: 'public-policy-poling.firebaseapp.com',
  projectId: 'public-policy-poling',
  storageBucket: 'public-policy-poling.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

function checkGhAuth() {
  try {
    execSync('gh auth status', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function addSecret(name, value) {
  try {
    console.log(`Adding secret: ${name}...`);
    execSync(`gh secret set ${name} --body "${value}"`, { stdio: 'inherit' });
    console.log(`✅ Added ${name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to add ${name}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔐 Adding Firebase secrets to GitHub...\n');

  if (!checkGhAuth()) {
    console.log('❌ GitHub CLI not authenticated.');
    console.log('Run: gh auth login');
    process.exit(1);
  }

  // Read service account
  let serviceAccountJson = '';
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    serviceAccountJson = fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8');
    console.log('✅ Found serviceAccountKey.json\n');
  } else {
    console.log('❌ serviceAccountKey.json not found');
    process.exit(1);
  }

  // Add Firebase client config secrets
  console.log('Adding Firebase client configuration secrets...\n');
  
  if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.log('⚠️  FIREBASE_API_KEY not set. Please set it as env var or update script.');
    console.log('   Get it from: https://console.firebase.google.com/project/public-policy-poling/settings/general\n');
  } else {
    addSecret('VITE_FIREBASE_API_KEY', FIREBASE_CONFIG.apiKey);
  }
  
  addSecret('VITE_FIREBASE_AUTH_DOMAIN', FIREBASE_CONFIG.authDomain);
  addSecret('VITE_FIREBASE_PROJECT_ID', FIREBASE_CONFIG.projectId);
  addSecret('VITE_FIREBASE_STORAGE_BUCKET', FIREBASE_CONFIG.storageBucket);
  
  if (!FIREBASE_CONFIG.messagingSenderId || FIREBASE_CONFIG.messagingSenderId === 'YOUR_SENDER_ID') {
    console.log('⚠️  VITE_FIREBASE_MESSAGING_SENDER_ID not set. Please set it as env var or update script.\n');
  } else {
    addSecret('VITE_FIREBASE_MESSAGING_SENDER_ID', FIREBASE_CONFIG.messagingSenderId);
  }
  
  if (!FIREBASE_CONFIG.appId || FIREBASE_CONFIG.appId.includes('YOUR')) {
    console.log('⚠️  VITE_FIREBASE_APP_ID not set. Please set it as env var or update script.\n');
  } else {
    addSecret('VITE_FIREBASE_APP_ID', FIREBASE_CONFIG.appId);
  }

  // Add service account secret
  console.log('\nAdding Firebase service account secret...\n');
  addSecret('FIREBASE_SERVICE_ACCOUNT', serviceAccountJson);

  console.log('\n✅ All secrets added!');
  console.log('Next push to main will automatically seed demo data.\n');
}

main().catch(console.error);

