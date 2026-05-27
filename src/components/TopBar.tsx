import { useGame } from "@/game/store";
import { fcfa } from "@/game/format";

const ACT_NAMES = ["", "La Débrouille", "Le Petit Patron", "L'Entrepreneur", "Le Notable", "L'Élite"];

export function TopBar() {
  const { state, dailyNet } = useGame();
  const netPositive = dailyNet.net >= 0;
  return (
    <div className="glass sticky top-0 z-20 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Acte {state.act} · Jour {state.day}</div>
          <div className="text-xs text-muted-foreground">{ACT_NAMES[state.act]}</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold gold-text leading-none">{fcfa(state.cash)} <span className="text-xs font-normal text-muted-foreground">FCFA</span></div>
          <div className={`text-[11px] mt-0.5 ${netPositive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {netPositive ? "+" : ""}{fcfa(dailyNet.net)} / jour
          </div>
        </div>
      </div>
      {state.debt > 0 && (
        <div className="mt-2 text-[11px] text-[var(--color-danger)]">⚠ Dette : {fcfa(state.debt)} FCFA</div>
      )}
    </div>
  );
}
