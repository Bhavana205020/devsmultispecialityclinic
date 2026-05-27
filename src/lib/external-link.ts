/**
 * Safely open an external URL in a new tab.
 * Using window.open with explicit features prevents the preview iframe
 * from intercepting the navigation (which causes X-Frame ERR_BLOCKED_BY_RESPONSE
 * when sites like WhatsApp/Google Maps refuse to be framed).
 */
export function openExternal(url: string) {
  try {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) w.opener = null;
    // Fallback: if popup was blocked, navigate top
    if (!w && typeof window !== "undefined") {
      window.top!.location.href = url;
    }
  } catch {
    window.location.href = url;
  }
}

export function externalLinkProps(url: string) {
  return {
    href: url,
    target: "_blank" as const,
    rel: "noopener noreferrer",
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      openExternal(url);
    },
  };
}
