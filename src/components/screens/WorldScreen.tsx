import { useGame } from "@/game/store";
import { pickRandomEvent } from "@/game/events";
import { fcfa } from "@/game/format";

const ACT_THRESHOLDS = [100_000, 1_000_000, 50_000_000, 1_000_000_000];
const ACT_LABELS = ["Petit Patron", "Entrepreneur", "Notable", "Élite"];

export function WorldScreen() {
  const { state, dispatch } = useGame();
  const nextThreshold = ACT_THRESHOLDS[state.act - 1] ?? Infinity;
  const progress = Math.min(100, (state.cash / nextThreshold) * 100);
  const canClaimDaily = state.day - state.lastDailyReward >= 1;

  return (
    <div className="space-y-4">
      {/* Progress to next act */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Progression</div>
        {state.act < 5 ? (
          <>
            <div className="mb-1 flex justify-between text-sm">
              <span>→ {ACT_LABELS[state.act - 1]}</span>
              <span className="gold-text font-bold">{fcfa(state.cash)} / {fcfa(nextThreshold)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[var(--color-muted)]">
              <div className="h-full rounded-full bg-[var(--color-gold)] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </>
        ) : (
          <div className="text-center text-sm gold-text font-bold">🏆 Tu es l'ÉLITE. Empire au sommet.</div>
        )}
      </div>

      {/* Daily reward + actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => dispatch({ type: "CLAIM_DAILY" })}
          disabled={!canClaimDaily}
          className="glass rounded-2xl p-4 text-left disabled:opacity-50"
        >
          <div className="text-2xl">🎁</div>
          <div className="mt-2 text-xs font-semibold">Bonus du jour</div>
          <div className="text-[10px] text-muted-foreground">{canClaimDaily ? `+${fcfa(20_000 * state.act)} FCFA` : "Déjà réclamé"}</div>
        </button>

        <button
          onClick={() => {
            const ev = pickRandomEvent(state);
            if (ev) dispatch({ type: "TRIGGER_EVENT", event: ev });
          }}
          className="glass rounded-2xl p-4 text-left"
        >
          <div className="text-2xl">🎲</div>
          <div className="mt-2 text-xs font-semibold">Provoquer un événement</div>
          <div className="text-[10px] text-muted-foreground">Tente ta chance</div>
        </button>
      </div>

      {/* Debt */}
      {state.debt > 0 && (
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--color-danger)]">Dette</div>
              <div className="text-lg font-bold">{fcfa(state.debt)} FCFA</div>
              <div className="text-[10px] text-muted-foreground">+2% d'intérêts par jour</div>
            </div>
            <button
              onClick={() => dispatch({ type: "REPAY_DEBT", amount: state.debt })}
              disabled={state.cash <= 0}
              className="rounded-xl bg-[var(--color-gold)] px-3 py-2 text-xs font-bold text-black disabled:opacity-40"
            >
              Rembourser
            </button>
          </div>
        </div>
      )}

      {/* News feed */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">📰 Actualité</div>
        <div className="space-y-2">
          {state.feed.map((f, i) => (
            <div key={i} className="rounded-lg bg-[var(--color-muted)] px-3 py-2 text-xs">
              <span className="mr-2 text-[10px] text-[var(--color-gold)]">J{f.day}</span>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { if (confirm("Recommencer une partie ? Tout sera perdu.")) dispatch({ type: "RESET" }); }}
        className="w-full rounded-xl border border-[var(--color-border)] py-2 text-xs text-muted-foreground"
      >
        Recommencer la partie
      </button>
    </div>
  );
}
