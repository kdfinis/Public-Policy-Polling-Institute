import { useEffect, useState } from 'react';
import { VoterCard } from '@/components/VoterCard';
import { fetchTopPoliticians, type PublicUser } from '@/lib/users';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function TopPoliticiansCarousel({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<PublicUser[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await fetchTopPoliticians(12);
        if (mounted) setUsers(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    if (compact) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-64" />
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Public Persons</h2>
        </div>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-64" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const six = users.slice(0, 6);
  if (!six.length) return null;

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {six.map((u) => (
          <div key={u.id} className="w-full">
            <VoterCard user={u} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Public Persons</h2>
      </div>
      <Card className="p-4 border-border relative">
        <div className="grid grid-cols-2 gap-3">
          {six.map((u) => (
            <div key={u.id} className="w-full">
              <VoterCard user={u} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


