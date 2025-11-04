import { useEffect, useState } from 'react';
import { VoterCard } from '@/components/VoterCard';
import { fetchTopPoliticians, type PublicUser } from '@/lib/users';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Public Persons & Politicians</h2>
        </div>
        <Card className="p-6 bg-gradient-to-br from-[hsl(var(--navbar))]/5 to-[hsl(var(--navbar))]/10 border-[hsl(var(--navbar))]/20">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-56 h-64 shrink-0 rounded-lg" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (!users.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Public Persons & Politicians</h2>
      </div>
      
      <div className="relative group">
        {/* Gradient background container */}
        <Card className="p-6 bg-gradient-to-br from-[hsl(var(--navbar))]/5 via-[hsl(var(--navbar))]/10 to-[hsl(var(--navbar))]/5 border-[hsl(var(--navbar))]/20 shadow-lg relative overflow-hidden">
          {/* Decorative accent lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--navbar))]/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[hsl(var(--navbar))]/20 to-transparent"></div>
          
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              loop: false,
              dragFree: true,
            }}
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {users.map((u) => (
                <CarouselItem key={u.id} className="pl-4 md:pl-6 basis-auto">
                  <VoterCard user={u} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom styled navigation buttons */}
            <CarouselPrevious 
              className={cn(
                "left-2 md:left-4 top-1/2 -translate-y-1/2",
                "h-10 w-10 rounded-full",
                "bg-[hsl(var(--navbar))] text-[hsl(var(--navbar-foreground))]",
                "border-2 border-[hsl(var(--navbar))]/50",
                "shadow-lg hover:shadow-xl",
                "hover:bg-[hsl(var(--navbar))]/90 active:scale-95",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "z-10 touch-manipulation"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </CarouselPrevious>
            
            <CarouselNext 
              className={cn(
                "right-2 md:right-4 top-1/2 -translate-y-1/2",
                "h-10 w-10 rounded-full",
                "bg-[hsl(var(--navbar))] text-[hsl(var(--navbar-foreground))]",
                "border-2 border-[hsl(var(--navbar))]/50",
                "shadow-lg hover:shadow-xl",
                "hover:bg-[hsl(var(--navbar))]/90 active:scale-95",
                "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity",
                "disabled:opacity-30 disabled:cursor-not-allowed",
                "z-10 touch-manipulation"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </CarouselNext>
          </Carousel>
          
          {/* Scroll indicator hint */}
          <div className="mt-4 flex items-center justify-center gap-1">
            <div className="h-1 w-8 bg-[hsl(var(--navbar))]/20 rounded-full"></div>
            <span className="text-xs text-muted-foreground px-2">Swipe to explore</span>
            <div className="h-1 w-8 bg-[hsl(var(--navbar))]/20 rounded-full"></div>
          </div>
        </Card>
      </div>
    </div>
  );
}


