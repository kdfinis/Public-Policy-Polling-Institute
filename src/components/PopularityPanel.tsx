import { TrendingUp, Share2, MousePointerClick, Eye } from 'lucide-react';

interface PopularityPanelProps {
  impressions: number;
  shares: number;
  clicks: number;
  language: 'en' | 'hr';
}

export function PopularityPanel({ impressions, shares, clicks, language }: PopularityPanelProps) {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: 'Popularity Metrics',
        impressions: 'Est. Reach',
        shares: 'Shares',
        clicks: 'Clicks',
      },
      hr: {
        title: 'Metrike Popularnosti',
        impressions: 'Procj. Doseg',
        shares: 'Dijeljenja',
        clicks: 'Klikovi',
      },
    };
    return translations[language][key] || key;
  };

  const metrics = [
    { label: t('impressions'), value: impressions.toLocaleString(), icon: Eye, color: 'text-primary' },
    { label: t('shares'), value: shares.toLocaleString(), icon: Share2, color: 'text-accent' },
    { label: t('clicks'), value: clicks.toLocaleString(), icon: MousePointerClick, color: 'text-blue-600' },
  ];

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-bold">{t('title')}</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="text-center">
              <Icon className={`h-5 w-5 mx-auto mb-2 ${metric.color}`} />
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-xs text-muted-foreground">{metric.label}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
