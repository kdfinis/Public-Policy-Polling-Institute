import { auth } from '@/lib/firebase';
import { signInWithPopup, TwitterAuthProvider, FacebookAuthProvider, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

export async function loginWithX(): Promise<void> {
  try {
    // Use env-configured provider ID for X (e.g., 'twitter.com' or custom OIDC id)
    const xProviderId = import.meta.env.VITE_FIREBASE_X_PROVIDER_ID as string | undefined;
    const provider = xProviderId ? new OAuthProvider(xProviderId) : new TwitterAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('Twitter login failed', err);
  }
}

export async function loginWithLinkedIn(): Promise<void> {
  try {
    // Use Firebase OIDC provider configured in console, e.g., 'oidc.linkedin'
    const providerId = (import.meta.env.VITE_FIREBASE_LINKEDIN_PROVIDER_ID as string) || 'oidc.linkedin';
    const provider = new OAuthProvider(providerId);
    // Request basic profile and email
    try { provider.addScope?.('r_liteprofile'); } catch {}
    try { provider.addScope?.('r_emailaddress'); } catch {}
    try { provider.addScope?.('openid'); } catch {}
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('LinkedIn login failed', err);
  }
}

export async function loginWithFacebook(): Promise<void> {
  try {
    const provider = new FacebookAuthProvider();
    try { provider.addScope('public_profile'); } catch {}
    try { provider.addScope('email'); } catch {}
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('Facebook login failed', err);
  }
}

export async function loginWithGoogle(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error('Google login failed', err);
  }
}


