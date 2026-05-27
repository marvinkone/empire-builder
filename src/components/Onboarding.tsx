import { useState } from "react";
import { useGame } from "@/game/store";
import type { Background } from "@/game/types";

const STEPS = [
  { title: "Bienvenue", body: "Bienvenue dans Business Elite. Tu vas construire ton empire depuis la rue jusqu'à l'élite. Choisis avec soin." },
  { title: "Ton nom" },
  { title: "Ton background" },
  { title: "Ta première vente", body: "Tape sur la bouteille pour vendre ton eau. Chaque tap = un client." },
  { title: "C'est parti", body: "Tu débloqueras de nouveaux business, employés et opportunités au fil de ta progression. Bonne chance, patron." },
];

const BG_OPTIONS: { id: Background; label: string; emoji: string; desc: string }[] = [
  { id: "orphan", label: "Orphelin du quartier", emoji: "🧒", desc: "Capital faible, mais cœur solide. +5 000 FCFA." },
  { id: "civil_son", label: "Fils de fonctionnaire", emoji: "🎓", desc: "Petit coup de pouce familial. +25 000 FCFA." },
  { id: "diaspora", label: "Retour de la diaspora", emoji: "✈️", desc: "Tu reviens avec des économies. +80 000 FCFA." },
];

export function Onboarding() {
  const { dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [bg, setBg] = useState<Background | null>(null);
  const [taps, setTaps] = useState(0);

  const next = () => setStep((s) => s + 1);
  const finish = () => bg && dispatch({ type: "ONBOARD", background: bg, name });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="glass w-full max-w-md rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Étape {step + 1} / 5</div>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded ${i <= step ? "bg-[var(--color-gold)]" : "bg-[var(--color-muted)]"}`} />
            ))}
          </div>
        </div>

        <h2 className="mb-3 text-2xl font-bold gold-text">{STEPS[step].title}</h2>

        {step === 0 && (
          <>
            <p className="text-sm text-muted-foreground">{STEPS[0].body}</p>
            <button onClick={next} className="mt-6 w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-black">Commencer</button>
          </>
        )}

        {step === 1 && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">Comment t'appelles-tu, patron ?</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ton nom"
              className="w-full rounded-xl bg-[var(--color-muted)] px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
            />
            <button onClick={next} disabled={!name.trim()} className="mt-6 w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-black disabled:opacity-40">Suivant</button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="mb-3 text-sm text-muted-foreground">D'où viens-tu ? (bonus de départ)</p>
            <div className="space-y-2">
              {BG_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setBg(o.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${bg === o.id ? "border-[var(--color-gold)] bg-[var(--color-muted)]" : "border-[var(--color-border)]"}`}
                >
                  <span className="text-2xl">{o.emoji}</span>
                  <div>
                    <div className="font-semibold">{o.label}</div>
                    <div className="text-xs text-muted-foreground">{o.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={next} disabled={!bg} className="mt-6 w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-black disabled:opacity-40">Suivant</button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-muted-foreground">{STEPS[3].body}</p>
            <div className="my-8 flex flex-col items-center">
              <button
                onClick={() => setTaps((t) => t + 1)}
                className="tap-pulse flex h-32 w-32 items-center justify-center rounded-full bg-[var(--color-gold)] text-6xl active:scale-95"
              >
                💧
              </button>
              <div className="mt-4 text-sm">Ventes : <span className="gold-text font-bold">{taps} / 5</span></div>
            </div>
            <button onClick={next} disabled={taps < 5} className="w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-black disabled:opacity-40">Suivant</button>
          </>
        )}

        {step === 4 && (
          <>
            <p className="text-sm text-muted-foreground">{STEPS[4].body}</p>
            <button onClick={finish} className="mt-6 w-full rounded-xl bg-[var(--color-gold)] py-3 font-semibold text-black">Entrer dans le jeu</button>
          </>
        )}
      </div>
    </div>
  );
}
