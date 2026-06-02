import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Stethoscope, Users, MessagesSquare, CalendarDays,
  LogOut, Home, Mail, Youtube, Menu, X, Bell, Search,
} from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Dev's Multispeciality Clinic" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/doctors", label: "Doctors", icon: Users },
  { to: "/admin/services", label: "Services", icon: Stethoscope },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessagesSquare },
  { to: "/admin/channels", label: "Channels & Videos", icon: Youtube },
  { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
];

function AdminLayout() {
  const { loading, user, isAdmin } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isLoginRoute = path === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginRoute) return;
    if (!loading) {
      if (!user) nav({ to: "/admin/login" });
      else if (!isAdmin) {
        supabase.auth.signOut().then(() => nav({ to: "/admin/login" }));
      }
    }
  }, [loading, user, isAdmin, nav, isLoginRoute]);

  useEffect(() => { setSidebarOpen(false); }, [path]);

  if (isLoginRoute) return <Outlet />;

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
          <p className="text-sm text-muted-foreground">Verifying admin access…</p>
        </div>
      </div>
    );
  }

  const currentPage = NAV.find((n) => path === n.to || (n.to !== "/admin" && path.startsWith(n.to)))?.label ?? "Overview";

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/95 p-1 flex items-center justify-center shrink-0 shadow-md">
            <img src={logo} alt="Logo" className="h-full w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate">Dev's Clinic</p>
            <p className="text-[11px] uppercase tracking-wider text-white/60">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = path === to || (to !== "/admin" && path.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative ${
                active
                  ? "bg-white/15 text-white font-semibold shadow-inner"
                  : "text-white/75 hover:text-white hover:bg-white/10"
              }`}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full"
                  style={{ background: "var(--gold)" }}
                />
              )}
              <Icon className={`h-4 w-4 ${active ? "text-gold" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/75 hover:text-white hover:bg-white/10">
          <Home className="h-4 w-4" /> View Website
        </Link>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            nav({ to: "/admin/login" });
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/75 hover:text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-soft">
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex w-64 shrink-0 flex-col text-white sticky top-0 h-screen"
        style={{
          background:
            "linear-gradient(180deg, var(--brand) 0%, color-mix(in oklab, var(--brand) 75%, black) 100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className="md:hidden fixed inset-y-0 left-0 w-72 z-50 flex flex-col text-white shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, var(--brand) 0%, color-mix(in oklab, var(--brand) 75%, black) 100%)",
            }}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card/85 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6">
          <button
            className="md:hidden p-2 -ml-1 rounded-lg hover:bg-soft"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          {sidebarOpen && (
            <button
              className="md:hidden p-2 -ml-1 rounded-lg hover:bg-soft fixed top-3 left-60 z-[60] text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Admin</p>
            <h2 className="text-base font-bold text-brand leading-tight">{currentPage}</h2>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="pl-9 pr-3 py-2 text-sm rounded-full bg-soft border border-border w-56 focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <button className="p-2 rounded-full hover:bg-soft relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-foreground/70" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold" />
            </button>
            <div
              className="h-9 w-9 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-sm"
              style={{ background: "var(--gradient-brand)" }}
              title={user?.email ?? ""}
            >
              {(user?.email?.[0] ?? "A").toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
