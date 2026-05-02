import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const NAV = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "doctors", label: "Our Doctors" },
  { id: "contact", label: "Contact Us" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-soft/60 backdrop-blur-md py-3">
      <header className="mx-auto max-w-7xl px-4">
        <div className="bg-background rounded-full shadow-soft border border-border/60 flex items-center justify-between pl-4 pr-2 h-16 md:h-[68px]">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="Dev's Multispeciality Clinic" className="h-10 md:h-12 w-auto" />
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm font-semibold text-foreground/80 hover:text-brand transition-colors"
              >
                {n.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("appointment")}
              className="btn-gold rounded-full px-6 py-2.5 text-sm font-bold shadow-soft"
            >
              Book Appointment
            </button>
            <Link
              to="/admin/login"
              className="text-xs font-medium text-muted-foreground hover:text-brand pr-2"
            >
              Admin
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-brand"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl bg-background shadow-soft border border-border">
            <div className="px-4 py-3 flex flex-col gap-2">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="text-left py-2 text-foreground/80 font-medium"
                >
                  {n.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("appointment")}
                className="btn-gold rounded-full px-5 py-2.5 text-sm font-semibold mt-2"
              >
                Book Appointment
              </button>
              <Link to="/admin/login" className="text-sm text-muted-foreground py-2">
                Admin Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
