import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  startAfter,
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';

export type Gender = 'male' | 'female' | 'other' | 'prefer_not';

export interface PublicUser {
  id: string;
  name?: string;
  surname?: string;
  display_name?: string;
  is_directory_opt_in?: boolean;
  is_politician?: boolean;
  politician_role?: string;
  gender?: Gender;
  public_vote_count_30d?: number;
  public_vote_count_all?: number;
  last_public_vote_at?: { seconds: number; nanoseconds: number } | Date;
  social_links?: { linkedin?: string; facebook?: string; x?: string };
  verification_level?: number;
  score_top?: number;
  score_rising?: number;
}

function computeScoreTop(u: PublicUser): number {
  const recent = u.public_vote_count_30d ?? 0;
  const verification = u.verification_level ?? 0;
  const last = u.last_public_vote_at instanceof Date
    ? u.last_public_vote_at
    : u.last_public_vote_at
      ? new Date((u.last_public_vote_at as any).seconds * 1000)
      : undefined;
  const days = last ? Math.max(1, (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24)) : 999;
  const recencyBoost = Math.max(0, 100 / days); // simple decay
  return 0.5 * recent + 0.3 * verification + 0.2 * recencyBoost;
}

export async function fetchTopVoters(limitCount = 12): Promise<PublicUser[]> {
  if (!db) return [];
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('is_directory_opt_in', '==', true),
    limit(limitCount * 2) // Fetch more to sort client-side
  );
  const snap = await getDocs(q);
  const list: PublicUser[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  return list
    .map((u) => ({ ...u, score_top: computeScoreTop(u) }))
    .sort((a, b) => (b.score_top ?? 0) - (a.score_top ?? 0))
    .slice(0, limitCount);
}

export async function fetchTopPoliticians(limitCount = 12): Promise<PublicUser[]> {
  if (!db) return [];
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('is_directory_opt_in', '==', true),
    where('is_politician', '==', true),
    limit(limitCount * 2) // Fetch more to sort client-side
  );
  const snap = await getDocs(q);
  const list: PublicUser[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  return list
    .map((u) => ({ ...u, score_top: computeScoreTop(u) }))
    .sort((a, b) => (b.score_top ?? 0) - (a.score_top ?? 0))
    .slice(0, limitCount);
}

export interface DirectoryFilter {
  gender?: Gender | 'any';
  type?: 'all' | 'public' | 'politician';
  pageSize?: number;
  cursor?: QueryDocumentSnapshot<DocumentData> | null;
}

