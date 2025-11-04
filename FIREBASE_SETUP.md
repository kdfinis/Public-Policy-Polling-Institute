# Firebase Setup Analysis for Public Policy Polling Institute

## Current State
- ✅ Firestore Database created
- ✅ Basic security rules published (public read for polls)
- ✅ Authentication providers configured (Google, Facebook, X/Twitter, LinkedIn)
- ⚠️ Missing: Firestore indexes, vote collection, vote aggregation logic

---

## 1. FIRESTORE COLLECTIONS

### `polls` Collection (REQUIRED - Current)
**Purpose:** Store all poll questions and metadata

**Document Structure:**
```typescript
{
  title: string;                    // "Should the government increase funding for public infrastructure?"
  description?: string;              // Full description
  category: string;                  // "Domestic Policy" | "Foreign Policy" | "Economic Policy" | "Environment"
  country: string;                   // ISO code: "US", "EU", "FR", etc.
  state?: string | null;            // "FEDERAL", "CA", "NY", etc. or null for non-US
  language: string;                  // "en" | "hr" | "fr" | "de"
  status: "open" | "closed" | "scheduled" | "draft";
  startAt?: Timestamp | null;
  endAt?: Timestamp | null;
  imageUrl?: string | null;
  tags?: string[];                   // ["infrastructure", "budget"]
  methodology?: string | null;
  sourceUrl?: string | null;
  sampleSize?: number | null;
  marginOfError?: number | null;
  pollster?: string | null;
  visibility: "public" | "private";
  createdBy: string;                 // userId
  createdAt: Timestamp;
  updatedAt: Timestamp;
  stats: {
    totalVotes: number;              // Calculated from votes subcollection
    yesCount: number;
    noCount: number;
    abstainCount?: number;
    yesPercent: number;              // Calculated
    noPercent: number;               // Calculated
    publicVotes: number;             // Count of public votes
  };
}
```

**Queries Currently Used:**
- `where('category', '==', category)` - ✅ Works (no index needed)
- `where('category', '==', category) + where('country', '==', country)` - ⚠️ Needs index
- `where('category', '==', category) + where('state', '==', state)` - ⚠️ Needs index
- `limit(max)` - ✅ Works

**Status:** ✅ Collection exists, needs data seeding

---

### `polls/{pollId}/votes` Subcollection (REQUIRED - Missing)
**Purpose:** Store individual votes for each poll

**Document Structure:**
```typescript
{
  userId: string;                    // From auth.uid
  optionId: string;                  // "yes" | "no" | "abstain" | custom option ID
  visibility: "public" | "private";
  country: string;                   // User's country at time of vote
  state?: string | null;             // User's state at time of vote
  deviceFingerprint?: string | null; // For fraud detection
  verifiedLevel: number;             // 0-3, from user's verification_level
  createdAt: Timestamp;
  updatedAt?: Timestamp;             // If vote changed
}
```

**Queries Needed:**
- Get votes for a poll: `where('visibility', '==', 'public')` - ✅ No index needed
- Check if user voted: `where('userId', '==', userId)` - ✅ No index needed
- Get votes by age group: Would need aggregation query (future)

**Status:** ❌ Not implemented yet - votes are not being saved

---

### `users` Collection (REQUIRED - Current)
**Purpose:** User profiles and directory

