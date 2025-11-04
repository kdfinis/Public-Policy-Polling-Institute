import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export interface VoteData {
  userId: string;
  optionId: 'yes' | 'no' | 'abstain';
  visibility: 'public' | 'private';
  country: string;
  state?: string | null;
  verifiedLevel: number;
  createdAt: any; // Timestamp
}

export async function castVote(
  pollId: string,
  optionId: 'yes' | 'no',
  visibility: 'public' | 'private',
  country: string,
  state?: string | null
): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');
  if (!auth.currentUser) throw new Error('User not authenticated');

  const userId = auth.currentUser.uid;
  const voteRef = doc(db, 'polls', pollId, 'votes', userId);

  // Check if user already voted
  const existingVote = await getDoc(voteRef);
  if (existingVote.exists()) {
    throw new Error('You have already voted on this poll');
  }

  // Get user's verification level (default to 0 if not set)
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  const verificationLevel = userDoc.data()?.verification_level ?? 0;

  const voteData: VoteData = {
    userId,
    optionId,
    visibility,
    country,
    state: state || null,
    verifiedLevel,
    createdAt: serverTimestamp(),
  };

  await setDoc(voteRef, voteData);
}

export async function getUserVote(pollId: string): Promise<VoteData | null> {
  if (!db) return null;
  if (!auth.currentUser) return null;

  const userId = auth.currentUser.uid;
  const voteRef = doc(db, 'polls', pollId, 'votes', userId);
  const voteDoc = await getDoc(voteRef);

  if (!voteDoc.exists()) return null;

  return { id: voteDoc.id, ...voteDoc.data() } as VoteData & { id: string };
}

