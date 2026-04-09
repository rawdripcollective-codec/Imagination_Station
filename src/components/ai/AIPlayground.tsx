"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAppStore } from "@/store/appStore";
import { Message, ModelSettings } from "@/types";
import { ALL_MODELS, PRE_INSTALLED_MODELS } from "@/lib/models";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { generateId } from "@/lib/utils";
import {
  Send,
  Bot,
  User,
  Trash2,
  Settings,
  ChevronDown,
  Zap,
  Copy,
  Check,
  Wrench,
} from "lucide-react";

interface AIPlaygroundProps {
  onOpenSettings?: () => void;
}

export default function AIPlayground({ onOpenSettings }: AIPlaygroundProps) {
  const {
    sessions,
    activeSessionId,
    createSession,
    addMessage,
    clearSession,
    settings,
  } = useAppStore();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    settings.defaultModel || PRE_INSTALLED_MODELS[0].id
  );
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [modelSettings] = useState<ModelSettings>({
    temperature: 0.7,
    maxTokens: 4096,
    topP: 0.95,
    stream: true,
    tools: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const allModels = [...PRE_INSTALLED_MODELS, ...ALL_MODELS.filter(m => !PRE_INSTALLED_MODELS.some(pm => pm.id === m.id)), ...(settings.customModels || [])];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ensureSession = useCallback(() => {
    if (!activeSessionId) {
      return createSession(selectedModel);
    }
    return activeSession!;
  }, [activeSessionId, activeSession, createSession, selectedModel]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const session = ensureSession();
    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    addMessage(session.id, {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      model: selectedModel,
    });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...(messages.map((m) => ({ role: m.role, content: m.content }))),
            { role: "user", content: userMessage },
          ],
          model: selectedModel,
          settings: modelSettings,
        }),
      });

      const data = await response.json();

      addMessage(session.id, {
        role: "assistant",
        content: data.content || data.error || "No response received.",
        timestamp: new Date(),
        model: selectedModel,
        metadata: { usage: data.usage },
      });
    } catch (error) {
      addMessage(session.id, {
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
        timestamp: new Date(),
        model: selectedModel,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const currentModel = allModels.find((m) => m.id === selectedModel);

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-sm text-slate-200 transition-colors border border-slate-600/50"
              >
                <Bot className="w-4 h-4 text-violet-400" />
                <span className="font-medium truncate max-w-[180px]">
                  {currentModel?.name || selectedModel}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showModelDropdown && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider px-2 pb-1">
                      Pre-installed Models
                    </p>
                    {PRE_INSTALLED_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedModel === model.id
                            ? "bg-violet-600/30 text-violet-200"
                            : "text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{model.name}</span>
                          <div className="flex gap-1">
                            <Badge variant="success">Free</Badge>
                            {model.isCloud && <Badge variant="info">Cloud</Badge>}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {model.description}
                        </p>
                      </button>
                    ))}

                    <p className="text-xs text-slate-500 uppercase tracking-wider px-2 pb-1 pt-2">
                      Cloud Models
                    </p>
                    {allModels
                      .filter((m) => !PRE_INSTALLED_MODELS.some((pm) => pm.id === m.id))
                      .map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedModel === model.id
                              ? "bg-violet-600/30 text-violet-200"
                              : "text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{model.name}</span>
                            <Badge variant="outline">{model.provider}</Badge>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {currentModel && (
              <div className="hidden sm:flex items-center gap-1.5">
                {currentModel.isFree && <Badge variant="success">Free</Badge>}
                {currentModel.isCloud && <Badge variant="info">Cloud</Badge>}
                {currentModel.capabilities?.slice(0, 2).map((cap) => (
                  <Badge key={cap} variant="outline">
                    {cap}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeSessionId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => clearSession(activeSessionId)}
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            title="Model settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <WelcomeScreen
            modelName={currentModel?.name || selectedModel}
            onPrompt={(prompt) => {
              setInput(prompt);
              inputRef.current?.focus();
            }}
          />
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={copyMessage}
              copied={copiedMessageId === message.id}
            />
          ))
        )}
        {isLoading && <TypingIndicator model={currentModel?.name || selectedModel} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${currentModel?.name || "AI"}... (Enter to send, Shift+Enter for newline)`}
              className="min-h-[52px] max-h-48 pr-12 resize-none text-slate-100"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            loading={isLoading}
            className="h-[52px] px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-violet-400" />
            Powered by Imagination Station AI
          </span>
          <span>
            {input.length > 0 && `${input.length} chars`}
          </span>
        </div>
      </div>

      {/* Dropdown overlay */}
      {showModelDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowModelDropdown(false)}
        />
      )}
    </div>
  );
}

function WelcomeScreen({
  modelName,
  onPrompt,
}: {
  modelName: string;
  onPrompt: (prompt: string) => void;
}) {
  const suggestions = [
    "Write a comprehensive blog post about the future of AI",
    "Explain quantum computing in simple terms",
    "Help me debug this JavaScript function",
    "Create a marketing strategy for a SaaS startup",
    "Analyze the pros and cons of renewable energy",
    "Write Python code for a REST API",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
        <Bot className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-slate-100 mb-2">
        Imagination Station AI
      </h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Currently using <span className="text-violet-400 font-medium">{modelName}</span>.
        Start a conversation or try one of these prompts:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-2xl">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onPrompt(suggestion)}
            className="text-left px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/50 hover:border-violet-500/30 text-sm text-slate-300 transition-all duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  onCopy,
  copied,
}: {
  message: Message;
  onCopy: (id: string, content: string) => void;
  copied: boolean;
}) {
  const isUser = message.role === "user";
  const isTool = message.role === "tool";

  return (
    <div className={`flex gap-3 group ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-violet-600"
            : isTool
            ? "bg-amber-600"
            : "bg-gradient-to-br from-violet-500 to-purple-600"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : isTool ? (
          <Wrench className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div className={`flex-1 max-w-3xl ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`relative px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-violet-600 text-white rounded-tr-sm"
              : isTool
              ? "bg-amber-900/30 text-amber-200 border border-amber-700/30 rounded-tl-sm font-mono text-xs"
              : "bg-slate-800 text-slate-100 border border-slate-700/50 rounded-tl-sm"
          }`}
        >
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <button
            onClick={() => onCopy(message.id, message.content)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <span className="text-xs text-slate-600">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
          {message.model && (
            <span className="text-xs text-slate-600 hidden sm:block">
              {message.model.split(":")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ model }: { model: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="px-4 py-3 bg-slate-800 rounded-2xl rounded-tl-sm border border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">{model} is thinking...</span>
        </div>
      </div>
    </div>
  );
}
