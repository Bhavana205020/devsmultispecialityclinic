import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Download, Mail } from "lucide-react";

export const Route = createFileRoute("/admin/subscribers")({
  component: SubscribersAdmin,
});

type Sub = { id: string; email: string; created_at: string };

function SubscribersAdmin() {
  const [items, setItems] = useState<Sub[]>([]);

  const load = async () => {
    const { data } = await supabase.from("subscribers").select("*").order("created_at", { ascending: false });
    setItems((data as Sub[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const exportCsv = () => {
    const csv = "email,subscribed_at\n" + items.map((s) => `${s.email},${s.created_at}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subscribers.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand">Subscribers</h1>
          <p className="text-muted-foreground mt-1">{items.length} email subscribers.</p>
        </div>
        <button onClick={exportCsv} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>
      <div className="mt-6 bg-card border border-border rounded-xl shadow-card divide-y">
        {items.length === 0 && <p className="p-8 text-center text-muted-foreground">No subscribers yet.</p>}
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 min-w-0">
              <Mail className="h-4 w-4 text-brand shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{s.email}</p>
                <p className="text-[11px] text-muted-foreground">{new Date(s.created_at).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={() => remove(s.id)} className="text-xs px-3 py-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1">
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
