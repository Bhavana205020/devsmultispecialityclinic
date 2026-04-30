import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Phone, Mail, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/appointments")({
  component: AppointmentsAdmin,
});

type Appt = {
  id: string;
  full_name: string;
  phone: string;
  department: string;
  preferred_date: string;
  message: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

const STATUS_COLORS: Record<Appt["status"], string> = {
  pending: "bg-orange-100 text-orange-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

function AppointmentsAdmin() {
  const [items, setItems] = useState<Appt[]>([]);
  const [filter, setFilter] = useState<"all" | Appt["status"]>("all");

  const load = async () => {
    const { data } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
    setItems((data as Appt[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Appt["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated.");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-brand">Appointments</h1>
        <p className="text-muted-foreground mt-1">Patient booking requests from the website.</p>
      </div>

      <div className="flex gap-2 mt-6 flex-wrap">
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${
              filter === s ? "bg-brand text-brand-foreground" : "bg-soft text-muted-foreground hover:bg-soft/70"
            }`}
          >
            {s} {s !== "all" && `(${items.filter((i) => i.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="grid gap-3 mt-4">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No appointments to show.</p>
        )}
        {filtered.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-brand text-lg">{a.full_name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${STATUS_COLORS[a.status]}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium text-foreground">{a.department}</span> ·{" "}
                  Preferred date: <span className="font-medium text-foreground">{a.preferred_date}</span>
                </p>
                <div className="flex gap-4 mt-2 text-sm text-foreground/80 flex-wrap">
                  <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1 hover:text-brand">
                    <Phone className="h-3.5 w-3.5" /> {a.phone}
                  </a>
                  <a href={`https://wa.me/${a.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-brand">
                    <Mail className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </div>
                {a.message && (
                  <p className="text-sm text-muted-foreground mt-2 flex gap-2">
                    <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    {a.message}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-2">
                  Booked: {new Date(a.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-[160px]">
                <select
                  value={a.status}
                  onChange={(e) => updateStatus(a.id, e.target.value as Appt["status"])}
                  className="text-sm rounded border border-border bg-background px-2 py-1.5"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => remove(a.id)}
                  className="text-xs py-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 inline-flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
