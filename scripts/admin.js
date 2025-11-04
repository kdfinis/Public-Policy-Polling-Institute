import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function deployRules() {
  console.log('📜 Deploying security rules...');
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rulesPath = join(__dirname, '..', 'firestore.rules');
    const rules = readFileSync(rulesPath, 'utf8');
    
    // Get access token using service account
    const credential = admin.credential.cert(serviceAccount);
    const token = await credential.getAccessToken();
    
    // Deploy via Firestore Rules API
    const projectId = serviceAccount.project_id;
    const response = await fetch(
      `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: {
            files: [{
              name: 'firestore.rules',
              content: rules,
            }],
          },
        }),
      }
    );
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Rules deployed successfully\n');
    } else {
      const error = await response.text();
      throw new Error(`Rules deployment failed: ${error}`);
    }
  } catch (err) {
    console.error(`⚠️  Could not deploy rules: ${err.message}`);
    console.error('   Deploy manually: Copy firestore.rules to Firebase Console → Firestore → Rules\n');
  }
}

async function setup() {
  await seedPolls();
  await deployRules();
  console.log('✅ Setup complete\n');
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
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();