export interface DirectoryPage {
  items: PublicUser[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

export async function fetchDirectoryPage(filters: DirectoryFilter): Promise<DirectoryPage> {
  if (!db) return { items: [], nextCursor: null };
  const { gender = 'any', type = 'all', pageSize = 20, cursor = null } = filters;
  const usersRef = collection(db, 'users');

  const clauses: any[] = [where('is_directory_opt_in', '==', true)];
  if (gender !== 'any') clauses.push(where('gender', '==', gender));
  if (type === 'politician') clauses.push(where('is_politician', '==', true));
  if (type === 'public') clauses.push(where('is_politician', '==', false));

  // Remove orderBy to avoid index requirement - sort client-side instead
  let q = query(usersRef, ...clauses, limit(pageSize + 10)); // Fetch extra for sorting
  if (cursor) {
    q = query(usersRef, ...clauses, startAfter(cursor), limit(pageSize + 10));
  }

  const snap = await getDocs(q);
  let items: PublicUser[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  
  // Sort by last_public_vote_at client-side
  items.sort((a, b) => {
    const aDate = a.last_public_vote_at instanceof Date 
      ? a.last_public_vote_at.getTime()
      : a.last_public_vote_at?.seconds 
        ? a.last_public_vote_at.seconds * 1000 
        : 0;
    const bDate = b.last_public_vote_at instanceof Date 
      ? b.last_public_vote_at.getTime()
      : b.last_public_vote_at?.seconds 
        ? b.last_public_vote_at.seconds * 1000 
        : 0;
    return bDate - aDate; // Descending
  });
  
  items = items.slice(0, pageSize);
  const nextCursor = snap.docs.length > pageSize ? snap.docs[snap.docs.length - 1] : null;
  return { items, nextCursor };
}

// Lovable additions (mock implementations)
export interface VoterProfile extends PublicUser {
  rank?: number;
  created_at?: string;
}

export interface VoterActivityPoint {
  date: string;
  votes: number;
}

export interface VoterBreakdownItem {
  label: string;
  count: number;
  percentage: number;
}

export interface VoterBreakdown {
  byPosition: VoterBreakdownItem[];
  byCategory: VoterBreakdownItem[];
  byRegion: VoterBreakdownItem[];
}

export interface RecentVote {
  id: string;
  pollId: string;
  pollTitle: string;
  choice: 'yes' | 'no';
  votedAt: string;
  category?: string;
}

export async function fetchVoterProfile(voterId: string): Promise<VoterProfile | null> {
  if (!db) return null;
  // Try to fetch from Firestore first
  try {
    const userRef = doc(db, 'users', voterId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        rank: data.rank || undefined,
        created_at: data.created_at || data.createdAt?.toDate?.()?.toISOString() || undefined,
      } as VoterProfile;
    }
  } catch (error) {
    console.error('Error fetching voter profile:', error);
  }
  
  // Mock implementation fallback
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockProfile: VoterProfile = {
    id: voterId,
    display_name: 'John Doe',
    is_directory_opt_in: true,
    is_politician: false,
    gender: 'male',
    public_vote_count_30d: 45,
    public_vote_count_all: 328,
    verification_level: 2,
    score_top: 87,
    rank: 42,
    created_at: '2023-06-15',
    last_public_vote_at: new Date(),
    social_links: {
      linkedin: 'https://linkedin.com/in/johndoe',
      x: 'https://x.com/johndoe'
    }
  };
  
  return mockProfile;
}

export async function fetchVoterActivity(voterId: string, range: string): Promise<VoterActivityPoint[]> {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const points: VoterActivityPoint[] = [];
  const now = new Date();
  const days = range === '1W' ? 7 : range === '1M' ? 30 : range === '3M' ? 90 : range === '1Y' ? 365 : 730;
  
  for (let i = days; i >= 0; i -= Math.max(1, Math.floor(days / 20))) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    points.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      votes: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return points;
}

export async function fetchVoterBreakdown(voterId: string): Promise<VoterBreakdown> {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    byPosition: [
      { label: 'Agree', count: 198, percentage: 60 },
      { label: 'Disagree', count: 130, percentage: 40 }
    ],
    byCategory: [
      { label: 'Economy', count: 85, percentage: 26 },
      { label: 'Healthcare', count: 72, percentage: 22 },
      { label: 'Education', count: 58, percentage: 18 },
      { label: 'Environment', count: 54, percentage: 16 },
      { label: 'Other', count: 59, percentage: 18 }
    ],
    byRegion: [
      { label: 'Federal', count: 156, percentage: 48 },
      { label: 'State', count: 98, percentage: 30 },
      { label: 'Local', count: 74, percentage: 22 }
    ]
  };
}

export async function fetchRecentVotes(voterId: string, limit: number): Promise<RecentVote[]> {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockVotes: RecentVote[] = [
    {
      id: '1',
      pollId: 'AU0DgZn7wAelMbBdferg',
      pollTitle: 'Should we increase funding for public education?',
      choice: 'yes',
      votedAt: new Date(Date.now() - 86400000).toISOString(),
      category: 'Education'
    },
    {
      id: '2',
      pollId: 'poll2',
      pollTitle: 'Do you support renewable energy initiatives?',
      choice: 'yes',
      votedAt: new Date(Date.now() - 172800000).toISOString(),
      category: 'Environment'
    },
    {
      id: '3',
      pollId: 'poll3',
      pollTitle: 'Should healthcare be universal?',
      choice: 'no',
      votedAt: new Date(Date.now() - 259200000).toISOString(),
      category: 'Healthcare'
    }
  ];
  return mockVotes.slice(0, limit);
}

