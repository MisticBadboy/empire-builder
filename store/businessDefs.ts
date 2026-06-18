export type BusinessCategory =
  | 'food_beverage'
  | 'retail'
  | 'services'
  | 'real_estate'
  | 'technology'
  | 'luxury';

export interface BusinessDef {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  tier: number;
  baseCost: number;
  baseIncome: number; // per second
  costMultiplier: number;
  maxLevel: number;
  icon: string;
}

export const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  food_beverage: '🍔 Food & Bev',
  retail: '👕 Retail',
  services: '🔧 Services',
  real_estate: '🏢 Real Estate',
  technology: '💻 Technology',
  luxury: '💎 Luxury',
};

export const CATEGORY_ORDER: BusinessCategory[] = [
  'food_beverage',
  'retail',
  'services',
  'real_estate',
  'technology',
  'luxury',
];

export const BUSINESS_DEFS: BusinessDef[] = [
  // ═══════════════════════════════════════════
  // TIER 1 — Street Hustler ($500 - $25K)
  // ═══════════════════════════════════════════
  {
    id: 'hot_dog_stand',
    name: 'Hot Dog Stand',
    description: 'Grill some dogs on the corner. Classic starter.',
    category: 'food_beverage',
    tier: 1,
    baseCost: 500,
    baseIncome: 1,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🌭',
  },
  {
    id: 'lemonade_cart',
    name: 'Lemonade Cart',
    description: 'Fresh-squeezed. Summer never ends.',
    category: 'food_beverage',
    tier: 1,
    baseCost: 1_200,
    baseIncome: 3,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🍋',
  },
  {
    id: 'newspaper_route',
    name: 'Newspaper Route',
    description: 'Early mornings, steady cash.',
    category: 'retail',
    tier: 1,
    baseCost: 3_000,
    baseIncome: 8,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '📰',
  },
  {
    id: 'car_wash',
    name: 'Car Wash',
    description: 'Suds up those rides for tips.',
    category: 'services',
    tier: 1,
    baseCost: 8_000,
    baseIncome: 20,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🧼',
  },
  {
    id: 'bike_repair',
    name: 'Bike Repair Shop',
    description: 'Fix flats, make bank.',
    category: 'services',
    tier: 1,
    baseCost: 15_000,
    baseIncome: 45,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🚲',
  },
  {
    id: 'dog_walking',
    name: 'Dog Walking Service',
    description: 'Walk good boys, earn good money.',
    category: 'services',
    tier: 1,
    baseCost: 25_000,
    baseIncome: 80,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🐕',
  },

  // ═══════════════════════════════════════════
  // TIER 2 — Small Business ($50K - $1.2M)
  // ═══════════════════════════════════════════
  {
    id: 'pizza_shop',
    name: 'Pizza Shop',
    description: 'Slice by slice, you build an empire.',
    category: 'food_beverage',
    tier: 2,
    baseCost: 50_000,
    baseIncome: 200,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🍕',
  },
  {
    id: 'clothing_store',
    name: 'Clothing Store',
    description: 'Fashion forward, cash flowing.',
    category: 'retail',
    tier: 2,
    baseCost: 120_000,
    baseIncome: 500,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '👕',
  },
  {
    id: 'barber_shop',
    name: 'Barber Shop',
    description: 'Fresh fades, fresh funds.',
    category: 'services',
    tier: 2,
    baseCost: 250_000,
    baseIncome: 1_200,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '💇',
  },
  {
    id: 'convenience_store',
    name: 'Convenience Store',
    description: 'Open 24/7. Sleep is for the rich.',
    category: 'retail',
    tier: 2,
    baseCost: 500_000,
    baseIncome: 2_800,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🏪',
  },
  {
    id: 'flower_shop',
    name: 'Flower Shop',
    description: 'Roses are red, profits are green.',
    category: 'retail',
    tier: 2,
    baseCost: 800_000,
    baseIncome: 5_000,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🌸',
  },
  {
    id: 'pet_store',
    name: 'Pet Store',
    description: 'Fur babies pay the bills.',
    category: 'retail',
    tier: 2,
    baseCost: 1_200_000,
    baseIncome: 8_000,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🐾',
  },

  // ═══════════════════════════════════════════
  // TIER 3 — Mid-Range ($5M - $120M)
  // ═══════════════════════════════════════════
  {
    id: 'boutique_hotel',
    name: 'Boutique Hotel',
    description: 'Luxury stays, premium pay.',
    category: 'real_estate',
    tier: 3,
    baseCost: 5_000_000,
    baseIncome: 40_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🏨',
  },
  {
    id: 'gym_spa',
    name: 'Gym & Spa',
    description: 'Health is wealth. Literally.',
    category: 'services',
    tier: 3,
    baseCost: 10_000_000,
    baseIncome: 85_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🏋️',
  },
  {
    id: 'sushi_restaurant',
    name: 'Sushi Restaurant',
    description: 'Omakase prices, omakase profits.',
    category: 'food_beverage',
    tier: 3,
    baseCost: 20_000_000,
    baseIncome: 180_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🍣',
  },
  {
    id: 'construction_firm',
    name: 'Construction Firm',
    description: 'Building the future, one brick at a time.',
    category: 'services',
    tier: 3,
    baseCost: 40_000_000,
    baseIncome: 380_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🏗️',
  },
  {
    id: 'car_dealership',
    name: 'Car Dealership',
    description: 'Move metal, move money.',
    category: 'retail',
    tier: 3,
    baseCost: 75_000_000,
    baseIncome: 750_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🚗',
  },
  {
    id: 'event_center',
    name: 'Event Center',
    description: 'Concerts, conferences, cash.',
    category: 'real_estate',
    tier: 3,
    baseCost: 120_000_000,
    baseIncome: 1_200_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🎭',
  },

  // ═══════════════════════════════════════════
  // TIER 4 — Corporate ($500M - $15B)
  // ═══════════════════════════════════════════
  {
    id: 'office_tower',
    name: 'Office Tower',
    description: 'Sky-high rents, sky-high returns.',
    category: 'real_estate',
    tier: 4,
    baseCost: 500_000_000,
    baseIncome: 5_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏢',
  },
  {
    id: 'private_airport',
    name: 'Private Airport',
    description: 'Jet set, money set.',
    category: 'luxury',
    tier: 4,
    baseCost: 1_000_000_000,
    baseIncome: 10_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '✈️',
  },
  {
    id: 'medical_center',
    name: 'Medical Center',
    description: 'Healthcare pays. Always.',
    category: 'services',
    tier: 4,
    baseCost: 2_000_000_000,
    baseIncome: 22_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏥',
  },
  {
    id: 'factory_complex',
    name: 'Factory Complex',
    description: 'Industrial might, industrial money.',
    category: 'retail',
    tier: 4,
    baseCost: 4_000_000_000,
    baseIncome: 45_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏭',
  },
  {
    id: 'telecom_network',
    name: 'Telecom Network',
    description: 'Connect the world, collect the bills.',
    category: 'technology',
    tier: 4,
    baseCost: 8_000_000_000,
    baseIncome: 95_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '📡',
  },
  {
    id: 'shopping_mall',
    name: 'Shopping Mall',
    description: 'Every store pays you rent.',
    category: 'real_estate',
    tier: 4,
    baseCost: 15_000_000_000,
    baseIncome: 200_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🛍️',
  },

  // ═══════════════════════════════════════════
  // TIER 5 — Mogul ($100B - $5T)
  // ═══════════════════════════════════════════
  {
    id: 'skyscraper',
    name: 'Skyscraper',
    description: 'Touch the sky, touch the profits.',
    category: 'real_estate',
    tier: 5,
    baseCost: 100_000_000_000,
    baseIncome: 1_500_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '🏙️',
  },
  {
    id: 'space_startup',
    name: 'Space Startup',
    description: 'To the moon. Literally.',
    category: 'technology',
    tier: 5,
    baseCost: 250_000_000_000,
    baseIncome: 3_800_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '🚀',
  },
  {
    id: 'private_island',
    name: 'Private Island',
    description: 'Paradise is profitable.',
    category: 'luxury',
    tier: 5,
    baseCost: 500_000_000_000,
    baseIncome: 8_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '🏝️',
  },
  {
    id: 'power_grid',
    name: 'Power Grid',
    description: 'Energy is the ultimate currency.',
    category: 'services',
    tier: 5,
    baseCost: 1_000_000_000_000,
    baseIncome: 18_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '⚡',
  },
  {
    id: 'movie_studio',
    name: 'Movie Studio',
    description: 'Lights, camera, revenue.',
    category: 'luxury',
    tier: 5,
    baseCost: 2_000_000_000_000,
    baseIncome: 40_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '🎬',
  },
  {
    id: 'sports_empire',
    name: 'Sports Empire',
    description: 'Own every team. Win every check.',
    category: 'luxury',
    tier: 5,
    baseCost: 5_000_000_000_000,
    baseIncome: 90_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '🏟️',
  },

  // ═══════════════════════════════════════════
  // TIER 6 — Tycoon ($50T - $5Q)
  // ═══════════════════════════════════════════
  {
    id: 'global_internet',
    name: 'Global Internet',
    description: 'The entire internet. Your internet.',
    category: 'technology',
    tier: 6,
    baseCost: 50_000_000_000_000,
    baseIncome: 500_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🌐',
  },
  {
    id: 'investment_bank',
    name: 'Investment Bank',
    description: 'Money making money making money.',
    category: 'luxury',
    tier: 6,
    baseCost: 100_000_000_000_000,
    baseIncome: 1_200_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🏦',
  },
  {
    id: 'diamond_mine',
    name: 'Diamond Mine',
    description: 'Sparkle and shine, all mine.',
    category: 'luxury',
    tier: 6,
    baseCost: 250_000_000_000_000,
    baseIncome: 3_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '💎',
  },
  {
    id: 'luxury_resort',
    name: 'Luxury Resort',
    description: 'Five stars, five commas.',
    category: 'real_estate',
    tier: 6,
    baseCost: 500_000_000_000_000,
    baseIncome: 7_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🏰',
  },
  {
    id: 'orbital_station',
    name: 'Orbital Station',
    description: 'Business in space. The final frontier.',
    category: 'technology',
    tier: 6,
    baseCost: 1_000_000_000_000_000,
    baseIncome: 20_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🛸',
  },
  {
    id: 'planetary_corp',
    name: 'Planetary Corporation',
    description: 'One planet wasn\'t enough.',
    category: 'technology',
    tier: 6,
    baseCost: 5_000_000_000_000_000,
    baseIncome: 60_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🌍',
  },
];

// Helper: get business def by id
export function getBusinessDef(id: string): BusinessDef {
  return BUSINESS_DEFS.find((b) => b.id === id)!;
}

// Helper: get businesses by tier
export function getBusinessesByTier(tier: number): BusinessDef[] {
  return BUSINESS_DEFS.filter((b) => b.tier === tier);
}

// Helper: calculate upgrade cost for a business at given level
export function getUpgradeCost(def: BusinessDef, level: number): number {
  if (level === 0) return def.baseCost;
  return Math.floor(def.baseCost * Math.pow(def.costMultiplier, level));
}

// Helper: calculate income per second for a business at given level
export function getBusinessIncome(def: BusinessDef, level: number): number {
  if (level === 0) return 0;
  return def.baseIncome * (1 + level * 0.1);
}
