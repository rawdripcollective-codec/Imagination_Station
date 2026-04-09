"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Server,
  Cpu,
  MemoryStick,
  Zap,
  Play,
  BarChart3,
  CloudLightning,
  Activity,
  CheckCircle,
  AlertCircle,
  Globe,
} from "lucide-react";

interface SystemStats {
  cpu: number;
  memory: number;
  gpu: number;
  activeJobs: number;
  status: string;
}

interface Task {
  id: string;
  name: string;
  type: string;
  status: "running" | "completed" | "failed" | "queued";
  progress: number;
  provider: string;
  result?: Record<string, unknown>;
  cost?: string;
  duration?: string;
}

export default function SuperComputerMode() {
  const [stats, setStats] = useState<SystemStats>({
    cpu: 45,
    memory: 62,
    gpu: 78,
    activeJobs: 3,
    status: "online",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("aws");
  const [selectedTaskType, setSelectedTaskType] = useState("inference");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/supercomputer");
        const data = await res.json();
        if (data.currentLoad) {
          setStats((prev) => ({
            ...prev,
            cpu: data.currentLoad.cpu,
            memory: data.currentLoad.memory,
            gpu: data.currentLoad.gpu,
            activeJobs: data.activeJobs || prev.activeJobs,
          }));
        }
      } catch {
        // Use simulated stats
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const runTask = async () => {
    setIsRunning(true);
    const taskId = Math.random().toString(36).substring(2, 8);

    const newTask: Task = {
      id: taskId,
      name: `${selectedTaskType} task #${taskId}`,
      type: selectedTaskType,
      status: "running",
      progress: 0,
      provider: selectedProvider,
    };

    setTasks((prev) => [newTask, ...prev]);

    // Animate progress
    const progressInterval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId && t.status === "running"
            ? { ...t, progress: Math.min(t.progress + Math.random() * 20, 95) }
            : t
        )
      );
    }, 300);

    try {
      const res = await fetch("/api/supercomputer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskType: selectedTaskType,
          config: { provider: selectedProvider },
        }),
      });

      const data = await res.json();
      clearInterval(progressInterval);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "completed",
                progress: 100,
                result: data.result as Record<string, unknown>,
                cost: data.cost,
                duration: data.duration,
              }
            : t
        )
      );

      setStats((prev) => ({ ...prev, activeJobs: Math.max(0, prev.activeJobs - 1) }));
    } catch {
      clearInterval(progressInterval);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "failed", progress: 0 } : t
        )
      );
    } finally {
      setIsRunning(false);
    }
  };

  const providers = [
    { id: "aws", name: "AWS", icon: "☁️", color: "text-orange-400" },
    { id: "gcp", name: "Google Cloud", icon: "🌐", color: "text-blue-400" },
    { id: "azure", name: "Azure", icon: "🔷", color: "text-sky-400" },
    { id: "local", name: "Local GPU", icon: "💻", color: "text-green-400" },
  ];

  const taskTypes = [
    { id: "inference", name: "AI Inference", description: "Run model inference at scale" },
    { id: "training", name: "Model Training", description: "Fine-tune or train models" },
    { id: "scraping", name: "Web Scraping", description: "Large-scale data collection" },
    { id: "analysis", name: "Data Analysis", description: "Process and analyze datasets" },
    { id: "generation", name: "Batch Generation", description: "Generate content at scale" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <CloudLightning className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Super Computer Mode</h1>
            <p className="text-sm text-slate-400">
              Cloud-scale AI operations across AWS, GCP & Azure
            </p>
          </div>
          <div className="ml-auto">
            <Badge variant={stats.status === "online" ? "success" : "error"}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-1" />
              {stats.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* System Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "CPU Load", value: stats.cpu, icon: Cpu, color: "text-blue-400", bg: "bg-blue-500" },
            { label: "Memory", value: stats.memory, icon: MemoryStick, color: "text-purple-400", bg: "bg-purple-500" },
            { label: "GPU Utilization", value: stats.gpu, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500" },
            { label: "Active Jobs", value: stats.activeJobs, icon: Activity, color: "text-green-400", bg: "bg-green-500", raw: true },
          ].map(({ label, value, icon: Icon, color, bg, raw }) => (
            <Card key={label} className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-slate-100">
                  {raw ? value : `${value}%`}
                </div>
                {!raw && (
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bg} rounded-full transition-all duration-500`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Cloud Provider
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                      selectedProvider === provider.id
                        ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                        : "border-slate-700 bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <span className="text-lg mr-2">{provider.icon}</span>
                    {provider.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-violet-400" />
                Task Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {taskTypes.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTaskType(task.id)}
                    className={`w-full p-2.5 rounded-lg border text-left text-sm transition-all ${
                      selectedTaskType === task.id
                        ? "border-violet-500/50 bg-violet-500/10 text-violet-200"
                        : "border-slate-700 bg-slate-700/30 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium">{task.name}</div>
                    <div className="text-xs text-slate-500">{task.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Run Button */}
        <Button
          onClick={runTask}
          loading={isRunning}
          className="w-full h-14 text-base bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/20"
        >
          <Play className="w-5 h-5" />
          Launch {taskTypes.find((t) => t.id === selectedTaskType)?.name} on{" "}
          {providers.find((p) => p.id === selectedProvider)?.name}
        </Button>

        {/* Task History */}
        {tasks.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                Task Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-700/50 border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {task.status === "completed" ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : task.status === "failed" ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                        )}
                        <span className="text-sm font-medium text-slate-200">
                          {task.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.cost && (
                          <Badge variant="success">{task.cost}</Badge>
                        )}
                        {task.duration && (
                          <Badge variant="outline">{task.duration}</Badge>
                        )}
                        <Badge
                          variant={
                            task.status === "completed"
                              ? "success"
                              : task.status === "failed"
                              ? "error"
                              : "info"
                          }
                        >
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                    {task.status === "running" && (
                      <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full transition-all duration-300"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                    {task.result && (
                      <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-800 p-2 rounded-lg overflow-x-auto">
                        {JSON.stringify(task.result, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
