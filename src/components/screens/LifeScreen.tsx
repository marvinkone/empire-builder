import { useGame } from "@/game/store";
import { LIFESTYLE_UPGRADES } from "@/game/businesses";
import { fcfa } from "@/game/format";
import type { Lifestyle } from "@/game/types";

const SLOT_LABEL: Record<keyof Lifestyle, string> = {
  home: "Logement",
  car: "Véhicule",
  outfit: "Tenue",
  phone: "Téléphone",
};

export function LifeScreen() {
  const { state, dispatch } = useGame();

  return (
    <div className="space-y-4">
      {/* Stats vie */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Ta vie</div>
        <div className="space-y-3">
          <Bar label="👨‍👩‍👧 Famille" value={state.family} color="oklch(0.74 0.17 150)" hint={state.family < 30 ? "Pression familiale élevée" : ""} />
          <Bar label="🤝 Réseau" value={state.network} color="oklch(0.7 0.15 240)" />
          <Bar label="⭐ Réputation" value={state.reputation} color="oklch(0.82 0.14 85)" />
        </div>
      </div>

      {/* Lifestyle */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">Style de vie</div>
        <div className="space-y-3">
          {(Object.keys(LIFESTYLE_UPGRADES) as (keyof Lifestyle)[]).map((slot) => {
            const current = state.lifestyle[slot];
            const list = LIFESTYLE_UPGRADES[slot];
            const cur = list[current];
            const next = list[current + 1];
            return (
              <div key={slot} className="flex items-center justify-between rounded-xl bg-[var(--color-muted)] p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{cur.emoji}</div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{SLOT_LABEL[slot]}</div>
                    <div className="text-sm font-semibold">{cur.name}</div>
                    {next && <div className="text-[11px] text-muted-foreground">Prochain : {next.emoji} {next.name}</div>}
                  </div>
                </div>
                {next ? (
                  <button
                    onClick={() => dispatch({ type: "BUY_LIFESTYLE", slot })}
                    disabled={state.cash < next.cost}
                    className="rounded-xl bg-[var(--color-gold)] px-3 py-2 text-xs font-bold text-black disabled:bg-[var(--color-background)] disabled:text-muted-foreground"
                  >
                    {fcfa(next.cost)}
                  </button>
                ) : (
                  <span className="text-[11px] text-[var(--color-gold)]">MAX</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value, color, hint }: { label: string; value: number; color: string; hint?: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span className="text-muted-foreground">{Math.round(value)}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-muted)]">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      {hint && <div className="mt-1 text-[10px] text-[var(--color-danger)]">{hint}</div>}
    </div>
  );
}
