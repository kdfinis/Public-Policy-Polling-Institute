import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Card } from '@/components/ui/card';
import { DataTable, Column } from '@/components/DataTable';
import { TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  date: string;
  activePolls: number;
  totalVotes: number;
  publicVotes: number;
  privateVotes: number;
}

const mockData: AnalyticsData[] = [
  { date: '2025-01-01', activePolls: 24, totalVotes: 3420, publicVotes: 2105, privateVotes: 1315 },
  { date: '2025-01-02', activePolls: 25, totalVotes: 3680, publicVotes: 2280, privateVotes: 1400 },
  { date: '2025-01-03', activePolls: 23, totalVotes: 3215, publicVotes: 1995, privateVotes: 1220 },
];

export default function Analytics() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');
  const [sortBy, setSortBy] = useState<keyof AnalyticsData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: 'Analytics Dashboard',
        activePolls: 'Active Polls',
        totalVotes: 'Total Votes Today',
        publicVotes: 'Public Votes',
        flagged: 'Flagged Activities',
        participationHistory: 'Participation History',
        date: 'Date',
        votes: 'Votes',
        private: 'Private',
      },
      hr: {
        title: 'Analitička Ploča',
        activePolls: 'Aktivne Ankete',
        totalVotes: 'Ukupno Glasova Danas',
        publicVotes: 'Javni Glasovi',
        flagged: 'Označene Aktivnosti',
        participationHistory: 'Povijest Sudjelovanja',
        date: 'Datum',
        votes: 'Glasovi',
        private: 'Privatno',
      },
    };
    return translations[selectedLanguage][key] || key;
  };

  const columns: Column<AnalyticsData>[] = [
    { key: 'date', header: t('date'), sortable: true },
    { key: 'activePolls', header: t('activePolls'), sortable: true },
    { 
      key: 'totalVotes', 
      header: t('totalVotes'), 
      sortable: true,
      render: (value) => (value as number).toLocaleString(),
    },
    { 
      key: 'publicVotes', 
      header: t('publicVotes'), 
      sortable: true,
      render: (value) => (value as number).toLocaleString(),
    },
    { 
      key: 'privateVotes', 
      header: t('private'), 
      sortable: true,
      render: (value) => (value as number).toLocaleString(),
    },
  ];

  const handleSort = (key: keyof AnalyticsData) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  const sortedData = [...mockData].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return aVal > bVal ? multiplier : -multiplier;
  });

  const kpiCards = [
    {
      title: t('activePolls'),
      value: '24',
      change: '+2',
      icon: Activity,
      color: 'text-chart-yes',
    },
    {
      title: t('totalVotes'),
      value: '8,547',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: t('publicVotes'),
      value: '62%',
      change: '-3%',
      icon: Users,
      color: 'text-accent',
    },
    {
      title: t('flagged'),
      value: '3',
      change: '+1',
      icon: AlertCircle,
      color: 'text-status-flagged',
    },
  ];

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

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                    <p className="text-3xl font-bold mb-1">{kpi.value}</p>
                    <p className={`text-sm ${kpi.change.startsWith('+') ? 'text-chart-yes' : 'text-chart-no'}`}>
                      {kpi.change}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Data Table */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">{t('participationHistory')}</h2>
          <DataTable
            data={sortedData}
            columns={columns}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            stickyHeader
          />
        </Card>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
