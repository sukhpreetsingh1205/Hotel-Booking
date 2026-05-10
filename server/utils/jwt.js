import crypto from "crypto";

const base64UrlEncode = (input) => {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(String(input));
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const base64UrlEncodeJson = (obj) => base64UrlEncode(Buffer.from(JSON.stringify(obj)));

const base64UrlDecodeToString = (input) => {
  const base64 = (input || "").replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
};

const signHmacSha256Base64Url = (data, secret) =>
  base64UrlEncode(crypto.createHmac("sha256", secret).update(data).digest());

export const signJwt = (payload, secret, { expiresInSeconds = 60 * 60 * 24 * 7 } = {}) => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };

  const fullPayload = {
    ...payload,
    iat: nowSeconds,
    exp: nowSeconds + Number(expiresInSeconds),
  };

  const headerPart = base64UrlEncodeJson(header);
  const payloadPart = base64UrlEncodeJson(fullPayload);
  const data = `${headerPart}.${payloadPart}`;
  const signature = signHmacSha256Base64Url(data, secret);
  return `${data}.${signature}`;
};

export const verifyJwt = (token, secret) => {
  const parts = (token || "").split(".");
  if (parts.length !== 3) {
    throw new Error("invalid token");
  }

  const [headerPart, payloadPart, signaturePart] = parts;
  const data = `${headerPart}.${payloadPart}`;

  const expectedSignature = signHmacSha256Base64Url(data, secret);
  const expectedBuf = Buffer.from(expectedSignature);
  const actualBuf = Buffer.from(signaturePart || "");

  if (
    expectedBuf.length !== actualBuf.length ||
    !crypto.timingSafeEqual(expectedBuf, actualBuf)
  ) {
    throw new Error("invalid signature");
  }

  const payloadJson = base64UrlDecodeToString(payloadPart);
  const payload = JSON.parse(payloadJson);

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (typeof payload?.exp === "number" && nowSeconds >= payload.exp) {
    throw new Error("token expired");
  }

  return payload;
};

