"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MCPTool } from "@/types";
import {
  Plug,
  Wrench,
  Play,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Code,
  Globe,
  Database,
  FileText,
} from "lucide-react";

interface MCPServerStatus {
  status: string;
  tools: MCPTool[];
  message?: string;
}

interface ToolExecution {
  tool: string;
  args: string;
  result: string | null;
  loading: boolean;
  error: string | null;
}

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  web_search: Globe,
  web_scrape: Globe,
  code_execute: Code,
  file_read: FileText,
  file_write: FileText,
  database_query: Database,
};

export default function MCPIntegration() {
  const [serverStatus, setServerStatus] = useState<MCPServerStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [executions, setExecutions] = useState<ToolExecution[]>([]);
  const [customServerUrl, setCustomServerUrl] = useState("");
  const [showAddServer, setShowAddServer] = useState(false);

  const fetchServerStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/mcp");
      const data = await res.json();
      setServerStatus(data);
      if (data.tools?.length > 0 && !selectedTool) {
        setSelectedTool(data.tools[0]);
      }
    } catch {
      setServerStatus({
        status: "error",
        tools: [],
        message: "Failed to connect to MCP server",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServerStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const executeTool = async () => {
    if (!selectedTool) return;

    let parsedArgs: Record<string, unknown> = {};
    try {
      parsedArgs = JSON.parse(toolArgs[selectedTool.name] || "{}");
    } catch {
      // Try to build args from input fields
      parsedArgs = {};
    }

    const newExecution: ToolExecution = {
      tool: selectedTool.name,
      args: JSON.stringify(parsedArgs),
      result: null,
      loading: true,
      error: null,
    };

    setExecutions((prev) => [newExecution, ...prev]);

    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedTool.name,
          arguments: parsedArgs,
        }),
      });

      const data = await res.json();
      setExecutions((prev) =>
        prev.map((e, i) =>
          i === 0
            ? {
                ...e,
                loading: false,
                result: JSON.stringify(data.result, null, 2),
                error: data.error || null,
              }
            : e
        )
      );
    } catch (error) {
      setExecutions((prev) =>
        prev.map((e, i) =>
          i === 0
            ? { ...e, loading: false, error: String(error) }
            : e
        )
      );
    }
  };

  const getDefaultArgs = (tool: MCPTool) => {
    const props = (tool.inputSchema as { properties?: Record<string, { type: string }> })?.properties || {};
    const defaults: Record<string, string> = {};
    Object.entries(props).forEach(([key, val]) => {
      if (val.type === "string") defaults[key] = "";
      if (val.type === "number") defaults[key] = "0";
    });
    return JSON.stringify(defaults, null, 2);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Plug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">MCP Integration</h1>
            <p className="text-sm text-slate-400">
              Model Context Protocol — connect AI to external tools & services
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge
              variant={
                serverStatus?.status === "connected"
                  ? "success"
                  : serverStatus?.status === "disconnected"
                  ? "warning"
                  : "error"
              }
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
              {serverStatus?.status || "checking..."}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchServerStatus}
              loading={loading}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-full">
        {/* Tools Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-700/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-300">Available Tools</h3>
            <button
              onClick={() => setShowAddServer(!showAddServer)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {showAddServer && (
            <div className="mb-4 p-3 bg-slate-800 rounded-xl border border-slate-700">
              <Input
                placeholder="MCP Server URL"
                value={customServerUrl}
                onChange={(e) => setCustomServerUrl(e.target.value)}
                className="mb-2"
              />
              <Button size="sm" className="w-full">
                Connect Server
              </Button>
            </div>
          )}

          {serverStatus?.message && (
            <div className="mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              {serverStatus.message}
            </div>
          )}

          <div className="space-y-1">
            {serverStatus?.tools?.map((tool) => {
              const Icon = TOOL_ICONS[tool.name] || Wrench;
              return (
                <button
                  key={tool.name}
                  onClick={() => {
                    setSelectedTool(tool);
                    if (!toolArgs[tool.name]) {
                      setToolArgs((prev) => ({
                        ...prev,
                        [tool.name]: getDefaultArgs(tool),
                      }));
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                    selectedTool?.name === tool.name
                      ? "bg-amber-500/15 text-amber-200 border border-amber-500/30"
                      : "text-slate-300 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 opacity-60 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {tool.description}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Executor */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
          {selectedTool ? (
            <>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    {selectedTool.name}
                  </CardTitle>
                  <CardDescription>{selectedTool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 uppercase tracking-wider mb-1 block">
                        Arguments (JSON)
                      </label>
                      <textarea
                        value={toolArgs[selectedTool.name] || "{}"}
                        onChange={(e) =>
                          setToolArgs((prev) => ({
                            ...prev,
                            [selectedTool.name]: e.target.value,
                          }))
                        }
                        className="w-full h-32 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        spellCheck={false}
                      />
                    </div>
                    <Button
                      onClick={executeTool}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                    >
                      <Play className="w-4 h-4" />
                      Execute Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Execution Results */}
              {executions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-300">
                      Execution History
                    </h3>
                    <button
                      onClick={() => setExecutions([])}
                      className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                  {executions.map((exec, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-800 border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-xs text-amber-300 font-mono">
                          {exec.tool}
                        </code>
                        {exec.loading ? (
                          <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        ) : exec.error ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono mb-2">
                        Args: {exec.args}
                      </div>
                      {exec.result && (
                        <pre className="text-xs text-slate-300 bg-slate-900 p-2 rounded-lg overflow-x-auto max-h-48">
                          {exec.result}
                        </pre>
                      )}
                      {exec.error && (
                        <div className="text-xs text-red-400">{exec.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Plug className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Select a tool to execute</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
