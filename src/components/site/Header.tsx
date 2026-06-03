import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { Menu, X, UserRound, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.webp";
import type { Session } from "@supabase/supabase-js";

const NAV = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "doctors", label: "Our Doctors" },
  { id: "contact", label: "Contact Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    const applySession = async (session: Session | null) => {
      if (!active) return;
      setSignedIn(!!session);
      if (!session?.user) {
        setAdmin(false);
        return;
      }
      const { isAdminUser } = await import("@/lib/auth-routing");
      const isAdmin = await isAdminUser(session.user.id);
      if (active) setAdmin(isAdmin);
    };

    import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!active) return;
      supabase.auth.getSession().then(({ data: { session } }) => applySession(session));
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        setTimeout(() => applySession(s), 0);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const next = window.scrollY > 20;
      setScrolled((current) => (current === next ? current : next));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section via IntersectionObserver (home page only)
  useEffect(() => {
    if (location.pathname !== "/") return;
    const ids = ["home", "services", "doctors", "contact"];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const scrollTo = (id: string) => {
    setOpen(false);
    if (location.pathname !== "/") {
      nav({ to: "/", hash: id });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "py-2" : "py-3"
      }`}
      style={{
        background: scrolled
          ? "color-mix(in oklab, var(--background) 80%, transparent)"
          : "color-mix(in oklab, var(--soft) 60%, transparent)",
        backdropFilter: "saturate(180%) blur(16px)",
        WebkitBackdropFilter: "saturate(180%) blur(16px)",
      }}
    >
      <header className="mx-auto max-w-7xl px-3 sm:px-4">
        <div
          className={`relative rounded-full bg-background flex items-center justify-between pl-3 sm:pl-4 pr-2 transition-all duration-300 ${
            scrolled ? "h-16 md:h-20 shadow-lg" : "h-20 md:h-24 shadow-soft"
          }`}
          style={{
            border: "1px solid color-mix(in oklab, var(--brand) 12%, transparent)",
            boxShadow: scrolled
              ? "0 10px 30px -16px color-mix(in oklab, var(--brand) 35%, transparent)"
              : "0 8px 24px -14px color-mix(in oklab, var(--brand) 22%, transparent)",
          }}
        >
          {/* gold underline accent */}
          <span
            aria-hidden
            className="absolute left-6 right-6 -bottom-px h-px rounded-full opacity-70"
            style={{ background: "var(--gradient-gold)" }}
          />

          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 shrink-0">
            <img
              src={logo}
              alt="Dev's Multispeciality Clinic"
              className={`w-auto transition-all duration-300 ${scrolled ? "h-10 md:h-14" : "h-12 md:h-16"}`}
            />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = activeSection === n.id && location.pathname === "/";
              return (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    active ? "text-brand" : "text-foreground/70 hover:text-brand"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[3px] rounded-full transition-all duration-300 ${
                      active ? "w-5 opacity-100" : "w-0 opacity-0"
                    }`}
                    style={{ background: "var(--gold)" }}
                  />
                </button>
              );
            })}

            <button
              onClick={() => scrollTo("appointment")}
              className="btn-gold rounded-full px-5 py-2.5 ml-2 text-sm font-bold shadow-soft inline-flex items-center gap-1.5"
            >
              Book Appointment
              <ChevronRight className="h-4 w-4" />
            </button>

            {signedIn ? (
              <Link
                to={admin ? "/admin" : "/profile"}
                className="ml-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:opacity-80 px-3 py-2 rounded-full hover:bg-brand/5"
                aria-label={admin ? "Admin dashboard" : "My profile"}
              >
                <UserRound className="h-4 w-4" /> {admin ? "Admin" : "Profile"}
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-2 text-sm font-semibold text-brand hover:opacity-80 px-3 py-2 rounded-full hover:bg-brand/5"
              >
                Sign In
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-brand rounded-full hover:bg-brand/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div
            className="md:hidden mt-2 rounded-2xl bg-background border overflow-hidden"
            style={{
              borderColor: "color-mix(in oklab, var(--brand) 15%, transparent)",
              boxShadow: "0 16px 40px -20px color-mix(in oklab, var(--brand) 35%, transparent)",
            }}
          >
            <div className="px-2 py-2 flex flex-col">
              {NAV.map((n) => {
                const active = activeSection === n.id && location.pathname === "/";
                return (
                  <button
                    key={n.id}
                    onClick={() => scrollTo(n.id)}
                    className={`text-left px-4 py-3 rounded-xl font-medium transition-colors ${
                      active ? "bg-brand/5 text-brand" : "text-foreground/80 hover:bg-soft"
                    }`}
                  >
                    {n.label}
                  </button>
                );
              })}
              <button
                onClick={() => scrollTo("appointment")}
                className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold mt-2 mx-2"
              >
                Book Appointment
              </button>
              {signedIn ? (
                <Link to={admin ? "/admin" : "/profile"} className="text-sm font-semibold text-brand px-4 py-3">
                  {admin ? "Admin Dashboard" : "My Profile"}
                </Link>
              ) : (
                <Link to="/login" className="text-sm font-semibold text-brand px-4 py-3">
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