**Document Structure:**
```typescript
{
  display_name: string;
  name?: string | null;
  surname?: string | null;
  country?: string | null;
  state?: string | null;
  is_politician: boolean;
  politician_role?: string | null;
  gender?: "male" | "female" | "other" | "prefer_not";
  verification_level: number;        // 0-3 (0=unverified, 3=ID verified)
  is_directory_opt_in: boolean;      // Opt-in to public directory
  social_links?: {
    linkedin?: string | null;
    facebook?: string | null;
    x?: string | null;
  };
  public_vote_count_30d: number;     // Updated by Cloud Function
  public_vote_count_all: number;     // Updated by Cloud Function
  last_public_vote_at?: Timestamp | null; // Updated by Cloud Function
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Queries Currently Used:**
- `where('is_directory_opt_in', '==', true) + orderBy('last_public_vote_at', 'desc')` - ⚠️ Needs index
- `where('is_directory_opt_in', '==', true) + where('is_politician', '==', true) + orderBy('last_public_vote_at', 'desc')` - ⚠️ Needs index
- `where('is_directory_opt_in', '==', true) + where('gender', '==', gender) + orderBy('last_public_vote_at', 'desc')` - ⚠️ Needs index

**Status:** ✅ Collection exists, needs user data

---

### `polls/{pollId}/comments` Subcollection (FUTURE)
**Purpose:** Comments on polls

**Document Structure:**
```typescript
{
  pollId: string;                    // Redundant but useful for queries
  userId: string;
  text: string;
  createdAt: Timestamp;
  likeCount: number;                 // Updated by Cloud Function
  parentId?: string | null;         // For replies
  editedAt?: Timestamp;
}
```

**Status:** ❌ Not implemented

---

## 2. FIRESTORE SECURITY RULES (Current: Basic)

**Current Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /polls/{pollId} {
      allow read: if true;
      allow write: if request.auth != null;
      
      // Votes subcollection - one vote per user
      match /votes/{voteId} {
        allow read: if true;
        allow create: if request.auth != null && 
                         request.auth.uid == request.resource.data.userId &&
                         !exists(/databases/$(database)/documents/polls/$(pollId)/votes/$(request.auth.uid));
        allow update: if request.auth != null && 
                         request.auth.uid == resource.data.userId;
        allow delete: if false; // Votes cannot be deleted
      }
      
      // Comments subcollection
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if request.auth != null && request.auth.uid == resource.data.userId;
        allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
      }
    }
    
    match /users/{userId} {
      allow read: if resource.data.is_directory_opt_in == true;
      allow read: if request.auth != null && request.auth.uid == userId; // Own profile
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      // Prevent users from manually updating vote counts
      allow update: if request.auth != null && 
                       request.auth.uid == userId &&
                       !request.resource.data.diff(resource.data).affectedKeys().hasAny(['public_vote_count_30d', 'public_vote_count_all', 'last_public_vote_at']);
    }
  }
}
```

**Status:** ⚠️ Needs update for votes subcollection rules

---

## 3. FIRESTORE INDEXES (REQUIRED)

### Polls Collection Indexes

**Index 1: Category + Country + State**
```
Collection: polls
Fields:
  - category (Ascending)
  - country (Ascending)
  - state (Ascending)
Query limit: 5
Status: ⚠️ NEEDED for filtered queries
```

**Index 2: Category + Country**
```
Collection: polls
Fields:
  - category (Ascending)
  - country (Ascending)
Query limit: 5
Status: ⚠️ NEEDED for country-filtered queries
```

**Index 3: Category + State (for US states)**
```
Collection: polls
Fields:
  - category (Ascending)
  - state (Ascending)
Query limit: 5
Status: ⚠️ NEEDED for state-filtered queries
```

### Users Collection Indexes

**Index 4: Directory Opt-in + Last Vote**
```
Collection: users
Fields:
  - is_directory_opt_in (Ascending)
  - last_public_vote_at (Descending)
Query limit: 12
Status: ⚠️ NEEDED for TopVotersCarousel
```

**Index 5: Directory Opt-in + Politician + Last Vote**
```
Collection: users
Fields:
  - is_directory_opt_in (Ascending)
  - is_politician (Ascending)
  - last_public_vote_at (Descending)
Query limit: 12
Status: ⚠️ NEEDED for TopPoliticiansCarousel
```

**Index 6: Directory Opt-in + Gender + Last Vote**
```
Collection: users
Fields:
  - is_directory_opt_in (Ascending)
  - gender (Ascending)
  - last_public_vote_at (Descending)
Query limit: 20
Status: ⚠️ NEEDED for DirectoryPage with gender filter
```

