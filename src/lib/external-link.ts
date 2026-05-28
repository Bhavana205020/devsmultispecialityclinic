/**
 * Open an external URL safely in a new tab.
 * Uses plain anchor semantics (target=_blank + rel=noopener) so the browser
 * handles navigation natively — avoids ERR_BLOCKED_BY_RESPONSE that can
 * happen when JS tries to load uncooperative origins (e.g. api.whatsapp.com)
 * inside the preview iframe.
 */
export function externalLinkProps(url: string) {
  return {
    href: url,
    target: "_blank" as const,
    rel: "noopener noreferrer",
  };
}

export function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
