import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { PublicUser } from '@/lib/users';

interface VoterCardProps {
  user: PublicUser;
}

// Truncate text to max length
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function VoterCard({ user }: VoterCardProps) {
  const displayName = user.display_name || [user.name, user.surname].filter(Boolean).join(' ') || 'Anonymous';
  // Limit display name to 20 characters
  const truncatedName = truncateText(displayName, 20);
  
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

  // Limit politician role to 20 characters
  const politicianRole = user.politician_role || 'Politician';
  const truncatedRole = truncateText(politicianRole, 20);

  return (
    <Link to={`/voter/${user.id}`} className="block">
      <Card className="w-full h-[200px] shadow-sm hover:shadow-md transition-shadow cursor-pointer flex-shrink-0">
        <CardContent className="p-4 h-full flex flex-col gap-3">
          <div className="flex flex-col items-center flex-shrink-0">
            <Avatar className="w-16 h-16 border border-border/50 shadow-sm flex-shrink-0">
              <AvatarImage 
                src={(user as any).profile_photo_url} 
                alt={truncatedName}
                className="object-cover"
              />
              <AvatarFallback className="text-base font-normal bg-muted text-muted-foreground">
                {initials || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center space-y-1.5 flex-shrink-0 min-h-[48px] flex flex-col justify-center">
            <div className="font-medium text-sm leading-tight text-foreground line-clamp-2">
              {truncatedName}
            </div>
            {user.is_politician && (
              <div className="flex justify-center">
                <Badge 
                  variant="secondary" 
                  className="text-xs font-normal px-2 py-0.5 bg-muted/80 max-w-full"
                  title={politicianRole}
                >
                  <span className="truncate block max-w-[120px]">
                    {truncatedRole}
                  </span>
                </Badge>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50 mt-auto flex-shrink-0">
            {user.public_vote_count_30d ?? 0} votes last 30d
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