**Index 7: Directory Opt-in + Politician + Last Vote (for public filter)**
```
Collection: users
Fields:
  - is_directory_opt_in (Ascending)
  - is_politician (Ascending)  // false for public
  - last_public_vote_at (Descending)
Query limit: 20
Status: ⚠️ NEEDED for DirectoryPage with type='public' filter
```

**Status:** ❌ All indexes missing - queries will fail

---

## 4. AUTHENTICATION PROVIDERS

### Currently Configured
- ✅ Google (`GoogleAuthProvider`)
- ✅ Facebook (`FacebookAuthProvider`)
- ✅ X/Twitter (`TwitterAuthProvider` or custom OAuth)
- ✅ LinkedIn (OIDC provider)

### Configuration Required
1. **Firebase Console → Authentication → Sign-in method**
   - Enable each provider
   - Configure OAuth redirect URLs
   - For LinkedIn: Set up custom OIDC provider

2. **Environment Variables Needed:**
   - `VITE_FIREBASE_X_PROVIDER_ID` (if using custom OAuth for X)
   - `VITE_FIREBASE_LINKEDIN_PROVIDER_ID` (default: 'oidc.linkedin')

**Status:** ⚠️ Providers need to be enabled in Firebase Console

---

## 5. CLOUD FUNCTIONS (FUTURE - Recommended)

### Function 1: `onVoteCreate` (REQUIRED)
**Trigger:** When a vote is created in `polls/{pollId}/votes`

**Purpose:**
- Update poll stats (totalVotes, yesCount, noCount, yesPercent, noPercent)
- Update user's public_vote_count_30d, public_vote_count_all, last_public_vote_at
- Prevent duplicate votes (enforce one vote per user per poll)

**Code Structure:**
```javascript
exports.onVoteCreate = functions.firestore
  .document('polls/{pollId}/votes/{voteId}')
  .onCreate(async (snap, context) => {
    const vote = snap.data();
    const { pollId } = context.params;
    
    // 1. Update poll stats
    const pollRef = db.collection('polls').doc(pollId);
    const pollDoc = await pollRef.get();
    const currentStats = pollDoc.data().stats || {};
    
    const newStats = {
      totalVotes: (currentStats.totalVotes || 0) + 1,
      yesCount: vote.optionId === 'yes' 
        ? (currentStats.yesCount || 0) + 1 
        : currentStats.yesCount || 0,
      noCount: vote.optionId === 'no' 
        ? (currentStats.noCount || 0) + 1 
        : currentStats.noCount || 0,
    };
    
    newStats.yesPercent = Math.round((newStats.yesCount / newStats.totalVotes) * 100);
    newStats.noPercent = Math.round((newStats.noCount / newStats.totalVotes) * 100);
    
    if (vote.visibility === 'public') {
      newStats.publicVotes = (currentStats.publicVotes || 0) + 1;
    }
    
    await pollRef.update({ stats: newStats, updatedAt: FieldValue.serverTimestamp() });
    
    // 2. Update user stats if vote is public
    if (vote.visibility === 'public') {
      const userRef = db.collection('users').doc(vote.userId);
      await userRef.update({
        public_vote_count_all: FieldValue.increment(1),
        public_vote_count_30d: FieldValue.increment(1),
        last_public_vote_at: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  });
```

### Function 2: `update30DayCounts` (RECOMMENDED)
**Trigger:** Scheduled (daily at midnight)

**Purpose:**
- Recalculate `public_vote_count_30d` for all users (decay votes older than 30 days)

**Status:** ❌ Not implemented

### Function 3: `aggregatePollStats` (FUTURE)
**Trigger:** Scheduled (hourly)

**Purpose:**
- Recalculate poll stats from votes (for data integrity)
- Calculate demographic breakdowns (age, gender, location)

**Status:** ❌ Not implemented

---

## 6. IMMEDIATE ACTIONS NEEDED

