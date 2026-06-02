import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, CalendarDays, Stethoscope, MessagesSquare, Mail,
  CheckCircle2, XCircle, Clock, TrendingUp, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

type Stats = {
  doctors: number; services: number; testimonials: number; subscribers: number;
  appts: number; pending: number; confirmed: number; rejected: number; waiting: number;
};

function Overview() {
  const [stats, setStats] = useState<Stats>({
    doctors: 0, services: 0, testimonials: 0, subscribers: 0,
    appts: 0, pending: 0, confirmed: 0, rejected: 0, waiting: 0,
  });
  const [recent, setRecent] = useState<Array<{ id: string; full_name: string; department: string; status: string; created_at: string }>>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
      supabase.from("subscribers").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "waiting"),
    ]).then(([d, s, t, sub, a, p, c, r, w]) =>
      setStats({
        doctors: d.count ?? 0, services: s.count ?? 0, testimonials: t.count ?? 0, subscribers: sub.count ?? 0,
        appts: a.count ?? 0, pending: p.count ?? 0, confirmed: c.count ?? 0, rejected: r.count ?? 0, waiting: w.count ?? 0,
      })
    );

    supabase
      .from("appointments")
      .select("id, full_name, department, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setRecent((data as typeof recent) ?? []));
  }, []);

  const apptCards = [
    { label: "Total Appointments", value: stats.appts, icon: CalendarDays, tone: "brand" },
    { label: "Pending", value: stats.pending, icon: Clock, tone: "orange" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, tone: "emerald" },
    { label: "Waiting", value: stats.waiting, icon: Clock, tone: "blue" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, tone: "red" },
  ];

  const contentCards = [
    { label: "Doctors", value: stats.doctors, icon: Users, to: "/admin/doctors" },
    { label: "Services", value: stats.services, icon: Stethoscope, to: "/admin/services" },
    { label: "Testimonials", value: stats.testimonials, icon: MessagesSquare, to: "/admin/testimonials" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, to: "/admin/subscribers" },
  ];

  const toneStyles: Record<string, { bg: string; ring: string; text: string }> = {
    brand:   { bg: "color-mix(in oklab, var(--brand) 10%, white)", ring: "var(--brand)", text: "var(--brand)" },
    orange:  { bg: "#fff4e5", ring: "#f59e0b", text: "#b45309" },
    emerald: { bg: "#e7f8f0", ring: "#10b981", text: "#047857" },
    blue:    { bg: "#e8f1ff", ring: "#3b82f6", text: "#1d4ed8" },
    red:     { bg: "#fdecec", ring: "#ef4444", text: "#b91c1c" },
  };

  return (
    <div className="space-y-8">
      {/* Hero panel */}
      <div
        className="rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden"
        style={{ background: "var(--gradient-brand)" }}
      >
        <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full opacity-20" style={{ background: "var(--gold)" }} />
        <div className="absolute -right-20 -bottom-16 h-56 w-56 rounded-full opacity-10 bg-white" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/70">Welcome back</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">Dashboard Overview</h1>
          <p className="text-white/80 mt-1 text-sm max-w-xl">
            Here's a quick summary of clinic activity and content. Stay on top of bookings and updates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/admin/appointments" className="inline-flex items-center gap-1.5 btn-gold px-4 py-2 rounded-full text-sm font-semibold">
              Manage Appointments <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/admin/doctors" className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 px-4 py-2 rounded-full text-sm font-semibold transition">
              Edit Doctors
            </Link>
          </div>
        </div>
      </div>

      {/* Appointment stats */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Appointments</h2>
          <Link to="/admin/appointments" className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {apptCards.map((c) => {
            const s = toneStyles[c.tone];
            return (
              <div
                key={c.label}
                className="bg-card rounded-2xl p-5 shadow-card border border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg, color: s.text }}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-bold mt-3 text-foreground tabular-nums">{c.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                <div className="mt-3 h-1 rounded-full bg-soft overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${stats.appts ? Math.min(100, (c.value / Math.max(1, stats.appts)) * 100) : 0}%`,
                      background: s.ring,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Content stats */}
      <section>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Content</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {contentCards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="group bg-card rounded-2xl p-5 shadow-card border border-border/60 hover:border-brand/40 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: "color-mix(in oklab, var(--gold) 18%, white)", color: "var(--gold-foreground)" }}
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-3xl font-bold mt-3 text-foreground tabular-nums">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent appointments */}
      <section className="bg-card rounded-2xl border border-border/60 shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand" />
            <h3 className="font-semibold text-foreground">Recent Appointments</h3>
          </div>
          <Link to="/admin/appointments" className="text-xs font-semibold text-brand hover:underline">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center">No recent bookings.</p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((a) => (
              <li key={a.id} className="px-5 py-3 flex items-center gap-3 hover:bg-soft/40 transition-colors">
                <div
                  className="h-9 w-9 rounded-full text-sm font-bold text-white flex items-center justify-center shrink-0"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {a.full_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{a.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.department} · {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="text-[10px] uppercase font-bold px-2 py-1 rounded-full"
                  style={{
                    background: toneStyles[
                      a.status === "confirmed" ? "emerald" :
                      a.status === "waiting" ? "blue" :
                      a.status === "rejected" ? "red" : "orange"
                    ].bg,
                    color: toneStyles[
                      a.status === "confirmed" ? "emerald" :
                      a.status === "waiting" ? "blue" :
                      a.status === "rejected" ? "red" : "orange"
                    ].text,
                  }}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
