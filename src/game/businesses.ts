import type { BusinessDef, Lifestyle } from "./types";

export const BUSINESSES: BusinessDef[] = [
  // STREET
  { id: "water", name: "Vente d'eau en sachet", emoji: "💧", tier: "street", cost: 5_000, baseRevenue: 3_500, baseExpense: 1_000, unlockAct: 1 },
  { id: "shoeshine", name: "Cireur de chaussures", emoji: "👞", tier: "street", cost: 15_000, baseRevenue: 6_000, baseExpense: 1_500, unlockAct: 1 },
  { id: "callbox", name: "Call-box / crédit", emoji: "📞", tier: "street", cost: 35_000, baseRevenue: 12_000, baseExpense: 3_000, unlockAct: 1 },
  { id: "beignets", name: "Vente de beignets", emoji: "🥐", tier: "street", cost: 60_000, baseRevenue: 22_000, baseExpense: 7_000, unlockAct: 1 },
  { id: "jakarta", name: "Taxi-moto Jakarta", emoji: "🛵", tier: "street", cost: 250_000, baseRevenue: 80_000, baseExpense: 25_000, unlockAct: 1 },

  // PME
  { id: "maquis", name: "Maquis / bar", emoji: "🍢", tier: "pme", cost: 800_000, baseRevenue: 220_000, baseExpense: 90_000, unlockAct: 2 },
  { id: "boutique", name: "Boutique de quartier", emoji: "🏪", tier: "pme", cost: 1_500_000, baseRevenue: 380_000, baseExpense: 140_000, unlockAct: 2 },
  { id: "salon", name: "Salon de coiffure", emoji: "💇", tier: "pme", cost: 2_500_000, baseRevenue: 600_000, baseExpense: 220_000, unlockAct: 2 },
  { id: "momo", name: "Agent Mobile Money", emoji: "📱", tier: "pme", cost: 4_000_000, baseRevenue: 1_100_000, baseExpense: 350_000, unlockAct: 2 },
  { id: "gbaka", name: "Transport (gbaka)", emoji: "🚐", tier: "pme", cost: 8_000_000, baseRevenue: 2_200_000, baseExpense: 800_000, unlockAct: 3 },
  { id: "cyber", name: "Cybercafé", emoji: "💻", tier: "pme", cost: 12_000_000, baseRevenue: 3_500_000, baseExpense: 1_300_000, unlockAct: 3 },

  // CORPORATE
  { id: "import", name: "Import-export Dubaï", emoji: "🚢", tier: "corporate", cost: 50_000_000, baseRevenue: 18_000_000, baseExpense: 7_000_000, unlockAct: 3 },
  { id: "immo", name: "Promotion immobilière", emoji: "🏗️", tier: "corporate", cost: 150_000_000, baseRevenue: 55_000_000, baseExpense: 22_000_000, unlockAct: 4 },
  { id: "hotel", name: "Hôtel 4 étoiles", emoji: "🏨", tier: "corporate", cost: 400_000_000, baseRevenue: 160_000_000, baseExpense: 70_000_000, unlockAct: 4 },
  { id: "fintech", name: "Startup Fintech", emoji: "🚀", tier: "corporate", cost: 800_000_000, baseRevenue: 350_000_000, baseExpense: 140_000_000, unlockAct: 5 },
  { id: "mine", name: "Mine d'or industrielle", emoji: "⛏️", tier: "corporate", cost: 2_500_000_000, baseRevenue: 1_200_000_000, baseExpense: 500_000_000, unlockAct: 5 },
];

export const LIFESTYLE_UPGRADES: Record<keyof Lifestyle, { name: string; cost: number; emoji: string }[]> = {
  home: [
    { name: "Chambre au quartier", cost: 0, emoji: "🛖" },
    { name: "Studio en ville", cost: 500_000, emoji: "🏠" },
    { name: "Appartement moderne", cost: 5_000_000, emoji: "🏢" },
    { name: "Villa Cocody", cost: 80_000_000, emoji: "🏡" },
    { name: "Domaine privé", cost: 600_000_000, emoji: "🏯" },
  ],
  car: [
    { name: "À pied", cost: 0, emoji: "🚶" },
    { name: "Moto Jakarta", cost: 200_000, emoji: "🛵" },
    { name: "Toyota d'occasion", cost: 3_000_000, emoji: "🚗" },
    { name: "Mercedes Classe C", cost: 25_000_000, emoji: "🚙" },
    { name: "Range Rover", cost: 80_000_000, emoji: "🏎️" },
  ],
  outfit: [
    { name: "Pagne simple", cost: 0, emoji: "👕" },
    { name: "Chemise propre", cost: 50_000, emoji: "👔" },
    { name: "Costume cravate", cost: 800_000, emoji: "🤵" },
    { name: "Sur-mesure italien", cost: 6_000_000, emoji: "🎩" },
  ],
  phone: [
    { name: "Itel basique", cost: 0, emoji: "📞" },
    { name: "Tecno Spark", cost: 80_000, emoji: "📱" },
    { name: "Samsung Galaxy", cost: 400_000, emoji: "📲" },
    { name: "iPhone Pro Max", cost: 1_500_000, emoji: "🍎" },
  ],
};

export function netBusinessIncome(defId: string, level: number, employees: number): { revenue: number; expense: number } {
  const def = BUSINESSES.find((b) => b.id === defId)!;
  const lvlMult = 1 + (level - 1) * 0.35;
  const empBonus = 1 + employees * 0.15;
  const revenue = def.baseRevenue * lvlMult * empBonus;
  const expense = def.baseExpense * lvlMult + employees * 5_000;
  return { revenue, expense };
}
