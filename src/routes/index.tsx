import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GameProvider, useGame } from "@/game/store";
import { TopBar } from "@/components/TopBar";
import { BottomNav, type Tab } from "@/components/BottomNav";
import { Onboarding } from "@/components/Onboarding";
import { EventModal } from "@/components/EventModal";
import { BusinessScreen } from "@/components/screens/BusinessScreen";
import { LifeScreen } from "@/components/screens/LifeScreen";
import { WorldScreen } from "@/components/screens/WorldScreen";

export const Route = createFileRoute("/")({
  component: Index,
});

function Game() {
  const { state } = useGame();
  const [tab, setTab] = useState<Tab>("business");

  if (!state.onboarded) return <Onboarding />;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <TopBar />
      <main className="flex-1 px-4 pb-28 pt-4">
        {tab === "business" && <BusinessScreen />}
        {tab === "life" && <LifeScreen />}
        {tab === "world" && <WorldScreen />}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
      <EventModal />
    </div>
  );
}

function Index() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}
