import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, setLogLevel } from 'firebase/firestore';
import { publicFirebaseConfig } from '@/firebase.public';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || publicFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || publicFirebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || publicFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || publicFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || publicFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || publicFirebaseConfig.appId,
};

// Validate Firebase config before initialization
function validateFirebaseConfig(config: typeof firebaseConfig): boolean {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
  for (const field of requiredFields) {
    if (!config[field] || typeof config[field] !== 'string' || config[field].trim() === '') {
      console.warn(`Firebase config missing or invalid: ${field}`);
      return false;
    }
  }
  return true;
}

const isValidConfig = validateFirebaseConfig(firebaseConfig);

// Only initialize Firebase if config is valid
let app: FirebaseApp;
let auth: Auth;

if (isValidConfig) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Create a minimal app instance to prevent crashes
    app = getApps()[0] || initializeApp({ apiKey: '', authDomain: '', projectId: '', appId: '' });
    auth = getAuth(app);
  }
} else {
  // Create a minimal app instance for development to prevent crashes
  const fallbackConfig = {
    apiKey: 'dev-key',
    authDomain: 'dev.local',
    projectId: 'dev-project',
    appId: 'dev-app',
  };
  app = getApps().length ? getApp() : initializeApp(fallbackConfig);
  auth = getAuth(app);
}

export { app, auth };

// Only initialize Firestore when real config is present to avoid noisy errors in dev
const hasRealProject = !!firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'placeholder' &&
  firebaseConfig.projectId !== 'YOUR_PROJECT_ID';

let db: Firestore | null = null;
if (hasRealProject) {
  try {
    db = getFirestore(app);
    // Configure Firestore for better connection stability
    if (db) {
      // Enable offline persistence only in production to reduce dev connection issues
      if (import.meta.env.PROD) {
        try {
          // Firestore will handle connection retries automatically
        } catch (e) {
          // Ignore persistence errors in dev
        }
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    db = null;
  }
}

export { db };

// Suppress Firestore connection warnings when using placeholder config
if (!hasRealProject) {
  setLogLevel('silent');
}

// Cleanup function for HMR stability
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup Firebase connections on HMR
    try {
      if (db) {
        // Firestore connections are automatically cleaned up
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  });
}

