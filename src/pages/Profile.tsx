import { useState } from 'react';
import { Shield, Facebook, Linkedin } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        profile: 'Profile',
        verification: 'Verification Status',
        stage1: 'Stage 1: Basic Account',
        stage1desc: 'Account created',
        stage2: 'Stage 2: Linked Accounts',
        stage2desc: 'Social media verified',
        stage3: 'Stage 3: Government ID',
        stage3desc: 'Not yet completed',
        linkedAccounts: 'Linked Accounts',
        connect: 'Connect',
        disconnect: 'Disconnect',
        settings: 'Settings',
        myActivity: 'My Activity',
      },
      hr: {
        profile: 'Profil',
        verification: 'Status Provjere',
        stage1: 'Faza 1: Osnovni Račun',
        stage1desc: 'Račun stvoren',
        stage2: 'Faza 2: Povezani Računi',
        stage2desc: 'Društveni mediji provjereni',
        stage3: 'Faza 3: Državna Iskaznica',
        stage3desc: 'Još nije završeno',
        linkedAccounts: 'Povezani Računi',
        connect: 'Poveži',
        disconnect: 'Odspoji',
        settings: 'Postavke',
        myActivity: 'Moja Aktivnost',
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
        <h1 className="text-2xl font-bold mb-6">{t('profile')}</h1>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-md p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold">Demo User</h2>
              <p className="text-sm text-muted-foreground">United States</p>
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-card border border-border rounded-md p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{t('verification')}</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-badge-stage-1 flex items-center justify-center text-white font-bold text-sm shrink-0">
                1
              </div>
              <div className="flex-1">
                <div className="font-medium">{t('stage1')}</div>
                <div className="text-sm text-muted-foreground">{t('stage1desc')}</div>
              </div>
              <Shield className="h-5 w-5 text-badge-stage-1" />
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-badge-stage-2 flex items-center justify-center text-white font-bold text-sm shrink-0">
                2
              </div>
              <div className="flex-1">
                <div className="font-medium">{t('stage2')}</div>
                <div className="text-sm text-muted-foreground">{t('stage2desc')}</div>
              </div>
              <Shield className="h-5 w-5 text-badge-stage-2" />
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm shrink-0">
                3
              </div>
              <div className="flex-1">
                <div className="font-medium text-muted-foreground">{t('stage3')}</div>
                <div className="text-sm text-muted-foreground">{t('stage3desc')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="bg-card border border-border rounded-md p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{t('linkedAccounts')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-provider-facebook flex items-center justify-center">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Facebook</span>
              </div>
              <Button variant="outline" size="sm">
                {t('disconnect')}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-provider-linkedin flex items-center justify-center">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">LinkedIn</span>
              </div>
              <Button variant="outline" size="sm">
                {t('disconnect')}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
