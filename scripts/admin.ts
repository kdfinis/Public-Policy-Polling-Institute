#!/usr/bin/env node
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found! Download from Firebase Console → Project Settings → Service Accounts');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
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
    stats: { totalVotes: 0, yesCount: 0, noCount: 0, yesPercent: 0, noPercent: 0, publicVotes: 0 },
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
    stats: { totalVotes: 0, yesCount: 0, noCount: 0, yesPercent: 0, noPercent: 0, publicVotes: 0 },
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
    stats: { totalVotes: 0, yesCount: 0, noCount: 0, yesPercent: 0, noPercent: 0, publicVotes: 0 },
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
    stats: { totalVotes: 0, yesCount: 0, noCount: 0, yesPercent: 0, noPercent: 0, publicVotes: 0 },
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
    stats: { totalVotes: 0, yesCount: 0, noCount: 0, yesPercent: 0, noPercent: 0, publicVotes: 0 },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seedPolls() {
  console.log('🌱 Seeding polls...');
  const batch = db.batch();
  testPolls.forEach(poll => {
    batch.set(db.collection('polls').doc(), poll);
  });
  await batch.commit();
  console.log(`✅ Seeded ${testPolls.length} polls\n`);
}

async function clearPolls() {
  console.log('🗑️  Clearing polls...');
  const polls = await db.collection('polls').get();
  const batch = db.batch();
  polls.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log(`✅ Deleted ${polls.docs.length} polls\n`);
}

async function clearVotes() {
  console.log('🗑️  Clearing votes...');
  const polls = await db.collection('polls').get();
  let total = 0;
  for (const pollDoc of polls.docs) {
    const votes = await pollDoc.ref.collection('votes').get();
    const batch = db.batch();
    votes.docs.forEach(v => { batch.delete(v.ref); total++; });
    await batch.commit();
  }
  console.log(`✅ Deleted ${total} votes\n`);
}

async function setup() {
  await seedPolls();
  console.log('✅ Setup complete - add security rules manually in Firebase Console\n');
}

const cmd = process.argv[2];
(async () => {
  try {
    if (cmd === 'seed:polls') await seedPolls();
    else if (cmd === 'clear:polls') await clearPolls();
    else if (cmd === 'clear:votes') await clearVotes();
    else if (cmd === 'setup') await setup();
    else {
      console.log('Usage: npm run admin <command>\nCommands: seed:polls, clear:polls, clear:votes, setup');
      process.exit(1);
    }
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();

