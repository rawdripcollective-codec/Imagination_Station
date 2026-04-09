import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const mcpUrl = process.env.MCP_SERVER_URL || "http://localhost:3100";

  try {
    const response = await fetch(`${mcpUrl}/tools`, {
      headers: {
        Authorization: `Bearer ${process.env.MCP_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return NextResponse.json({
        status: "disconnected",
        tools: getDefaultMCPTools(),
        message: "MCP server not available - showing default tools",
      });
    }

    const data = await response.json();
    return NextResponse.json({ status: "connected", tools: data.tools || [] });
  } catch {
    return NextResponse.json({
      status: "disconnected",
      tools: getDefaultMCPTools(),
      message: "MCP server offline - demo mode active",
    });
  }
}

export async function POST(req: NextRequest) {
  const mcpUrl = process.env.MCP_SERVER_URL || "http://localhost:3100";

  try {
    const body = await req.json();
    const { tool, arguments: args } = body;

    const response = await fetch(`${mcpUrl}/tools/${tool}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MCP_API_KEY || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ arguments: args }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      return NextResponse.json(
        await simulateMCPTool(tool, args),
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json(await simulateMCPTool(body?.tool, body?.arguments));
  }
}

function getDefaultMCPTools() {
  return [
    {
      name: "web_search",
      description: "Search the web for real-time information",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
          limit: {
            type: "number",
            description: "Number of results",
            default: 5,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "web_scrape",
      description: "Scrape content from a URL",
      inputSchema: {
        type: "object",
        properties: {
          url: { type: "string", description: "URL to scrape" },
          selector: {
            type: "string",
            description: "CSS selector for specific content",
          },
        },
        required: ["url"],
      },
    },
    {
      name: "code_execute",
      description: "Execute code in a sandboxed environment",
      inputSchema: {
        type: "object",
        properties: {
          code: { type: "string", description: "Code to execute" },
          language: {
            type: "string",
            description: "Programming language",
            enum: ["python", "javascript", "typescript", "bash"],
          },
        },
        required: ["code", "language"],
      },
    },
    {
      name: "file_read",
      description: "Read file contents",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
        },
        required: ["path"],
      },
    },
    {
      name: "file_write",
      description: "Write content to a file",
      inputSchema: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path" },
          content: { type: "string", description: "File content" },
        },
        required: ["path", "content"],
      },
    },
    {
      name: "database_query",
      description: "Execute a database query",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "SQL query" },
          database: { type: "string", description: "Database name" },
        },
        required: ["query"],
      },
    },
  ];
}

async function simulateMCPTool(
  tool: string,
  args: Record<string, unknown>
): Promise<{ result: unknown; simulated: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const simulations: Record<string, unknown> = {
    web_search: {
      results: [
        {
          title: `Search results for: ${args?.query || "query"}`,
          url: "https://example.com",
          snippet: "This is a simulated search result from the MCP demo mode.",
        },
        {
          title: "AI Technology News 2026",
          url: "https://ai-news.example.com",
          snippet: "Latest developments in AI including multimodal models and agentic systems.",
        },
      ],
    },
    web_scrape: {
      url: args?.url,
      content:
        "Simulated web content from MCP server. Connect to a live MCP server for real scraping.",
      title: "Simulated Page",
      links: [],
    },
    code_execute: {
      output: `Simulated execution of ${args?.language || "code"}:\n\nHello from MCP sandbox!`,
      exitCode: 0,
      executionTime: "42ms",
    },
    file_read: {
      path: args?.path,
      content: "Simulated file content",
      size: 100,
    },
    file_write: {
      path: args?.path,
      success: true,
      bytesWritten: String(args?.content || "").length,
    },
    database_query: {
      rows: [{ id: 1, name: "Example Row", created_at: new Date().toISOString() }],
      rowCount: 1,
    },
  };

  return {
    result: simulations[tool] || { message: "Tool executed successfully" },
    simulated: true,
  };
}
