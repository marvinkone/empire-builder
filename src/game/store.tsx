import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import type { Background, GameEvent, GameState, OwnedBusiness } from "./types";
import { BUSINESSES, LIFESTYLE_UPGRADES, netBusinessIncome } from "./businesses";
import { pickRandomEvent } from "./events";

const STORAGE_KEY = "business_elite_v1";
const DAY_DURATION_MS = 120_000; // 2 minutes real = 1 in-game day
const MAX_OFFLINE_HOURS = 8;

const ACT_THRESHOLDS = [0, 100_000, 1_000_000, 50_000_000, 1_000_000_000, Infinity];

const initialState: GameState = {
  onboarded: false,
  background: null,
  playerName: "Toi",
  act: 1,
  day: 1,
  lastTick: Date.now(),
  cash: 5_000,
  debt: 0,
  businesses: [],
  lifestyle: { home: 0, car: 0, outfit: 0, phone: 0 },
  family: 60,
  network: 20,
  reputation: 50,
  energy: 100,
  feed: [{ day: 1, text: "Bienvenue dans Business Elite. À toi de jouer." }],
  pendingEvent: null,
  lastDailyReward: 0,
};

type Action =
  | { type: "HYDRATE"; state: GameState }
  | { type: "ONBOARD"; background: Background; name: string }
  | { type: "TICK"; days: number; offline?: boolean }
  | { type: "BUY_BUSINESS"; defId: string }
  | { type: "UPGRADE_BUSINESS"; index: number }
  | { type: "HIRE"; index: number }
  | { type: "BUY_LIFESTYLE"; slot: keyof GameState["lifestyle"] }
  | { type: "TRIGGER_EVENT"; event: GameEvent }
  | { type: "RESOLVE_EVENT"; choiceIndex: number }
  | { type: "CLAIM_DAILY" }
  | { type: "REPAY_DEBT"; amount: number }
  | { type: "RESET" };

function computeAct(cash: number): GameState["act"] {
  for (let i = 5; i >= 1; i--) if (cash >= ACT_THRESHOLDS[i - 1]) return i as GameState["act"];
  return 1;
}

