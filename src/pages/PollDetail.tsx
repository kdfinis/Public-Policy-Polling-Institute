import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function PollDetail() {
  const { id } = useParams();
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock poll data
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

  // Mock age distribution data
  const ageData = [
    { range: '18-24', yes: 150, no: 80 },
    { range: '25-34', yes: 320, no: 180 },
    { range: '35-44', yes: 450, no: 290 },
    { range: '45-54', yes: 380, no: 310 },
    { range: '55-64', yes: 290, no: 340 },
    { range: '65+', yes: 210, no: 380 },
  ];

  const maxVotes = Math.max(...ageData.flatMap(d => [d.yes, d.no]));

  const handleVote = () => {
    if (vote) {
      setHasVoted(true);
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
    return translations[selectedLanguage][key] || key;
  };

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
            <Badge variant="secondary">{poll.region}</Badge>
            <Badge variant="secondary">{poll.citizenship}</Badge>
            <Badge
              variant={poll.status === 'open' ? 'default' : 'secondary'}
              className={poll.status === 'open' ? 'bg-accent text-accent-foreground' : ''}
            >
              {t(poll.status)}
            </Badge>
          </div>

          <h1 className="text-2xl font-bold mb-3">{poll.title}</h1>
          <p className="text-muted-foreground mb-4">{poll.description}</p>

          {/* Current Results */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-chart-yes">{t('voteYes')} {poll.yesPercent}%</span>
                <span className="text-chart-no">{t('voteNo')} {poll.noPercent}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                <div className="bg-chart-yes" style={{ width: `${poll.yesPercent}%` }} />
                <div className="bg-chart-no" style={{ width: `${poll.noPercent}%` }} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{poll.totalVotes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{t('votes')}</div>
            </div>
          </div>

          {/* Vote Widget */}
          {!hasVoted && poll.status === 'open' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  variant={vote === 'yes' ? 'default' : 'outline'}
                  className="flex-1 h-12"
                  onClick={() => setVote('yes')}
                >
                  {t('voteYes')}
                </Button>
                <Button
                  variant={vote === 'no' ? 'default' : 'outline'}
                  className="flex-1 h-12"
                  onClick={() => setVote('no')}
                >
                  {t('voteNo')}
                </Button>
              </div>

              {vote && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <Label htmlFor="public-vote" className="cursor-pointer">
                      {isPublic ? t('public') : t('private')}
                    </Label>
                    <Switch
                      id="public-vote"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                  {isPublic && (
                    <p className="text-xs text-muted-foreground">{t('consent')}</p>
                  )}
                  <Button onClick={handleVote} className="w-full h-12">
                    {t('submitVote')}
                  </Button>
                </div>
              )}
            </div>
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
          <div className="space-y-3">
            {ageData.map((data) => (
              <div key={data.range} className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">{data.range}</div>
                <div className="flex gap-2">
                  <div className="flex-1 flex justify-end">
                    <div
                      className="h-8 bg-chart-yes rounded-l flex items-center justify-end pr-2 text-xs font-medium text-white"
                      style={{ width: `${(data.yes / maxVotes) * 100}%` }}
                    >
                      {data.yes > 50 && data.yes}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-8 bg-chart-no rounded-r flex items-center pl-2 text-xs font-medium text-white"
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
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
