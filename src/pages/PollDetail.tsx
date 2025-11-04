import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VotePreview } from '@/components/VotePreview';

export default function PollDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // Validate route parameter
  useEffect(() => {
    if (!id || id.trim() === '') {
      navigate('/404', { replace: true });
    }
  }, [id, navigate]);

  // Mock poll data (structure-compatible with new visuals)
  const poll = {
    id,
    title: 'Should the government increase funding for public infrastructure?',
    description: 'This poll aims to gauge public support for increased federal investment in roads, bridges, public transit, and other critical infrastructure.',
    category: 'Domestic Policy',
    country: 'United States',
    region: 'Federal (All States)',
    citizenship: 'US Citizens',
    yesPercent: 62,
    noPercent: 38,
    totalVotes: 8547,
    status: 'open' as const,
    minSampleSize: 1000,
  };

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
    setVote(choice);
    setIsPublic(visibility);
    setHasVoted(true);
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

  // Early return if id is invalid (will be handled by useEffect, but prevent render issues)
  if (!id || id.trim() === '') {
    return null;
  }

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
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
          <Badge variant={poll.status === 'open' ? 'default' : 'secondary'} className={poll.status === 'open' ? 'bg-accent text-accent-foreground' : ''}>
            {t(poll.status)}
          </Badge>
        </div>

        <section className="bg-card border border-border rounded-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary">{poll.category}</Badge>
            <Badge variant="secondary">{poll.country}</Badge>
            <Badge variant="secondary">{poll.region}</Badge>
            <Badge variant="secondary">{poll.citizenship}</Badge>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-2">{poll.title}</h1>
          <p className="text-muted-foreground mb-4 max-w-prose">{poll.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-chart-yes">{t('voteYes')} {poll.yesPercent}%</span>
                <span className="text-chart-no">{t('voteNo')} {poll.noPercent}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                {(() => {
                  const total = Math.max(1, poll.yesPercent + poll.noPercent);
                  const yesW = (poll.yesPercent / total) * 100;
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
              <div className="text-3xl font-bold">{poll.totalVotes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('votes')}</div>
            </div>
          </div>
        </section>

        {!hasVoted && poll.status === 'open' && (
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

        <section className="bg-card border border-border rounded-md p-6 mb-6">
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
        </section>

        <section className="bg-card border border-border rounded-md p-6">
          <h2 className="text-lg font-bold mb-4">{t('publicVoters')}</h2>
          <div className="space-y-3">
            {[
              { name: 'Sarah Johnson', vote: 'yes', verified: true, social: ['FB', 'LI'] },
              { name: 'Michael Chen', vote: 'no', verified: true, social: ['LI'] },
              { name: 'Emma Davis', vote: 'yes', verified: false, social: ['FB'] },
            ].map((voter, i) => (
              <div key={i} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                  {voter.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{voter.name}</div>
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
                  className={voter.vote === 'yes' ? 'bg-chart-yes' : 'bg-chart-no'}
                >
                  {voter.vote === 'yes' ? t('voteYes') : t('voteNo')}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
