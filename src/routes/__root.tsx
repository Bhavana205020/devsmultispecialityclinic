import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

// Set to `true` by vite.netlify.config.ts via `define`. In the SPA build we
// must NOT render <html>/<head>/<body>/<Scripts> because main.tsx already
// mounts into a real <div id="root"> inside a real index.html. Rendering a
// full document inside that div causes React to reconcile an invalid tree on
// every state change — every keystroke in an input triggers a re-render loop
// that locks the main thread and Chrome shows "Page Unresponsive".
declare const __SPA_ONLY__: boolean | undefined;
const IS_SPA_BUILD =
  typeof __SPA_ONLY__ !== "undefined" ? __SPA_ONLY__ : false;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-brand">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

const rootOptions = {
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dev's Multispeciality Clinic" },
      { name: "description", content: "Dev's Multispeciality Clinic — Kondapur, Hyderabad" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Dev's Multispeciality Clinic" },
      { name: "twitter:title", content: "Dev's Multispeciality Clinic" },
      { property: "og:description", content: "Dev's Multispeciality Clinic — Kondapur, Hyderabad" },
      { name: "twitter:description", content: "Dev's Multispeciality Clinic — Kondapur, Hyderabad" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/O3hamS2kPvbMS7vndYAxjKw5kmt2/social-images/social-1780910869632-Untitled_design_(4).webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/O3hamS2kPvbMS7vndYAxjKw5kmt2/social-images/social-1780910869632-Untitled_design_(4).webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  ...(IS_SPA_BUILD ? {} : { shellComponent: RootShell }),
} as const;

export const Route = createRootRoute(rootOptions);

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
