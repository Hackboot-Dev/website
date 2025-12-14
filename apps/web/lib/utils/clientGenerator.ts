// /workspaces/website/apps/web/lib/utils/clientGenerator.ts
// Description: Random client generator with multi-ethnic names for realistic testing
// Last modified: 2025-12-14
// Related docs: /docs/features/ADMIN_PNL_V2.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

// ============================================
// MULTI-PROVIDER NAME DATABASE
// ============================================

// French names
const FRENCH_FIRST_NAMES = {
  male: ['Lucas', 'Hugo', 'Gabriel', 'Louis', 'Raphaël', 'Arthur', 'Nathan', 'Jules', 'Léo', 'Paul', 'Théo', 'Mathis', 'Maxime', 'Antoine', 'Pierre', 'Thomas', 'Nicolas', 'Julien', 'François', 'Jean', 'Marc', 'Philippe', 'Olivier', 'Sébastien', 'Christophe'],
  female: ['Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Manon', 'Inès', 'Camille', 'Sarah', 'Lina', 'Anna', 'Rose', 'Zoé', 'Eva', 'Charlotte', 'Clara', 'Juliette', 'Marie', 'Sophie', 'Laura', 'Julie', 'Anaïs', 'Margot', 'Lucie'],
};

const FRENCH_LAST_NAMES = [
  'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
  'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
  'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre',
  'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'Legrand', 'Gauthier', 'Perrin', 'Robin',
];

// English/American names
const ENGLISH_FIRST_NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Andrew', 'Brian', 'Kevin', 'Jason', 'Ryan'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Emily', 'Ashley', 'Kimberly', 'Megan', 'Amanda', 'Rachel', 'Hannah', 'Samantha', 'Olivia', 'Emma'],
};

const ENGLISH_LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Anderson', 'Taylor', 'Thomas', 'Jackson', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Hill', 'Moore', 'Green', 'Adams',
];

// Spanish names
const SPANISH_FIRST_NAMES = {
  male: ['Carlos', 'Miguel', 'José', 'Antonio', 'Juan', 'Francisco', 'Luis', 'Pedro', 'Alejandro', 'Diego', 'Rafael', 'Fernando', 'Manuel', 'Javier', 'Pablo'],
  female: ['María', 'Carmen', 'Ana', 'Laura', 'Isabel', 'Paula', 'Lucía', 'Elena', 'Sofía', 'Marta', 'Claudia', 'Adriana', 'Natalia', 'Teresa', 'Rosa'],
};

const SPANISH_LAST_NAMES = [
  'García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres',
  'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Gutiérrez', 'Chavez',
];

// German names
const GERMAN_FIRST_NAMES = {
  male: ['Hans', 'Klaus', 'Peter', 'Wolfgang', 'Jürgen', 'Stefan', 'Andreas', 'Thomas', 'Michael', 'Frank', 'Markus', 'Christian', 'Dieter', 'Ralf', 'Uwe'],
  female: ['Anna', 'Maria', 'Ursula', 'Monika', 'Petra', 'Sabine', 'Claudia', 'Susanne', 'Birgit', 'Heike', 'Karin', 'Ingrid', 'Renate', 'Helga', 'Gisela'],
};

const GERMAN_LAST_NAMES = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
];

// Italian names
const ITALIAN_FIRST_NAMES = {
  male: ['Marco', 'Giuseppe', 'Giovanni', 'Francesco', 'Andrea', 'Alessandro', 'Luca', 'Matteo', 'Lorenzo', 'Davide', 'Simone', 'Fabio', 'Roberto', 'Stefano', 'Paolo'],
  female: ['Maria', 'Giulia', 'Francesca', 'Sara', 'Anna', 'Laura', 'Chiara', 'Valentina', 'Alessia', 'Martina', 'Elisa', 'Federica', 'Silvia', 'Roberta', 'Elena'],
};

const ITALIAN_LAST_NAMES = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
];

// Portuguese/Brazilian names
const PORTUGUESE_FIRST_NAMES = {
  male: ['João', 'Pedro', 'Miguel', 'Rafael', 'André', 'Bruno', 'Carlos', 'Daniel', 'Eduardo', 'Fernando', 'Gabriel', 'Henrique', 'Lucas', 'Marcos', 'Paulo'],
  female: ['Ana', 'Maria', 'Beatriz', 'Camila', 'Carolina', 'Daniela', 'Fernanda', 'Gabriela', 'Juliana', 'Larissa', 'Letícia', 'Mariana', 'Patrícia', 'Rafaela', 'Vanessa'],
};

const PORTUGUESE_LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa',
];

