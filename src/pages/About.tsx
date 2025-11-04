import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function About() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');

  const toc = [
    { id: 'mission', label: '1. Mission and Rationale' },
    { id: 'how-it-works', label: '2. How the Platform Works' },
    { id: 'transparency', label: '3. Democratic Theory and Transparency' },
    { id: 'methodology', label: '4. Methodology and Data Integrity' },
    { id: 'governance', label: '5. Governance, Ethics, and Nonpartisanship' },
    { id: 'global-scope', label: '6. Global Scope and Localization' },
    { id: 'roadmap', label: '7. Roadmap and Public Collaboration' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedLanguage={selectedLanguage}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Removed Contents sidebar */}

          <article className="col-span-12 prose prose-slate max-w-none">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">About the Public Policy Polling Institute</h1>
              <p className="text-muted-foreground text-base">
                A global, nonpartisan platform advancing transparent, evidence-based democracy through verifiable public sentiment.
              </p>
            </header>

            {/* 1. Mission and Rationale */}
            <section id="mission" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Mission and Rationale</h2>
              <p className="text-foreground/90">
                The Public Policy Polling Institute exists to make democratic governance more legible, accountable, and responsive. We synthesize
                high-frequency citizen input with methodological rigor so that elected officials, public institutions, journalists, researchers, and
                citizens can observe public sentiment in real time. Our mission is to replace intuition and partisanship with repeatable evidence:
                who supports which proposal, where, and why—under conditions that maximize transparency, privacy, and inclusivity.
              </p>
              <p className="text-foreground/90">
                In contemporary democracies, opinion is often inferred through sporadic surveys, elite cues, or media narratives. This produces
                informational asymmetries that are inimical to accountability. We address this by establishing a persistent, auditable measurement
                layer—an institutional ledger of public assent—so that public choices can be examined alongside empirical traces of consent.
              </p>
              <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                <li>[Public Value]: Convert diffuse preferences into usable evidence for legislators and the public.</li>
                <li>[Neutral Infrastructure]: Offer a durable, nonpartisan instrument rather than episodic campaigns.</li>
                <li>[Reproducibility]: Publish enough methodological detail to allow independent replication.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.oecd.org/gov/open-government/" target="_blank" rel="noreferrer" className="underline">OECD Open Government</a>
              </p>
            </section>

            {/* 2. How the Platform Works */}
            <section id="how-it-works" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. How the Platform Works</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>
                  <strong>Verified Participation:</strong> Users can vote privately or publicly. Optional verification tiers (linked accounts, ID verification)
                  increase the analytic weight of responses and enable provenance without coercing disclosure.
                </li>
                <li>
                  <strong>Methodological Weighting:</strong> We apply demographic and geographic weighting to approximate representativeness while reporting
                  raw counts and weighted estimates distinctly. Our goal is clarity rather than obfuscation.
                </li>
                <li>
                  <strong>Policy-Centric Polls:</strong> Polls are framed around concrete policy propositions, not personalities. Each item is scoped to jurisdiction
                  (local, state, national, supranational) with precise wording and change-tracking.
                </li>
                <li>
                  <strong>Continuous Publication:</strong> Results update in real time with clear uncertainty bands and sample-size thresholds; insufficient samples are
                  flagged rather than hidden.
                </li>
              </ul>
              <div className="mt-3">
                <div className="font-semibold text-foreground">[Operational Brackets]</div>
                <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                  <li>[Security]: Rate-limiting, device fingerprinting, and anomaly detection to deter fraud.</li>
                  <li>[Privacy]: Public votes are signed; private votes are aggregated with k-anonymity thresholds.</li>
                  <li>[APIs]: Versioned endpoints for raw counts, weighted estimates, and metadata.</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.federalregister.gov/" target="_blank" rel="noreferrer" className="underline">U.S. Federal Register</a> ·
                <a href="https://eur-lex.europa.eu/" target="_blank" rel="noreferrer" className="underline ml-1">EUR‑Lex</a>
              </p>
            </section>

            {/* 3. Democratic Theory and Transparency */}
            <section id="transparency" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Democratic Theory and Transparency</h2>
              <p className="text-foreground/90">
                Our design premise is straightforward: democracy is strongest when citizens can continuously observe and contest the relationship between
                policy proposals and public assent. We therefore expose the full measurement chain—question wording, sampling cadence, weighting logic,
                and historical revisions—so that independent observers can critique, reproduce, and improve our approach. Transparency is not ornamental;
                it is the principal safeguard against manipulation and inadvertent bias.
              </p>
              <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                <li>[Open Instruments]: Poll definitions, wording history, and change logs are published.</li>
                <li>[Epistemic Modesty]: We present uncertainty and limits explicitly rather than as afterthoughts.</li>
                <li>[Deliberative Use]: Results are prompts for debate—not final verdicts—within constitutional processes.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.opengovpartnership.org/" target="_blank" rel="noreferrer" className="underline">Open Government Partnership</a>
              </p>
            </section>

            {/* 4. Methodology and Data Integrity */}
            <section id="methodology" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Methodology and Data Integrity</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>
                  <strong>Sampling & Weighting:</strong> We blend platform participation with external priors (e.g., census, reputable surveys) to calibrate
                  demographic and regional representation. Weight caps prevent domination by any segment.
                </li>
                <li>
                  <strong>Fraud Prevention:</strong> Device fingerprinting, anomaly detection, geographic plausibility checks, and rate limiting reduce non-genuine
                  participation. Public votes are cryptographically signed; private votes remain unlinkable beyond coarse aggregates.
                </li>
                <li>
                  <strong>Auditability:</strong> We retain immutable poll definitions and publish versioned change logs. API endpoints provide programmatic access to
                  raw counts, weighted estimates, and metadata.
                </li>
              </ul>
              <div className="mt-3">
                <div className="font-semibold text-foreground">[Technical Brackets]</div>
                <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                  <li>[Reweighting]: Iterative proportional fitting constrained by public priors and caps.</li>
                  <li>[Outlier Control]: Robust z-score and temporal smoothing for surge detection.</li>
                  <li>[Reproducibility]: Deterministic pipelines with pinned versions and published seeds.</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.rand.org/" target="_blank" rel="noreferrer" className="underline">RAND Corporation</a> ·
                <a href="https://www.brookings.edu/" target="_blank" rel="noreferrer" className="underline ml-1">Brookings Institution</a>
              </p>
            </section>

            {/* 5. Governance, Ethics, and Nonpartisanship */}
            <section id="governance" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Governance, Ethics, and Nonpartisanship</h2>
              <p className="text-foreground/90">
                We operate as a nonpartisan, method-driven institution. Our governance model separates product stewardship from methodological oversight;
                an independent advisory council of scholars and practitioners periodically reviews instruments, weighting, and publication standards.
                Conflicts of interest are disclosed ex ante; funding relationships are published, categorized, and machine-readable.
              </p>
              <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                <li>[Nonpartisanship]: No endorsements; symmetric standards for all policy domains.</li>
                <li>[Ethics]: Minimization of data collection; privacy by design; consent as a first-class constraint.</li>
                <li>[Accountability]: External audits on methodology and security at regular intervals.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.public-standards.gov.uk/" target="_blank" rel="noreferrer" className="underline">UK Committee on Standards in Public Life</a>
              </p>
            </section>

            {/* 6. Global Scope and Localization */}
            <section id="global-scope" className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Global Scope and Localization</h2>
              <p className="text-foreground/90">
                The Institute is designed for global comparability and local specificity. Polls localize language, legal context, and policy taxonomy while
                preserving a common analytical substrate. Initial deep coverage focuses on the United States, the European Union, and Croatia, expanding
                to additional jurisdictions via standardized onboarding (policy schema, election calendar integration, media feeds, and verification norms).
              </p>
              <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                <li>[Localization]: Jurisdiction-aware categories and translations with controlled vocabularies.</li>
                <li>[Comparability]: Crosswalk tables to map local constructs to global analytics.</li>
                <li>[Elections]: Machine-readable calendars and eligibility flags for each jurisdiction.</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.osce.org/odihr/elections" target="_blank" rel="noreferrer" className="underline">OSCE/ODIHR Elections</a> ·
                <a href="https://commission.europa.eu/law/law-making-process/better-regulation-why-and-how_en" target="_blank" rel="noreferrer" className="underline ml-1">EU Better Regulation</a>
              </p>
            </section>

            {/* 7. Roadmap and Public Collaboration */}
            <section id="roadmap" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Roadmap and Public Collaboration</h2>
              <ul className="list-disc pl-6 space-y-2 text-foreground/90">
                <li>
                  <strong>Media & Open Data:</strong> Publish structured feeds for journalists and researchers with reproducible notebooks and benchmark datasets.
                </li>
                <li>
                  <strong>Participatory Design:</strong> Public RFCs for question wording, category evolution, weighting schemes, and privacy enhancements.
                </li>
                <li>
                  <strong>Verification & Privacy:</strong> Progressive verification that strengthens data integrity without coercing identity disclosure; advanced
                  privacy-preserving aggregation for sensitive cohorts.
                </li>
                <li>
                  <strong>Education:</strong> Guides that demystify polling, uncertainty, and causal inference so civic actors can use results responsibly.
                </li>
              </ul>
              <div className="mt-3">
                <div className="font-semibold text-foreground">[Collaboration Brackets]</div>
                <ul className="list-[square] pl-6 space-y-2 text-foreground/90">
                  <li>[Open Calls]: Quarterly requests for community feedback and research proposals.</li>
                  <li>[Partnerships]: Academic, media, and civic tech collaborations to extend coverage.</li>
                  <li>[Sustainability]: Transparent funding, cost accounting, and public stewardship reports.</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Reference: <a href="https://www.chathamhouse.org/research" target="_blank" rel="noreferrer" className="underline">Chatham House Research</a> ·
                <a href="https://data.europa.eu/en" target="_blank" rel="noreferrer" className="underline ml-1">EU Open Data</a>
              </p>
              <p className="text-foreground/90 mt-4">
                We invite scrutiny, collaboration, and replication. Democracy is a public technology: it improves when its core instruments—measurement,
                publication, and deliberation—are open to inspection and shared improvement.
              </p>
            </section>
          </article>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
