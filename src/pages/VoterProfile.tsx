import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { VoterActivityChart } from '@/components/VoterActivityChart';
import { VoteBreakdownPanel } from '@/components/VoteBreakdownPanel';
import { RecentVotesList } from '@/components/RecentVotesList';
import { VoterSocialLinks } from '@/components/VoterSocialLinks';
import { fetchVoterProfile, type VoterProfile } from '@/lib/users';
import { CheckCircle2, Shield, TrendingUp } from 'lucide-react';

export default function VoterProfile() {
  const { id } = useParams<{ id: string }>();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<VoterProfile | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      const data = await fetchVoterProfile(id);
      if (mounted) {
        setProfile(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-4">
        <Header
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          selectedLanguage={selectedLanguage}
          onCountryChange={setSelectedCountry}
          onStateChange={setSelectedState}
          onLanguageChange={setSelectedLanguage}
        />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-64 w-full mb-6" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
        <BottomNav language={selectedLanguage} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-4">
        <Header
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          selectedLanguage={selectedLanguage}
          onCountryChange={setSelectedCountry}
          onStateChange={setSelectedState}
          onLanguageChange={setSelectedLanguage}
        />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Voter Not Found</h1>
            <p className="text-muted-foreground mb-6">This voter profile doesn't exist or is not public.</p>
            <Link to="/voters">
              <Button>Back to Voters Directory</Button>
            </Link>
          </div>
        </main>
        <BottomNav language={selectedLanguage} />
      </div>
    );
  }

  const displayName = profile.display_name || [profile.name, profile.surname].filter(Boolean).join(' ') || 'Anonymous';
  const initials = displayName.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('');

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedLanguage={selectedLanguage}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <section className="bg-card border border-border rounded-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground shrink-0">
              {initials || 'U'}
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  {profile.verification_level && profile.verification_level >= 2 && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.is_politician && (
                    <Badge variant="secondary">
                      {profile.politician_role || 'Politician'}
                    </Badge>
                  )}
                  {profile.gender && profile.gender !== 'prefer_not' && (
                    <Badge variant="outline">
                      {profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
                    </Badge>
                  )}
                  {profile.verification_level && (
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Level {profile.verification_level} Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                  <div className="text-2xl font-bold">{profile.public_vote_count_all || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last 30 Days</div>
                  <div className="text-2xl font-bold">{profile.public_vote_count_30d || 0}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Activity Score</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {Math.round(profile.score_top || 0)}
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                  <div className="text-2xl font-bold">#{profile.rank || '—'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <VoterActivityChart voterId={id!} />
            <VoteBreakdownPanel voterId={id!} />
            <RecentVotesList voterId={id!} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VoterSocialLinks profile={profile} />
            
            <section className="bg-card border border-border rounded-md p-6">
              <h3 className="text-base font-bold mb-4">About</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium mb-1">Member Since</div>
                  <div className="text-muted-foreground">
                    {profile.created_at 
                      ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                      : 'Recently'}
                  </div>
                </div>
                
                {profile.last_public_vote_at && (
                  <div>
                    <div className="font-medium mb-1">Last Activity</div>
                    <div className="text-muted-foreground">
                      {new Date(
                        profile.last_public_vote_at instanceof Date 
                          ? profile.last_public_vote_at 
                          : (profile.last_public_vote_at as any).seconds * 1000
                      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="font-medium mb-1">Verification Status</div>
                  <div className="text-muted-foreground">
                    {profile.verification_level === 0 && 'Unverified'}
                    {profile.verification_level === 1 && 'Email Verified'}
                    {profile.verification_level === 2 && 'Phone Verified'}
                    {profile.verification_level && profile.verification_level >= 3 && 'Full Identity Verified'}
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-card border border-border rounded-md p-6">
              <h3 className="text-base font-bold mb-4">Transparency</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>All vote history shown is based on public votes only. Private votes are never disclosed.</p>
                <p>Statistics are updated in real-time as new votes are cast.</p>
                <p>This profile is opt-in and can be hidden at any time by the voter.</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}

