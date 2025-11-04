import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { loginWithX, loginWithLinkedIn, loginWithFacebook, loginWithGoogle } from '@/lib/auth';
import { useState } from 'react';

export default function Login() {
  const [selectedLanguage] = useState<'en' | 'hr'>('en');
  const [selectedCountry] = useState('US');
  const [selectedState] = useState('FEDERAL');

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedLanguage={selectedLanguage}
        onCountryChange={() => {}}
        onStateChange={() => {}}
        onLanguageChange={() => {}}
      />
      <main className="container mx-auto px-4 py-10 max-w-md">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold">Login</h1>
          <div className="grid gap-3">
            <Button variant="default" onClick={loginWithGoogle}>
              Continue with Google
            </Button>
            <Button variant="default" onClick={loginWithX}>
              Continue with X
            </Button>
            <Button variant="secondary" onClick={loginWithLinkedIn}>
              Continue with LinkedIn
            </Button>
            <Button variant="outline" onClick={loginWithFacebook}>
              Continue with Facebook
            </Button>
          </div>
        </div>
      </main>
      <BottomNav language={selectedLanguage} />
    </div>
  );
}


