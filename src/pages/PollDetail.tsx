import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { VotePreview } from '@/components/VotePreview';
import { fetchPollById } from '@/lib/polls';
import { castVote, getUserVote } from '@/lib/votes';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [poll, setPoll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Validate route parameter and fetch poll
  useEffect(() => {
    if (!id || id.trim() === '') {
      navigate('/404', { replace: true });
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const pollData = await fetchPollById(id);
        if (!pollData) {
          navigate('/404', { replace: true });
          return;
        }
        setPoll(pollData);

        // Check if user already voted
        if (auth.currentUser) {
          const existingVote = await getUserVote(id);
          if (existingVote) {
            setVote(existingVote.optionId as 'yes' | 'no');
            setIsPublic(existingVote.visibility === 'public');
            setHasVoted(true);
          }
        }
      } catch (error) {
        console.error('Failed to load poll:', error);
        toast({
          title: 'Error',
          description: 'Failed to load poll. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, navigate, toast]);

  // Mock age distribution data (oldest at top → youngest at bottom)
  const ageData = [
    { range: '90+', yes: 40, no: 70 },
    { range: '80-89', yes: 60, no: 100 },
    { range: '70-79', yes: 120, no: 160 },
    { range: '60-69', yes: 220, no: 260 },
    { range: '50-59', yes: 300, no: 280 },
    { range: '40-49', yes: 380, no: 310 },
    { range: '30-39', yes: 420, no: 300 },
    { range: '22-29', yes: 350, no: 220 },
    { range: 'Under 21', yes: 180, no: 120 },
  ];

  const maxVotes = Math.max(...ageData.flatMap(d => [d.yes, d.no]));

  const handleVote = async (choice: 'yes' | 'no', visibility: boolean) => {
    if (!id || !poll) return;
    if (!auth.currentUser) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to vote.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await castVote(id, choice, visibility ? 'public' : 'private', selectedCountry || 'US', selectedState || undefined);
      setVote(choice);
      setIsPublic(visibility);
      setHasVoted(true);
      
      // Refresh poll stats
      const updatedPoll = await fetchPollById(id);
      if (updatedPoll) setPoll(updatedPoll);

      toast({
        title: 'Vote submitted',
        description: 'Your vote has been recorded.',
      });
    } catch (error: any) {
      console.error('Failed to cast vote:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit vote. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        back: 'Back',
        open: 'Open',
        closed: 'Closed',
        votes: 'votes',
        voteYes: 'Yes',
        voteNo: 'No',
        public: 'Public',
        private: 'Private',
        consent: 'Your vote will be publicly visible with your name and verification status.',
        submitVote: 'Submit Vote',
        changeVote: 'Change Vote',
        ageDistribution: 'Vote Distribution by Age',
        publicVoters: 'Public Voters',
        verified: 'ID Verified',
      },
      hr: {
        back: 'Natrag',
        open: 'Otvoreno',
        closed: 'Zatvoreno',
        votes: 'glasova',
        voteYes: 'Da',
        voteNo: 'Ne',
        public: 'Javno',
        private: 'Privatno',
        consent: 'Vaš glas bit će javno vidljiv s vašim imenom i statusom provjere.',
        submitVote: 'Pošalji Glas',
        changeVote: 'Promijeni Glas',
        ageDistribution: 'Raspodjela Glasova po Dobi',
        publicVoters: 'Javni Glasači',
        verified: 'ID Provjeren',
      },
    };
    // Safe access with fallback
    const langTranslations = translations[selectedLanguage];
    if (!langTranslations) {
      return translations.en?.[key] || key;
    }
    return langTranslations[key] || key;
  };

  if (loading || !poll) {
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
        <main className="container mx-auto px-4 py-6 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  const stats = poll.stats || { totalVotes: 0, yesPercent: 0, noPercent: 0 };

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

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        {/* Poll Header */}
        <div className="bg-card border border-border rounded-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="secondary">{poll.category}</Badge>
            <Badge variant="secondary">{poll.country}</Badge>
            {poll.state && <Badge variant="secondary">{poll.state}</Badge>}
            <Badge
              variant={poll.status === 'open' ? 'default' : 'secondary'}
              className={poll.status === 'open' ? 'bg-accent text-accent-foreground' : ''}
            >
              {t(poll.status)}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold mb-3">{poll.title}</h1>
          {poll.description && <p className="text-muted-foreground mb-4">{poll.description}</p>}

          {/* Current Results */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-chart-yes">{t('voteYes')} {stats.yesPercent || 0}%</span>
                <span className="text-chart-no">{t('voteNo')} {stats.noPercent || 0}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                {(() => {
                  const total = Math.max(1, (stats.yesPercent || 0) + (stats.noPercent || 0));
                  const yesW = ((stats.yesPercent || 0) / total) * 100;
                  const noW = 100 - yesW;
                  return (
                    <>
                      <div className="bg-chart-yes" style={{ width: `${yesW}%` }} />
                      <div className="bg-chart-no" style={{ width: `${noW}%` }} />
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{(stats.totalVotes || 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('votes')}</div>
            </div>
          </div>

          {/* Vote Widget */}
          {!hasVoted && poll.status === 'open' && (
            <VotePreview
              voteYesLabel={t('voteYes')}
              voteNoLabel={t('voteNo')}
              publicLabel={t('public')}
              privateLabel={t('private')}
              consentText={t('consent')}
              submitLabel={t('submitVote')}
              onSubmit={handleVote}
              className="space-y-4"
              disabled={submitting}
            />
          )}

          {hasVoted && (
            <div className="flex items-center gap-2 p-4 bg-accent/10 border border-accent rounded-md animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
              <span className="font-medium">
                {selectedLanguage === 'en'
                  ? `You voted ${vote?.toUpperCase()} (${isPublic ? 'Public' : 'Private'})`
                  : `Glasali ste ${vote === 'yes' ? 'DA' : 'NE'} (${isPublic ? 'Javno' : 'Privatno'})`}
              </span>
            </div>
          )}
        </div>

        {/* Age Distribution Chart */}
        <div className="bg-card border border-border rounded-md p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">{t('ageDistribution')}</h2>
          <div className="space-y-2">
            {ageData.map((data) => (
              <div key={data.range} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{data.range}</div>
                <div className="flex gap-2">
                  <div className="flex-1 flex justify-end">
                    <div
                      className="h-4 bg-chart-yes rounded-l flex items-center justify-end pr-2 text-[10px] font-medium text-white"
                      style={{ width: `${(data.yes / maxVotes) * 100}%` }}
                    >
                      {data.yes > 50 && data.yes}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-4 bg-chart-no rounded-r flex items-center pl-2 text-[10px] font-medium text-white"
                      style={{ width: `${(data.no / maxVotes) * 100}%` }}
                    >
                      {data.no > 50 && data.no}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Voters */}
        <div className="bg-card border border-border rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">{t('publicVoters')}</h2>
          <div className="space-y-3">
            {[
              { userId: 'voter-001', name: 'Alex Thompson', vote: 'yes', verified: true, social: ['FB', 'LI'] },
              { userId: 'voter-002', name: 'Jordan Martinez', vote: 'no', verified: true, social: ['LI'] },
              { userId: 'voter-003', name: 'Casey Williams', vote: 'yes', verified: false, social: ['FB'] },
              { userId: 'voter-004', name: 'Riley Anderson', vote: 'yes', verified: true, social: ['FB', 'LI'] },
              { userId: 'voter-005', name: 'Taylor Brown', vote: 'no', verified: true, social: ['LI'] },
              { userId: 'voter-006', name: 'Morgan Garcia', vote: 'yes', verified: false, social: ['FB'] },
              { userId: 'voter-007', name: 'Quinn Lee', vote: 'no', verified: true, social: ['FB', 'LI'] },
              { userId: 'voter-008', name: 'Sam Wilson', vote: 'yes', verified: true, social: ['LI'] },
            ].map((voter) => (
              <Link
                key={voter.userId}
                to={`/profile/${voter.userId}`}
                className="flex items-center gap-3 pb-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors rounded-md px-2 -mx-2"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium shrink-0">
                  {voter.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{voter.name}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {voter.social.map((s) => (
                      <Badge
                        key={s}
                        variant="outline"
                        className="text-xs h-5"
                      >
                        {s}
                      </Badge>
                    ))}
                    {voter.verified && (
                      <Badge variant="outline" className="text-xs h-5 bg-badge-stage-3/10 border-badge-stage-3">
                        {t('verified')}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant={voter.vote === 'yes' ? 'default' : 'secondary'}
                  className={voter.vote === 'yes' ? 'bg-chart-yes' : 'bg-chart-no shrink-0'}
                >
                  {voter.vote === 'yes' ? t('voteYes') : t('voteNo')}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
