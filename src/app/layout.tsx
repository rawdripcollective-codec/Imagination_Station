import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Imagination Station — AI Writing Platform",
  description:
    "Full-stack AI writing assistant with multi-model support, MCP integrations, Super Computer mode, and a powerful AI playground. Powered by Kimi K2, Mistral Large 3, and DeepSeek V3.2.",
  keywords: ["AI", "writing assistant", "Ollama", "MCP", "GPT-4", "Claude", "Imagination Station"],
  openGraph: {
    title: "Imagination Station — AI Writing Platform",
    description: "The most powerful AI writing platform with local and cloud model support.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
