/**
 * Shared utility for server-side page fetching with SSRF protection,
 * script stripping, <base> tag injection, and 10s timeout.
 */

// Helper to check if an IP or host is private/reserved to prevent SSRF
export function isPrivateOrBlockedHost(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();

  // Block localhost aliases
  if (
    normalized === 'localhost' ||
    normalized.endsWith('.localhost') ||
    normalized === '0.0.0.0' ||
    normalized === '::1' ||
    normalized === '[::1]'
  ) {
    return true;
  }

  // Check IPv4 patterns
  const ipv4Match = normalized.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b] = ipv4Match.map(Number);
    // 127.0.0.0/8 - Loopback
    if (a === 127) return true;
    // 10.0.0.0/8 - Private
    if (a === 10) return true;
    // 172.16.0.0/12 - Private (172.16.x.x - 172.31.x.x)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 - Private
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 - Link-local / Cloud metadata (e.g., AWS/GCP 169.254.169.254)
    if (a === 169 && b === 254) return true;
    // 0.0.0.0/8
    if (a === 0) return true;
  }

  // Check IPv6 patterns (fc00::/7 unique local, fe80::/10 link local)
  if (
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    normalized.startsWith('fe80')
  ) {
    return true;
  }

  return false;
}

export function sanitizeAndPrepareHtml(rawHtml: string, originalUrl: string): string {
  // Strip <script> tags and inline script handlers to prevent execution
  let sanitized = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Strip on* event handlers (e.g. onload, onerror)
  sanitized = sanitized.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');
  sanitized = sanitized.replace(/\son\w+\s*=\s*[^>\s]+/gi, '');

  // Inject <base> tag right after <head> or at beginning of document
  const baseTag = `<base href="${originalUrl}">`;
  if (/<head\b[^>]*>/i.test(sanitized)) {
    sanitized = sanitized.replace(/(<head\b[^>]*>)/i, `$1\n${baseTag}`);
  } else if (/<html\b[^>]*>/i.test(sanitized)) {
    sanitized = sanitized.replace(/(<html\b[^>]*>)/i, `$1\n<head>${baseTag}</head>`);
  } else {
    sanitized = `${baseTag}\n${sanitized}`;
  }

  return sanitized;
}

export async function fetchPageHtml(targetUrl: string): Promise<{ html: string; title: string }> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw new Error('Invalid URL format. Please enter a valid HTTP or HTTPS address.');
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error('Unsupported protocol. Only http: and https: protocols are permitted.');
  }

  if (isPrivateOrBlockedHost(parsedUrl.hostname)) {
    throw new Error(`Access blocked: requests to private, local, or loopback addresses (${parsedUrl.hostname}) are restricted for security.`);
  }

  // Setup 10-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AccessAudit-Scanner/1.0 (Developer WCAG Audit Tool; +https://accessaudit.local)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: received HTTP status ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      throw new Error(`Target returned unsupported content-type (${contentType}). Only HTML documents can be audited.`);
    }

    const rawHtml = await response.text();
    const sanitizedHtml = sanitizeAndPrepareHtml(rawHtml, response.url || targetUrl);

    // Extract title if present
    const titleMatch = rawHtml.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch && titleMatch[1] ? titleMatch[1].trim() : parsedUrl.hostname;

    return { html: sanitizedHtml, title };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Request timed out after 10 seconds. The target server did not respond in time.');
      }
      throw err;
    }
    throw new Error('An unexpected error occurred while fetching the URL.');
  }
}
