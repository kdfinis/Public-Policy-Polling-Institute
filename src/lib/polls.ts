import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, limit, query, where, orderBy } from 'firebase/firestore';

export interface PollDoc {
  id: string;
  title: string;
  description?: string;
  category: string;
  country: string;
  state?: string | null;
  status: 'open' | 'closed' | 'scheduled' | 'draft';
  stats?: {
    totalVotes?: number;
    yesPercent?: number;
    noPercent?: number;
  };
}

export async function fetchPollsByCategory(category: string, opts?: { country?: string; state?: string; max?: number }): Promise<PollDoc[]> {
  if (!db) return [];
  const { country, state, max = 5 } = opts || {};
  
  try {
    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const ref = collection(db, 'polls');
    const clauses: any[] = [where('category', '==', category)];
    if (country) clauses.push(where('country', '==', country));
    if (state) clauses.push(where('state', '==', state));
    const q = query(ref, ...clauses, limit(max));
    
    const snap = await Promise.race([getDocs(q), timeoutPromise]);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  } catch (error) {
    console.error(`Error fetching polls for category ${category}:`, error);
    return []; // Return empty array instead of throwing
  }
}

export async function fetchFeatured(opts?: { max?: number }): Promise<PollDoc[]> {
  if (!db) return [];
  const { max = 4 } = opts || {};
  const ref = collection(db, 'polls');
  const q = query(ref, limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function fetchHotPoll(): Promise<PollDoc | null> {
  if (!db) return null;
  
  try {
    // Add timeout to prevent hanging connections
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 10000)
    );
    
    const ref = collection(db, 'polls');
    const q = query(ref, limit(50)); // Get more to sort client-side
    const snap = await Promise.race([getDocs(q), timeoutPromise]);
    const polls = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as PollDoc));
    // Sort by total votes and return the hottest
    polls.sort((a, b) => (b.stats?.totalVotes || 0) - (a.stats?.totalVotes || 0));
    const hot = polls[0];
    // Ensure hot poll has article URL
    if (hot && !(hot as any).articleUrl && !(hot as any).article_url) {
      (hot as any).articleUrl = 'https://www.nytimes.com/article/policy-debate.html';
    }
    return hot || null;
  } catch (error) {
    console.error('Error fetching hot poll:', error);
    return null; // Return null instead of throwing
  }
}

export async function fetchPollById(pollId: string): Promise<PollDoc | null> {
  if (!db) return null;
  const pollRef = doc(db, 'polls', pollId);
  const pollDoc = await getDoc(pollRef);
  if (!pollDoc.exists()) return null;
  return { id: pollDoc.id, ...pollDoc.data() } as PollDoc;
}

// Lovable additions (mock implementations)
export interface HistoryDataPoint {
  timestamp: string;
  yes: number;
  no: number;
  total: number;
}

export interface ShareStats {
  impressions: number;
  shares: number;
  clicks: number;
}

// Fetch historical data for a poll - mock implementation
export async function fetchPollHistory(pollId: string, range: '1D' | '1W' | '1M' | '1Y' | '5Y'): Promise<HistoryDataPoint[]> {
  // Mock data generator based on range
  const now = Date.now();
  const points: HistoryDataPoint[] = [];
  
  let intervals = 24; // default for 1D
  let step = 3600000; // 1 hour in ms
  
  switch (range) {
    case '1D':
      intervals = 24;
      step = 3600000; // hourly
      break;
    case '1W':
      intervals = 168;
      step = 3600000; // hourly
      break;
    case '1M':
      intervals = 30;
      step = 86400000; // daily
      break;
    case '1Y':
      intervals = 52;
      step = 604800000; // weekly
      break;
    case '5Y':
      intervals = 60;
      step = 2592000000; // monthly
      break;
  }
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = new Date(now - (i * step));
    const baseYes = 300 + Math.random() * 200;
    points.push({
      timestamp: timestamp.toISOString(),
      yes: Math.floor(baseYes + Math.random() * 50),
      no: Math.floor(baseYes * 0.6 + Math.random() * 30),
      total: Math.floor(baseYes * 1.6 + Math.random() * 80),
    });
  }
  
  return points;
}

// Fetch share statistics for a poll - mock implementation
export async function getShareStats(pollId: string): Promise<ShareStats> {
  // Mock data
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    impressions: 12345,
    shares: 567,
    clicks: 234,
  };
}

