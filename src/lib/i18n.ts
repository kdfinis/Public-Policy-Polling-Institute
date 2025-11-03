// Internationalization utilities and translations

export type Language = 'en' | 'hr';

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.browse': 'Browse',
    'nav.search': 'Search',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    
    // Selectors
    'selector.country': 'Country',
    'selector.state': 'State/Region',
    'selector.language': 'Language',
    'selector.federal': 'Federal (All States)',
    
    // Poll
    'poll.vote.yes': 'Yes',
    'poll.vote.no': 'No',
    'poll.vote.public': 'Public',
    'poll.vote.private': 'Private',
    'poll.vote.consent': 'Your vote will be publicly visible with your name and verification status.',
    'poll.vote.submit': 'Submit Vote',
    'poll.vote.change': 'Change Vote',
    'poll.participants': 'participants',
    'poll.open': 'Open',
    'poll.closed': 'Closed',
    'poll.minSample': 'Minimum sample size not yet reached',
    
    // Categories
    'category.domestic': 'Domestic Policy',
    'category.foreign': 'Foreign Policy',
    'category.economic': 'Economic Policy',
    'category.social': 'Social Issues',
    'category.environment': 'Environment',
    'category.healthcare': 'Healthcare',
    'category.education': 'Education',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signInWith': 'Sign in with',
    'auth.facebook': 'Facebook',
    'auth.linkedin': 'LinkedIn',
    'auth.welcome': 'Welcome to Public Polling',
    'auth.tagline': 'Verified public opinion on the issues that matter',
    
    // Onboarding
    'onboard.name': 'Display Name',
    'onboard.dob': 'Date of Birth',
    'onboard.dobHelp': 'We ask for your age to ensure polling accuracy and demographic representation.',
    'onboard.verification': 'Verification Progress',
    'onboard.stage1': 'Stage 1: Basic Account',
    'onboard.stage2': 'Stage 2: Linked Accounts',
    'onboard.stage3': 'Stage 3: Government ID',
    'onboard.continue': 'Continue',
    
    // Profile
    'profile.verification': 'Verification Status',
    'profile.linkedAccounts': 'Linked Accounts',
    'profile.settings': 'Settings',
    'profile.myActivity': 'My Activity',
    'profile.defaultVisibility': 'Default Vote Visibility',
    'profile.connect': 'Connect',
    'profile.disconnect': 'Disconnect',
    'profile.verified': 'ID Verified',
    
    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.createPoll': 'Create Poll',
    'admin.suspicious': 'Suspicious Activity',
    'admin.activePolls': 'Active Polls',
    'admin.totalVotes': 'Total Votes Today',
    'admin.publicVotes': 'Public Votes',
    'admin.flags': 'Flagged Activities',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error loading data',
    'common.empty': 'No results found',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.apply': 'Apply',
    'common.clear': 'Clear',
  },
  hr: {
    // Navigation
    'nav.home': 'Naslovnica',
    'nav.browse': 'Pretraži',
    'nav.search': 'Traži',
    'nav.notifications': 'Obavijesti',
    'nav.profile': 'Profil',
    'nav.admin': 'Admin',
    
    // Selectors
    'selector.country': 'Država',
    'selector.state': 'Država/Regija',
    'selector.language': 'Jezik',
    'selector.federal': 'Savezna (Sve Države)',
    
    // Poll
    'poll.vote.yes': 'Da',
    'poll.vote.no': 'Ne',
    'poll.vote.public': 'Javno',
    'poll.vote.private': 'Privatno',
    'poll.vote.consent': 'Vaš glas bit će javno vidljiv s vašim imenom i statusom provjere.',
    'poll.vote.submit': 'Pošalji Glas',
    'poll.vote.change': 'Promijeni Glas',
    'poll.participants': 'sudionika',
    'poll.open': 'Otvoreno',
    'poll.closed': 'Zatvoreno',
    'poll.minSample': 'Minimalni uzorak još nije dosegnut',
    
    // Categories
    'category.domestic': 'Domaća Politika',
    'category.foreign': 'Vanjska Politika',
    'category.economic': 'Ekonomska Politika',
    'category.social': 'Društvena Pitanja',
    'category.environment': 'Okoliš',
    'category.healthcare': 'Zdravstvo',
    'category.education': 'Obrazovanje',
    
    // Auth
    'auth.signIn': 'Prijava',
    'auth.signInWith': 'Prijavi se s',
    'auth.facebook': 'Facebook',
    'auth.linkedin': 'LinkedIn',
    'auth.welcome': 'Dobrodošli u Javno Glasovanje',
    'auth.tagline': 'Provjereno javno mnjenje o pitanjima koja su važna',
    
    // Onboarding
    'onboard.name': 'Prikazano Ime',
    'onboard.dob': 'Datum Rođenja',
    'onboard.dobHelp': 'Pitamo za vašu dob kako bismo osigurali točnost glasovanja i demografsku zastupljenost.',
    'onboard.verification': 'Napredak Provjere',
    'onboard.stage1': 'Faza 1: Osnovni Račun',
    'onboard.stage2': 'Faza 2: Povezani Računi',
    'onboard.stage3': 'Faza 3: Državna Iskaznica',
    'onboard.continue': 'Nastavi',
    
    // Profile
    'profile.verification': 'Status Provjere',
    'profile.linkedAccounts': 'Povezani Računi',
    'profile.settings': 'Postavke',
    'profile.myActivity': 'Moja Aktivnost',
    'profile.defaultVisibility': 'Zadana Vidljivost Glasa',
    'profile.connect': 'Poveži',
    'profile.disconnect': 'Odspoji',
    'profile.verified': 'ID Provjeren',
    
    // Admin
    'admin.dashboard': 'Nadzorna Ploča',
    'admin.createPoll': 'Stvori Anketu',
    'admin.suspicious': 'Sumnjiva Aktivnost',
    'admin.activePolls': 'Aktivne Ankete',
    'admin.totalVotes': 'Ukupno Glasova Danas',
    'admin.publicVotes': 'Javni Glasovi',
    'admin.flags': 'Označene Aktivnosti',
    
    // Common
    'common.loading': 'Učitavanje...',
    'common.error': 'Greška pri učitavanju',
    'common.empty': 'Nema rezultata',
    'common.save': 'Spremi',
    'common.cancel': 'Odustani',
    'common.filter': 'Filtriraj',
    'common.sort': 'Sortiraj',
    'common.apply': 'Primijeni',
    'common.clear': 'Očisti',
  },
} as const;

export function useTranslation(lang: Language = 'en') {
  return {
    t: (key: keyof typeof translations.en) => translations[lang][key] || key,
    lang,
  };
}
