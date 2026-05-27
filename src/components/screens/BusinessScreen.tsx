import { useState } from "react";
import { useGame } from "@/game/store";
import { BUSINESSES, netBusinessIncome } from "@/game/businesses";
import { fcfa } from "@/game/format";
import type { Tier } from "@/game/types";

const TIER_LABEL: Record<Tier, string> = { street: "Street", pme: "PME", corporate: "Corporate" };

export function BusinessScreen() {
  const { state, dispatch, dailyNet } = useGame();
  const [tab, setTab] = useState<"mine" | "buy">("mine");
  const [tierFilter, setTierFilter] = useState<Tier>("street");

  const taxes = Math.max(0, (dailyNet.revenue - (dailyNet.expense - 0)) * 0); // already included
  return (
    <div className="space-y-4">
      {/* Daily P&L */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Bilan journalier</div>
        <div className="space-y-1 text-sm">
          <Row label="Revenus bruts" value={fcfa(dailyNet.revenue)} positive />
          <Row label="Charges (salaires, loyer, taxes 10%)" value={`-${fcfa(dailyNet.expense)}`} />
          <div className="my-2 h-px bg-[var(--color-border)]" />
          <Row label="Profit net" value={`${dailyNet.net >= 0 ? "+" : ""}${fcfa(dailyNet.net)}`} bold positive={dailyNet.net >= 0} danger={dailyNet.net < 0} />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <Pill active={tab === "mine"} onClick={() => setTab("mine")}>Mes business ({state.businesses.length})</Pill>
        <Pill active={tab === "buy"} onClick={() => setTab("buy")}>Acheter</Pill>
      </div>

      {tab === "mine" && (
        <div className="space-y-3">
          {state.businesses.length === 0 && (
            <div className="glass rounded-2xl p-6 text-center text-sm text-muted-foreground">
              Tu n'as encore aucun business. Va dans l'onglet "Acheter".
            </div>
          )}
          {state.businesses.map((b, i) => {
            const def = BUSINESSES.find((d) => d.id === b.defId)!;
            const { revenue, expense } = netBusinessIncome(b.defId, b.level, b.employees);
            const upgradeCost = Math.round(def.cost * 0.6 * b.level);
            const hireCost = 50_000 * (b.employees + 1);
            return (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{def.emoji}</div>
                    <div>
                      <div className="font-semibold">{def.name}</div>
                      <div className="text-[11px] text-muted-foreground">Niv. {b.level} · {b.employees} employé(s)</div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-[var(--color-success)]">+{fcfa(revenue)}/j</div>
                    <div className="text-[var(--color-danger)]">-{fcfa(expense)}/j</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => dispatch({ type: "UPGRADE_BUSINESS", index: i })}
                    disabled={state.cash < upgradeCost}
                    className="rounded-xl bg-[var(--color-muted)] px-3 py-2 text-xs font-medium disabled:opacity-40"
                  >
                    ⬆ Niveau ({fcfa(upgradeCost)})
                  </button>
                  <button
                    onClick={() => dispatch({ type: "HIRE", index: i })}
                    disabled={state.cash < hireCost}
                    className="rounded-xl bg-[var(--color-muted)] px-3 py-2 text-xs font-medium disabled:opacity-40"
                  >
                    👤 Embaucher ({fcfa(hireCost)})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "buy" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["street", "pme", "corporate"] as Tier[]).map((t) => (
              <Pill key={t} active={tierFilter === t} onClick={() => setTierFilter(t)}>{TIER_LABEL[t]}</Pill>
            ))}
          </div>
          {BUSINESSES.filter((b) => b.tier === tierFilter).map((def) => {
            const locked = def.unlockAct > state.act;
            const owned = state.businesses.find((o) => o.defId === def.id);
            return (
              <div key={def.id} className={`glass rounded-2xl p-4 ${locked ? "opacity-50" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{def.emoji}</div>
                    <div>
                      <div className="font-semibold">{def.name} {owned && <span className="ml-1 text-[10px] text-[var(--color-gold)]">×{state.businesses.filter(b=>b.defId===def.id).length}</span>}</div>
                      <div className="text-[11px] text-[var(--color-success)]">+{fcfa(def.baseRevenue)}/j brut</div>
                      <div className="text-[11px] text-[var(--color-danger)]">-{fcfa(def.baseExpense)}/j charges</div>
                    </div>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "BUY_BUSINESS", defId: def.id })}
                    disabled={locked || state.cash < def.cost}
                    className="rounded-xl bg-[var(--color-gold)] px-3 py-2 text-xs font-bold text-black disabled:bg-[var(--color-muted)] disabled:text-muted-foreground"
                  >
                    {locked ? `🔒 Acte ${def.unlockAct}` : `${fcfa(def.cost)}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, positive, danger, bold }: { label: string; value: string; positive?: boolean; danger?: boolean; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? "font-bold" : ""} ${positive ? "text-[var(--color-success)]" : ""} ${danger ? "text-[var(--color-danger)]" : ""}`}>{value}</span>
    </div>
  );
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${active ? "bg-[var(--color-gold)] text-black" : "bg-[var(--color-muted)] text-muted-foreground"}`}
    >
      {children}
    </button>
  );
}
