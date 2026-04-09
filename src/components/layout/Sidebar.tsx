"use client";

import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  CloudLightning,
  Plug,
  Settings,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bot,
  Moon,
} from "lucide-react";

type AppView = "playground" | "supercomputer" | "mcp" | "settings";

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export default function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const {
    sessions,
    activeSessionId,
    createSession,
    deleteSession,
    setActiveSession,
    sidebarOpen,
    toggleSidebar,
    settings,
  } = useAppStore();

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    color: string;
  }[] = [
    {
      id: "playground",
      label: "AI Playground",
      icon: Bot,
      color: "text-violet-400",
    },
    {
      id: "supercomputer",
      label: "Super Computer",
      icon: CloudLightning,
      color: "text-cyan-400",
    },
    {
      id: "mcp",
      label: "MCP Tools",
      icon: Plug,
      color: "text-amber-400",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-slate-400",
    },
  ];

  return (
    <>
      {/* Collapsed sidebar toggle button */}
      {!sidebarOpen && (
        <div className="flex flex-col h-full w-14 bg-slate-900 border-r border-slate-700/50 items-center py-3 gap-2">
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          {navItems.map(({ id, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                activeView === id
                  ? "bg-violet-600/20 text-violet-300"
                  : "hover:bg-slate-800 text-slate-500 hover:text-slate-200"
              }`}
              title={id}
            >
              <Icon className={`w-4 h-4 ${activeView === id ? "text-violet-400" : color}`} />
            </button>
          ))}
        </div>
      )}

      {/* Expanded sidebar */}
      {sidebarOpen && (
        <div className="flex flex-col h-full w-64 bg-slate-900 border-r border-slate-700/50 flex-shrink-0">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm text-white leading-none">Imagination</p>
                <p className="text-xs text-slate-400 leading-none">Station</p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-3 py-3 space-y-1 border-b border-slate-700/50">
            {navItems.map(({ id, label, icon: Icon, color, badge }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeView === id
                    ? "bg-violet-600/15 text-violet-300 border border-violet-500/25"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${activeView === id ? "text-violet-400" : color}`} />
                <span>{label}</span>
                {badge && <Badge variant="default" className="ml-auto text-xs">{badge}</Badge>}
              </button>
            ))}
          </nav>

          {/* Conversation History */}
          <div className="flex-1 overflow-hidden flex flex-col px-3 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                Recent Chats
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  createSession();
                  onViewChange("playground");
                }}
                className="h-6 w-6"
                title="New chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5">
              {sessions.length === 0 ? (
                <div className="py-4 text-center">
                  <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-600">No conversations yet</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                      activeSessionId === session.id
                        ? "bg-slate-800 text-slate-200"
                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
                    }`}
                    onClick={() => {
                      setActiveSession(session.id);
                      onViewChange("playground");
                    }}
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-xs truncate flex-1">{session.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Moon className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">
                  {settings.defaultModel?.split(":")[0] || "Kimi K2"}
                </p>
                <p className="text-[10px] text-slate-500">Default model</p>
              </div>
              {settings.debugMode && (
                <Badge variant="warning" className="text-[10px]">DEBUG</Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
