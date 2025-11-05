import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
import type { PublicUser } from '@/lib/users';

interface VoterSocialLinksProps {
  profile: PublicUser;
}

export function VoterSocialLinks({ profile }: VoterSocialLinksProps) {
  const hasLinks = profile.social_links && (
    profile.social_links.linkedin || 
    profile.social_links.facebook || 
    profile.social_links.x
  );

  if (!hasLinks) {
    return (
      <section className="bg-card border border-border rounded-md p-6 mb-6">
        <h3 className="text-base font-bold mb-4">Social Links</h3>
        <p className="text-sm text-muted-foreground">No social media profiles linked</p>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <h3 className="text-base font-bold mb-4">Social Links</h3>
      <div className="space-y-2">
        {profile.social_links?.linkedin && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <a href={profile.social_links.linkedin} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </Button>
        )}
        
        {profile.social_links?.facebook && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <a href={profile.social_links.facebook} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-4 h-4" />
              Facebook
            </a>
          </Button>
        )}
        
        {profile.social_links?.x && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            asChild
          >
            <a href={profile.social_links.x} target="_blank" rel="noopener noreferrer">
              <Twitter className="w-4 h-4" />
              X (Twitter)
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
