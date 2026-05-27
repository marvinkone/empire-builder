export type Tab = "business" | "life" | "world";

export function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const items: { id: Tab; label: string; emoji: string }[] = [
    { id: "business", label: "Business", emoji: "💼" },
    { id: "life", label: "Vie", emoji: "🏡" },
    { id: "world", label: "Monde", emoji: "🌍" },
  ];
  return (
    <div className="glass fixed bottom-0 left-0 right-0 z-20 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition ${active ? "bg-[var(--color-muted)]" : ""}`}
            >
              <span className={`text-xl ${active ? "" : "opacity-60"}`}>{it.emoji}</span>
              <span className={`text-[10px] uppercase tracking-wider ${active ? "gold-text font-semibold" : "text-muted-foreground"}`}>{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
