import admin from 'firebase-admin';

// Support both file-based and environment variable credentials
let serviceAccount;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT:', error.message);
    process.exit(1);
  }
} else {
  try {
    serviceAccount = await import('../serviceAccountKey.json', { assert: { type: 'json' } }).then(m => m.default);
  } catch (error) {
    console.error('❌ Failed to load serviceAccountKey.json. Set FIREBASE_SERVICE_ACCOUNT env var or provide serviceAccountKey.json');
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 10 polls per category across all 20 categories = 200 polls total
const pollsByCategory = {
  'Domestic Policy': [
    { title: 'Should the federal minimum wage be increased to $15 per hour?', description: 'Debate over raising the federal minimum wage to address income inequality.' },
    { title: 'Should the government implement universal basic income?', description: 'Discussion on providing a guaranteed income to all citizens.' },
    { title: 'Should voting be mandatory for all eligible citizens?', description: 'Debate on compulsory voting and democratic participation.' },
    { title: 'Should the U.S. adopt a national ID card system?', description: 'Discussion on implementing a federal identification system.' },
    { title: 'Should the government regulate social media content moderation?', description: 'Policy debate on platform oversight and free speech.' },
    { title: 'Should the U.S. abolish the electoral college?', description: 'Discussion on direct presidential elections.' },
    { title: 'Should term limits be imposed on Supreme Court justices?', description: 'Debate on judicial tenure and court reform.' },
    { title: 'Should the government provide free internet access to all citizens?', description: 'Discussion on digital infrastructure and accessibility.' },
    { title: 'Should the voting age be lowered to 16?', description: 'Debate on youth participation in democracy.' },
    { title: 'Should the government implement ranked-choice voting nationwide?', description: 'Discussion on electoral reform and voting systems.' },
  ],
  'Foreign Policy': [
    { title: 'Should the U.S. increase foreign aid to developing countries?', description: 'International relations and global development assistance.' },
    { title: 'Should the U.S. withdraw from NATO?', description: 'Debate on military alliances and international commitments.' },
    { title: 'Should the U.S. recognize Palestine as an independent state?', description: 'Middle East policy and diplomatic recognition.' },
    { title: 'Should the U.S. maintain military bases in foreign countries?', description: 'Discussion on global military presence and defense strategy.' },
    { title: 'Should the U.S. rejoin the Paris Climate Agreement?', description: 'International climate cooperation and commitments.' },
    { title: 'Should the U.S. impose sanctions on China?', description: 'Trade policy and international relations with China.' },
    { title: 'Should the U.S. provide military aid to Ukraine?', description: 'Foreign policy and support for allies.' },
    { title: 'Should the U.S. end the trade war with China?', description: 'Economic policy and international trade relations.' },
    { title: 'Should the U.S. normalize relations with Cuba?', description: 'Foreign policy and diplomatic relations.' },
    { title: 'Should the U.S. increase funding for the United Nations?', description: 'International cooperation and multilateralism.' },
  ],
  'Economic Policy': [
    { title: 'Should large tech companies be broken up to prevent monopolies?', description: 'Antitrust regulation and tech industry competition.' },
    { title: 'Should the government regulate cryptocurrency?', description: 'Financial policy and digital currency oversight.' },
    { title: 'Should the Federal Reserve be audited?', description: 'Monetary policy transparency and central bank oversight.' },
    { title: 'Should the government bail out failing banks?', description: 'Financial stability and taxpayer-funded rescues.' },
    { title: 'Should the U.S. return to the gold standard?', description: 'Monetary policy and currency backing.' },
    { title: 'Should the government implement a financial transaction tax?', description: 'Revenue generation and market regulation.' },
    { title: 'Should the U.S. end quantitative easing?', description: 'Monetary policy and economic stimulus measures.' },
    { title: 'Should the government provide subsidies to small businesses?', description: 'Economic support and entrepreneurship.' },
    { title: 'Should the U.S. impose tariffs on imported goods?', description: 'Trade policy and protectionism.' },
    { title: 'Should the government regulate stock market trading algorithms?', description: 'Financial markets and algorithmic trading oversight.' },
  ],
  'Social Issues': [
    { title: 'Should same-sex marriage be protected at the federal level?', description: 'LGBTQ+ rights and marriage equality.' },
    { title: 'Should gender-affirming healthcare be covered by insurance?', description: 'Healthcare access and transgender rights.' },
    { title: 'Should the government ban conversion therapy?', description: 'LGBTQ+ rights and therapeutic practices.' },
    { title: 'Should the U.S. legalize marijuana nationwide?', description: 'Drug policy and criminal justice reform.' },
    { title: 'Should hate speech be criminalized?', description: 'Free speech and discrimination prevention.' },
    { title: 'Should the government fund faith-based organizations?', description: 'Separation of church and state.' },
    { title: 'Should the U.S. adopt a national holiday for Juneteenth?', description: 'Cultural recognition and historical commemoration.' },
    { title: 'Should the government provide reparations for slavery?', description: 'Historical justice and economic redress.' },
    { title: 'Should the government fund universal childcare?', description: 'Family support and early childhood development.' },
    { title: 'Should the U.S. adopt a national paid family leave policy?', description: 'Workplace benefits and family support.' },
  ],
  'Environment': [
    { title: 'Should the government ban single-use plastics?', description: 'Environmental protection and waste reduction.' },
    { title: 'Should the U.S. invest in renewable energy infrastructure?', description: 'Clean energy transition and climate action.' },
    { title: 'Should the government regulate carbon emissions from vehicles?', description: 'Environmental protection and transportation policy.' },
    { title: 'Should the U.S. protect more federal lands as national parks?', description: 'Conservation and public land management.' },
    { title: 'Should the government fund ocean cleanup initiatives?', description: 'Marine conservation and pollution reduction.' },
    { title: 'Should the U.S. ban offshore drilling?', description: 'Environmental protection and energy production.' },
    { title: 'Should the government subsidize electric vehicle purchases?', description: 'Clean transportation and climate policy.' },
    { title: 'Should the U.S. implement a carbon tax?', description: 'Climate policy and emissions reduction.' },
    { title: 'Should the government regulate factory farming?', description: 'Environmental protection and animal welfare.' },
    { title: 'Should the U.S. invest in sustainable agriculture?', description: 'Food security and environmental stewardship.' },
  ],
  'Healthcare': [
    { title: 'Should the U.S. adopt universal healthcare coverage?', description: 'Healthcare access and single-payer system.' },
    { title: 'Should the government negotiate drug prices with pharmaceutical companies?', description: 'Healthcare costs and prescription drug affordability.' },
    { title: 'Should the government fund mental health services?', description: 'Healthcare access and mental wellness.' },
    { title: 'Should the U.S. allow Medicare to negotiate drug prices?', description: 'Healthcare costs and prescription drug policy.' },
    { title: 'Should the government provide free preventive healthcare?', description: 'Public health and preventive care access.' },
    { title: 'Should the U.S. allow importation of prescription drugs?', description: 'Healthcare costs and drug access.' },
    { title: 'Should the government fund research on rare diseases?', description: 'Medical research and treatment development.' },
    { title: 'Should the U.S. implement a public health insurance option?', description: 'Healthcare access and insurance reform.' },
    { title: 'Should the government regulate health insurance premiums?', description: 'Healthcare affordability and insurance oversight.' },
    { title: 'Should the U.S. provide universal dental coverage?', description: 'Healthcare access and dental care.' },
  ],
  'Education': [
    { title: 'Should student loan debt be forgiven for all borrowers?', description: 'Student debt crisis and higher education funding.' },
    { title: 'Should the government provide free college tuition?', description: 'Higher education access and affordability.' },
    { title: 'Should the U.S. increase funding for public schools?', description: 'Education funding and school quality.' },
    { title: 'Should the government fund universal pre-K programs?', description: 'Early childhood education and development.' },
    { title: 'Should the U.S. ban standardized testing in schools?', description: 'Education reform and assessment methods.' },
    { title: 'Should the government provide free school lunches to all students?', description: 'Child nutrition and food security.' },
    { title: 'Should the U.S. increase teacher salaries?', description: 'Education funding and teacher compensation.' },
    { title: 'Should the government fund STEM education programs?', description: 'Education priorities and workforce development.' },
    { title: 'Should the U.S. implement nationwide school choice programs?', description: 'Education reform and school alternatives.' },
    { title: 'Should the government regulate for-profit colleges?', description: 'Higher education oversight and student protection.' },
  ],
  'Immigration': [
    { title: 'Should the U.S. provide a pathway to citizenship for undocumented immigrants?', description: 'Immigration reform and citizenship pathways.' },
    { title: 'Should the government increase border security funding?', description: 'Border control and immigration enforcement.' },
    { title: 'Should the U.S. end family-based immigration?', description: 'Immigration policy and family reunification.' },
    { title: 'Should the government provide legal aid to immigrants?', description: 'Immigration services and legal support.' },
    { title: 'Should the U.S. implement a points-based immigration system?', description: 'Immigration policy and merit-based selection.' },
    { title: 'Should the government increase refugee resettlement?', description: 'Humanitarian policy and refugee support.' },
    { title: 'Should the U.S. end the visa lottery program?', description: 'Immigration policy and visa allocation.' },
    { title: 'Should the government provide work permits to asylum seekers?', description: 'Immigration policy and employment access.' },
    { title: 'Should the U.S. increase funding for immigration courts?', description: 'Immigration services and judicial efficiency.' },
    { title: 'Should the government end detention of immigrant families?', description: 'Immigration policy and family separation.' },
  ],
  'Criminal Justice': [
    { title: 'Should prisons focus more on rehabilitation than punishment?', description: 'Criminal justice reform and prison system overhaul.' },
    { title: 'Should the U.S. abolish the death penalty?', description: 'Criminal justice and capital punishment.' },
    { title: 'Should the government legalize all drugs?', description: 'Drug policy and criminal justice reform.' },
    { title: 'Should the U.S. end cash bail?', description: 'Criminal justice reform and pretrial detention.' },
    { title: 'Should the government fund police reform programs?', description: 'Law enforcement reform and community relations.' },
    { title: 'Should the U.S. increase funding for public defenders?', description: 'Criminal justice and legal representation.' },
    { title: 'Should the government expunge nonviolent criminal records?', description: 'Criminal justice reform and reentry support.' },
    { title: 'Should the U.S. end mandatory minimum sentences?', description: 'Criminal justice reform and sentencing policy.' },
    { title: 'Should the government fund community-based alternatives to prison?', description: 'Criminal justice reform and incarceration alternatives.' },
    { title: 'Should the U.S. increase funding for crime prevention programs?', description: 'Public safety and crime reduction.' },
  ],
  'Technology & Privacy': [
    { title: 'Should social media platforms be held liable for misinformation?', description: 'Content moderation and platform responsibility.' },
    { title: 'Should the government regulate artificial intelligence?', description: 'Technology oversight and AI governance.' },
    { title: 'Should the U.S. implement a national data privacy law?', description: 'Privacy rights and data protection.' },
    { title: 'Should the government break up big tech companies?', description: 'Antitrust regulation and tech industry competition.' },
    { title: 'Should the U.S. ban facial recognition technology?', description: 'Privacy rights and surveillance technology.' },
    { title: 'Should the government regulate cryptocurrency?', description: 'Financial technology and digital currency oversight.' },
    { title: 'Should the U.S. implement net neutrality regulations?', description: 'Internet policy and digital rights.' },
    { title: 'Should the government fund cybersecurity initiatives?', description: 'National security and digital infrastructure.' },
    { title: 'Should the U.S. regulate deepfake technology?', description: 'Technology oversight and digital manipulation.' },
    { title: 'Should the government provide free broadband internet?', description: 'Digital infrastructure and internet access.' },
  ],
  'Housing & Urban': [
    { title: 'Should the government implement rent control policies?', description: 'Affordable housing and rental market regulation.' },
    { title: 'Should the U.S. fund public housing construction?', description: 'Affordable housing and urban development.' },
    { title: 'Should the government provide housing vouchers to all low-income families?', description: 'Affordable housing and rental assistance.' },
    { title: 'Should the U.S. end homelessness through housing-first programs?', description: 'Social services and housing policy.' },
    { title: 'Should the government regulate Airbnb and short-term rentals?', description: 'Housing policy and rental market regulation.' },
    { title: 'Should the U.S. fund urban revitalization programs?', description: 'Urban development and community investment.' },
    { title: 'Should the government provide down payment assistance?', description: 'Homeownership support and housing affordability.' },
    { title: 'Should the U.S. increase funding for public transportation?', description: 'Urban infrastructure and transportation policy.' },
    { title: 'Should the government fund affordable housing development?', description: 'Housing policy and development incentives.' },
    { title: 'Should the U.S. implement inclusionary zoning policies?', description: 'Housing policy and affordable housing requirements.' },
  ],
  'National Defense': [
    { title: 'Should defense spending be reduced and reallocated to social programs?', description: 'Military budget and national priorities.' },
    { title: 'Should the U.S. increase military recruitment?', description: 'National defense and military readiness.' },
    { title: 'Should the government fund veterans\' healthcare programs?', description: 'Veterans services and healthcare access.' },
    { title: 'Should the U.S. reduce nuclear weapons stockpile?', description: 'National security and nuclear disarmament.' },
    { title: 'Should the government increase funding for military families?', description: 'Military support and family services.' },
    { title: 'Should the U.S. end military aid to foreign countries?', description: 'Foreign policy and military assistance.' },
    { title: 'Should the government fund military base modernization?', description: 'National defense and infrastructure investment.' },
    { title: 'Should the U.S. increase cybersecurity defense funding?', description: 'National security and digital defense.' },
    { title: 'Should the government provide free college to veterans?', description: 'Veterans services and education benefits.' },
    { title: 'Should the U.S. end military drone strikes?', description: 'National security and military operations.' },
  ],
  'Energy Policy': [
    { title: 'Should fracking be banned to protect the environment?', description: 'Energy production methods and environmental impact.' },
    { title: 'Should the U.S. invest in nuclear energy?', description: 'Energy policy and clean energy transition.' },
    { title: 'Should the government subsidize renewable energy?', description: 'Clean energy and climate policy.' },
    { title: 'Should the U.S. end oil and gas subsidies?', description: 'Energy policy and fossil fuel industry support.' },
    { title: 'Should the government fund battery storage technology?', description: 'Energy infrastructure and renewable energy.' },
    { title: 'Should the U.S. increase offshore wind energy development?', description: 'Clean energy and renewable energy expansion.' },
    { title: 'Should the government regulate energy grid modernization?', description: 'Energy infrastructure and smart grid technology.' },
    { title: 'Should the U.S. invest in hydrogen fuel technology?', description: 'Clean energy and alternative fuel development.' },
    { title: 'Should the government fund solar panel installation?', description: 'Renewable energy and solar power expansion.' },
    { title: 'Should the U.S. end coal mining subsidies?', description: 'Energy policy and fossil fuel industry support.' },
  ],
  'Trade & Commerce': [
    { title: 'Should tariffs be used to protect domestic manufacturing?', description: 'Trade policy and economic protectionism.' },
    { title: 'Should the U.S. renegotiate trade agreements?', description: 'Trade policy and international commerce.' },
    { title: 'Should the government regulate international trade?', description: 'Trade policy and economic oversight.' },
    { title: 'Should the U.S. increase exports to emerging markets?', description: 'Trade policy and economic expansion.' },
    { title: 'Should the government fund export promotion programs?', description: 'Trade policy and business support.' },
    { title: 'Should the U.S. end trade restrictions with Cuba?', description: 'Trade policy and international relations.' },
    { title: 'Should the government regulate e-commerce platforms?', description: 'Trade policy and digital commerce oversight.' },
    { title: 'Should the U.S. increase tariffs on Chinese goods?', description: 'Trade policy and international trade relations.' },
    { title: 'Should the government fund small business export programs?', description: 'Trade policy and entrepreneurship support.' },
    { title: 'Should the U.S. rejoin the Trans-Pacific Partnership?', description: 'Trade policy and multilateral trade agreements.' },
  ],
  'Taxation': [
    { title: 'Should billionaires pay a wealth tax on assets over $1 billion?', description: 'Wealth inequality and progressive taxation.' },
    { title: 'Should the government increase corporate tax rates?', description: 'Tax policy and revenue generation.' },
    { title: 'Should the U.S. implement a flat tax system?', description: 'Tax reform and tax system simplification.' },
    { title: 'Should the government eliminate the estate tax?', description: 'Tax policy and inheritance taxation.' },
    { title: 'Should the U.S. increase capital gains taxes?', description: 'Tax policy and investment income taxation.' },
    { title: 'Should the government implement a value-added tax?', description: 'Tax policy and consumption taxation.' },
    { title: 'Should the U.S. eliminate tax deductions?', description: 'Tax reform and tax code simplification.' },
    { title: 'Should the government increase taxes on high earners?', description: 'Tax policy and progressive taxation.' },
    { title: 'Should the U.S. implement a carbon tax?', description: 'Tax policy and environmental taxation.' },
    { title: 'Should the government eliminate sales tax?', description: 'Tax policy and consumption taxation reform.' },
  ],
  'Labor & Employment': [
    { title: 'Should all workers be guaranteed paid family and medical leave?', description: 'Workplace benefits and worker protections.' },
    { title: 'Should the government increase the minimum wage?', description: 'Labor policy and worker compensation.' },
    { title: 'Should the U.S. ban non-compete agreements?', description: 'Labor policy and worker mobility.' },
    { title: 'Should the government fund job training programs?', description: 'Workforce development and employment support.' },
    { title: 'Should the U.S. implement a federal sick leave policy?', description: 'Workplace benefits and worker protections.' },
    { title: 'Should the government regulate gig economy workers?', description: 'Labor policy and worker classification.' },
    { title: 'Should the U.S. increase funding for unemployment benefits?', description: 'Labor policy and social safety net.' },
    { title: 'Should the government fund apprenticeship programs?', description: 'Workforce development and skills training.' },
    { title: 'Should the U.S. implement a four-day work week?', description: 'Labor policy and work-life balance.' },
    { title: 'Should the government regulate remote work policies?', description: 'Labor policy and workplace flexibility.' },
  ],
  'Civil Rights': [
    { title: 'Should voting rights be expanded with automatic voter registration?', description: 'Democracy and electoral access.' },
    { title: 'Should the government protect voting rights?', description: 'Democracy and electoral integrity.' },
    { title: 'Should the U.S. end gerrymandering?', description: 'Electoral reform and redistricting.' },
    { title: 'Should the government fund civil rights organizations?', description: 'Civil rights and social justice support.' },
    { title: 'Should the U.S. implement automatic voter registration?', description: 'Electoral reform and voter access.' },
    { title: 'Should the government protect LGBTQ+ rights?', description: 'Civil rights and equality protection.' },
    { title: 'Should the U.S. end voter suppression?', description: 'Electoral reform and voting rights protection.' },
    { title: 'Should the government fund civil rights education?', description: 'Education and civil rights awareness.' },
    { title: 'Should the U.S. implement same-day voter registration?', description: 'Electoral reform and voter access.' },
    { title: 'Should the government protect religious freedom?', description: 'Civil rights and religious liberty.' },
  ],
  'Gun Control': [
    { title: 'Should there be stricter background checks for firearm purchases?', description: 'Gun control legislation and safety measures.' },
    { title: 'Should the government ban assault weapons?', description: 'Gun control and firearm regulation.' },
    { title: 'Should the U.S. implement a national gun registry?', description: 'Gun control and firearm tracking.' },
    { title: 'Should the government fund gun violence prevention programs?', description: 'Public safety and violence prevention.' },
    { title: 'Should the U.S. require gun owners to have liability insurance?', description: 'Gun control and firearm responsibility.' },
    { title: 'Should the government ban high-capacity magazines?', description: 'Gun control and firearm regulation.' },
    { title: 'Should the U.S. implement red flag laws nationwide?', description: 'Gun control and public safety.' },
    { title: 'Should the government fund gun buyback programs?', description: 'Gun control and firearm reduction.' },
    { title: 'Should the U.S. require waiting periods for gun purchases?', description: 'Gun control and firearm regulation.' },
    { title: 'Should the government fund mental health background checks?', description: 'Gun control and public safety.' },
  ],
  'Abortion & Reproductive': [
    { title: 'Should abortion access be protected as a federal right?', description: 'Reproductive rights and healthcare access.' },
    { title: 'Should the government fund abortion services?', description: 'Reproductive rights and healthcare access.' },
    { title: 'Should the U.S. protect reproductive healthcare access?', description: 'Reproductive rights and healthcare policy.' },
    { title: 'Should the government fund contraception access?', description: 'Reproductive health and family planning.' },
    { title: 'Should the U.S. protect access to emergency contraception?', description: 'Reproductive rights and healthcare access.' },
    { title: 'Should the government fund reproductive health education?', description: 'Reproductive health and education.' },
    { title: 'Should the U.S. end restrictions on abortion access?', description: 'Reproductive rights and healthcare policy.' },
    { title: 'Should the government fund fertility treatments?', description: 'Reproductive health and family planning support.' },
    { title: 'Should the U.S. protect access to reproductive healthcare?', description: 'Reproductive rights and healthcare access.' },
    { title: 'Should the government fund maternal health programs?', description: 'Reproductive health and maternal care.' },
  ],
  'Infrastructure': [
    { title: 'Should the government invest $1 trillion in infrastructure modernization?', description: 'Public works and transportation investment.' },
    { title: 'Should the U.S. fund high-speed rail projects?', description: 'Infrastructure and transportation policy.' },
    { title: 'Should the government invest in broadband infrastructure?', description: 'Digital infrastructure and internet access.' },
    { title: 'Should the U.S. fund bridge and road repairs?', description: 'Infrastructure and transportation safety.' },
    { title: 'Should the government invest in smart city technology?', description: 'Infrastructure and urban development.' },
    { title: 'Should the U.S. fund water infrastructure improvements?', description: 'Infrastructure and public utilities.' },
    { title: 'Should the government invest in airport modernization?', description: 'Infrastructure and transportation policy.' },
    { title: 'Should the U.S. fund port infrastructure development?', description: 'Infrastructure and trade facilitation.' },
    { title: 'Should the government invest in energy grid upgrades?', description: 'Infrastructure and energy policy.' },
    { title: 'Should the U.S. fund public transportation expansion?', description: 'Infrastructure and transportation policy.' },
  ],
  'Climate Change': [
    { title: 'Should the government mandate carbon emissions reductions by 2030?', description: 'Climate action and environmental regulations.' },
    { title: 'Should the U.S. rejoin the Paris Climate Agreement?', description: 'International climate cooperation and commitments.' },
    { title: 'Should the government fund climate adaptation programs?', description: 'Climate policy and resilience planning.' },
    { title: 'Should the U.S. implement a carbon pricing system?', description: 'Climate policy and emissions reduction.' },
    { title: 'Should the government fund renewable energy research?', description: 'Climate policy and clean energy innovation.' },
    { title: 'Should the U.S. increase funding for climate science?', description: 'Climate policy and scientific research.' },
    { title: 'Should the government fund climate resilience infrastructure?', description: 'Climate policy and infrastructure investment.' },
    { title: 'Should the U.S. implement nationwide climate action plans?', description: 'Climate policy and environmental protection.' },
    { title: 'Should the government fund green technology development?', description: 'Climate policy and clean technology innovation.' },
    { title: 'Should the U.S. increase funding for climate education?', description: 'Climate policy and environmental awareness.' },
  ],
};

const articleUrls = [
  'https://www.nytimes.com/article/policy-debate.html',
  'https://www.washingtonpost.com/politics/analysis.html',
  'https://www.theguardian.com/us-news/commentisfree/article',
  'https://www.politico.com/news/analysis',
  'https://www.reuters.com/world/us/article',
  'https://www.bbc.com/news/world-us-canada/article',
  'https://www.cnn.com/politics/article',
  'https://www.npr.org/politics/article',
];

async function seedAllPolls() {
  // Check if polls already exist
  const existingPolls = await db.collection('polls').limit(1).get();
  if (!existingPolls.empty) {
    console.log('⚠️  Polls already exist. Skipping seed. Use --force to overwrite.\n');
    return;
  }
  
  console.log('🌱 Seeding 200 polls (10 per category across 20 categories)...');
  const batch = db.batch();
  let totalCount = 0;
  
  for (const [category, polls] of Object.entries(pollsByCategory)) {
    for (const pollData of polls) {
      const pollRef = db.collection('polls').doc();
      const totalVotes = Math.floor(Math.random() * 5000) + 1000;
      const yesPercent = Math.floor(Math.random() * 30) + 35; // 35-65%
      const noPercent = 100 - yesPercent;
      const yesCount = Math.round((totalVotes * yesPercent) / 100);
      const noCount = totalVotes - yesCount;
      
      const articleUrl = articleUrls[Math.floor(Math.random() * articleUrls.length)];
      
      batch.set(pollRef, {
        ...pollData,
        category,
        country: 'US',
        state: 'FEDERAL',
        language: 'en',
        status: 'open',
        visibility: 'public',
        createdBy: 'system',
        tags: [category.toLowerCase().replace(/\s+/g, '-')],
        articleUrl: articleUrl,
        is_demo: true,
        demo_note: 'Demo Data - Not Real',
        stats: {
          totalVotes,
          yesPercent,
          noPercent,
          yesCount,
          noCount,
          publicVotes: Math.round(totalVotes * 0.7),
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      totalCount++;
    }
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${totalCount} polls across ${Object.keys(pollsByCategory).length} categories\n`);
}

seedAllPolls().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

