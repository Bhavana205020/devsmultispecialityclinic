import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

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

export const Route = createRootRoute({
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
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

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
