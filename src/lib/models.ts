import { AIModel } from "@/types";

export const PRE_INSTALLED_MODELS: AIModel[] = [
  {
    id: "kimi-k2-thinking:cloud",
    name: "Kimi K2 Thinking",
    provider: "ollama",
    description:
      "Advanced reasoning model with extended thinking capabilities. Excels at complex problem-solving and multi-step reasoning tasks.",
    contextLength: 131072,
    capabilities: ["reasoning", "code", "math", "analysis", "tool-calling"],
    isLocal: true,
    isCloud: true,
    isFree: true,
    endpoint: "mcp://ollama/run/kimi-k2-thinking:cloud",
  },
  {
    id: "mistral-large-3:675b-cloud",
    name: "Mistral Large 3 (675B)",
    provider: "ollama",
    description:
      "Mistral's flagship 675B parameter model with exceptional performance across all benchmarks. State-of-the-art multilingual and code capabilities.",
    contextLength: 128000,
    capabilities: [
      "general",
      "code",
      "multilingual",
      "reasoning",
      "tool-calling",
    ],
    isLocal: true,
    isCloud: true,
    isFree: true,
    endpoint: "ollama run mistral-large-3:675b-cloud",
  },
  {
    id: "deepseek-v3.2:cloud",
    name: "DeepSeek V3.2",
    provider: "ollama",
    description:
      "DeepSeek's latest model with breakthrough performance on coding, math, and reasoning tasks. Matches frontier model capabilities.",
    contextLength: 64000,
    capabilities: ["code", "math", "reasoning", "analysis", "generation"],
    isLocal: true,
    isCloud: true,
    isFree: true,
    endpoint: "ollama run deepseek-v3.2:cloud",
  },
];

export const CLOUD_MODELS: AIModel[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "OpenAI's most capable multimodal model",
    contextLength: 128000,
    capabilities: ["general", "code", "vision", "tool-calling", "multimodal"],
    isCloud: true,
    apiKeyRequired: true,
  },
  {
    id: "claude-opus-4-5",
    name: "Claude Opus 4.5",
    provider: "anthropic",
    description: "Anthropic's most powerful model for complex tasks",
    contextLength: 200000,
    capabilities: ["general", "code", "analysis", "tool-calling"],
    isCloud: true,
    apiKeyRequired: true,
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    description: "Google's fast and capable multimodal model",
    contextLength: 1000000,
    capabilities: ["general", "code", "vision", "multimodal", "tool-calling"],
    isCloud: true,
    apiKeyRequired: true,
  },
  {
    id: "mistral-large-latest",
    name: "Mistral Large",
    provider: "mistral",
    description: "Mistral's top-tier model via API",
    contextLength: 128000,
    capabilities: ["general", "code", "multilingual", "tool-calling"],
    isCloud: true,
    apiKeyRequired: true,
  },
];

export const ALL_MODELS = [...PRE_INSTALLED_MODELS, ...CLOUD_MODELS];

export const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.95,
  topK: 40,
  presencePenalty: 0,
  frequencyPenalty: 0,
  stream: true,
  tools: false,
  multimodal: false,
};
