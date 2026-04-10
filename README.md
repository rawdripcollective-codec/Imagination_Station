# 🚀 Imagination Station

> **The Ultimate AI-Powered Full Stack Platform** — A feature-rich AI playground, writing assistant SaaS, and cloud computing hub powered by frontier AI models.

[![CI/CD](https://github.com/rawdripcollective-codec/Imagination_Station/actions/workflows/ci.yml/badge.svg)](https://github.com/rawdripcollective-codec/Imagination_Station/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rawdripcollective-codec/Imagination_Station)

---

## 📖 Overview

**Imagination Station** is a production-ready, open-source AI platform that brings the power of the world's most capable large language models (LLMs) directly to your browser — with zero friction. Whether you're an independent developer prototyping AI-driven features, a content creator automating writing workflows, a data scientist orchestrating large-scale compute jobs, or a business team evaluating multiple AI providers, Imagination Station delivers a unified, polished experience in a single application.

At its core, the platform is built around four pillars:

1. **AI Playground** — A full-featured multi-model chat interface supporting both free local models (via Ollama) and premium cloud models (OpenAI, Anthropic, Google, Mistral). Every conversation is streamed in real time, sessions are persisted locally in the browser, and every generation parameter is fully tunable.

2. **Super Computer Mode** — A cloud-compute orchestration layer that lets you dispatch heavyweight AI workloads — batch inference, distributed model training, large-scale web scraping, and dataset analysis — across AWS, GCP, and Azure. A built-in task queue with live progress tracking and cost estimation keeps you in control at every step.

3. **MCP Integration** — A first-class implementation of the open [Model Context Protocol (MCP)](https://modelcontextprotocol.io), enabling AI models to invoke external tools such as web search, web scraping, code execution, file I/O, and database queries. Bring your own MCP servers or use the built-in defaults.

4. **SaaS Landing Page** — A polished, production-quality marketing site included out of the box, complete with a live AI demo, animated hero section, four-tier pricing, a competitor comparison matrix, user testimonials, an FAQ accordion, and an AI-powered support chatbot — all rendered server-side for maximum SEO performance.

The entire application is written in **TypeScript** on **Next.js 16** with the App Router, styled with **Tailwind CSS v4**, and powered by a **Zustand** store that persists the last 50 chat sessions and all user settings to `localStorage`. It ships with security hardening via Next.js middleware (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, and more) and is designed to deploy to **Vercel** in under two minutes.

---

## ✨ Features

### 🤖 AI Playground

The AI Playground is the heart of Imagination Station — a ChatGPT-style conversational interface that goes well beyond a simple chat window.

- **Multi-model selection** — Switch between any supported model at the start of a new conversation. The model picker groups pre-installed local models and cloud API models, and surfaces any custom models you have registered in Settings.
- **Pre-installed free models (via Ollama)** — Three powerful models run locally at no cost:
  - **Kimi K2 Thinking** (131 k-token context) — MoonShot's advanced reasoning model optimised for multi-step problem solving, code, and mathematics.
  - **Mistral Large 3 675B** (128 k-token context) — Mistral's flagship parameter-dense model; state-of-the-art for multilingual tasks and code generation.
  - **DeepSeek V3.2** (64 k-token context) — DeepSeek's latest release with breakthrough performance on coding, maths, and reasoning benchmarks.
- **Cloud API models (API key required)** — GPT-4o (OpenAI, 128 k), Claude Opus 4.5 (Anthropic, 200 k), Gemini 2.0 Flash (Google, 1 M), and Mistral Large (Mistral API, 128 k).
- **Real-time streaming** — Responses arrive token-by-token via Server-Sent Events so you see output as the model generates it, with no waiting for the full completion.
- **Tool calling** — Enable structured function/tool calls so the model can invoke MCP tools or built-in capabilities mid-conversation.
- **Multimodal input** — Toggle multimodal mode for models that support image and file inputs.
- **Persistent sessions** — Every conversation is saved as a named `ChatSession` in Zustand persisted storage. Sessions auto-title themselves from the first user message and are listed in the sidebar for instant recall. Up to 50 sessions are retained.
- **Per-session settings** — Each conversation carries its own `ModelSettings` snapshot: temperature (default 0.7), max tokens (default 4 096), top-P (default 0.95), top-K, presence penalty, and frequency penalty — all independently tunable without affecting other sessions.
- **Markdown rendering** — Assistant messages are rendered as rich Markdown (code blocks with syntax highlighting via `highlight.js`, tables, bold/italic, etc.).
- **Copy-to-clipboard** — Every assistant message has a one-click copy button that flashes a confirmation checkmark.
- **System prompt** — Set a persistent system prompt per session to give the model a persona or domain-specific instructions.

### ⚡ Super Computer Mode

Super Computer Mode exposes a cloud-compute orchestration dashboard for AI tasks that exceed what a single inference call can handle.

- **Cloud providers** — Dispatch tasks to **AWS**, **GCP**, or **Azure** directly from the UI. Each provider is abstracted behind a unified task API so you can switch infrastructure without changing your workflow.
- **Task types**:
  - *Batch Inference* — Run thousands of prompts in parallel against any supported model.
  - *Model Training* — Fine-tune or fully train models on custom datasets.
  - *Web Scraping* — Orchestrate large-scale, distributed web data collection jobs.
  - *Data Analysis* — Process and analyse multi-gigabyte datasets using cloud compute.
  - *Batch Generation* — Generate structured content (documents, synthetic data, embeddings) at scale.
- **Real-time resource monitor** — Live CPU, memory, and GPU utilisation gauges update as tasks run.
- **Task queue with live progress** — Each task entry shows its current status (`pending → running → completed / failed`), percentage complete, elapsed time, and estimated cost before dispatch.
- **Cost estimation** — Before a job is submitted, the UI calculates and displays the projected cloud spend based on selected instance type and task duration.

### 🔌 MCP Server Integration

Imagination Station is one of the first full-stack applications to ship a complete **Model Context Protocol** client implementation.

- **Protocol-native tool execution** — Any MCP-compatible tool server can be connected via URL and an optional API key. The app discovers available tools from the server's `tools/list` endpoint and makes them available to the AI Playground.
- **Built-in tool library**:
  - `web_search` — Query the live web and inject results into the model context.
  - `web_scrape` — Fetch and parse the content of any URL.
  - `code_execute` — Run code snippets in a sandboxed environment and return output.
  - `file_io` — Read and write files on the MCP server host.
  - `database_query` — Execute SQL queries against connected databases.
- **Multi-server support** — Register and manage multiple MCP servers simultaneously. Each server entry shows connection status (`connected / disconnected / error`) and the full list of tools it exposes.
- **Live tool results** — Tool call inputs and outputs are surfaced inline in the chat transcript so you can follow the model's reasoning and the raw tool responses in context.
- **Custom server registration** — Any server conforming to the MCP spec can be added from the Settings panel without code changes.

### 🎨 AI Writing Assistant Landing Page

The landing page doubles as a complete SaaS marketing site that you can customise and ship as your own product:

- **Animated hero section** — Gradient headline animations, a live typing effect, and CTAs that scroll smoothly to the demo section.
- **Live AI demo** — Visitors can try the AI before signing up using curated sample prompts (blog intros, professional emails, creative headlines, healthcare summaries). Results stream in real time directly on the landing page via the same `/api/chat` endpoint used by the full app.
- **Feature highlights** — Icon-based cards covering the platform's core capabilities with concise benefit-oriented copy.
- **Four-tier pricing** — Starter (free), Pro ($29/mo), Team ($79/mo), and Enterprise (custom). Each tier lists included features with check marks and a prominent CTA. Selecting "Starter" drops the visitor straight into the app.
- **Competitor comparison table** — Side-by-side feature matrix positioning Imagination Station against competing AI tools.
- **Testimonials carousel** — Social proof from a pool of 150 K+ users with star ratings and role/company attribution.
- **FAQ accordion** — Expandable question-and-answer sections that reduce support load.
- **AI-powered support chatbot** — A floating chat widget in the bottom-right corner connects to the same `/api/chat` backend and is pre-primed with a system prompt describing the platform. Visitors get instant answers without leaving the page.
- **Footer** — Links to product, company, legal, and social channels.

### ⚙️ Settings & Configuration

The Settings panel gives you granular control over every aspect of the platform:

- **Default model** — Choose which model is pre-selected when you open a new conversation.
- **Model parameters** — Globally adjust temperature, max tokens, top-P, top-K, presence penalty, and frequency penalty. Per-session overrides take precedence.
- **API key management** — Store your OpenAI, Anthropic, Google (Gemini), and Mistral API keys. Keys are kept exclusively in `localStorage` and are never transmitted to any intermediate server.
- **Custom model registration** — Add any Ollama model or remote API endpoint as a named model entry. Fields include model ID, display name, provider, context length, and capabilities.
- **Ollama URL** — Override the default `http://localhost:11434` Ollama base URL to point at a remote or containerised Ollama instance.
- **MCP server management** — Add, edit, and remove MCP server connections (URL + optional API key). Connection status is shown live.
- **Theme** — Choose between dark, light, or system-default colour scheme. Powered by `next-themes`.
- **Streaming toggle** — Disable token streaming for environments that cannot handle SSE (e.g., certain corporate proxies).
- **Debug mode** — Enable verbose logging in the browser console for API request/response tracing and error diagnostics.
- **Security dashboard** — Summarises active security headers and key-storage hygiene status.

---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | Server components, API routes, middleware |
| Language | TypeScript 5 | Strict mode throughout |
| Styling | Tailwind CSS v4 | JIT, custom design tokens |
| Component library | Radix UI primitives | Dialog, Select, Switch, Slider, Tabs, Toast, … |
| Animations | Framer Motion 12 | Page transitions, gradient animations |
| Icons | Lucide React | Consistent SVG icon set |
| State management | Zustand 5 + `persist` middleware | Browser `localStorage`, last 50 sessions |
| AI SDK | Vercel AI SDK 6 | Streaming, tool calling, multi-provider |
| AI providers | OpenAI, Anthropic, Google, Mistral | Via `@ai-sdk/*` adapters |
| Local AI runtime | Ollama | Free, private, on-device inference |
| Markdown rendering | `react-markdown` + `highlight.js` | Code syntax highlighting |
| Deployment | Vercel | Edge network, zero-config |
| CI/CD | GitHub Actions + GitLab CI | Lint → build → deploy pipeline |

---

## ��️ Architecture

```
Browser
  │
  ├─ Landing Page (SSR/CSR hybrid)
  │    ├─ Hero, Features, LiveDemo, Pricing, Comparison, Testimonials, FAQ, CTA, Footer
  │    └─ LandingChatbot (floating widget → /api/chat)
  │
  └─ App Shell (CSR)
       ├─ Sidebar (view switcher: Playground / SuperComputer / MCP / Settings)
       ├─ AIPlayground   ──── /api/chat  ──────────────────────────────────────┐
       ├─ SuperComputerMode ─ /api/supercomputer ───────── Cloud (AWS/GCP/Azure)
       ├─ MCPIntegration ──── /api/mcp  ──────────────────── MCP Server(s)
       └─ SettingsPanel  (client-only, persisted to localStorage)             │
                                                                               │
Next.js API Routes (Edge/Node)                                                 │
  ├─ /api/chat        → Vercel AI SDK → OpenAI / Anthropic / Google / Ollama ◄┘
  ├─ /api/ollama      → Ollama REST API (model list, pull, delete)
  ├─ /api/mcp         → MCP Server proxy (tools/list, tools/call)
  ├─ /api/supercomputer → Cloud task dispatch + status polling
  └─ /api/github      → GitHub integration utilities

Security Middleware (Next.js Edge)
  └─ CSP, HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection,
     Referrer-Policy, Permissions-Policy, frame-ancestors: none
```

### Data Flow — Chat Message

1. User types a message and presses **Send** in `AIPlayground`.
2. The component calls `POST /api/chat` with the conversation history, selected model ID, model settings, and any active tool definitions.
3. The API route resolves the correct Vercel AI SDK provider adapter (OpenAI, Anthropic, Google, Mistral, or Ollama) and initiates a streaming generation request.
4. Tokens are streamed back to the client via the Vercel AI SDK's `StreamingTextResponse`. The frontend progressively appends each chunk to the assistant message bubble.
5. Once the stream closes, the complete message (including any tool calls and tool results) is committed to the active `ChatSession` in Zustand and persisted to `localStorage`.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** and **npm 10+**
- (Optional) [Ollama](https://ollama.ai) for running free local models

### Installation

```bash
# Clone repository
git clone https://github.com/rawdripcollective-codec/Imagination_Station.git
cd Imagination_Station

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local — add your API keys (see Environment Variables section below)

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page loads by default; click **Try Live Demo** or **Open Full App** to enter the AI Playground.

### Ollama Setup (Free Local Models)

```bash
# 1. Install the Ollama runtime
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull the pre-configured models
ollama pull kimi-k2-thinking:cloud
ollama pull mistral-large-3:675b-cloud
ollama pull deepseek-v3.2:cloud

# 3. (Ollama starts automatically; verify it's running)
curl http://localhost:11434/api/tags
```

Once Ollama is running, the three free models appear immediately in the model picker — no API keys required.

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and populate the values you need:

```env
# ── Cloud AI Providers (API keys, required only for cloud models) ──
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=AI...
MISTRAL_API_KEY=...

# ── Ollama (local model runtime) ──────────────────────────────────
OLLAMA_BASE_URL=http://localhost:11434          # default
NEXT_PUBLIC_OLLAMA_BASE_URL=http://localhost:11434

# ── MCP Server (optional) ─────────────────────────────────────────
MCP_SERVER_URL=http://localhost:3100

# ── GitHub Integration (optional) ─────────────────────────────────
GITHUB_TOKEN=ghp_...
```

> **Security note:** API keys entered in the Settings panel UI are stored only in browser `localStorage` and are passed directly from the client to the Next.js API route — they are never logged or stored server-side.

See `.env.example` for the complete list of supported variables.

---

## 📦 Deployment

### Vercel (Recommended — one-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rawdripcollective-codec/Imagination_Station)

Or deploy via CLI:

```bash
npm i -g vercel
vercel --prod
```

Add your environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

### Self-hosting (Docker / Node)

```bash
npm run build
npm run start          # listens on PORT (default 3000)
```

The built application is a standard Next.js output and can be hosted behind any Node-compatible reverse proxy (nginx, Caddy, etc.).

---

## 🔒 Security

Imagination Station ships with a defence-in-depth security posture:

| Control | Implementation |
|---------|---------------|
| Content Security Policy | `default-src 'self'`; whitelisted CDNs for fonts; explicit allowlist for AI provider APIs |
| HSTS | `max-age=31536000; includeSubDomains` |
| Clickjacking protection | `X-Frame-Options: SAMEORIGIN` + `frame-ancestors: none` in CSP |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| XSS filter | `X-XSS-Protection: 1; mode=block` |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` |
| Permissions | `camera=(), microphone=(), geolocation=()` disabled by default |
| API key handling | Keys stored in `localStorage` only; never transmitted to intermediate servers |
| Input sanitisation | All user-supplied strings sanitised before inclusion in API payloads |
| Rate limiting | Applied at the Next.js API route level on all `/api/*` endpoints |
| Scheduled security scans | Automated scans run twice daily (00:00 and 12:00 UTC) via GitHub Actions |

All headers are injected by a lightweight Next.js Edge Middleware (`src/middleware.ts`) with a path matcher that excludes static assets, ensuring zero performance overhead on image and font requests.

---

## 🗂️ Project Structure

```
imagination-station/
├── public/                        # Static assets (favicon, OG images, …)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/              # Multi-provider AI chat endpoint (streaming)
│   │   │   ├── github/            # GitHub integration utilities
│   │   │   ├── mcp/               # MCP server proxy (tools/list + tools/call)
│   │   │   ├── ollama/            # Ollama model management (list, pull, delete)
│   │   │   └── supercomputer/     # Cloud compute task dispatch + status
│   │   ├── layout.tsx             # Root layout (metadata, ThemeProvider)
│   │   └── page.tsx               # App shell — landing page gate + view router
│   │
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIPlayground.tsx   # Multi-model chat UI with session management
│   │   │   ├── MCPIntegration.tsx # MCP server manager + tool execution UI
│   │   │   └── SuperComputerMode.tsx # Cloud compute dashboard
│   │   ├── landing/
│   │   │   └── LandingPage.tsx    # Full SaaS marketing site (Hero → Footer)
│   │   ├── layout/
│   │   │   └── Sidebar.tsx        # Collapsible navigation sidebar
│   │   ├── settings/
│   │   │   └── SettingsPanel.tsx  # Global settings (models, keys, theme, MCP)
│   │   └── ui/                    # Primitive UI components (Button, Badge, Card, …)
│   │
│   ├── lib/
│   │   ├── models.ts              # PRE_INSTALLED_MODELS, CLOUD_MODELS, defaults
│   │   └── utils.ts               # generateId(), cn() class merge helpers
│   │
│   ├── store/
│   │   └── appStore.ts            # Zustand store (settings, sessions, UI state)
│   │
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces & types
│   │
│   └── middleware.ts              # Next.js Edge Middleware — security headers
│
├── .env.example                   # Environment variable template
├── .github/                       # GitHub Actions CI/CD workflows
├── .gitlab-ci.yml                 # GitLab CI pipeline
├── next.config.ts                 # Next.js configuration
├── tailwind.config (inline)       # Tailwind CSS v4 configuration
├── tsconfig.json                  # TypeScript compiler options
└── vercel.json                    # Vercel deployment configuration
```

---

## 📋 Supported AI Models

### Pre-installed (Free — requires Ollama)

| Model | Provider | Context Window | Strengths |
|-------|----------|---------------|-----------|
| **Kimi K2 Thinking** | MoonShot AI via Ollama | 131 072 tokens | Extended reasoning, multi-step problem solving, maths, code |
| **Mistral Large 3 (675B)** | Mistral AI via Ollama | 128 000 tokens | Multilingual, code generation, instruction following |
| **DeepSeek V3.2** | DeepSeek via Ollama | 64 000 tokens | Coding, maths, logical reasoning, data analysis |

### Cloud Models (API key required)

| Model | Provider | Context Window | Strengths |
|-------|----------|---------------|-----------|
| **GPT-4o** | OpenAI | 128 000 tokens | Multimodal (text + vision), tool calling, broad general capability |
| **Claude Opus 4.5** | Anthropic | 200 000 tokens | Long-context analysis, nuanced writing, safety-aligned |
| **Gemini 2.0 Flash** | Google DeepMind | 1 000 000 tokens | Largest context window, multimodal, real-time data |
| **Mistral Large** | Mistral AI (API) | 128 000 tokens | European data residency, multilingual, efficient |

### Custom Models

Register any Ollama model or OpenAI-compatible API endpoint in **Settings → Custom Models** to add it to the picker without modifying source code.

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server with hot-reload |
| `npm run build` | Compile and optimise the production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across the entire codebase |

---

## 🤝 Contributing

We welcome contributions of all sizes — from typo fixes to new model integrations.

1. **Fork** the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the existing TypeScript and component conventions.
3. **Lint** before committing:
   ```bash
   npm run lint
   ```
4. **Commit** with a descriptive message:
   ```bash
   git commit -m 'feat: add support for XYZ model'
   ```
5. **Push** to your fork and **open a Pull Request** against `main`.

Please open an issue first for significant feature proposals so we can discuss the approach before you invest time building it.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details. You are free to use, modify, and distribute this software for personal and commercial purposes.

---

## 🔗 Links

- **GitHub**: https://github.com/rawdripcollective-codec/Imagination_Station
- **Deploy to Vercel**: Use the button at the top of this README
- **Ollama**: https://ollama.ai
- **Model Context Protocol**: https://modelcontextprotocol.io
- **Vercel AI SDK**: https://sdk.vercel.ai
- **Next.js**: https://nextjs.org
