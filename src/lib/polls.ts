import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';

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
  const ref = collection(db, 'polls');
  const clauses: any[] = [where('category', '==', category)];
  if (country) clauses.push(where('country', '==', country));
  if (state) clauses.push(where('state', '==', state));
  const q = query(ref, ...clauses, orderBy('title'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function fetchFeatured(opts?: { max?: number }): Promise<PollDoc[]> {
  if (!db) return [];
  const { max = 4 } = opts || {};
  const ref = collection(db, 'polls');
  const q = query(ref, orderBy('updatedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}


