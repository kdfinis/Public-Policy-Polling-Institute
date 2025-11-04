// Seed script to add test polls to Firestore
// Run with: node scripts/seed-polls.js
// Requires: npm install firebase-admin

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const testPolls = [
  {
    title: 'Should the government increase funding for public infrastructure?',
    description: 'This poll aims to gauge public support for increased federal investment in roads, bridges, public transit, and other critical infrastructure.',
    category: 'Domestic Policy',
    country: 'US',
    state: 'FEDERAL',
    language: 'en',
    status: 'open',
    visibility: 'public',
    createdBy: 'system',
    tags: ['infrastructure', 'budget', 'transportation'],
    stats: {
      totalVotes: 0,
      yesCount: 0,
      noCount: 0,
      yesPercent: 0,
      noPercent: 0,
      publicVotes: 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Should the country commit to net-zero emissions by 2040?',
    description: 'Assessing support for aggressive climate action and carbon neutrality goals.',
    category: 'Environment',
    country: 'EU',
    state: null,
    language: 'en',
    status: 'open',
    visibility: 'public',
    createdBy: 'system',
    tags: ['climate', 'environment', 'emissions'],
    stats: {
      totalVotes: 0,
      yesCount: 0,
      noCount: 0,
      yesPercent: 0,
      noPercent: 0,
      publicVotes: 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Do you support strengthening international trade agreements?',
    description: 'Public opinion on expanding trade partnerships and economic cooperation.',
    category: 'Foreign Policy',
    country: 'US',
    state: 'FEDERAL',
    language: 'en',
    status: 'open',
    visibility: 'public',
    createdBy: 'system',
    tags: ['trade', 'foreign policy', 'economics'],
    stats: {
      totalVotes: 0,
      yesCount: 0,
      noCount: 0,
      yesPercent: 0,
      noPercent: 0,
      publicVotes: 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Should corporate tax rates be increased?',
    description: 'Measuring support for higher corporate taxation to fund social programs.',
    category: 'Economic Policy',
    country: 'US',
    state: 'FEDERAL',
    language: 'en',
    status: 'open',
    visibility: 'public',
    createdBy: 'system',
    tags: ['taxes', 'corporate', 'economy'],
    stats: {
      totalVotes: 0,
      yesCount: 0,
      noCount: 0,
      yesPercent: 0,
      noPercent: 0,
      publicVotes: 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    title: 'Should renewable energy subsidies be increased?',
    description: 'Opinion on government support for clean energy transition.',
    category: 'Environment',
    country: 'US',
    state: 'FEDERAL',
    language: 'en',
    status: 'open',
    visibility: 'public',
    createdBy: 'system',
    tags: ['renewable energy', 'subsidies', 'environment'],
    stats: {
      totalVotes: 0,
      yesCount: 0,
      noCount: 0,
      yesPercent: 0,
      noPercent: 0,
      publicVotes: 0,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedPolls() {
  console.log('Seeding polls...');
  const batch = db.batch();
  
  for (const poll of testPolls) {
    const pollRef = db.collection('polls').doc();
    batch.set(pollRef, poll);
    console.log(`Added poll: ${poll.title.substring(0, 50)}...`);
  }
  
  await batch.commit();
  console.log('✅ All polls seeded successfully!');
  process.exit(0);
}

seedPolls().catch((error) => {
  console.error('Error seeding polls:', error);
  process.exit(1);
});