### Priority 1: Core Functionality
1. ✅ **Create Firestore indexes** (Indexes 1-7 above)
   - Go to Firebase Console → Firestore → Indexes
   - Click "Create Index" for each
   - Wait 1-5 minutes for build

2. ✅ **Update Security Rules** for votes subcollection
   - Add rules for `polls/{pollId}/votes` (see above)

3. ❌ **Implement vote saving** in frontend
   - Create `src/lib/votes.ts` with `castVote()` function
   - Wire to `VotePreview` component in `PollDetail.tsx`

4. ❌ **Seed initial polls data**
   - Add 3-5 test polls to Firestore `polls` collection
   - Use categories: "Domestic Policy", "Foreign Policy", "Economic Policy", "Environment"

### Priority 2: Data Integrity
5. ⚠️ **Set up Cloud Functions** for vote aggregation
   - Deploy `onVoteCreate` function
   - Test vote counting logic

6. ⚠️ **User profile creation** on first login
   - Create `onUserCreate` Cloud Function or handle in frontend

### Priority 3: Future Features
7. ⚠️ **Comments system** (if needed)
8. ⚠️ **Analytics aggregation** for demographics
9. ⚠️ **Notification system** using Firebase Cloud Messaging

---

## 7. SAMPLE DATA STRUCTURE

### Example Poll Document:
```json
{
  "title": "Should the government increase funding for public infrastructure?",
  "description": "This poll aims to gauge public support for increased federal investment in roads, bridges, public transit, and other critical infrastructure.",
  "category": "Domestic Policy",
  "country": "US",
  "state": "FEDERAL",
  "language": "en",
  "status": "open",
  "visibility": "public",
  "createdBy": "admin-user-id",
  "createdAt": "2025-11-04T10:00:00Z",
  "updatedAt": "2025-11-04T10:00:00Z",
  "stats": {
    "totalVotes": 0,
    "yesCount": 0,
    "noCount": 0,
    "yesPercent": 0,
    "noPercent": 0,
    "publicVotes": 0
  },
  "tags": ["infrastructure", "budget", "transportation"]
}
```

### Example Vote Document:
```json
{
  "userId": "user-123",
  "optionId": "yes",
  "visibility": "public",
  "country": "US",
  "state": "CA",
  "verifiedLevel": 2,
  "createdAt": "2025-11-04T10:30:00Z"
}
```

---

## 8. COST CONSIDERATIONS

**Firestore Pricing (Blaze Plan - Pay as you go):**
- **Reads:** $0.06 per 100K documents
- **Writes:** $0.18 per 100K documents
- **Deletes:** $0.02 per 100K documents
- **Storage:** $0.18/GB/month

**Estimated Monthly Costs (10K users, 100 polls):**
- Poll reads: ~$5-10/month
- Vote writes: ~$2-5/month
- User reads: ~$1-2/month
- **Total: ~$10-20/month** (within free tier for most use)

**Free Tier Limits:**
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1GB storage

---

## 9. NEXT STEPS CHECKLIST

- [ ] Create all 7 Firestore indexes
- [ ] Update security rules for votes subcollection
- [ ] Enable authentication providers (Google, Facebook, X, LinkedIn)
- [ ] Seed 3-5 test polls in Firestore
- [ ] Implement `castVote()` function in frontend
- [ ] Wire vote submission to PollDetail page
- [ ] Set up Cloud Functions for vote aggregation (optional but recommended)
- [ ] Test vote flow end-to-end
- [ ] Test user directory queries
- [ ] Set up monitoring/alerts for Firestore usage

---

## 10. QUICK REFERENCE

**Firebase Console URLs:**
- Project: https://console.firebase.google.com/project/public-policy-poling
- Firestore: https://console.firebase.google.com/project/public-policy-poling/firestore
- Authentication: https://console.firebase.google.com/project/public-policy-poling/authentication
- Functions: https://console.firebase.google.com/project/public-policy-poling/functions
- Indexes: https://console.firebase.google.com/project/public-policy-poling/firestore/indexes

**Project ID:** `public-policy-poling`
**Database ID:** `(default)`

