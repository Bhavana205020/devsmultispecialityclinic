import { createFileRoute, Outlet, useNavigate, Link, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, Stethoscope, Users, MessagesSquare, CalendarDays, LogOut, Home, Mail, Youtube } from "lucide-react";
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

  useEffect(() => {
    if (isLoginRoute) return;
    if (!loading) {
      if (!user) nav({ to: "/admin/login" });
      else if (!isAdmin) {
        // Sign out non-admins
        supabase.auth.signOut().then(() => nav({ to: "/admin/login" }));
      }
    }
  }, [loading, user, isAdmin, nav, isLoginRoute]);

  if (isLoginRoute) return <Outlet />;

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft">
        <p className="text-muted-foreground">Checking admin access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-soft">
      <aside className="w-full md:w-64 bg-brand text-brand-foreground flex md:flex-col">
        <div className="p-4 border-b border-brand-foreground/10">
          <img src={logo} alt="Logo" className="h-14 w-auto bg-white/95 rounded p-1" />
          <p className="hidden md:block text-xs mt-2 opacity-80">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 flex md:block gap-2 overflow-x-auto md:space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = path === to || (to !== "/admin" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex shrink-0 items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? "bg-gold text-gold-foreground font-semibold" : "hover:bg-brand-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block p-3 border-t border-brand-foreground/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-brand-foreground/10">
            <Home className="h-4 w-4" /> View Website
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              nav({ to: "/admin/login" });
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-brand-foreground/10"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
