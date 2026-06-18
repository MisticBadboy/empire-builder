export type BusinessCategory =
  | 'food_beverage'
  | 'retail'
  | 'services'
  | 'real_estate'
  | 'technology'
  | 'luxury';

export interface MilestoneBonus {
  level: number;
  multiplier: number;
  label: string;
}

export const MILESTONE_LEVELS: MilestoneBonus[] = [
  { level: 10, multiplier: 2, label: '⭐ Level 10' },
  { level: 25, multiplier: 5, label: '⭐⭐ Level 25' },
  { level: 50, multiplier: 10, label: '🌟 Level 50' },
  { level: 75, multiplier: 25, label: '💫 Level 75' },
  { level: 100, multiplier: 50, label: '👑 MAX LEVEL' },
];

export interface BusinessDef {
  id: string;
  name: string;
  description: string;
  category: BusinessCategory;
  tier: number;
  baseCost: number;
  baseIncome: number; // per second at level 1
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
    baseCost: 6_000,
    baseIncome: 18,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🚗',
  },
  {
    id: 'lawn_mowing',
    name: 'Lawn Mowing Service',
    description: 'Mow lawns, stack bills.',
    category: 'services',
    tier: 1,
    baseCost: 12_000,
    baseIncome: 40,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🌿',
  },
  {
    id: 'pizza_delivery',
    name: 'Pizza Delivery',
    description: 'Hot pies, hot cash.',
    category: 'food_beverage',
    tier: 1,
    baseCost: 25_000,
    baseIncome: 90,
    costMultiplier: 1.12,
    maxLevel: 100,
    icon: '🍕',
  },

  // ═══════════════════════════════════════════
  // TIER 2 — Small Business ($100K - $3M)
  // ═══════════════════════════════════════════
  {
    id: 'coffee_shop',
    name: 'Coffee Shop',
    description: 'Bean there, done that. Premium brews.',
    category: 'food_beverage',
    tier: 2,
    baseCost: 100_000,
    baseIncome: 600,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '☕',
  },
  {
    id: 'clothing_boutique',
    name: 'Clothing Boutique',
    description: 'Fashion forward, profit upward.',
    category: 'retail',
    tier: 2,
    baseCost: 250_000,
    baseIncome: 1_500,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '👗',
  },
  {
    id: 'auto_repair',
    name: 'Auto Repair Shop',
    description: 'Fix engines, build empires.',
    category: 'services',
    tier: 2,
    baseCost: 500_000,
    baseIncome: 3_200,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🔧',
  },
  {
    id: 'laundromat',
    name: 'Laundromat',
    description: 'Spin to win. Clean money, literally.',
    category: 'services',
    tier: 2,
    baseCost: 800_000,
    baseIncome: 5_500,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '🧺',
  },
  {
    id: 'bookstore',
    name: 'Bookstore',
    description: 'Knowledge is power. And profit.',
    category: 'retail',
    tier: 2,
    baseCost: 1_200_000,
    baseIncome: 8_000,
    costMultiplier: 1.11,
    maxLevel: 100,
    icon: '📚',
  },
  {
    id: 'pet_grooming',
    name: 'Pet Grooming',
    description: 'Fluffy clients, fat stacks.',
    category: 'services',
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
    id: 'real_estate_agency',
    name: 'Real Estate Agency',
    description: 'Location, location, leverage.',
    category: 'real_estate',
    tier: 3,
    baseCost: 40_000_000,
    baseIncome: 380_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🏠',
  },
  {
    id: 'car_dealership',
    name: 'Car Dealership',
    description: 'Move metal, make millions.',
    category: 'retail',
    tier: 3,
    baseCost: 60_000_000,
    baseIncome: 550_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🏎️',
  },
  {
    id: 'tech_startup',
    name: 'Tech Startup',
    description: 'Disrupt everything. Pivot often.',
    category: 'technology',
    tier: 3,
    baseCost: 80_000_000,
    baseIncome: 800_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '💻',
  },
  {
    id: 'nightclub',
    name: 'Nightclub',
    description: 'Bass drops, cash pops.',
    category: 'food_beverage',
    tier: 3,
    baseCost: 120_000_000,
    baseIncome: 1_200_000,
    costMultiplier: 1.10,
    maxLevel: 100,
    icon: '🪩',
  },

  // ═══════════════════════════════════════════
  // TIER 4 — Corporate ($500M - $80B)
  // ═══════════════════════════════════════════
  {
    id: 'manufacturing_plant',
    name: 'Manufacturing Plant',
    description: 'Assembly lines print money.',
    category: 'services',
    tier: 4,
    baseCost: 500_000_000,
    baseIncome: 5_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏭',
  },
  {
    id: 'software_company',
    name: 'Software Company',
    description: 'Code is the new oil.',
    category: 'technology',
    tier: 4,
    baseCost: 2_000_000_000,
    baseIncome: 22_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🖥️',
  },
  {
    id: 'hotel_chain',
    name: 'Hotel Chain',
    description: 'Keys to every city.',
    category: 'real_estate',
    tier: 4,
    baseCost: 5_000_000_000,
    baseIncome: 60_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏛️',
  },
  {
    id: 'construction_company',
    name: 'Construction Company',
    description: 'Build the world, own the world.',
    category: 'services',
    tier: 4,
    baseCost: 8_000_000_000,
    baseIncome: 100_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🏗️',
  },
  {
    id: 'shipping_fleet',
    name: 'Shipping Fleet',
    description: 'Containers full of cash.',
    category: 'services',
    tier: 4,
    baseCost: 10_000_000_000,
    baseIncome: 140_000_000,
    costMultiplier: 1.09,
    maxLevel: 100,
    icon: '🚢',
  },
  {
    id: 'shopping_mall',
    name: 'Shopping Mall',
    description: 'Retail kingdom. Every store pays rent.',
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
    id: 'airline',
    name: 'Airline',
    description: 'Fly high, earn higher.',
    category: 'services',
    tier: 5,
    baseCost: 750_000_000_000,
    baseIncome: 12_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '✈️',
  },
  {
    id: 'hedge_fund',
    name: 'Hedge Fund',
    description: 'Other people\'s money, your profits.',
    category: 'luxury',
    tier: 5,
    baseCost: 1_000_000_000_000,
    baseIncome: 18_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '📈',
  },
  {
    id: 'pharmaceutical',
    name: 'Pharmaceutical Empire',
    description: 'Cure diseases, cure poverty.',
    category: 'technology',
    tier: 5,
    baseCost: 2_000_000_000_000,
    baseIncome: 30_000_000_000,
    costMultiplier: 1.08,
    maxLevel: 100,
    icon: '💊',
  },

  // ═══════════════════════════════════════════
  // TIER 6 — Tycoon ($10T - $1Qa)
  // ═══════════════════════════════════════════
  {
    id: 'global_bank',
    name: 'Global Bank',
    description: 'The world\'s vault. Everyone deposits.',
    category: 'luxury',
    tier: 6,
    baseCost: 10_000_000_000_000,
    baseIncome: 200_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🏦',
  },
  {
    id: 'movie_studio',
    name: 'Movie Studio',
    description: 'Blockbusters are billion-dollar businesses.',
    category: 'luxury',
    tier: 6,
    baseCost: 50_000_000_000_000,
    baseIncome: 1_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🎬',
  },
  {
    id: 'defense_contractor',
    name: 'Defense Contractor',
    description: 'Protecting nations. Profiting doubly.',
    category: 'services',
    tier: 6,
    baseCost: 100_000_000_000_000,
    baseIncome: 2_500_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🛡️',
  },
  {
    id: 'space_agency',
    name: 'Space Agency',
    description: 'Mining asteroids. Infinite resources.',
    category: 'technology',
    tier: 6,
    baseCost: 500_000_000_000_000,
    baseIncome: 12_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🛸',
  },
  {
    id: 'mega_corporation',
    name: 'Mega Corporation',
    description: 'The final boss. Owns everything.',
    category: 'technology',
    tier: 6,
    baseCost: 1_000_000_000_000_000,
    baseIncome: 30_000_000_000_000,
    costMultiplier: 1.07,
    maxLevel: 100,
    icon: '🏢',
  },
];

