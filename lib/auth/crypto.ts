import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

function getSecret(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (16 caractères minimum) dans les variables d'environnement."
    );
  }
  return Buffer.from(secret, "utf8");
}

function hmacHex(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

/** Constant-time string comparison (inputs are hashed first so length never leaks). */
export function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = createHash("sha256").update(a).digest();
  const bufB = createHash("sha256").update(b).digest();
  return timingSafeEqual(bufA, bufB);
}

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L ambiguity

export function generateAccessCode(length = 10): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

export function hashAccessCode(code: string): string {
  return hmacHex(`code:${normalizeCode(code)}`);
}

/** Signed, expiring session token: base64url(payload.expiry).hmac */
export function signSessionToken(payload: string, expiresAtMs: number): string {
  const data = `${payload}.${expiresAtMs}`;
  const sig = hmacHex(`session:${data}`);
  return `${Buffer.from(data, "utf8").toString("base64url")}.${sig}`;
}

export function verifySessionToken(token: string, expectedPayload: string): boolean {
  const [dataB64, sig] = token.split(".");
  if (!dataB64 || !sig) return false;

  let data: string;
  try {
    data = Buffer.from(dataB64, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const expectedSig = hmacHex(`session:${data}`);
  if (!timingSafeEqualStr(sig, expectedSig)) return false;

  const lastDot = data.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = data.slice(0, lastDot);
  const expStr = data.slice(lastDot + 1);

  if (payload !== expectedPayload) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  return true;
}
