# Firebase Setup - Action Items

## ✅ COMPLETED (Code Side)
- ✅ Vote saving functionality (`src/lib/votes.ts`)
- ✅ PollDetail fetches real data from Firestore
- ✅ User queries work without indexes (client-side sorting)
- ✅ Poll queries work without indexes
- ✅ All code compiles and integrates

## 🔧 IMMEDIATE ACTIONS (Firebase Console)

### 1. Update Security Rules (5 minutes)

**Go to:** https://console.firebase.google.com/project/public-policy-poling/firestore/rules

**Copy/paste the rules from `firestore.rules` file**, then click **Publish**.

**OR** manually paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /polls/{pollId} {
      allow read: if true;
      allow write: if request.auth != null;
      match /votes/{voteId} {
        allow read: if true;
        allow create: if request.auth != null && 
                         request.auth.uid == request.resource.data.userId &&
                         !exists(/databases/$(database)/documents/polls/$(pollId)/votes/$(request.auth.uid));
        allow update: if request.auth != null && request.auth.uid == resource.data.userId;
        allow delete: if false;
      }
    }
    match /users/{userId} {
      allow read: if resource.data.is_directory_opt_in == true;
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && 
                       request.auth.uid == userId &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['public_vote_count_30d', 'public_vote_count_all', 'last_public_vote_at']);
    }
  }
}
```

### 2. Add Test Polls (2 minutes)

**Option A: Manual (Easiest)**
1. Go to: https://console.firebase.google.com/project/public-policy-poling/firestore/data
2. Click **Start collection** → Name it `polls`
3. Click **Add document** → Use auto-ID
4. Add these fields (one poll):

**Poll 1:**
```
title: "Should the government increase funding for public infrastructure?"
category: "Domestic Policy"
country: "US"
state: "FEDERAL"
language: "en"
status: "open"
visibility: "public"
createdBy: "system"
tags: ["infrastructure", "budget"]
stats: {
  totalVotes: 0,
  yesCount: 0,
  noCount: 0,
  yesPercent: 0,
  noPercent: 0,
  publicVotes: 0
}
```

**Poll 2:**
```
title: "Should the country commit to net-zero emissions by 2040?"
category: "Environment"
country: "EU"
language: "en"
status: "open"
visibility: "public"
createdBy: "system"
tags: ["climate", "environment"]
stats: {
  totalVotes: 0,
  yesCount: 0,
  noCount: 0,
  yesPercent: 0,
  noPercent: 0,
  publicVotes: 0
}
```

**Poll 3:**
```
title: "Do you support strengthening international trade agreements?"
category: "Foreign Policy"
country: "US"
state: "FEDERAL"
language: "en"
status: "open"
visibility: "public"
createdBy: "system"
tags: ["trade", "foreign policy"]
stats: {
  totalVotes: 0,
  yesCount: 0,
  noCount: 0,
  yesPercent: 0,
  noPercent: 0,
  publicVotes: 0
}
```

**Option B: Using Script (Requires Firebase Admin SDK)**
1. Download service account key from Firebase Console → Project Settings → Service Accounts
2. Save as `serviceAccountKey.json` in project root
3. Run: `node scripts/seed-polls.js`

### 3. Enable Authentication Providers (5 minutes)

**Go to:** https://console.firebase.google.com/project/public-policy-poling/authentication/providers

Enable these providers:
- ✅ **Google** - Click Enable, add authorized domains
- ✅ **Facebook** - Click Enable, add App ID and App Secret
- ✅ **Twitter/X** - Click Enable, add API Key and Secret (or use custom OAuth)
- ✅ **Email/Password** (optional) - For direct signup

### 4. Test End-to-End (2 minutes)

1. Refresh `http://localhost:5173`
2. You should see polls in categories (if you added them)
3. Click a poll → Sign in → Vote → Should save successfully

## ✅ DONE!

After completing steps 1-3, your app is fully functional:
- ✅ Polls display from Firestore
- ✅ Users can vote (saves to Firestore)
- ✅ Votes are enforced (one per user per poll)
- ✅ No index errors (client-side sorting)

## 🔮 FUTURE ENHANCEMENTS (Optional)

1. **Cloud Functions** - Auto-update poll stats when votes are created
2. **Indexes** - Add back `orderBy` queries and create indexes for better performance
3. **Real-time updates** - Use `onSnapshot` for live poll results
4. **Analytics** - Track demographics, voting patterns

