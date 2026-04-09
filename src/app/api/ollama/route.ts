import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const ollamaUrl =
    process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, {
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Ollama server not available", models: [] },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ models: data.models || [], status: "connected" });
  } catch {
    return NextResponse.json(
      { error: "Cannot connect to Ollama", models: [], status: "disconnected" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ollamaUrl =
    process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  try {
    const body = await req.json();
    const { action, model } = body;

    if (action === "pull") {
      const response = await fetch(`${ollamaUrl}/api/pull`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: model, stream: false }),
        signal: AbortSignal.timeout(300000),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to pull model" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, message: `Model ${model} pulled successfully` });
    }

    if (action === "delete") {
      const response = await fetch(`${ollamaUrl}/api/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: model }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to delete model" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ollama operation failed", details: String(error) },
      { status: 500 }
    );
  }
}
