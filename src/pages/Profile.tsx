import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Facebook, Linkedin } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock voter data for public profiles
const mockVoters: Record<string, { name: string; verified: boolean; social: string[]; country: string }> = {
  'voter-001': { name: 'Alex Thompson', verified: true, social: ['FB', 'LI'], country: 'United States' },
  'voter-002': { name: 'Jordan Martinez', verified: true, social: ['LI'], country: 'United States' },
  'voter-003': { name: 'Casey Williams', verified: false, social: ['FB'], country: 'United States' },
  'voter-004': { name: 'Riley Anderson', verified: true, social: ['FB', 'LI'], country: 'United States' },
  'voter-005': { name: 'Taylor Brown', verified: true, social: ['LI'], country: 'United States' },
  'voter-006': { name: 'Morgan Garcia', verified: false, social: ['FB'], country: 'United States' },
  'voter-007': { name: 'Quinn Lee', verified: true, social: ['FB', 'LI'], country: 'United States' },
  'voter-008': { name: 'Sam Wilson', verified: true, social: ['LI'], country: 'United States' },
};

export default function Profile() {
  const { userId } = useParams();
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  
  const isViewingOtherProfile = !!userId;
  const voterData = userId ? mockVoters[userId] : null;

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
              {isViewingOtherProfile && voterData ? voterData.name[0] : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {isViewingOtherProfile && voterData ? voterData.name : 'Demo User'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isViewingOtherProfile && voterData ? voterData.country : 'United States'}
              </p>
              {isViewingOtherProfile && voterData && voterData.verified && (
                <Badge variant="outline" className="mt-2 bg-badge-stage-3/10 border-badge-stage-3">
                  ID Verified
                </Badge>
              )}
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
        {(!isViewingOtherProfile || (isViewingOtherProfile && voterData?.social && voterData.social.length > 0)) && (
          <div className="bg-card border border-border rounded-md p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">{t('linkedAccounts')}</h3>
            <div className="space-y-3">
              {isViewingOtherProfile && voterData ? (
                <>
                  {voterData.social.includes('FB') && (
                    <div className="flex items-center justify-between p-3 border border-border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-provider-facebook flex items-center justify-center">
                          <Facebook className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">Facebook</span>
                      </div>
                      <Badge variant="outline">Connected</Badge>
                    </div>
                  )}
                  {voterData.social.includes('LI') && (
                    <div className="flex items-center justify-between p-3 border border-border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-provider-linkedin flex items-center justify-center">
                          <Linkedin className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium">LinkedIn</span>
                      </div>
                      <Badge variant="outline">Connected</Badge>
                    </div>
                  )}
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
