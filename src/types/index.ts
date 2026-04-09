export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextLength: number;
  capabilities: string[];
  isLocal?: boolean;
  isCloud?: boolean;
  isFree?: boolean;
  endpoint?: string;
  apiKeyRequired?: boolean;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: Date;
  model?: string;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  metadata?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  result: unknown;
  error?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: Date;
  updatedAt: Date;
  systemPrompt?: string;
  settings?: ModelSettings;
}

export interface ModelSettings {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  systemPrompt?: string;
  stream: boolean;
  tools?: boolean;
  multimodal?: boolean;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  apiKey?: string;
  status: "connected" | "disconnected" | "error";
  tools: MCPTool[];
  description?: string;
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface SuperComputerTask {
  id: string;
  name: string;
  type: "inference" | "training" | "scraping" | "analysis" | "generation";
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  provider: "aws" | "gcp" | "azure" | "local";
  resources: {
    cpu: number;
    memory: number;
    gpu?: number;
  };
  startedAt?: Date;
  completedAt?: Date;
  result?: unknown;
  error?: string;
}

export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    family: string;
    parameter_size: string;
    quantization_level: string;
  };
  modified_at: string;
}

export type ThemeMode = "light" | "dark" | "system";

export interface AppSettings {
  theme: ThemeMode;
  defaultModel: string;
  ollamaUrl: string;
  mcpServers: MCPServer[];
  debugMode: boolean;
  streamingEnabled: boolean;
  customModels: AIModel[];
}
