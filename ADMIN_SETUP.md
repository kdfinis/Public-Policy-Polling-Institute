# Firebase Admin Setup

## Quick Setup (2 steps)

1. **Download service account key:**
   - Go to: https://console.firebase.google.com/project/public-policy-poling/settings/serviceaccounts/adminsdk
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root

2. **Run setup:**
   ```bash
   npm run admin setup
   ```

## Commands

- `npm run admin seed:polls` - Seed test polls
- `npm run admin clear:polls` - Delete all polls  
- `npm run admin clear:votes` - Delete all votes
- `npm run admin setup` - Full setup (seed polls)

**Note:** Security rules still need manual deployment in Firebase Console (copy from `firestore.rules`).