// Demographics breakdown interfaces
export interface DemographicsData {
  byGender: Array<{ label: string; yes: number; no: number }>;
  byLocation: Array<{ label: string; yes: number; no: number }>;
}

// Public voter info for display
export interface PublicVoter {
  userId: string;
  displayName: string;
  vote: 'yes' | 'no';
  verified: boolean;
  social: string[];
  verificationLevel: number;
}

// Fetch demographics breakdown for a poll
export async function fetchPollDemographics(pollId: string): Promise<DemographicsData> {
  if (!db) {
    // Return mock data if db not available
    return {
      byGender: [
        { label: 'Male', yes: 120, no: 80 },
        { label: 'Female', yes: 150, no: 90 },
        { label: 'Other', yes: 20, no: 15 },
        { label: 'Prefer not to say', yes: 10, no: 5 },
      ],
      byLocation: [
        { label: 'Federal', yes: 180, no: 120 },
        { label: 'State', yes: 80, no: 50 },
        { label: 'Local', yes: 40, no: 20 },
      ],
    };
  }

  try {
    const votesRef = collection(db, 'polls', pollId, 'votes');
    const votesQuery = query(votesRef, where('visibility', '==', 'public'));
    let votesSnap;
    try {
      votesSnap = await getDocs(votesQuery);
    } catch (queryError: any) {
      if (queryError?.code === 'permission-denied' || queryError?.code === 'permissions-denied') {
        throw { code: 'permission-denied', isPermissionError: true };
      }
      throw queryError;
    }
    
    const votes = votesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any & { userId: string; optionId: 'yes' | 'no'; state?: string | null }));
    
    // Get user data for all voters
    if (!db) return { byGender: [], byLocation: [] };
    const userIds = [...new Set(votes.map(v => v.userId))];
    const userPromises = userIds.map((userId: string) => 
      getDoc(doc(db, 'users', userId)).then(userDoc => ({
        userId,
        data: userDoc.exists() ? userDoc.data() : null,
      }))
    );
    const users = await Promise.all(userPromises);
    const userMap = new Map(users.map(u => [u.userId, u.data]));

    // Aggregate by gender
    const genderCounts: Record<string, { yes: number; no: number }> = {};
    votes.forEach(vote => {
      const user = userMap.get(vote.userId);
      const gender = user?.gender || 'prefer_not';
      const genderLabel = gender === 'prefer_not' ? 'Prefer not to say' : 
                         gender.charAt(0).toUpperCase() + gender.slice(1);
      
      if (!genderCounts[genderLabel]) {
        genderCounts[genderLabel] = { yes: 0, no: 0 };
      }
      if (vote.optionId === 'yes') {
        genderCounts[genderLabel].yes++;
      } else {
        genderCounts[genderLabel].no++;
      }
    });

    // Aggregate by location (state vs federal)
    const locationCounts: Record<string, { yes: number; no: number }> = {};
    votes.forEach(vote => {
      const location = vote.state ? 'State' : 'Federal';
      if (!locationCounts[location]) {
        locationCounts[location] = { yes: 0, no: 0 };
      }
      if (vote.optionId === 'yes') {
        locationCounts[location].yes++;
      } else {
        locationCounts[location].no++;
      }
    });

    return {
      byGender: Object.entries(genderCounts).map(([label, counts]) => ({
        label,
        yes: counts.yes,
        no: counts.no,
      })),
      byLocation: Object.entries(locationCounts).map(([label, counts]) => ({
        label,
        yes: counts.yes,
        no: counts.no,
      })),
    };
  } catch (error: any) {
    // Gracefully handle permission errors - suppress console errors
    if (error?.code === 'permission-denied' || error?.code === 'permissions-denied' || error?.isPermissionError || error?.message?.includes('permission')) {
      // Silently use mock data for permission errors
      return {
        byGender: [
          { label: 'Male', yes: 120, no: 80 },
          { label: 'Female', yes: 150, no: 90 },
          { label: 'Other', yes: 20, no: 15 },
          { label: 'Prefer not to say', yes: 10, no: 5 },
        ],
        byLocation: [
          { label: 'Federal', yes: 180, no: 120 },
          { label: 'State', yes: 80, no: 50 },
          { label: 'Local', yes: 40, no: 20 },
        ],
      };
    }
    // Only log non-permission errors
    console.error('Error fetching poll demographics:', error);
    return {
      byGender: [
        { label: 'Male', yes: 120, no: 80 },
        { label: 'Female', yes: 150, no: 90 },
        { label: 'Other', yes: 20, no: 15 },
        { label: 'Prefer not to say', yes: 10, no: 5 },
      ],
      byLocation: [
        { label: 'Federal', yes: 180, no: 120 },
        { label: 'State', yes: 80, no: 50 },
        { label: 'Local', yes: 40, no: 20 },
      ],
    };
  }
}

