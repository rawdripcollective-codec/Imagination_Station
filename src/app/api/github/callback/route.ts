import { NextRequest, NextResponse } from "next/server";

/**
 * GitHub App OAuth callback.
 *
 * After a user installs or authorises the GitHub App, GitHub redirects here
 * with a temporary `code` that we exchange for an access token.
 *
 * Docs: https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const installationId = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");

  if (!code) {
    return NextResponse.redirect(
      new URL("/github/setup?error=missing_code", request.url)
    );
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // App credentials not yet configured — redirect to setup instructions
    const params = new URLSearchParams({
      installation_id: installationId ?? "",
      setup_action: setupAction ?? "",
    });
    return NextResponse.redirect(
      new URL(`/github/setup?${params.toString()}`, request.url)
    );
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.redirect(
        new URL(
          `/github/setup?error=${encodeURIComponent(tokenData.error_description ?? tokenData.error)}`,
          request.url
        )
      );
    }

    // Successful — redirect to the setup page with the installation context
    const params = new URLSearchParams({
      installation_id: installationId ?? "",
      setup_action: setupAction ?? "install",
      success: "true",
    });
    return NextResponse.redirect(
      new URL(`/github/setup?${params.toString()}`, request.url)
    );
  } catch {
    return NextResponse.redirect(
      new URL("/github/setup?error=token_exchange_failed", request.url)
    );
  }
}
