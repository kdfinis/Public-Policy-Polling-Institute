import { useEffect, useState } from 'react';
import { VoterCard } from '@/components/VoterCard';
import { fetchTopPoliticians, type PublicUser } from '@/lib/users';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

export function TopPoliticiansCarousel() {
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
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Public Persons & Politicians</div>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-48 h-40 shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!users.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Public Persons & Politicians</div>
      </div>
      <Carousel>
        <CarouselContent className="-ml-2">
          {users.map((u) => (
            <CarouselItem key={u.id} className="pl-2 basis-auto">
              <VoterCard user={u} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}


