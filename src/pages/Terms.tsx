import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function Terms() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        back: 'Back',
        title: 'Terms of Service',
        lastUpdated: 'Last Updated: January 3, 2025',
      },
      hr: {
        back: 'Natrag',
        title: 'Uvjeti Pružanja Usluge',
        lastUpdated: 'Zadnje Ažurirano: 3. siječnja 2025.',
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

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-muted-foreground mb-8">{t('lastUpdated')}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-foreground leading-relaxed mb-4">
              By accessing and using the Public Polling platform, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. User Accounts and Verification</h2>
            <p className="text-foreground leading-relaxed mb-4">
              To participate in polls, you must create an account and complete our verification process.
              We implement a three-stage verification system to ensure the integrity of our polling data:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">
              <li>Stage 1: Basic account creation with email verification</li>
              <li>Stage 2: Social media account linking (Facebook and/or LinkedIn)</li>
              <li>Stage 3: Government-issued ID verification and proof of address</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Privacy and Data Usage</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Your privacy is paramount. When you vote publicly, your name and verification status will
              be visible to other users. Private votes remain anonymous but are counted in aggregate
              statistics. For detailed information about data handling, please review our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
            <p className="text-foreground leading-relaxed mb-4">
              You agree to use this platform for legitimate civic engagement purposes only. Prohibited
              activities include but are not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground">
              <li>Creating multiple accounts to manipulate poll results</li>
              <li>Sharing false or misleading information</li>
              <li>Harassing or intimidating other users</li>
              <li>Attempting to circumvent security measures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="text-foreground leading-relaxed mb-4">
              All content, trademarks, and data on this platform are the property of Public Polling or
              its licensors. Aggregate polling data may be published for research purposes with proper
              attribution.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Public Polling provides this platform "as is" without warranties of any kind. We are not
              liable for any damages arising from your use of the service, including but not limited to
              data loss, service interruptions, or unauthorized access to your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Significant changes will be
              communicated via email or platform notification. Continued use of the platform after
              changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Contact Information</h2>
            <p className="text-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us at legal@publicpolling.app
            </p>
          </section>
        </article>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
