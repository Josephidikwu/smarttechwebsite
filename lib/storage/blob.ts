import { put } from "@vercel/blob";

const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadKind = "document" | "image";

/**
 * Validates and stores a file under a private, non-guessable Blob pathname —
 * objects are never served from a public/predictable path (see
 * docs/SETUP.md security notes). Returns the object key to persist on the
 * owning row, or an error string.
 */
export async function uploadToBlob(
  file: File,
  { prefix, kind }: { prefix: string; kind: UploadKind },
): Promise<{ key: string } | { error: string }> {
  if (file.size === 0) return { error: "No file was provided." };
  if (file.size > MAX_FILE_BYTES) return { error: "File is too large (max 10MB)." };

  const allowed = kind === "document" ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES;
  if (!allowed.has(file.type)) {
    return {
      error:
        kind === "document"
          ? "Only PDF or Word documents are accepted."
          : "Only JPG, PNG or WEBP images are accepted.",
    };
  }

  const extension = file.name.split(".").pop()?.toLowerCase().slice(0, 10) ?? "bin";
  const key = `${prefix}/${crypto.randomUUID()}.${extension}`;

  // `access: "private"` + no random suffix on our end (we already generated
  // a UUID key above) keeps this the same "never a guessable public URL"
  // model R2 had — the blob's own store URL still isn't returned to the
  // browser directly, only served back out via the authenticated route.
  await put(key, file, {
    access: "private",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return { key };
}

/** The admin-facing link for a stored object — see app/api/admin/files/[...key]/route.ts. */
export function adminFileUrl(key: string) {
  return `/api/admin/files/${key.split("/").map(encodeURIComponent).join("/")}`;
}