// Arabic names
const ARABIC_FIRST_NAMES = {
  male: ['Mohammed', 'Ahmed', 'Ali', 'Omar', 'Youssef', 'Ibrahim', 'Hassan', 'Khalid', 'Karim', 'Tariq', 'Amir', 'Samir', 'Nabil', 'Rachid', 'Farid'],
  female: ['Fatima', 'Aisha', 'Mariam', 'Layla', 'Sara', 'Nour', 'Yasmin', 'Hana', 'Amira', 'Leila', 'Samira', 'Dalila', 'Khadija', 'Salma', 'Rania'],
};

const ARABIC_LAST_NAMES = [
  'Ben Ali', 'El Amrani', 'Benali', 'Kaddouri', 'Bensaid', 'Chakir', 'El Idrissi', 'Tazi', 'Alaoui', 'Berrada',
  'Mansouri', 'Fassi', 'Benjelloun', 'Benmoussa', 'El Hakim', 'Toumi', 'Daoudi', 'Chaoui', 'Lahlou', 'Bennani',
];

// Asian names
const ASIAN_FIRST_NAMES = {
  male: ['Wei', 'Hiroshi', 'Takeshi', 'Jin', 'Min-Jun', 'Tuan', 'Kenji', 'Yuki', 'Chen', 'Hiro', 'Ryu', 'Kai', 'Akira', 'Satoshi', 'Nguyen'],
  female: ['Mei', 'Yuki', 'Sakura', 'Hana', 'Lin', 'Mi-Young', 'Aiko', 'Emi', 'Yuna', 'Suki', 'Mina', 'Rei', 'Natsuki', 'Haruka', 'Linh'],
};

const ASIAN_LAST_NAMES = [
  'Wang', 'Li', 'Zhang', 'Chen', 'Liu', 'Tanaka', 'Suzuki', 'Yamamoto', 'Kim', 'Park',
  'Nguyen', 'Tran', 'Le', 'Pham', 'Sato', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Lee',
];

// Provider weights (percentage)
const PROVIDER_WEIGHTS = {
  french: 40,     // 40%
  english: 15,    // 15%
  spanish: 10,    // 10%
  german: 8,      // 8%
  italian: 8,     // 8%
  portuguese: 7,  // 7%
  arabic: 7,      // 7%
  asian: 5,       // 5%
};

type ProviderKey = keyof typeof PROVIDER_WEIGHTS;

// Email domains by region
const EMAIL_DOMAINS = {
  french: ['gmail.com', 'outlook.fr', 'yahoo.fr', 'orange.fr', 'free.fr', 'hotmail.fr', 'laposte.net', 'sfr.fr', 'protonmail.com'],
  english: ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'mail.com'],
  spanish: ['gmail.com', 'outlook.es', 'yahoo.es', 'hotmail.es', 'telefonica.net', 'protonmail.com'],
  german: ['gmail.com', 'web.de', 'gmx.de', 't-online.de', 'outlook.de', 'protonmail.com'],
  italian: ['gmail.com', 'libero.it', 'virgilio.it', 'outlook.it', 'alice.it', 'protonmail.com'],
  portuguese: ['gmail.com', 'outlook.pt', 'sapo.pt', 'hotmail.com', 'bol.com.br', 'protonmail.com'],
  arabic: ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'protonmail.com'],
  asian: ['gmail.com', 'outlook.com', 'yahoo.co.jp', 'naver.com', 'qq.com', 'protonmail.com'],
};

// Company names for business clients
const COMPANY_PREFIXES = [
  'Tech', 'Digital', 'Web', 'Cloud', 'Data', 'Cyber', 'Net', 'Soft', 'Info', 'Dev',
  'Smart', 'Fast', 'Pro', 'Next', 'New', 'Euro', 'Global', 'Expert', 'Premium', 'Prime',
  'Alpha', 'Beta', 'Omega', 'Nova', 'Quantum', 'Pixel', 'Code', 'Logic', 'Sync', 'Flow',
];

const COMPANY_SUFFIXES = [
  'Solutions', 'Services', 'Systems', 'Consulting', 'Labs', 'Studio', 'Agency', 'Group', 'Corp', 'Tech',
  'Digital', 'Innovation', 'Partners', 'France', 'Europe', 'Média', 'Design', 'IT', 'Web', 'Hub',
  'Works', 'Factory', 'Ventures', 'Network', 'Platform', 'Connect', 'Pro', 'Plus', 'Max', 'One',
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Select provider based on weights
function selectProvider(): ProviderKey {
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const [provider, weight] of Object.entries(PROVIDER_WEIGHTS)) {
    cumulative += weight;
    if (random <= cumulative) {
      return provider as ProviderKey;
    }
  }
  return 'french'; // Default fallback
}

