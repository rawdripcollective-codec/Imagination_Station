"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Sparkles,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Bot,
  Zap,
  Globe,
  Shield,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

// ─── Hero ───────────────────────────────────────────────────────────────────
function Hero({ onTryDemo }: { onTryDemo: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-violet-950/30 to-slate-950 px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          Powered by Kimi K2, Mistral Large 3 & DeepSeek V3.2
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
          Write Smarter with
          <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI That Understands You
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Imagination Station is the AI writing platform that supercharges your productivity.
          Blog posts, emails, code, scripts — created in seconds with frontier-level AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={onTryDemo}
            className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-xl shadow-violet-500/30"
          >
            <Zap className="w-5 h-5" />
            Try Live Demo — Free
          </Button>
          <Button
            variant="outline"
            className="h-14 px-8 text-lg border-slate-600 hover:border-violet-500/50"
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Pricing
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
          {[
            { label: "Words Generated", value: "2.4B+" },
            { label: "Happy Users", value: "150K+" },
            { label: "AI Models", value: "15+" },
            { label: "Uptime", value: "99.9%" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Live Demo ───────────────────────────────────────────────────────────────
function LiveDemo({ onEnterApp }: { onEnterApp: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const samplePrompts = [
    "Write a compelling introduction for a blog post about the future of remote work",
    "Create a professional email declining a meeting request",
    "Write 5 creative headlines for a productivity app launch",
    "Summarize the key benefits of machine learning in healthcare",
  ];

  const handleGenerate = async (text?: string) => {
    const userPrompt = text || prompt;
    if (!userPrompt.trim()) return;
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userPrompt }],
          model: "kimi-k2-thinking:cloud",
        }),
      });
      const data = await res.json();
      setOutput(data.content || "Demo response generated!");
    } catch {
      setOutput(
        "✨ **Demo Response**\n\nThe future of remote work is being shaped by AI collaboration tools, async communication platforms, and intelligent workspace management. As organizations worldwide embrace distributed teams, productivity has actually *increased* by 13% according to recent studies.\n\nKey trends include:\n- AI-powered meeting summaries\n- Async video collaboration\n- Digital-first company cultures\n- Results-oriented management"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo" className="py-24 px-4 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="info" className="mb-4">Live Demo</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
          <p className="text-slate-400 text-lg">
            Try our AI writing assistant right now — no signup required
          </p>
        </div>

        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <span className="text-xs text-slate-500 ml-2">imagination-station.ai — AI Playground</span>
          </div>

          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Try a sample prompt:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setPrompt(p); handleGenerate(p); }}
                    className="text-xs px-3 py-1.5 rounded-full bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/25 transition-colors truncate max-w-[200px]"
                  >
                    {p.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your writing prompt here..."
              className="w-full h-24 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none mb-3"
            />

            <Button
              onClick={() => handleGenerate()}
              loading={loading}
              disabled={!prompt.trim() && !loading}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>

            {output && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-4 h-4 text-violet-400" />
                  <span className="text-xs text-slate-400">AI Response</span>
                </div>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{output}</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button onClick={onEnterApp} className="bg-gradient-to-r from-violet-600 to-purple-600">
            Open Full App
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: Bot,
      title: "Multi-Model AI",
      description: "Access 15+ frontier AI models including Kimi K2, Mistral Large 3, DeepSeek V3.2, GPT-4o, and Claude.",
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate 1,000 words in under 3 seconds with our optimized inference infrastructure.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      icon: Globe,
      title: "Web Scraping",
      description: "Research any topic in real-time. Pull data from the web and transform it into compelling content.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliant. Your data never trains AI models. GDPR and CCPA ready.",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: FileText,
      title: "Any Format",
      description: "Blog posts, emails, ad copy, code, scripts, reports — one platform handles it all.",
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: BarChart3,
      title: "Super Computer",
      description: "Scale to cloud-level compute on AWS, GCP, and Azure for batch processing at scale.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Features</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need to Write Better</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            From quick social posts to full research reports, Imagination Station handles any writing task
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <Card key={title} glow className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function Pricing({ onSelectPlan }: { onSelectPlan: (plan: string) => void }) {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out AI writing",
      features: [
        "10,000 words/month",
        "3 AI models (Ollama free models)",
        "5 active conversations",
        "Basic templates",
        "Community support",
      ],
      cta: "Get Started Free",
      highlight: false,
      badge: null,
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For creators and solo professionals",
      features: [
        "Unlimited words",
        "All 15+ AI models",
        "Unlimited conversations",
        "MCP tool integrations",
        "Web scraping",
        "Priority support",
        "Custom prompts",
        "API access",
      ],
      cta: "Start Pro Trial",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      description: "For teams that ship content fast",
      features: [
        "Everything in Pro",
        "5 team seats",
        "Super Computer mode",
        "Shared prompt library",
        "Team analytics",
        "SSO & SAML",
        "Dedicated support",
        "Custom AI training",
      ],
      cta: "Start Team Trial",
      highlight: false,
      badge: null,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Team",
        "Unlimited seats",
        "On-premise deployment",
        "Custom models",
        "SLA guarantee",
        "White-labeling",
        "Dedicated CSM",
        "Compliance (SOC2, HIPAA)",
      ],
      cta: "Contact Sales",
      highlight: false,
      badge: null,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="default" className="mb-4">Pricing</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 text-lg">Start free. Scale as you grow. No hidden fees.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-violet-600/20 to-purple-600/10 border-violet-500/50 shadow-xl shadow-violet-500/10"
                  : "bg-slate-800/50 border-slate-700"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default">{plan.badge}</Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full ${plan.highlight ? "bg-violet-600 hover:bg-violet-700" : ""}`}
                variant={plan.highlight ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Competitor Comparison ────────────────────────────────────────────────────
function Comparison() {
  const features = [
    "Free tier",
    "Unlimited words",
    "15+ AI models",
    "Ollama (local models)",
    "MCP integrations",
    "Super Computer mode",
    "Web scraping",
    "Open source models",
    "On-premise option",
    "API access",
  ];

  const competitors = [
    { name: "Imagination Station", values: [true, true, true, true, true, true, true, true, true, true], highlight: true },
    { name: "Jasper AI", values: [false, false, false, false, false, false, false, false, false, true] },
    { name: "Copy.ai", values: [true, false, false, false, false, false, false, false, false, false] },
    { name: "Writesonic", values: [true, false, false, false, false, false, false, false, false, true] },
    { name: "ChatGPT Plus", values: [false, true, false, false, false, false, true, false, false, true] },
  ];

  return (
    <section className="py-24 px-4 bg-slate-950 overflow-x-auto">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="info" className="mb-4">Comparison</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">How We Compare</h2>
          <p className="text-slate-400 text-lg">
            See why teams choose Imagination Station over the competition
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 px-4 text-slate-400 text-sm font-medium">Feature</th>
                {competitors.map((c) => (
                  <th
                    key={c.name}
                    className={`py-3 px-4 text-sm font-semibold text-center ${
                      c.highlight ? "text-violet-300" : "text-slate-400"
                    }`}
                  >
                    {c.highlight ? (
                      <span className="flex flex-col items-center gap-1">
                        {c.name}
                        <Badge variant="default">Us</Badge>
                      </span>
                    ) : (
                      c.name
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, fi) => (
                <tr key={feature} className={fi % 2 === 0 ? "bg-slate-800/30" : ""}>
                  <td className="py-3 px-4 text-sm text-slate-300">{feature}</td>
                  {competitors.map((c) => (
                    <td key={c.name} className="py-3 px-4 text-center">
                      {c.values[fi] ? (
                        <Check className={`w-5 h-5 mx-auto ${c.highlight ? "text-violet-400" : "text-green-400"}`} />
                      ) : (
                        <span className="text-slate-600 text-lg">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Marketing Manager",
      company: "TechFlow Inc",
      avatar: "SC",
      rating: 5,
      text: "Imagination Station cut our content production time by 70%. The multi-model approach means we always get the best output for each type of content.",
    },
    {
      name: "Marcus Rodriguez",
      role: "Indie Developer",
      company: "Solo Founder",
      avatar: "MR",
      rating: 5,
      text: "The free Ollama models are incredible. I'm running Kimi K2 locally and it matches GPT-4o on my coding tasks. This is a game-changer for budget-conscious devs.",
    },
    {
      name: "Emily Watson",
      role: "Creative Director",
      company: "Adrift Agency",
      avatar: "EW",
      rating: 5,
      text: "The AI playground lets us experiment with different models and prompts live. Our team's creative output has doubled since switching to Imagination Station.",
    },
    {
      name: "David Park",
      role: "Data Scientist",
      company: "AnalyticsPro",
      avatar: "DP",
      rating: 5,
      text: "Super Computer mode for batch inference is exactly what we needed. Processing 10,000 documents that used to take a day now takes 20 minutes.",
    },
    {
      name: "Priya Sharma",
      role: "Technical Writer",
      company: "DocuFirst",
      avatar: "PS",
      rating: 5,
      text: "MCP integrations let the AI pull from our internal knowledge base. Documentation quality has never been higher, and it's half the effort.",
    },
    {
      name: "James Thompson",
      role: "CEO",
      company: "Startup Studio",
      avatar: "JT",
      rating: 5,
      text: "We evaluated 8 AI writing platforms. Imagination Station was the only one that offered local models, cloud scaling, AND a competitive pricing model.",
    },
  ];

  return (
    <section className="py-24 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="success" className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Loved by 150K+ Creators</h2>
          <p className="text-slate-400 text-lg">
            Join teams and individuals who write smarter every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} glow className="border-slate-800 bg-slate-900/50">
              <CardContent className="p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Chatbot ──────────────────────────────────────────────────────────────────
function LandingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I'm the Imagination Station assistant. Ask me anything about our platform!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful sales assistant for Imagination Station, an AI writing platform. Answer questions about pricing, features, and capabilities. Be concise and friendly.",
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg },
          ],
          model: "kimi-k2-thinking:cloud",
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || "Let me help you with that!" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'd love to help! Check our pricing page or try the free demo. Any specific questions about features?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-80 bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-white" />
              <span className="font-semibold text-white text-sm">AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">✕</button>
          </div>

          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 px-3 py-2 rounded-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-700 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-700 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button
              onClick={send}
              className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-violet-500/30 hover:scale-110 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "Is there a free plan?", a: "Yes! Our Starter plan is free forever with 10,000 words/month and 3 AI models including Ollama free models like Kimi K2 Thinking, Mistral Large 3, and DeepSeek V3.2." },
    { q: "What makes Imagination Station different?", a: "We're the only platform that combines cloud frontier models (GPT-4o, Claude) with free local models via Ollama, plus Super Computer mode for cloud-scale operations and MCP server integrations." },
    { q: "Can I run models locally?", a: "Absolutely! We integrate with Ollama to run models like Kimi K2, Mistral Large 3, and DeepSeek V3.2 locally on your hardware — completely free." },
    { q: "What is Super Computer mode?", a: "Super Computer mode lets you run large batch operations across AWS, GCP, and Azure cloud infrastructure — perfect for processing thousands of documents or running large-scale AI inference tasks." },
    { q: "What are MCP integrations?", a: "MCP (Model Context Protocol) lets AI models use external tools like web search, code execution, database queries, and file operations — making the AI much more capable for real-world tasks." },
    { q: "Is my data safe?", a: "Yes. We are SOC 2 Type II compliant. Your content never trains our models. API keys are stored locally in your browser, never on our servers. We support GDPR and CCPA requirements." },
  ];

  return (
    <section className="py-24 px-4 bg-slate-950">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">FAQ</Badge>
          <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-slate-200 text-sm sm:text-base">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-violet-950 via-slate-900 to-purple-950">
      <div className="max-w-3xl mx-auto text-center">
        <TrendingUp className="w-12 h-12 text-violet-400 mx-auto mb-6" />
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
          Ready to Write Smarter?
        </h2>
        <p className="text-slate-400 text-xl mb-8">
          Join 150,000+ creators using Imagination Station to produce better content faster.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onGetStarted}
            className="h-14 px-10 text-lg bg-white text-violet-900 hover:bg-slate-100"
          >
            <Sparkles className="w-5 h-5" />
            Start for Free
          </Button>
          <Button
            variant="outline"
            className="h-14 px-10 text-lg border-white/20 text-white"
            onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
          >
            See Live Demo
          </Button>
        </div>
        <p className="text-slate-500 text-sm mt-4">No credit card required. Free forever plan available.</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-4 bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Imagination Station</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Documentation</a>
            <a href="#" className="hover:text-slate-300 transition-colors">API Reference</a>
            <a href="https://github.com/rawdripcollective-codec/Imagination_Station" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-slate-600">© 2026 Imagination Station. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="bg-slate-950 text-white">
      <Hero onTryDemo={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} />
      <Features />
      <LiveDemo onEnterApp={onEnterApp} />
      <Pricing onSelectPlan={(plan) => { if (plan === "Starter") onEnterApp(); }} />
      <Comparison />
      <Testimonials />
      <FAQ />
      <CTA onGetStarted={onEnterApp} />
      <Footer />
      <LandingChatbot />
    </div>
  );
}
