import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// 20 real-world relevant polls across all categories
const realWorldPolls = [
  // Domestic Policy
  {
    title: 'Should the federal minimum wage be increased to $15 per hour?',
    description: 'Debate over raising the federal minimum wage to address income inequality and cost of living.',
    category: 'Domestic Policy',
    country: 'US',
    state: 'FEDERAL',
    articleUrl: 'https://www.nytimes.com/article/minimum-wage-debate.html',
  },
  {
    title: 'Should the U.S. adopt universal healthcare coverage?',
    description: 'Discussion on implementing a single-payer or universal healthcare system.',
    category: 'Healthcare',
    country: 'US',
    state: 'FEDERAL',
  },
  // Immigration
  {
    title: 'Should the U.S. provide a pathway to citizenship for undocumented immigrants?',
    description: 'Policy debate on immigration reform and citizenship pathways.',
    category: 'Immigration',
    country: 'US',
    state: 'FEDERAL',
  },
  // Climate Change
  {
    title: 'Should the government mandate carbon emissions reductions by 2030?',
    description: 'Climate action and environmental regulations.',
    category: 'Climate Change',
    country: 'US',
    state: 'FEDERAL',
  },
  // Gun Control
  {
    title: 'Should there be stricter background checks for firearm purchases?',
    description: 'Gun control legislation and safety measures.',
    category: 'Gun Control',
    country: 'US',
    state: 'FEDERAL',
  },
  // Economic Policy
  {
    title: 'Should large tech companies be broken up to prevent monopolies?',
    description: 'Antitrust regulation and tech industry competition.',
    category: 'Economic Policy',
    country: 'US',
    state: 'FEDERAL',
  },
  // Education
  {
    title: 'Should student loan debt be forgiven for all borrowers?',
    description: 'Student debt crisis and higher education funding.',
    category: 'Education',
    country: 'US',
    state: 'FEDERAL',
  },
  // Criminal Justice
  {
    title: 'Should prisons focus more on rehabilitation than punishment?',
    description: 'Criminal justice reform and prison system overhaul.',
    category: 'Criminal Justice',
    country: 'US',
    state: 'FEDERAL',
  },
  // Technology & Privacy
  {
    title: 'Should social media platforms be held liable for misinformation?',
    description: 'Content moderation and platform responsibility.',
    category: 'Technology & Privacy',
    country: 'US',
    state: 'FEDERAL',
  },
  // Housing & Urban
  {
    title: 'Should the government implement rent control policies?',
    description: 'Affordable housing and rental market regulation.',
    category: 'Housing & Urban',
    country: 'US',
    state: 'FEDERAL',
  },
  // National Defense
  {
    title: 'Should defense spending be reduced and reallocated to social programs?',
    description: 'Military budget and national priorities.',
    category: 'National Defense',
    country: 'US',
    state: 'FEDERAL',
  },
  // Energy Policy
  {
    title: 'Should fracking be banned to protect the environment?',
    description: 'Energy production methods and environmental impact.',
    category: 'Energy Policy',
    country: 'US',
    state: 'FEDERAL',
  },
  // Trade & Commerce
  {
    title: 'Should tariffs be used to protect domestic manufacturing?',
    description: 'Trade policy and economic protectionism.',
    category: 'Trade & Commerce',
    country: 'US',
    state: 'FEDERAL',
  },
  // Taxation
  {
    title: 'Should billionaires pay a wealth tax on assets over $1 billion?',
    description: 'Wealth inequality and progressive taxation.',
    category: 'Taxation',
    country: 'US',
    state: 'FEDERAL',
  },
  // Labor & Employment
  {
    title: 'Should all workers be guaranteed paid family and medical leave?',
    description: 'Workplace benefits and worker protections.',
    category: 'Labor & Employment',
    country: 'US',
    state: 'FEDERAL',
  },
  // Civil Rights
  {
    title: 'Should voting rights be expanded with automatic voter registration?',
    description: 'Democracy and electoral access.',
    category: 'Civil Rights',
    country: 'US',
    state: 'FEDERAL',
  },
  // Abortion & Reproductive
  {
    title: 'Should abortion access be protected as a federal right?',
    description: 'Reproductive rights and healthcare access.',
    category: 'Abortion & Reproductive',
    country: 'US',
    state: 'FEDERAL',
  },
  // Infrastructure
  {
    title: 'Should the government invest $1 trillion in infrastructure modernization?',
    description: 'Public works and transportation investment.',
    category: 'Infrastructure',
    country: 'US',
    state: 'FEDERAL',
  },
  // Social Issues
  {
    title: 'Should same-sex marriage be protected at the federal level?',
    description: 'LGBTQ+ rights and marriage equality.',
    category: 'Social Issues',
    country: 'US',
    state: 'FEDERAL',
  },
  // Foreign Policy
  {
    title: 'Should the U.S. increase foreign aid to developing countries?',
    description: 'International relations and global development.',
    category: 'Foreign Policy',
    country: 'US',
    state: 'FEDERAL',
  },
];

async function seedPolls() {
  console.log('🌱 Seeding 20 real-world polls...');
  const batch = db.batch();
  
  for (const poll of realWorldPolls) {
    const pollRef = db.collection('polls').doc();
    const totalVotes = Math.floor(Math.random() * 5000) + 1000;
    const yesPercent = Math.floor(Math.random() * 30) + 35; // 35-65%
    const noPercent = 100 - yesPercent;
    const yesCount = Math.round((totalVotes * yesPercent) / 100);
    const noCount = totalVotes - yesCount;
    
    // Generate article URLs for all polls
    const articleUrls = [
      'https://www.nytimes.com/article/policy-debate.html',
      'https://www.washingtonpost.com/politics/analysis.html',
      'https://www.theguardian.com/us-news/commentisfree/article',
      'https://www.politico.com/news/analysis',
      'https://www.reuters.com/world/us/article',
    ];
    const articleUrl = poll.articleUrl || articleUrls[Math.floor(Math.random() * articleUrls.length)];
    
    batch.set(pollRef, {
      ...poll,
      language: 'en',
      status: 'open',
      visibility: 'public',
      createdBy: 'system',
      tags: [poll.category.toLowerCase().replace(/\s+/g, '-')],
      articleUrl: articleUrl,
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
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${realWorldPolls.length} polls\n`);
}

seedPolls().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