// Get names for a provider
function getNamesForProvider(provider: ProviderKey): { firstNames: { male: string[]; female: string[] }; lastNames: string[] } {
  switch (provider) {
    case 'french':
      return { firstNames: FRENCH_FIRST_NAMES, lastNames: FRENCH_LAST_NAMES };
    case 'english':
      return { firstNames: ENGLISH_FIRST_NAMES, lastNames: ENGLISH_LAST_NAMES };
    case 'spanish':
      return { firstNames: SPANISH_FIRST_NAMES, lastNames: SPANISH_LAST_NAMES };
    case 'german':
      return { firstNames: GERMAN_FIRST_NAMES, lastNames: GERMAN_LAST_NAMES };
    case 'italian':
      return { firstNames: ITALIAN_FIRST_NAMES, lastNames: ITALIAN_LAST_NAMES };
    case 'portuguese':
      return { firstNames: PORTUGUESE_FIRST_NAMES, lastNames: PORTUGUESE_LAST_NAMES };
    case 'arabic':
      return { firstNames: ARABIC_FIRST_NAMES, lastNames: ARABIC_LAST_NAMES };
    case 'asian':
      return { firstNames: ASIAN_FIRST_NAMES, lastNames: ASIAN_LAST_NAMES };
    default:
      return { firstNames: FRENCH_FIRST_NAMES, lastNames: FRENCH_LAST_NAMES };
  }
}

// Generate phone number
function generatePhone(provider: ProviderKey): string {
  // French format by default, with some international variations
  if (provider === 'french') {
    const prefix = randomItem(['06', '07']);
    const numbers = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
    return `+33 ${prefix} ${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)}`;
  }
  // For other providers, still use French format (they're in France)
  const prefix = randomItem(['06', '07']);
  const numbers = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return `+33 ${prefix} ${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)}`;
}

// Normalize string for email
function normalizeForEmail(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Generate unique ID
function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// ============================================
// TYPES
// ============================================

export type GeneratedClientType = 'individual' | 'business';

export type GeneratedClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  country?: string;
  type: GeneratedClientType;
  isGenerated: boolean;
  generatedAt: string;
  origin?: string; // Provider origin for debugging
};

// ============================================
// GENERATORS
// ============================================

// Generate a random individual client
export function generateIndividualClient(): GeneratedClient {
  const provider = selectProvider();
  const { firstNames, lastNames } = getNamesForProvider(provider);

  const isMale = Math.random() < 0.5;
  const firstName = randomItem(isMale ? firstNames.male : firstNames.female);
  const lastName = randomItem(lastNames);
  const name = `${firstName} ${lastName}`;

  // Email variations
  const emailVariants = [
    `${normalizeForEmail(firstName)}.${normalizeForEmail(lastName)}`,
    `${normalizeForEmail(firstName)}${normalizeForEmail(lastName)}`,
    `${normalizeForEmail(firstName)}.${normalizeForEmail(lastName)}${randomBetween(1, 99)}`,
    `${normalizeForEmail(lastName)}.${normalizeForEmail(firstName)}`,
    `${normalizeForEmail(firstName)[0]}${normalizeForEmail(lastName)}`,
  ];
  const domains = EMAIL_DOMAINS[provider];
  const email = `${randomItem(emailVariants)}@${randomItem(domains)}`;

  return {
    id: generateId('cli'),
    name,
    email,
    phone: generatePhone(provider),
    type: 'individual',
    isGenerated: true,
    generatedAt: new Date().toISOString(),
    origin: provider,
  };
}

// Generate a random business client
export function generateBusinessClient(): GeneratedClient {
  const provider = selectProvider();
  const { firstNames, lastNames } = getNamesForProvider(provider);

  const companyName = `${randomItem(COMPANY_PREFIXES)} ${randomItem(COMPANY_SUFFIXES)}`;
  const isMale = Math.random() < 0.5;
  const contactFirstName = randomItem(isMale ? firstNames.male : firstNames.female);
  const contactLastName = randomItem(lastNames);
  const contactName = `${contactFirstName} ${contactLastName}`;

  const companySlug = normalizeForEmail(companyName.replace(/\s+/g, ''));
  const emailSuffixes = ['.fr', '.com', '.eu', '.io', '.co'];
  const email = `contact@${companySlug}${randomItem(emailSuffixes)}`;

  return {
    id: generateId('cli'),
    name: contactName,
    email,
    phone: generatePhone(provider),
    company: companyName,
    type: 'business',
    isGenerated: true,
    generatedAt: new Date().toISOString(),
    origin: provider,
  };
}

// Generate a random client (mix of individual and business)
export function generateRandomClient(preferType?: GeneratedClientType): GeneratedClient {
  if (preferType === 'business') {
    return generateBusinessClient();
  }
  if (preferType === 'individual') {
    return generateIndividualClient();
  }
  // 70% individual, 30% business
  return Math.random() < 0.7 ? generateIndividualClient() : generateBusinessClient();
}

// Generate multiple clients
export function generateClients(count: number, preferType?: GeneratedClientType): GeneratedClient[] {
  return Array.from({ length: count }, () => generateRandomClient(preferType));
}

// Export default for convenience
export default {
  generateIndividualClient,
  generateBusinessClient,
  generateRandomClient,
  generateClients,
};
