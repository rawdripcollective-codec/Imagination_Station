"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const GITHUB_INSTALL_URL =
  process.env.NEXT_PUBLIC_GITHUB_APP_SLUG
    ? `https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG}/installations/new`
    : null;

const MANIFEST_URL =
  "https://github.com/settings/apps/new?manifest=" +
  encodeURIComponent(
    JSON.stringify({
      name: "Imagination Station",
      url: "https://imagination-station.vercel.app",
      hook_attributes: {
        url: "https://imagination-station.vercel.app/api/github/webhook",
        active: true,
      },
      redirect_url:
        "https://imagination-station.vercel.app/api/github/callback",
      callback_urls: [
        "https://imagination-station.vercel.app/api/github/callback",
      ],
      setup_url: "https://imagination-station.vercel.app/github/setup",
      setup_on_update: true,
      description:
        "The ultimate AI-powered writing and coding assistant for your repositories.",
      public: true,
      default_permissions: {
        contents: "read",
        issues: "write",
        pull_requests: "write",
        metadata: "read",
      },
      default_events: [
        "push",
        "pull_request",
        "issues",
        "issue_comment",
        "pull_request_review",
        "pull_request_review_comment",
      ],
    })
  );

function SetupContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");
  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo / Title */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🚀</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Imagination Station
          </h1>
          <p className="text-slate-400">GitHub App Setup</p>
        </div>

        {/* Success banner */}
        {success === "true" && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400 text-sm text-center">
            ✅ GitHub App installed successfully
            {installationId && (
              <span className="block mt-1 text-green-500/70 text-xs">
                Installation ID: {installationId}
                {setupAction && ` · Action: ${setupAction}`}
              </span>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm text-center">
            ⚠️ {decodeURIComponent(error)}
          </div>
        )}

        {/* Steps */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 divide-y divide-slate-800">
          {/* Step 1 */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-semibold text-slate-100">
                Register the GitHub App
              </h2>
            </div>
            <p className="text-slate-400 text-sm pl-10">
              Click the button below to create the Imagination Station GitHub
              App in your account or organisation. GitHub will pre-fill the
              settings from the manifest.
            </p>
            <div className="pl-10">
              <a
                href={MANIFEST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 transition-colors px-5 py-2.5 text-sm font-semibold text-white"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Create GitHub App
              </a>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="font-semibold text-slate-100">
                Add credentials to environment variables
              </h2>
            </div>
            <p className="text-slate-400 text-sm pl-10">
              After registration, copy the App ID, Client ID, Client Secret, and
              generate a Private Key. Add them to your{" "}
              <code className="text-violet-400 bg-slate-800 px-1 py-0.5 rounded text-xs">
                .env.local
              </code>{" "}
              (or your deployment environment):
            </p>
            <pre className="ml-10 rounded-lg bg-slate-800/80 border border-slate-700 p-4 text-xs text-slate-300 overflow-x-auto">
              {`GITHUB_APP_ID=<your-app-id>
GITHUB_APP_PRIVATE_KEY=<base64-encoded-pem>
GITHUB_APP_CLIENT_ID=<your-client-id>
GITHUB_APP_CLIENT_SECRET=<your-client-secret>
GITHUB_APP_WEBHOOK_SECRET=<random-secret>`}
            </pre>
          </div>

          {/* Step 3 */}
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 text-sm font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="font-semibold text-slate-100">
                Install the app on your repositories
              </h2>
            </div>
            <p className="text-slate-400 text-sm pl-10">
              Once the app is registered and credentials are saved, install it
              on the repositories you want Imagination Station to access.
            </p>
            <div className="pl-10">
              {GITHUB_INSTALL_URL ? (
                <a
                  href={GITHUB_INSTALL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700 transition-colors px-5 py-2.5 text-sm font-semibold text-slate-200"
                >
                  Install on GitHub →
                </a>
              ) : (
                <p className="text-slate-500 text-xs">
                  Set{" "}
                  <code className="text-violet-400 bg-slate-800 px-1 py-0.5 rounded">
                    NEXT_PUBLIC_GITHUB_APP_SLUG
                  </code>{" "}
                  in your environment variables to show the install link (e.g.{" "}
                  <code className="text-slate-400">imagination-station</code>
                  ).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to Imagination Station
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function GitHubSetupPage() {
  return (
    <Suspense>
      <SetupContent />
    </Suspense>
  );
}
