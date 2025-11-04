import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, limit, query, where } from 'firebase/firestore';

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
    if (hot && !hot.articleUrl && !(hot as any).article_url) {
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


