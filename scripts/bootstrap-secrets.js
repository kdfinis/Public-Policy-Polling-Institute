#!/usr/bin/env node
/**
 * Bootstrap GitHub Actions secrets from your Firebase project automatically.
 *
 * Prereqs (one-time):
 *  - npm i -g firebase-tools
 *  - gh auth login  (GitHub CLI authenticated)
 *  - firebase login (Google account authenticated)
 *
 * Usage:
 *  node scripts/bootstrap-secrets.js --project public-policy-poling
 *
 * What it does:
 *  - Finds your default Web App in the Firebase project
 *  - Pulls SDK config (apiKey, authDomain, projectId, storageBucket,
 *    messagingSenderId, appId)
 *  - Sets GitHub repo secrets VITE_FIREBASE_* accordingly
 *  - If ./serviceAccountKey.json exists, sets FIREBASE_SERVICE_ACCOUNT
 */

import { execSync } from 'child_process';
import fs from 'fs';

function sh(cmd, opts = {}) {
  return execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }).trim();
}

function ensureGh() {
  try { sh('gh --version'); } catch { throw new Error('GitHub CLI (gh) not installed'); }
  try { sh('gh auth status'); } catch { throw new Error('Run: gh auth login'); }
}

function ensureFirebase() {
  try { sh('firebase --version'); } catch { throw new Error('Install firebase-tools: npm i -g firebase-tools'); }
  try { sh('firebase projects:list'); } catch { throw new Error('Run: firebase login'); }
}

function parseArg(name, fallback) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

async function main() {
  const project = parseArg('project', 'public-policy-poling');
  console.log(`\n🔧 Using Firebase project: ${project}\n`);

  ensureGh();
  ensureFirebase();

  // Detect repo (owner/name) from git remote
  let repo;
  try {
    const remotes = sh('git remote -v');
    const m = remotes.match(/github\.com[:\/]([^\s]+)\.git/);
    repo = m ? m[1] : process.env.GITHUB_REPOSITORY;
  } catch {}
  if (!repo) throw new Error('Cannot detect GitHub repository. Set GITHUB_REPOSITORY=owner/repo');
  console.log(`📦 GitHub repository: ${repo}`);

  // Find web app id
  console.log('🔎 Finding Firebase Web Apps...');
  const appsJson = sh(`firebase apps:list --project ${project} --json`);
  const apps = JSON.parse(appsJson);
  const webApps = (apps.result || apps).filter(a => a.platform === 'WEB');
  if (!webApps.length) throw new Error('No Firebase Web App found. Create one in Firebase Console → Project settings → Your apps → Web.');
  const app = webApps[0];
  console.log(`✅ Using Web App: ${app.displayName || app.appId} (${app.appId})`);

  // Get SDK config
  console.log('📥 Retrieving SDK config...');
  const cfgJson = sh(`firebase apps:sdkconfig web ${app.appId} --project ${project} --json`);
  const cfgObj = JSON.parse(cfgJson);
  const cfg = cfgObj.result || cfgObj;

  const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId } = cfg;
  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error('Incomplete SDK config returned. Check Firebase project and web app.');
  }

  // Helper to set secret
  const setSecret = (name, value) => {
    console.log(`🔐 Setting secret ${name}...`);
    sh(`gh secret set ${name} --repo ${repo} --body ${JSON.stringify(String(value))}`);
    console.log(`   → OK`);
  };

  // Set VITE_* secrets
  setSecret('VITE_FIREBASE_API_KEY', apiKey);
  setSecret('VITE_FIREBASE_AUTH_DOMAIN', authDomain);
  setSecret('VITE_FIREBASE_PROJECT_ID', projectId);
  setSecret('VITE_FIREBASE_STORAGE_BUCKET', storageBucket || `${project}.appspot.com`);
  if (messagingSenderId) setSecret('VITE_FIREBASE_MESSAGING_SENDER_ID', messagingSenderId);
  setSecret('VITE_FIREBASE_APP_ID', appId);

  // Optionally set service account secret
  if (fs.existsSync('./serviceAccountKey.json')) {
    console.log('📄 Found serviceAccountKey.json → adding FIREBASE_SERVICE_ACCOUNT');
    const sa = fs.readFileSync('./serviceAccountKey.json', 'utf8');
    setSecret('FIREBASE_SERVICE_ACCOUNT', sa);
  } else {
    console.log('ℹ️  No serviceAccountKey.json found. Skipping FIREBASE_SERVICE_ACCOUNT.');
  }

  console.log('\n✅ All required secrets are set. Push to main to deploy, or run the seed workflow.');
}

main().catch((e) => {
  console.error(`\n❌ ${e.message}`);
  process.exit(1);
});


