import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { PublicUser } from '@/lib/users';

interface VoterCardProps {
  user: PublicUser;
}

export function VoterCard({ user }: VoterCardProps) {
  const displayName = user.display_name || [user.name, user.surname].filter(Boolean).join(' ') || 'Anonymous';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border border-border/50 shadow-sm">
            <AvatarImage 
              src={(user as any).profile_photo_url} 
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="text-lg font-normal bg-muted text-muted-foreground">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center space-y-2">
          <div className="font-medium text-base leading-snug text-foreground">
            {displayName}
          </div>
          {user.is_politician && (
            <div>
              <Badge 
                variant="secondary" 
                className="text-xs font-normal px-2.5 py-0.5 bg-muted/80"
              >
                {user.politician_role || 'Politician'}
              </Badge>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          {user.public_vote_count_30d ?? 0} votes last 30d
        </div>
      </CardContent>
    </Card>
  );
}


