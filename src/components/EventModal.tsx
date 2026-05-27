import { useGame } from "@/game/store";
import { fcfaFull } from "@/game/format";

export function EventModal() {
  const { state, dispatch } = useGame();
  const ev = state.pendingEvent;
  if (!ev) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="glass w-full max-w-md rounded-2xl p-5 animate-in slide-in-from-bottom">
        <div className="mb-1 text-[10px] uppercase tracking-widest text-[var(--color-gold)]">Événement · Jour {state.day}</div>
        <h3 className="mb-2 text-xl font-bold">{ev.title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{ev.description}</p>
        <div className="space-y-2">
          {ev.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => dispatch({ type: "RESOLVE_EVENT", choiceIndex: i })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-left text-sm font-medium transition hover:border-[var(--color-gold)]"
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="mt-3 text-center text-[10px] text-muted-foreground">Cash : {fcfaFull(state.cash)}</div>
      </div>
    </div>
  );
}
