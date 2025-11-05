import { FileText, User, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

interface TermsSidebarProps {
  terms: string;
  author: {
    name: string;
    organization?: string;
    verified: boolean;
  };
  publishedAt: string;
  lastUpdated?: string;
  language: 'en' | 'hr';
}

export function TermsSidebar({ terms, author, publishedAt, lastUpdated, language }: TermsSidebarProps) {
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        terms: 'Poll Terms',
        author: 'Author & Publishing',
        authorName: 'Author',
        organization: 'Organization',
        published: 'Published',
        updated: 'Last Updated',
        verified: 'Verified',
        transparency: 'Transparency',
        samplingNote: 'This poll uses stratified sampling to ensure representative results.',
        fraudNote: 'Advanced verification systems prevent duplicate or fraudulent votes.',
        moderationNote: 'All polls are moderated according to our community guidelines.',
        dataSource: 'Data source: Public Polling Institute',
        fullPolicy: 'View Full Policy →',
      },
      hr: {
        terms: 'Uvjeti Ankete',
        author: 'Autor i Objava',
        authorName: 'Autor',
        organization: 'Organizacija',
        published: 'Objavljeno',
        updated: 'Zadnje Ažuriranje',
        verified: 'Provjereno',
        transparency: 'Transparentnost',
        samplingNote: 'Ova anketa koristi stratificirano uzorkovanje za osiguranje reprezentativnih rezultata.',
        fraudNote: 'Napredni sustavi provjere sprječavaju duple ili lažne glasove.',
        moderationNote: 'Sve ankete su moderirane prema našim smjernicama zajednice.',
        dataSource: 'Izvor podataka: Javni institut za ankete',
        fullPolicy: 'Pogledaj Cijelu Politiku →',
      },
    };
    return translations[language][key] || key;
  };

  return (
    <div className="space-y-6">
      {/* Terms */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-bold">{t('terms')}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{terms}</p>
      </section>

      {/* Author & Publishing */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-bold">{t('author')}</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <div className="text-muted-foreground mb-1">{t('authorName')}</div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{author.name}</span>
              {author.verified && (
                <span className="inline-flex items-center gap-1 text-xs text-badge-stage-3">
                  <Shield className="h-3 w-3" />
                  {t('verified')}
                </span>
              )}
            </div>
          </div>
          {author.organization && (
            <div>
              <div className="text-muted-foreground mb-1">{t('organization')}</div>
              <div className="font-medium">{author.organization}</div>
            </div>
          )}
          <Separator />
          <div>
            <div className="text-muted-foreground mb-1">{t('published')}</div>
            <div className="font-medium">{publishedAt}</div>
          </div>
          {lastUpdated && (
            <div>
              <div className="text-muted-foreground mb-1">{t('updated')}</div>
              <div className="font-medium">{lastUpdated}</div>
            </div>
          )}
        </div>
      </section>

      {/* Transparency */}
      <section className="bg-card border border-border rounded-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-bold">{t('transparency')}</h3>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{t('samplingNote')}</p>
          <p>{t('fraudNote')}</p>
          <p>{t('moderationNote')}</p>
          <Separator />
          <p className="text-xs">{t('dataSource')}</p>
          <Link
            to="/terms"
            className="inline-block text-xs text-primary hover:underline"
          >
            {t('fullPolicy')}
          </Link>
        </div>
      </section>
    </div>
  );
}
