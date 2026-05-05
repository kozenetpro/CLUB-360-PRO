const SAFE_URL_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeMediaUrl(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return SAFE_URL_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}
