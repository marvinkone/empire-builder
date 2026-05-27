export type Tier = "street" | "pme" | "corporate";

export type BusinessDef = {
  id: string;
  name: string;
  emoji: string;
  tier: Tier;
  cost: number;
  baseRevenue: number; // FCFA per day
  baseExpense: number; // FCFA per day
  unlockAct: number;
};

export type OwnedBusiness = {
  defId: string;
  level: number;
  employees: number;
};

export type LifestyleSlot = "home" | "car" | "outfit" | "phone";
export type Lifestyle = Record<LifestyleSlot, number>; // index in upgrade list

export type Background = "orphan" | "civil_son" | "diaspora";

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  choices: {
    label: string;
    apply: (s: GameState) => Partial<GameState> & { log?: string };
  }[];
  weight?: number;
  requiresAct?: number;
};

export type GameState = {
  // meta
  onboarded: boolean;
  background: Background | null;
  playerName: string;
  act: 1 | 2 | 3 | 4 | 5;
  day: number;
  lastTick: number; // ms epoch

  // money
  cash: number;
  debt: number;

  // assets
  businesses: OwnedBusiness[];
  lifestyle: Lifestyle;

  // life
  family: number;     // 0-100
  network: number;    // 0-100
  reputation: number; // 0-100
  energy: number;     // 0-100

  // log
  feed: { day: number; text: string }[];

  // ui
  pendingEvent: GameEvent | null;
  lastDailyReward: number; // day index
};
