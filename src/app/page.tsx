"use client";

import { useState } from "react";
import LandingPage from "@/components/landing/LandingPage";
import Sidebar from "@/components/layout/Sidebar";
import AIPlayground from "@/components/ai/AIPlayground";
import SuperComputerMode from "@/components/ai/SuperComputerMode";
import MCPIntegration from "@/components/ai/MCPIntegration";
import SettingsPanel from "@/components/settings/SettingsPanel";

type AppView = "playground" | "supercomputer" | "mcp" | "settings";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeView, setActiveView] = useState<AppView>("playground");

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {activeView === "playground" && (
          <AIPlayground onOpenSettings={() => setActiveView("settings")} />
        )}
        {activeView === "supercomputer" && <SuperComputerMode />}
        {activeView === "mcp" && <MCPIntegration />}
        {activeView === "settings" && <SettingsPanel />}
      </main>
    </div>
  );
}