// Helper: get all categories that exist in BUSINESS_DEFS
export function getActiveCategories(): BusinessCategory[] {
  const cats = new Set<BusinessCategory>();
  for (const b of BUSINESS_DEFS) cats.add(b.category);
  return CATEGORY_ORDER.filter((c) => cats.has(c));
}

// Helper: find a business by id
export function getBusinessDef(id: string): BusinessDef {
  const def = BUSINESS_DEFS.find((b) => b.id === id);
  if (!def) throw new Error(`Business not found: ${id}`);
  return def;
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

// Helper: get milestone multiplier for a given level
export function getMilestoneMultiplier(level: number): number {
  let mult = 1;
  for (const m of MILESTONE_LEVELS) {
    if (level >= m.level) mult = m.multiplier;
  }
  return mult;
}

// Helper: get the next milestone for a given level
export function getNextMilestone(level: number): MilestoneBonus | null {
  for (const m of MILESTONE_LEVELS) {
    if (level < m.level) return m;
  }
  return null; // already at max
}

// Helper: calculate income per second for a business at given level
// Uses exponential scaling: baseIncome * level^1.8 * milestoneMultiplier
export function getBusinessIncome(def: BusinessDef, level: number): number {
  if (level === 0) return 0;
  const base = def.baseIncome;
  const levelScale = Math.pow(level, 1.8);
  const milestoneMult = getMilestoneMultiplier(level);
  return base * levelScale * milestoneMult;
}

// Helper: get income for a specific level without milestone (for previewing next milestone)
export function getBusinessIncomeRaw(def: BusinessDef, level: number): number {
  if (level === 0) return 0;
  return def.baseIncome * Math.pow(level, 1.8);
}

// Helper: format the income jump preview
export function getIncomeJumpPreview(
  def: BusinessDef,
  currentLevel: number,
  nextLevel: number
): { current: number; next: number; percentIncrease: number } {
  const current = getBusinessIncome(def, currentLevel);
  const next = getBusinessIncome(def, nextLevel);
  const percentIncrease = current > 0 ? ((next - current) / current) * 100 : 100;
  return { current, next, percentIncrease };
}
