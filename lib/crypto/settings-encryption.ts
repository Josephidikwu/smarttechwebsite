import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import "server-only";

/**
 * AES-256-GCM helpers for the one place a real secret has to live in a
 * plain DB column: the admin-configured SMTP (webmail) password (see
 * lib/email/index.ts and app/admin/(protected)/settings/email). Same
 * principle as PBKDF2 for user passwords and never committing Turnstile's
 * secret — this key belongs in `SETTINGS_ENCRYPTION_KEY` (Vercel env var,
 * never in the repo), a 32-byte key, base64-encoded.
 *
 * Storage format: base64(iv) + "." + base64(authTag) + "." + base64(ciphertext)
 */

function getKey(): Buffer {
  const raw = process.env.SETTINGS_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "SETTINGS_ENCRYPTION_KEY is not set — generate one with `openssl rand -base64 32` and add it to your env (see docs/SETUP.md).",
    );
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("SETTINGS_ENCRYPTION_KEY must decode to exactly 32 bytes.");
  }
  return key;
}

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${authTag.toString("base64")}.${ciphertext.toString("base64")}`;
}

export function decryptSecret(stored: string): string {
  const [ivB64, tagB64, ciphertextB64] = stored.split(".");
  if (!ivB64 || !tagB64 || !ciphertextB64) {
    throw new Error("Malformed encrypted value.");
  }
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, "base64")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
