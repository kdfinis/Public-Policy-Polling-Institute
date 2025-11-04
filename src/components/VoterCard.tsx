import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="w-48 shrink-0">
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
          {initials || 'U'}
        </div>
        <div className="text-center">
          <div className="font-medium leading-tight">{displayName}</div>
          {user.is_politician && (
            <div className="mt-1">
              <Badge variant="secondary">{user.politician_role || 'Politician'}</Badge>
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {user.public_vote_count_30d ?? 0} votes last 30d
        </div>
      </CardContent>
    </Card>
  );
}


