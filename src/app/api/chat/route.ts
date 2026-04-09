import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model, settings } = body;

    const ollamaUrl =
      process.env.OLLAMA_BASE_URL || "http://localhost:11434";

    const isOllamaModel =
      model?.includes("kimi") ||
      model?.includes("mistral") ||
      model?.includes("deepseek") ||
      model?.includes(":cloud") ||
      model?.startsWith("ollama:");

    if (isOllamaModel) {
      const cleanModel = model
        .replace("ollama:", "")
        .replace(":cloud", "")
        .replace("mcp://ollama/run/", "");

      const ollamaMessages = messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })
      );

      const response = await fetch(`${ollamaUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: cleanModel,
          messages: ollamaMessages,
          stream: false,
          options: {
            temperature: settings?.temperature ?? 0.7,
            top_p: settings?.topP ?? 0.95,
            num_predict: settings?.maxTokens ?? 4096,
          },
        }),
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          {
            error: "Ollama inference failed",
            details: errorText,
            fallback: true,
          },
          { status: 500 }
        );
      }

      const data = await response.json();
      return NextResponse.json({
        content: data.message?.content || "",
        model,
        usage: {
          prompt_tokens: data.prompt_eval_count || 0,
          completion_tokens: data.eval_count || 0,
        },
      });
    }

    // Cloud model routing
    if (model?.startsWith("gpt") || model?.includes("openai")) {
      return await routeToOpenAI(messages, model, settings);
    }

    if (model?.startsWith("claude") || model?.includes("anthropic")) {
      return await routeToAnthropic(messages, model, settings);
    }

    if (model?.startsWith("gemini") || model?.includes("google")) {
      return await routeToGemini(messages, model, settings);
    }

    // Default demo response
    return NextResponse.json({
      content: generateDemoResponse(messages),
      model,
      usage: { prompt_tokens: 50, completion_tokens: 100 },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Chat failed", details: String(error) },
      { status: 500 }
    );
  }
}

async function routeToOpenAI(
  messages: Array<{ role: string; content: string }>,
  model: string,
  settings: Record<string, number>
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 400 }
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: settings?.temperature ?? 0.7,
      max_tokens: settings?.maxTokens ?? 4096,
      top_p: settings?.topP ?? 0.95,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: "OpenAI error", details: err }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({
    content: data.choices[0]?.message?.content || "",
    model,
    usage: data.usage,
  });
}

async function routeToAnthropic(
  messages: Array<{ role: string; content: string }>,
  model: string,
  settings: Record<string, number>
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Anthropic API key not configured" },
      { status: 400 }
    );
  }

  const systemMessage = messages.find((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      system: systemMessage?.content,
      max_tokens: settings?.maxTokens ?? 4096,
      temperature: settings?.temperature ?? 0.7,
    }),
    signal: AbortSignal.timeout(60000),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: "Anthropic error", details: err }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({
    content: data.content[0]?.text || "",
    model,
    usage: data.usage,
  });
}

async function routeToGemini(
  messages: Array<{ role: string; content: string }>,
  model: string,
  settings: Record<string, number>
) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google AI API key not configured" },
      { status: 400 }
    );
  }

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: settings?.temperature ?? 0.7,
          maxOutputTokens: settings?.maxTokens ?? 4096,
          topP: settings?.topP ?? 0.95,
        },
      }),
      signal: AbortSignal.timeout(60000),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: "Gemini error", details: err }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({
    content: data.candidates[0]?.content?.parts[0]?.text || "",
    model,
    usage: data.usageMetadata,
  });
}

function generateDemoResponse(
  messages: Array<{ role: string; content: string }>
): string {
  const lastMessage = messages[messages.length - 1];
  const content = lastMessage?.content?.toLowerCase() || "";

  if (content.includes("hello") || content.includes("hi")) {
    return "Hello! I'm **Imagination Station AI**, your intelligent assistant. I'm powered by advanced AI models including Kimi K2 Thinking, Mistral Large 3, and DeepSeek V3.2. How can I help you today?";
  }

  if (content.includes("code") || content.includes("function")) {
    return "```python\ndef hello_world():\n    print('Hello from Imagination Station!')\n    return 'AI-powered code generation ready'\n\nhello_world()\n```\n\nI can generate code in any programming language with full context understanding.";
  }

  if (content.includes("write") || content.includes("essay") || content.includes("article")) {
    return "## AI Writing Assistant\n\nI can help you write **compelling content** across any format:\n\n- 📝 **Blog posts & articles** with SEO optimization\n- 📧 **Emails & communications** that convert\n- 📚 **Long-form content** with structured narratives\n- 🎯 **Marketing copy** that resonates\n\nWhat would you like me to write for you?";
  }

  return `I understand your request: *"${lastMessage?.content?.slice(0, 100) || "..."}"*\n\n**Imagination Station** is processing this with our ensemble of frontier AI models. For the full AI experience, configure your API keys in the Settings panel or connect to your local Ollama instance.\n\nCapabilities include:\n- 🤖 Multi-model AI routing\n- 🔧 Tool calling & function execution\n- 🌐 Web scraping & real-time data\n- 💻 Code generation & analysis\n- 🖼️ Multimodal (vision + text)`;
}