function dailyNet(s: GameState): { revenue: number; expense: number; net: number } {
  let revenue = 0;
  let expense = 0;
  for (const b of s.businesses) {
    const { revenue: r, expense: e } = netBusinessIncome(b.defId, b.level, b.employees);
    revenue += r;
    expense += e;
  }
  // taxes 10% on net positive
  const gross = revenue - expense;
  const tax = gross > 0 ? gross * 0.1 : 0;
  return { revenue, expense: expense + tax, net: gross - tax };
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;

    case "ONBOARD": {
      const bonuses: Record<Background, number> = { orphan: 5_000, civil_son: 25_000, diaspora: 80_000 };
      return {
        ...state,
        onboarded: true,
        background: action.background,
        playerName: action.name || "Toi",
        cash: state.cash + bonuses[action.background],
        lastTick: Date.now(),
        feed: [{ day: 1, text: `${action.name || "Toi"} commence sa montée. Bonne chance.` }],
      };
    }

    case "TICK": {
      const { net } = dailyNet(state);
      const gained = net * action.days;
      let cash = state.cash + gained;
      const debtInterest = state.debt * 0.02 * action.days;
      const debt = state.debt + debtInterest;
      const newDay = state.day + action.days;
      const feed = [...state.feed];
      if (action.offline && action.days > 0) {
        feed.unshift({ day: newDay, text: `Retour ! ${action.days}j passés, ${Math.round(gained).toLocaleString("fr-FR")} FCFA gagnés (offline).` });
      }
      return {
        ...state,
        cash,
        debt,
        day: newDay,
        lastTick: Date.now(),
        act: computeAct(cash),
        feed: feed.slice(0, 30),
      };
    }

    case "BUY_BUSINESS": {
      const def = BUSINESSES.find((b) => b.id === action.defId);
      if (!def || state.cash < def.cost) return state;
      const ob: OwnedBusiness = { defId: def.id, level: 1, employees: 0 };
      return {
        ...state,
        cash: state.cash - def.cost,
        businesses: [...state.businesses, ob],
        feed: [{ day: state.day, text: `Nouveau business : ${def.name} ${def.emoji}` }, ...state.feed].slice(0, 30),
      };
    }

    case "UPGRADE_BUSINESS": {
      const b = state.businesses[action.index];
      if (!b) return state;
      const def = BUSINESSES.find((d) => d.id === b.defId)!;
      const cost = Math.round(def.cost * 0.6 * b.level);
      if (state.cash < cost) return state;
      const next = [...state.businesses];
      next[action.index] = { ...b, level: b.level + 1 };
      return { ...state, cash: state.cash - cost, businesses: next };
    }

    case "HIRE": {
      const b = state.businesses[action.index];
      if (!b) return state;
      const cost = 50_000 * (b.employees + 1);
      if (state.cash < cost) return state;
      const next = [...state.businesses];
      next[action.index] = { ...b, employees: b.employees + 1 };
      return { ...state, cash: state.cash - cost, businesses: next };
    }

    case "BUY_LIFESTYLE": {
      const slot = action.slot;
      const current = state.lifestyle[slot];
      const upgrades = LIFESTYLE_UPGRADES[slot];
      const next = upgrades[current + 1];
      if (!next || state.cash < next.cost) return state;
      return {
        ...state,
        cash: state.cash - next.cost,
        lifestyle: { ...state.lifestyle, [slot]: current + 1 },
        network: Math.min(100, state.network + 4),
        reputation: Math.min(100, state.reputation + 3),
        feed: [{ day: state.day, text: `Lifestyle upgrade : ${next.name} ${next.emoji}` }, ...state.feed].slice(0, 30),
      };
    }

    case "TRIGGER_EVENT":
      return { ...state, pendingEvent: action.event };

    case "RESOLVE_EVENT": {
      if (!state.pendingEvent) return state;
      const choice = state.pendingEvent.choices[action.choiceIndex];
      const patch = choice.apply(state);
      const { log, ...rest } = patch;
      const merged = { ...state, ...rest, pendingEvent: null };
      if (log) merged.feed = [{ day: state.day, text: log }, ...state.feed].slice(0, 30);
      return merged;
    }

    case "CLAIM_DAILY": {
      const reward = 20_000 * state.act;
      return {
        ...state,
        cash: state.cash + reward,
        lastDailyReward: state.day,
        feed: [{ day: state.day, text: `Récompense quotidienne : +${reward.toLocaleString("fr-FR")} FCFA` }, ...state.feed].slice(0, 30),
      };
    }

    case "REPAY_DEBT": {
      const amt = Math.min(action.amount, state.cash, state.debt);
      return { ...state, cash: state.cash - amt, debt: state.debt - amt };
    }

    case "RESET":
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState, lastTick: Date.now() };

    default:
      return state;
  }
}

type Ctx = {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  dailyNet: ReturnType<typeof dailyNet>;
};

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const hydrated = useRef(false);

  // hydrate + offline
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as GameState;
        dispatch({ type: "HYDRATE", state: saved });
        if (saved.onboarded) {
          const elapsedMs = Math.min(Date.now() - saved.lastTick, MAX_OFFLINE_HOURS * 3600_000);
          const days = Math.floor(elapsedMs / DAY_DURATION_MS);
          if (days > 0) dispatch({ type: "TICK", days, offline: true });
        }
      }
    } catch {}
    hydrated.current = true;
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // live tick + random events
  useEffect(() => {
    if (!state.onboarded) return;
    const id = setInterval(() => {
      dispatch({ type: "TICK", days: 1 });
      // 18% chance per day to trigger an event, if none pending
      if (Math.random() < 0.18) {
        const ev = pickRandomEvent(state);
        if (ev) dispatch({ type: "TRIGGER_EVENT", event: ev });
      }
    }, DAY_DURATION_MS);
    return () => clearInterval(id);
  }, [state.onboarded, state.act]);

  return (
    <GameCtx.Provider value={{ state, dispatch, dailyNet: dailyNet(state) }}>{children}</GameCtx.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
