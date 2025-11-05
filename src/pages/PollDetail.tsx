import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, LogIn } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VotePreview } from '@/components/VotePreview';
import { HistoryChart } from '@/components/HistoryChart';
import { SharePanel } from '@/components/SharePanel';
import { PopularityPanel } from '@/components/PopularityPanel';
import { TermsSidebar } from '@/components/TermsSidebar';
import { fetchPollById, fetchPollHistory, getShareStats, fetchPollDemographics, fetchPollVoters, type PollDoc, type HistoryDataPoint, type DemographicsData, type PublicVoter } from '@/lib/polls';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [poll, setPoll] = useState<PollDoc | null>(null);
  const [historyData, setHistoryData] = useState<HistoryDataPoint[]>([]);
  const [shareStats, setShareStats] = useState<{ impressions: number; shares: number; clicks: number } | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [publicVoters, setPublicVoters] = useState<PublicVoter[]>([]);

  // Validate route parameter
  useEffect(() => {
    if (!id || id.trim() === '') {
      navigate('/404', { replace: true });
    }
  }, [id, navigate]);

  // Fetch poll data
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const pollData = await fetchPollById(id);
        if (mounted && pollData) {
          setPoll(pollData);
          // Fetch history, share stats, demographics, and voters
          const [history, stats, demo, voters] = await Promise.all([
            fetchPollHistory(id, '1W'),
            getShareStats(id),
            fetchPollDemographics(id),
            fetchPollVoters(id, 10),
          ]);
          if (mounted) {
            setHistoryData(history);
            setShareStats(stats);
            setDemographics(demo);
            setPublicVoters(voters);
          }
        } else if (mounted && !pollData) {
          navigate('/404', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching poll:', error);
        if (mounted) navigate('/404', { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, navigate]);

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

  const handleVote = (choice: 'yes' | 'no', visibility: boolean) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setVote(choice);
    setIsPublic(visibility);
    setHasVoted(true);
  };

  const handleLoginClick = () => {
    navigate('/login');
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
        signInToVote: 'Sign in to vote',
        needLogin: 'You need to be logged in to participate in this poll',
        signInToVoteBtn: 'Sign In to Vote',
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
        signInToVote: 'Prijavite se za glasanje',
        needLogin: 'Morate biti prijavljeni za sudjelovanje u ovoj anketi',
        signInToVoteBtn: 'Prijavite se za Glasanje',
      },
    };
    const langTranslations = translations[selectedLanguage];
    if (!langTranslations) {
      return translations.en?.[key] || key;
    }
    return langTranslations[key] || key;
  };

  // Early return if id is invalid
  if (!id || id.trim() === '') {
    return null;
  }

  // Loading state
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
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-96 w-full" />
        </main>
        <BottomNav language={selectedLanguage} />
      </div>
    );
  }

  // Extract poll data with defaults
  const pollTitle = poll.title || 'Untitled Poll';
  const pollDescription = poll.description || '';
  const pollCategory = poll.category || 'General';
  const pollCountry = poll.country || 'United States';
  const pollState = poll.state || null;
  const pollStatus = poll.status || 'closed';
  const yesPercent = poll.stats?.yesPercent || 0;
  const noPercent = poll.stats?.noPercent || 0;
  const totalVotes = poll.stats?.totalVotes || 0;

  // Format dates for sidebar
  const publishedAt = (poll as any).publishedAt || (poll as any).createdAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recently';
  const lastUpdated = (poll as any).lastUpdated || (poll as any).updatedAt?.toDate?.()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || publishedAt;

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

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="mb-4 flex items-center justify-between">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('back')}
              </Link>
              <Badge variant={pollStatus === 'open' ? 'default' : 'secondary'} className={pollStatus === 'open' ? 'bg-accent text-accent-foreground' : ''}>
                {t(pollStatus)}
              </Badge>
            </div>

            <section className="bg-card border border-border rounded-md p-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="secondary">{pollCategory}</Badge>
                <Badge variant="secondary">{pollCountry}</Badge>
                {pollState && <Badge variant="secondary">{pollState}</Badge>}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{pollTitle}</h1>
              <p className="text-muted-foreground mb-4 max-w-prose">{pollDescription}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-2">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-blue-600">{t('voteYes')} {yesPercent}%</span>
                    <span className="text-red-600">{t('voteNo')} {noPercent}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                    {(() => {
                      const total = Math.max(1, yesPercent + noPercent);
                      const yesW = (yesPercent / total) * 100;
                      const noW = 100 - yesW;
                      return (
                        <>
                          <div className="bg-blue-600" style={{ width: `${yesW}%` }} />
                          <div className="bg-red-600" style={{ width: `${noW}%` }} />
                        </>
                      );
                    })()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{totalVotes.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{t('votes')}</div>
                </div>
              </div>
            </section>

            {/* Vote Widget or Login Prompt */}
            {!hasVoted && pollStatus === 'open' && (
              <>
                {!user ? (
                  <section className="bg-card border border-border rounded-md p-6 mb-6 bg-accent/5 border-accent/20">
                    <div className="text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                          <LogIn className="h-6 w-6 text-accent" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{t('signInToVote')}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{t('needLogin')}</p>
                      </div>
                      <Button onClick={handleLoginClick} size="lg" className="w-full sm:w-auto">
                        {t('signInToVoteBtn')}
                      </Button>
                    </div>
                  </section>
                ) : (
                  <section className="bg-card border border-border rounded-md p-6 mb-6">
                    <VotePreview
                      voteYesLabel={t('voteYes')}
                      voteNoLabel={t('voteNo')}
                      publicLabel={t('public')}
                      privateLabel={t('private')}
                      consentText={t('consent')}
                      submitLabel={t('submitVote')}
                      onSubmit={handleVote}
                      className="space-y-4"
                    />
                  </section>
                )}
              </>
            )}

            {hasVoted && (
              <section className="flex items-center gap-2 p-4 bg-accent/10 border border-accent rounded-md mb-6">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                <span className="font-medium">
                  {selectedLanguage === 'en'
                    ? `You voted ${vote?.toUpperCase()} (${isPublic ? 'Public' : 'Private'})`
                    : `Glasali ste ${vote === 'yes' ? 'DA' : 'NE'} (${isPublic ? 'Javno' : 'Privatno'})`}
                </span>
              </section>
            )}

            {/* Historical Trend Chart */}
            {historyData.length > 0 && (
              <HistoryChart
                data={historyData}
                language={selectedLanguage === 'en' || selectedLanguage === 'hr' ? selectedLanguage : 'en'}
              />
            )}

            {/* Share Panel */}
            <SharePanel
              pollId={id}
              pollTitle={pollTitle}
              language={selectedLanguage === 'en' || selectedLanguage === 'hr' ? selectedLanguage : 'en'}
            />

            {/* Popularity Panel */}
            {shareStats && (
              <PopularityPanel
                impressions={shareStats.impressions}
                shares={shareStats.shares}
                clicks={shareStats.clicks}
                language={selectedLanguage === 'en' || selectedLanguage === 'hr' ? selectedLanguage : 'en'}
              />
            )}

            {/* Age Distribution Chart */}
            <section className="bg-card border border-border rounded-md p-6 mb-6">
              <h2 className="text-lg font-bold mb-4">{t('ageDistribution')}</h2>
              <div className="space-y-2">
                {ageData.map((data) => (
                  <div key={data.range} className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">{data.range}</div>
                    <div className="flex gap-2">
                      <div className="flex-1 flex justify-end">
                        <div
                          className="h-4 bg-blue-600 rounded-l flex items-center justify-end pr-2 text-[10px] font-medium text-white"
                          style={{ width: `${(data.yes / maxVotes) * 100}%` }}
                        >
                          {data.yes > 50 && data.yes}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div
                          className="h-4 bg-red-600 rounded-r flex items-center pl-2 text-[10px] font-medium text-white"
                          style={{ width: `${(data.no / maxVotes) * 100}%` }}
                        >
                          {data.no > 50 && data.no}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gender Distribution Chart */}
            {demographics && demographics.byGender.length > 0 && (
              <section className="bg-card border border-border rounded-md p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Vote Distribution by Gender</h2>
                <div className="space-y-2">
                  {(() => {
                    const maxVotes = Math.max(...demographics.byGender.flatMap(d => [d.yes, d.no]));
                    return demographics.byGender.map((data) => (
                      <div key={data.label} className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{data.label}</div>
                        <div className="flex gap-2">
                          <div className="flex-1 flex justify-end">
                            <div
                              className="h-4 bg-blue-600 rounded-l flex items-center justify-end pr-2 text-[10px] font-medium text-white"
                              style={{ width: `${maxVotes > 0 ? (data.yes / maxVotes) * 100 : 0}%` }}
                            >
                              {data.yes > 50 && data.yes}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div
                              className="h-4 bg-red-600 rounded-r flex items-center pl-2 text-[10px] font-medium text-white"
                              style={{ width: `${maxVotes > 0 ? (data.no / maxVotes) * 100 : 0}%` }}
                            >
                              {data.no > 50 && data.no}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* Location Distribution Chart */}
            {demographics && demographics.byLocation.length > 0 && (
              <section className="bg-card border border-border rounded-md p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Vote Distribution by Location</h2>
                <div className="space-y-2">
                  {(() => {
                    const maxVotes = Math.max(...demographics.byLocation.flatMap(d => [d.yes, d.no]));
                    return demographics.byLocation.map((data) => (
                      <div key={data.label} className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground">{data.label}</div>
                        <div className="flex gap-2">
                          <div className="flex-1 flex justify-end">
                            <div
                              className="h-4 bg-blue-600 rounded-l flex items-center justify-end pr-2 text-[10px] font-medium text-white"
                              style={{ width: `${maxVotes > 0 ? (data.yes / maxVotes) * 100 : 0}%` }}
                            >
                              {data.yes > 50 && data.yes}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div
                              className="h-4 bg-red-600 rounded-r flex items-center pl-2 text-[10px] font-medium text-white"
                              style={{ width: `${maxVotes > 0 ? (data.no / maxVotes) * 100 : 0}%` }}
                            >
                              {data.no > 50 && data.no}
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </section>
            )}

            {/* Public Voters */}
            <section className="bg-card border border-border rounded-md p-6">
              <h2 className="text-lg font-bold mb-4">{t('publicVoters')}</h2>
              <div className="space-y-3">
                {publicVoters.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No public voters yet</p>
                ) : (
                  publicVoters.map((voter) => (
                    <Link
                      key={voter.userId}
                      to={`/voter/${voter.userId}`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors rounded-md p-2 -m-2">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                          {voter.displayName[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{voter.displayName}</div>
                          <div className="flex items-center gap-2">
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
                          className={voter.vote === 'yes' ? 'bg-blue-600' : 'bg-red-600'}
                        >
                          {voter.vote === 'yes' ? t('voteYes') : t('voteNo')}
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 lg:sticky lg:top-20 lg:self-start">
            <TermsSidebar
              terms={(poll as any).terms || 'Eligible voters must be verified. One vote per verified account. Poll closes when sample size is reached.'}
              author={{
                name: (poll as any).author?.name || 'Public Policy Polling Institute',
                organization: (poll as any).author?.organization,
                verified: (poll as any).author?.verified || true,
              }}
              publishedAt={publishedAt}
              lastUpdated={lastUpdated}
              language={selectedLanguage === 'en' || selectedLanguage === 'hr' ? selectedLanguage : 'en'}
            />
          </aside>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
