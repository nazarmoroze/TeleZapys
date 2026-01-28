const textEncoder = new TextEncoder();

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

const hmacSha256 = async (key: Uint8Array, message: Uint8Array) => {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);
  return new Uint8Array(signature);
};

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return result === 0;
};

export const parseInitData = (initData: string) => {
  const params = new URLSearchParams(initData);
  const data: Record<string, string> = {};
  params.forEach((value, key) => {
    data[key] = value;
  });
  return data;
};

export const getTelegramUserFromInitData = (initData: string) => {
  const data = parseInitData(initData);
  if (!data.user) return null;

  try {
    return JSON.parse(data.user) as {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
  } catch {
    return null;
  }
};

export const validateTelegramWebAppData = async (
  initData: string,
  botToken: string,
  maxAgeSeconds = 60 * 60 * 24
) => {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;

  params.delete("hash");
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const authDateRaw = params.get("auth_date");
  if (authDateRaw) {
    const authDate = Number(authDateRaw);
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (!Number.isNaN(authDate) && nowSeconds - authDate > maxAgeSeconds) {
      return false;
    }
  }

  const secretKey = await hmacSha256(
    textEncoder.encode("WebAppData"),
    textEncoder.encode(botToken)
  );
  const calculatedHash = toHex(
    await hmacSha256(secretKey, textEncoder.encode(dataCheckString))
  );

  return timingSafeEqual(calculatedHash, hash);
};
