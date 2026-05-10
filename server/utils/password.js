import crypto from "crypto";

const SCHEME = "pbkdf2_sha256";
const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const DIGEST = "sha256";

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${SCHEME}$${ITERATIONS}$${salt}$${hash}`;
};

export const verifyPassword = (password, stored) => {
  try {
    const [scheme, iterationsStr, salt, hash] = (stored || "").split("$");
    if (!scheme || !iterationsStr || !salt || !hash) return false;
    if (scheme !== SCHEME) return false;

    const iterations = Number(iterationsStr);
    if (!Number.isFinite(iterations) || iterations <= 0) return false;

    const computed = crypto
      .pbkdf2Sync(password, salt, iterations, KEY_LENGTH, DIGEST)
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(computed, "hex"),
      Buffer.from(hash, "hex"),
    );
  } catch {
    return false;
  }
};

