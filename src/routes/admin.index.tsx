import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, CalendarDays, Stethoscope, MessagesSquare, Mail, CheckCircle2, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({
    doctors: 0, services: 0, testimonials: 0, subscribers: 0,
    appts: 0, pending: 0, confirmed: 0, rejected: 0, waiting: 0,
  });

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
  }, []);

  const apptCards = [
    { label: "Total Appointments", value: stats.appts, icon: CalendarDays, color: "text-brand" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-orange-600" },
    { label: "Confirmed", value: stats.confirmed, icon: CheckCircle2, color: "text-emerald-600" },
    { label: "Waiting", value: stats.waiting, icon: Clock, color: "text-blue-600" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600" },
  ];

  const contentCards = [
    { label: "Doctors", value: stats.doctors, icon: Users, color: "text-brand" },
    { label: "Services", value: stats.services, icon: Stethoscope, color: "text-gold" },
    { label: "Testimonials", value: stats.testimonials, icon: MessagesSquare, color: "text-purple-600" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-blue-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand">Dashboard Overview</h1>
      <p className="text-muted-foreground mt-1">Welcome back to Dev's Multispeciality Clinic Admin.</p>

      <h2 className="text-sm font-semibold text-muted-foreground uppercase mt-8 tracking-wide">Appointments</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-3">
        {apptCards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5 shadow-card">
            <c.icon className={`h-6 w-6 ${c.color}`} />
            <p className="text-3xl font-bold mt-3 text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-muted-foreground uppercase mt-8 tracking-wide">Content</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
        {contentCards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-xl p-5 shadow-card">
            <c.icon className={`h-6 w-6 ${c.color}`} />
            <p className="text-3xl font-bold mt-3 text-foreground">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
