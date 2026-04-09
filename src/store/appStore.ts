import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  AppSettings,
  ChatSession,
  MCPServer,
  AIModel,
  Message,
  ModelSettings,
} from "@/types";
import { PRE_INSTALLED_MODELS, DEFAULT_MODEL_SETTINGS } from "@/lib/models";
import { generateId } from "@/lib/utils";

interface AppState {
  settings: AppSettings;
  sessions: ChatSession[];
  activeSessionId: string | null;
  sidebarOpen: boolean;

  // Settings actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  setDebugMode: (enabled: boolean) => void;
  addCustomModel: (model: AIModel) => void;
  removeCustomModel: (modelId: string) => void;
  addMCPServer: (server: MCPServer) => void;
  removeMCPServer: (serverId: string) => void;
  updateMCPServer: (serverId: string, updates: Partial<MCPServer>) => void;

  // Session actions
  createSession: (model?: string) => ChatSession;
  deleteSession: (sessionId: string) => void;
  setActiveSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Omit<Message, "id">) => void;
  clearSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  updateSessionSettings: (
    sessionId: string,
    settings: Partial<ModelSettings>
  ) => void;

  // UI actions
  toggleSidebar: () => void;
}

const defaultSettings: AppSettings = {
  theme: "dark",
  defaultModel: "kimi-k2-thinking:cloud",
  ollamaUrl: process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || "http://localhost:11434",
  mcpServers: [],
  debugMode: false,
  streamingEnabled: true,
  customModels: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      sessions: [],
      activeSessionId: null,
      sidebarOpen: true,

      updateSettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),

      setDebugMode: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, debugMode: enabled },
        })),

      addCustomModel: (model) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customModels: [...state.settings.customModels, model],
          },
        })),

      removeCustomModel: (modelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customModels: state.settings.customModels.filter(
              (m) => m.id !== modelId
            ),
          },
        })),

      addMCPServer: (server) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mcpServers: [...state.settings.mcpServers, server],
          },
        })),

      removeMCPServer: (serverId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mcpServers: state.settings.mcpServers.filter(
              (s) => s.id !== serverId
            ),
          },
        })),

      updateMCPServer: (serverId, updates) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mcpServers: state.settings.mcpServers.map((s) =>
              s.id === serverId ? { ...s, ...updates } : s
            ),
          },
        })),

      createSession: (model) => {
        const { settings } = get();
        const newSession: ChatSession = {
          id: generateId(),
          title: "New Conversation",
          messages: [],
          model: model || settings.defaultModel || PRE_INSTALLED_MODELS[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
          settings: { ...DEFAULT_MODEL_SETTINGS },
        };
        set((state) => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: newSession.id,
        }));
        return newSession;
      },

      deleteSession: (sessionId) =>
        set((state) => {
          const sessions = state.sessions.filter((s) => s.id !== sessionId);
          const activeSessionId =
            state.activeSessionId === sessionId
              ? sessions[0]?.id || null
              : state.activeSessionId;
          return { sessions, activeSessionId };
        }),

      setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

      addMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  messages: [
                    ...s.messages,
                    { ...message, id: generateId() } as Message,
                  ],
                  updatedAt: new Date(),
                  title:
                    s.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 50)
                      : s.title,
                }
              : s
          ),
        })),

      clearSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, messages: [] } : s
          ),
        })),

      updateSessionTitle: (sessionId, title) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, title } : s
          ),
        })),

      updateSessionSettings: (sessionId, settings) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId
              ? { ...s, settings: { ...s.settings, ...settings } }
              : s
          ),
        })),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "imagination-station-storage",
      partialize: (state) => ({
        settings: state.settings,
        sessions: state.sessions.slice(0, 50), // Keep last 50 sessions
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
