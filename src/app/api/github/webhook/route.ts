import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * GitHub App Webhook receiver.
 *
 * GitHub sends POST requests here for every subscribed event listed in
 * app.yml.  We verify the HMAC-SHA256 signature using
 * GITHUB_APP_WEBHOOK_SECRET before processing the payload.
 *
 * Docs: https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // Webhook secret not yet configured — return 200 so GitHub doesn't retry
    return NextResponse.json(
      { message: "Webhook received (secret not configured)" },
      { status: 200 }
    );
  }

  // Verify signature
  const signature = request.headers.get("x-hub-signature-256");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 401 });
  }

  const expectedSignature =
    "sha256=" +
    createHmac("sha256", webhookSecret).update(body).digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  const payload = JSON.parse(body);

  // Log the event (replace with your own processing logic)
  console.log(`[GitHub Webhook] ${event}`, {
    action: payload.action,
    repository: payload.repository?.full_name,
    sender: payload.sender?.login,
  });

  return NextResponse.json({ message: "OK" }, { status: 200 });
}
