import { COLORS } from './theme';

export interface TierDef {
  id: number;
  name: string;
  unlockNetWorth: number;
  color: string;
  description: string;
}

export const TIERS: TierDef[] = [
  {
    id: 1,
    name: 'Street Hustler',
    unlockNetWorth: 0,
    color: COLORS.tier1,
    description: 'Everyone starts somewhere. Make your first bucks!',
  },
  {
    id: 2,
    name: 'Small Business',
    unlockNetWorth: 10_000,
    color: COLORS.tier2,
    description: 'Real businesses, real money. Time to level up.',
  },
  {
    id: 3,
    name: 'Mid-Range',
    unlockNetWorth: 100_000,
    color: COLORS.tier3,
    description: 'Big leagues. Your empire is taking shape.',
  },
  {
    id: 4,
    name: 'Corporate',
    unlockNetWorth: 1_000_000,
    color: COLORS.tier4,
    description: 'Corporate titan. Board rooms and bottom lines.',
  },
  {
    id: 5,
    name: 'Mogul',
    unlockNetWorth: 50_000_000,
    color: COLORS.tier5,
    description: 'Untouchable. Your name is the brand.',
  },
  {
    id: 6,
    name: 'Tycoon',
    unlockNetWorth: 500_000_000,
    color: COLORS.tier6,
    description: 'Apex predator. The world is your棋盘.',
  },
];
