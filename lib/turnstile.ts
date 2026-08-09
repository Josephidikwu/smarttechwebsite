import { getTurnstileSecretKey } from "@/lib/settings/site-settings";

/**
 * Server-side Turnstile siteverify — canonical pattern from the
 * turnstile-spin skill. Fails closed: any network error, non-2xx, or
 * malformed response is treated as a failed verification.
 *
 * Until a widget is created and the secret key is set at Settings ->
 * Integrations (admin dashboard), this no-ops (returns true) so forms stay
 * usable during early development — logged loudly so it's impossible to
 * miss switching this on before launch.
 */
export async function verifyTurnstile(token: string | null, remoteIp?: string): Promise<boolean> {
  const secret = await getTurnstileSecretKey();

  if (!secret) {
    console.warn(
      "[turnstile] No secret key configured — skipping verification. " +
        "Set it up at Settings -> Integrations before launch.",
    );
    return true;
  }

  if (!token || token.length === 0 || token.length > 2048) {
    return false;
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return false;

    const result = (await res.json()) as { success: boolean };
    return result.success === true;
  } catch {
    return false; // network error / bad JSON — fail closed
  }
}
