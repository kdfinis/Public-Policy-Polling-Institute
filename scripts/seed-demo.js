import admin from 'firebase-admin';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Real politicians/celebrities for demo with AI-style photos
const politicians = [
  { name: 'Barack', surname: 'Obama', role: 'Former President', gender: 'male' },
  { name: 'Hillary', surname: 'Clinton', role: 'Former Secretary of State', gender: 'female' },
  { name: 'Bernie', surname: 'Sanders', role: 'Senator', gender: 'male' },
  { name: 'Elizabeth', surname: 'Warren', role: 'Senator', gender: 'female' },
  { name: 'Mitch', surname: 'McConnell', role: 'Senator', gender: 'male' },
  { name: 'Nancy', surname: 'Pelosi', role: 'Former Speaker', gender: 'female' },
];

// Regular voters
const voters = [
  { name: 'Sarah', surname: 'Johnson', gender: 'female' },
  { name: 'Michael', surname: 'Chen', gender: 'male' },
  { name: 'Emma', surname: 'Davis', gender: 'female' },
  { name: 'James', surname: 'Wilson', gender: 'male' },
  { name: 'Maria', surname: 'Garcia', gender: 'female' },
  { name: 'David', surname: 'Brown', gender: 'male' },
  { name: 'Lisa', surname: 'Anderson', gender: 'female' },
  { name: 'Robert', surname: 'Taylor', gender: 'male' },
  { name: 'Jennifer', surname: 'Martinez', gender: 'female' },
  { name: 'Christopher', surname: 'Lee', gender: 'male' },
  { name: 'Amanda', surname: 'White', gender: 'female' },
  { name: 'Daniel', surname: 'Harris', gender: 'male' },
  { name: 'Jessica', surname: 'Clark', gender: 'female' },
  { name: 'Matthew', surname: 'Lewis', gender: 'male' },
  { name: 'Ashley', surname: 'Walker', gender: 'female' },
];

async function seedUsers() {
  console.log('👥 Seeding users...');
  const batch = db.batch();
  const userIds = [];
  
  // Photo generation config
  const photoStyles = ['avataaars', 'personas', 'bottts', 'identicon', 'initials'];
  const bgColors = ['6366f1', '8b5cf6', 'ec4899', 'f43f5e', 'ef4444', 'f59e0b', '10b981', '14b8a6', '06b6d4', '3b82f6'];
  
  // Add politicians with AI-style photos
  for (const pol of politicians) {
    const userRef = db.collection('users').doc();
    userIds.push(userRef.id);
    const now = admin.firestore.Timestamp.now();
    const daysAgo = Math.floor(Math.random() * 30);
    const lastVote = admin.firestore.Timestamp.fromMillis(now.toMillis() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Generate AI-style photo
    const style = photoStyles[Math.floor(Math.random() * photoStyles.length)];
    const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const photoUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${pol.name}${pol.surname}&backgroundColor=${bgColor}&size=200`;
    
    batch.set(userRef, {
      name: pol.name,
      surname: pol.surname,
      display_name: `${pol.name} ${pol.surname}`,
      is_directory_opt_in: true,
      is_politician: true,
      politician_role: pol.role,
      gender: pol.gender,
      profile_photo_url: photoUrl,
      public_vote_count_30d: Math.floor(Math.random() * 20) + 5,
      public_vote_count_all: Math.floor(Math.random() * 100) + 50,
      last_public_vote_at: lastVote,
      social_links: {
        linkedin: `linkedin.com/in/${pol.name.toLowerCase()}-${pol.surname.toLowerCase()}`,
        x: `x.com/${pol.name.toLowerCase()}${pol.surname[0]}`,
      },
      verification_level: 3,
      is_demo: true,
      demo_note: 'Demo Data - Not Real',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  // Add regular voters with AI-generated style photos
  for (const voter of voters) {
    const userRef = db.collection('users').doc();
    userIds.push(userRef.id);
    const now = admin.firestore.Timestamp.now();
    const daysAgo = Math.floor(Math.random() * 30);
    const lastVote = admin.firestore.Timestamp.fromMillis(now.toMillis() - daysAgo * 24 * 60 * 60 * 1000);
    
    // Generate AI-style photo using dicebear or ui-avatars with more realistic styling
    const style = photoStyles[Math.floor(Math.random() * photoStyles.length)];
    const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
    const photoUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${voter.name}${voter.surname}&backgroundColor=${bgColor}&size=200`;
    
    batch.set(userRef, {
      name: voter.name,
      surname: voter.surname,
      display_name: `${voter.name} ${voter.surname}`,
      is_directory_opt_in: true,
      is_politician: false,
      gender: voter.gender,
      profile_photo_url: photoUrl,
      public_vote_count_30d: Math.floor(Math.random() * 15) + 1,
      public_vote_count_all: Math.floor(Math.random() * 50) + 10,
      last_public_vote_at: lastVote,
      verification_level: Math.floor(Math.random() * 3) + 1,
      is_demo: true,
      demo_note: 'Demo Data - Not Real',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${politicians.length} politicians and ${voters.length} voters\n`);
  return userIds;
}

async function seedVotes(userIds) {
  console.log('🗳️  Seeding votes...');
  const polls = await db.collection('polls').get();
  if (polls.empty) {
    console.log('⚠️  No polls found - seed polls first\n');
    return;
  }
  
  let totalVotes = 0;
  
  for (const pollDoc of polls.docs) {
    const pollId = pollDoc.id;
    const voteBatch = db.batch();
    let pollYes = 0;
    let pollNo = 0;
    
    // Each user votes on 60-80% of polls randomly
    const usersToVote = userIds.filter(() => Math.random() > 0.3);
    
    for (const userId of usersToVote) {
      const voteRef = pollDoc.ref.collection('votes').doc(userId);
      const optionId = Math.random() > 0.5 ? 'yes' : 'no';
      const visibility = Math.random() > 0.3 ? 'public' : 'private';
      
      if (optionId === 'yes') pollYes++;
      else pollNo++;
      
      voteBatch.set(voteRef, {
        userId,
        optionId,
        visibility,
        country: 'US',
        state: Math.random() > 0.5 ? 'CA' : null,
        verifiedLevel: Math.floor(Math.random() * 3) + 1,
        createdAt: admin.firestore.Timestamp.now(),
        is_demo: true,
      });
      totalVotes++;
    }
    
    await voteBatch.commit();
    
    // Update poll stats
    const pollTotal = pollYes + pollNo;
    await pollDoc.ref.update({
      'stats.totalVotes': pollTotal,
      'stats.yesCount': pollYes,
      'stats.noCount': pollNo,
      'stats.yesPercent': pollTotal > 0 ? Math.round((pollYes / pollTotal) * 100) : 0,
      'stats.noPercent': pollTotal > 0 ? Math.round((pollNo / pollTotal) * 100) : 0,
    });
  }
  
  console.log(`✅ Seeded ${totalVotes} votes across ${polls.docs.length} polls\n`);
}

async function addDemoBanner() {
  console.log('📝 Adding demo banner note...');
  // Add a flag in a settings/doc or we'll handle this in UI
  const settingsRef = db.collection('_settings').doc('demo');
  await settingsRef.set({
    isDemo: true,
    note: 'Demo Data - This is demonstration data and not real user information',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log('✅ Demo banner flag added\n');
}

async function setup() {
  const userIds = await seedUsers();
  await seedVotes(userIds);
  await addDemoBanner();
  console.log('✅ Demo data setup complete\n');
}

setup().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

