import { db } from '@/lib/firebase';
import {
  collection,
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


