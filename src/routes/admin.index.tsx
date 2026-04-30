import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, CalendarDays, Stethoscope, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({ doctors: 0, services: 0, appts: 0, pending: 0, testimonials: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("testimonials").select("*", { count: "exact", head: true }),
    ]).then(([d, s, a, p, t]) =>
      setStats({
        doctors: d.count ?? 0,
        services: s.count ?? 0,
        appts: a.count ?? 0,
        pending: p.count ?? 0,
        testimonials: t.count ?? 0,
      })
    );
  }, []);

  const cards = [
    { label: "Doctors", value: stats.doctors, icon: Users, color: "text-brand" },
    { label: "Services", value: stats.services, icon: Stethoscope, color: "text-gold" },
    { label: "Appointments", value: stats.appts, icon: CalendarDays, color: "text-emerald-600" },
    { label: "Pending Requests", value: stats.pending, icon: CalendarDays, color: "text-orange-600" },
    { label: "Testimonials", value: stats.testimonials, icon: MessagesSquare, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand">Dashboard Overview</h1>
      <p className="text-muted-foreground mt-1">Welcome back to Dev's Multispeciality Clinic Admin.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
        {cards.map((c) => (
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
