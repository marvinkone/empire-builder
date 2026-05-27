import type { GameEvent, GameState } from "./types";

export const EVENTS: GameEvent[] = [
  {
    id: "competitor",
    title: "Nouvelle concurrence",
    description: "Un nouveau maquis ouvre à 50m du tien. Que fais-tu ?",
    choices: [
      {
        label: "Baisser les prix (-100K, +clientèle)",
        apply: (s) => ({ cash: s.cash - 100_000, reputation: Math.min(100, s.reputation + 8), log: "Baisse de prix — clientèle fidélisée." }),
      },
      {
        label: "Sabotage discret (-50K, risqué)",
        apply: (s) => {
          const ok = Math.random() < 0.65;
          return ok
            ? { cash: s.cash - 50_000, log: "Sabotage réussi. Personne ne saura." }
            : { cash: s.cash - 50_000, reputation: Math.max(0, s.reputation - 20), log: "Scandale ! Ta réputation en prend un coup." };
        },
      },
    ],
  },
  {
    id: "mother",
    title: "Appel du village",
    description: "Ta mère a besoin de 80 000 FCFA pour l'hôpital.",
    choices: [
      { label: "Envoyer l'argent", apply: (s) => ({ cash: s.cash - 80_000, family: Math.min(100, s.family + 15), log: "Maman est soignée. Bénédictions reçues." }) },
      { label: "Refuser (honte)", apply: (s) => ({ family: Math.max(0, s.family - 25), reputation: Math.max(0, s.reputation - 10), log: "Tu as refusé. Le quartier en parle." }) },
    ],
  },
  {
    id: "inspector",
    title: "Inspecteur véreux",
    description: "Un inspecteur menace de fermer ton business contre 30 000 FCFA.",
    choices: [
      { label: "Payer pour être tranquille", apply: (s) => ({ cash: s.cash - 30_000, log: "Inspecteur 'satisfait'. Affaires reprennent." }) },
      {
        label: "Refuser et porter plainte",
        apply: (s) => {
          const ok = Math.random() < 0.5;
          return ok
            ? { reputation: Math.min(100, s.reputation + 12), log: "Justice rendue. Tu es respecté." }
            : { cash: s.cash - 200_000, log: "Business fermé 3 jours. Lourde perte." };
        },
      },
    ],
  },
  {
    id: "cousin_deal",
    title: "Marché public",
    description: "Un cousin haut placé propose un marché contre 500 000 FCFA de 'frais'.",
    requiresAct: 3,
    choices: [
      {
        label: "Payer (gros gain attendu)",
        apply: (s) => {
          const ok = Math.random() < 0.9;
          return ok
            ? { cash: s.cash - 500_000 + 2_500_000, network: Math.min(100, s.network + 10), log: "Marché obtenu. +2.5M FCFA." }
            : { cash: s.cash - 500_000, reputation: Math.max(0, s.reputation - 30), log: "Enquête ouverte. Mauvaise presse." };
        },
      },
      { label: "Refuser (intégrité)", apply: (s) => ({ reputation: Math.min(100, s.reputation + 5), log: "Tu gardes les mains propres." }) },
    ],
  },
  {
    id: "tontine",
    title: "Tontine du quartier",
    description: "Rejoindre la tontine ? Mise de 50K, gros lot possible.",
    choices: [
      {
        label: "Rejoindre",
        apply: (s) => {
          const win = Math.random() < 0.4;
          return win
            ? { cash: s.cash - 50_000 + 300_000, network: Math.min(100, s.network + 8), log: "Tu as gagné le tour ! +300K." }
            : { cash: s.cash - 50_000, network: Math.min(100, s.network + 5), log: "Pas ce tour-ci, mais réseau renforcé." };
        },
      },
      { label: "Ignorer", apply: () => ({ log: "Tontine ignorée." }) },
    ],
  },
  {
    id: "delestage",
    title: "Délestage généralisé",
    description: "Coupure d'électricité 3 jours dans la zone.",
    choices: [
      { label: "Acheter un groupe (-200K)", apply: (s) => ({ cash: s.cash - 200_000, log: "Groupe électrogène installé. Activité continue." }) },
      { label: "Subir", apply: (s) => ({ cash: s.cash - Math.min(s.cash, 400_000), log: "3 jours sans revenus. Lourde perte." }) },
    ],
  },
  {
    id: "employee_raise",
    title: "Augmentation demandée",
    description: "Ton gérant menace de partir sans augmentation.",
    requiresAct: 2,
    choices: [
      { label: "Accepter (+charges)", apply: (s) => ({ cash: s.cash - 80_000, log: "Gérant fidélisé." }) },
      {
        label: "Refuser",
        apply: (s) => {
          const steal = Math.random() < 0.4;
          return steal
            ? { cash: Math.max(0, s.cash - 250_000), log: "Il a volé la caisse avant de partir !" }
            : { log: "Il est parti. À toi de retrouver quelqu'un." };
        },
      },
    ],
  },
  {
    id: "marabout",
    title: "Le marabout du marché",
    description: "Un marabout promet de bénir ton business contre 100K.",
    choices: [
      {
        label: "Payer",
        apply: (s) => {
          const real = Math.random() < 0.5;
          return real
            ? { cash: s.cash - 100_000 + 400_000, log: "Miraculeux ! Affaires explosent." }
            : { cash: s.cash - 100_000, log: "Arnaque. Il a disparu." };
        },
      },
      { label: "Refuser", apply: () => ({ log: "Tu crois en ton travail, pas aux gris-gris." }) },
    ],
  },
  {
    id: "crisis",
    title: "Crise économique",
    description: "Dévaluation surprise. L'économie tousse.",
    requiresAct: 3,
    choices: [
      { label: "Tenir bon", apply: (s) => ({ cash: Math.max(0, s.cash * 0.7), log: "Crise traversée. -30% de cash." }) },
    ],
  },
];

export function pickRandomEvent(s: GameState): GameEvent | null {
  const pool = EVENTS.filter((e) => (e.requiresAct ?? 1) <= s.act);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
