// /workspaces/website/apps/web/lib/utils/clientGenerator.ts
// Description: Random client generator for testing and simulations
// Last modified: 2025-12-12
// Related docs: /docs/features/ADMIN_PNL_V2.md

// DÉBUT DU FICHIER COMPLET - Peut être copié/collé directement

// French first names
const FIRST_NAMES = [
  // Male
  'Lucas', 'Hugo', 'Gabriel', 'Louis', 'Raphaël', 'Arthur', 'Nathan', 'Adam', 'Jules', 'Léo',
  'Paul', 'Ethan', 'Noah', 'Liam', 'Tom', 'Théo', 'Mathis', 'Sacha', 'Maxime', 'Alexandre',
  'Antoine', 'Pierre', 'Thomas', 'Nicolas', 'Julien', 'Kevin', 'David', 'Romain', 'François', 'Jean',
  // Female
  'Emma', 'Jade', 'Louise', 'Alice', 'Chloé', 'Léa', 'Manon', 'Inès', 'Camille', 'Sarah',
  'Lina', 'Anna', 'Rose', 'Zoé', 'Eva', 'Charlotte', 'Clara', 'Juliette', 'Marie', 'Sophie',
  'Laura', 'Julie', 'Anaïs', 'Margot', 'Lucie', 'Marion', 'Pauline', 'Marine', 'Océane', 'Mélanie',
];

// French last names
const LAST_NAMES = [
  'Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent',
  'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard',
  'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent', 'Muller', 'Lefevre', 'Faure', 'Andre',
  'Mercier', 'Blanc', 'Guerin', 'Boyer', 'Garnier', 'Chevalier', 'François', 'Legrand', 'Gauthier', 'Garcia',
  'Perrin', 'Robin', 'Clement', 'Morin', 'Nicolas', 'Henry', 'Roussel', 'Mathieu', 'Gautier', 'Masson',
];

// Email domains for generated clients
const EMAIL_DOMAINS = [
  'gmail.com', 'outlook.fr', 'yahoo.fr', 'orange.fr', 'free.fr',
  'hotmail.fr', 'laposte.net', 'sfr.fr', 'wanadoo.fr', 'protonmail.com',
];

// Company names for business clients
const COMPANY_PREFIXES = [
  'Tech', 'Digital', 'Web', 'Cloud', 'Data', 'Cyber', 'Net', 'Soft', 'Info', 'Dev',
  'Smart', 'Fast', 'Pro', 'Next', 'New', 'Euro', 'Global', 'Expert', 'Premium', 'Prime',
];

const COMPANY_SUFFIXES = [
  'Solutions', 'Services', 'Systems', 'Consulting', 'Labs', 'Studio', 'Agency', 'Group', 'Corp', 'Tech',
  'Digital', 'Innovation', 'Partners', 'France', 'Europe', 'Média', 'Design', 'Développement', 'IT', 'Web',
];

// Helper: Get random item from array
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: Generate random number between min and max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: Generate random phone number (French format)
function generatePhone(): string {
  const prefix = randomItem(['06', '07']);
  const numbers = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
  return `+33 ${prefix} ${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 6)} ${numbers.slice(6, 8)}`;
}

// Helper: Normalize string for email (remove accents, lowercase)
function normalizeForEmail(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Helper: Generate unique ID
function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}${random}`;
}

// Types
export type GeneratedClientType = 'individual' | 'business';

export type GeneratedClient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: GeneratedClientType;
  isGenerated: boolean; // true = auto-generated, false = manually created
  generatedAt: string;
};

// Generate a random individual client
export function generateIndividualClient(): GeneratedClient {
  const firstName = randomItem(FIRST_NAMES);
  const lastName = randomItem(LAST_NAMES);
  const name = `${firstName} ${lastName}`;

  // Email variations
  const emailVariants = [
    `${normalizeForEmail(firstName)}.${normalizeForEmail(lastName)}`,
    `${normalizeForEmail(firstName)}${normalizeForEmail(lastName)}`,
    `${normalizeForEmail(firstName)}.${normalizeForEmail(lastName)}${randomBetween(1, 99)}`,
    `${normalizeForEmail(lastName)}.${normalizeForEmail(firstName)}`,
  ];
  const email = `${randomItem(emailVariants)}@${randomItem(EMAIL_DOMAINS)}`;

  return {
    id: generateId('cli'),
    name,
    email,
    phone: generatePhone(),
    type: 'individual',
    isGenerated: true,
    generatedAt: new Date().toISOString(),
  };
}

// Generate a random business client
export function generateBusinessClient(): GeneratedClient {
  const companyName = `${randomItem(COMPANY_PREFIXES)} ${randomItem(COMPANY_SUFFIXES)}`;
  const contactFirstName = randomItem(FIRST_NAMES);
  const contactLastName = randomItem(LAST_NAMES);
  const contactName = `${contactFirstName} ${contactLastName}`;

  const companySlug = normalizeForEmail(companyName.replace(/\s+/g, ''));
  const email = `contact@${companySlug}.fr`;

  return {
    id: generateId('cli'),
    name: contactName,
    email,
    phone: generatePhone(),
    company: companyName,
    type: 'business',
    isGenerated: true,
    generatedAt: new Date().toISOString(),
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
