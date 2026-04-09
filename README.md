# 🚀 Imagination Station

> **The Ultimate AI-Powered Full Stack Platform** — A feature-rich AI playground, writing assistant SaaS, and cloud computing hub powered by frontier AI models.

[![CI/CD](https://github.com/rawdripcollective-codec/Imagination_Station/actions/workflows/ci.yml/badge.svg)](https://github.com/rawdripcollective-codec/Imagination_Station/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rawdripcollective-codec/Imagination_Station)

---

## ✨ Features

### 🤖 AI Playground
- Multi-model AI chat with **Kimi K2 Thinking**, **Mistral Large 3 (675B)**, **DeepSeek V3.2** (pre-installed, free via Ollama)
- Cloud models: GPT-4o, Claude Opus 4.5, Gemini 2.0 Flash, Mistral Large API
- Real-time streaming, tool calling, multimodal support
- Persistent conversation history with session management
- Customizable model parameters (temperature, max tokens, top-p, etc.)

### ⚡ Super Computer Mode
- Cloud-scale AI operations on **AWS**, **GCP**, **Azure**
- Batch inference, distributed training, large-scale web scraping
- Real-time resource monitoring (CPU, Memory, GPU)
- Task queue with live progress tracking and cost estimation

### �� MCP Server Integration
- Full **Model Context Protocol** support
- Built-in tools: web search, web scraping, code execution, file I/O, database queries
- Connect custom MCP servers via URL
- Tool execution with live results

### 🎨 AI Writing Assistant Landing Page
- Hero section with animated gradients
- Live demo with real AI generation
- Pricing tiers (Starter/Pro/Team/Enterprise)
- Competitor comparison table
- Testimonials from 150K+ users
- Built-in support chatbot
- FAQ section

### ⚙️ Settings & Configuration
- Full model customization (temperature, max tokens, top-P, etc.)
- Custom model registration (any Ollama or API model)
- API key management (OpenAI, Anthropic, Google, Mistral)
- MCP server management
- Theme (dark/light/system)
- Debug mode toggle
- Security dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| State | Zustand (with persistence) |
| Local AI | Ollama |
| Deployment | Vercel |
| CI/CD | GitHub Actions + GitLab CI |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- (Optional) [Ollama](https://ollama.ai) for local models

### Installation

```bash
# Clone repository
git clone https://github.com/rawdripcollective-codec/Imagination_Station.git
cd Imagination_Station

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Ollama Setup (Free Models)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull pre-installed models
mcp://ollama/run/kimi-k2-thinking:cloud
ollama run mistral-large-3:675b-cloud
ollama run deepseek-v3.2:cloud
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Required for cloud models
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Ollama (defaults to localhost)
OLLAMA_BASE_URL=http://localhost:11434

# MCP Server (optional)
MCP_SERVER_URL=http://localhost:3100
```

See `.env.example` for full list of supported variables.

---

## 📦 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

---

## 🔒 Security

- **Scheduled scans**: 2x/day (12:00 AM and 12:00 PM UTC)
- Security headers via Next.js middleware (CSP, HSTS, X-Frame-Options, etc.)
- API keys stored client-side only (never sent to servers)
- Input sanitization on all user inputs
- Rate limiting on all API routes

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/          # Multi-model AI chat endpoint
│   │   ├── ollama/        # Ollama model management
│   │   ├── mcp/           # MCP server proxy
│   │   └── supercomputer/ # Cloud compute tasks
│   ├── layout.tsx
│   └── page.tsx           # Landing page + app shell
├── components/
│   ├── ai/                # AI Playground, SuperComputer, MCP
│   ├── landing/           # SaaS landing page
│   ├── layout/            # Sidebar navigation
│   ├── settings/          # Settings panel
│   └── ui/                # Reusable UI components
├── lib/
│   ├── models.ts          # AI model definitions
│   └── utils.ts
├── store/
│   └── appStore.ts        # Zustand global state
├── types/
│   └── index.ts           # TypeScript types
└── middleware.ts          # Security headers
```

---

## 📋 Pre-installed AI Models

| Model | Provider | Context | Free |
|-------|----------|---------|------|
| Kimi K2 Thinking | Ollama/MoonShot | 131k | ✅ |
| Mistral Large 3 (675B) | Ollama/Mistral | 128k | ✅ |
| DeepSeek V3.2 | Ollama/DeepSeek | 64k | ✅ |
| GPT-4o | OpenAI | 128k | API Key |
| Claude Opus 4.5 | Anthropic | 200k | API Key |
| Gemini 2.0 Flash | Google | 1M | API Key |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **GitHub**: https://github.com/rawdripcollective-codec/Imagination_Station
- **Vercel**: Deploy with the button above
- **Ollama**: https://ollama.ai
- **MCP Protocol**: https://modelcontextprotocol.io