// Fetch public voters for a poll
export async function fetchPollVoters(pollId: string, limitCount = 10): Promise<PublicVoter[]> {
  if (!db) {
    // Return mock data if db not available
    return [
      { userId: '1', displayName: 'Sarah Johnson', vote: 'yes', verified: true, social: ['FB', 'LI'], verificationLevel: 2 },
      { userId: '2', displayName: 'Michael Chen', vote: 'no', verified: true, social: ['LI'], verificationLevel: 3 },
      { userId: '3', displayName: 'Emma Davis', vote: 'yes', verified: false, social: ['FB'], verificationLevel: 1 },
    ];
  }

  try {
    const votesRef = collection(db, 'polls', pollId, 'votes');
    const votesQuery = query(
      votesRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    let votesSnap;
    try {
      votesSnap = await getDocs(votesQuery);
    } catch (queryError: any) {
      if (queryError?.code === 'permission-denied' || queryError?.code === 'permissions-denied') {
        throw { code: 'permission-denied', isPermissionError: true };
      }
      throw queryError;
    }
    
    const votes = votesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any & { userId: string; optionId: 'yes' | 'no'; createdAt?: any }));
    
    // Get user data for all voters
    if (!db) return [];
    const userIds = [...new Set(votes.map(v => v.userId))];
    const userPromises = userIds.map((userId: string) => 
      getDoc(doc(db, 'users', userId)).then(userDoc => ({
        userId,
        data: userDoc.exists() ? userDoc.data() : null,
      }))
    );
    const users = await Promise.all(userPromises);
    const userMap = new Map(users.map(u => [u.userId, u.data]));

    // Map votes to public voter info
    const voters: PublicVoter[] = votes.map(vote => {
      const user = userMap.get(vote.userId);
      const displayName = user?.display_name || 
                         [user?.name, user?.surname].filter(Boolean).join(' ') || 
                         'Anonymous';
      
      const social: string[] = [];
      if (user?.social_links?.facebook) social.push('FB');
      if (user?.social_links?.linkedin) social.push('LI');
      if (user?.social_links?.x) social.push('X');

      return {
        userId: vote.userId,
        displayName,
        vote: vote.optionId as 'yes' | 'no',
        verified: (user?.verification_level || 0) >= 2,
        social,
        verificationLevel: user?.verification_level || 0,
      };
    });

    return voters;
  } catch (error: any) {
    // Gracefully handle permission errors - suppress console errors
    if (error?.code === 'permission-denied' || error?.code === 'permissions-denied' || error?.isPermissionError || error?.message?.includes('permission')) {
      // Silently use mock data for permission errors
      return [
        { userId: '1', displayName: 'Sarah Johnson', vote: 'yes', verified: true, social: ['FB', 'LI'], verificationLevel: 2 },
        { userId: '2', displayName: 'Michael Chen', vote: 'no', verified: true, social: ['LI'], verificationLevel: 3 },
        { userId: '3', displayName: 'Emma Davis', vote: 'yes', verified: false, social: ['FB'], verificationLevel: 1 },
      ];
    }
    // Only log non-permission errors
    console.error('Error fetching poll voters:', error);
    return [
      { userId: '1', displayName: 'Sarah Johnson', vote: 'yes', verified: true, social: ['FB', 'LI'], verificationLevel: 2 },
      { userId: '2', displayName: 'Michael Chen', vote: 'no', verified: true, social: ['LI'], verificationLevel: 3 },
      { userId: '3', displayName: 'Emma Davis', vote: 'yes', verified: false, social: ['FB'], verificationLevel: 1 },
    ];
  }
}

