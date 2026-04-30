import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsAdmin,
});

type T = {
  id: string;
  patient_name: string;
  rating: number;
  message: string;
  display_order: number;
  active: boolean;
};

const empty: Omit<T, "id"> = { patient_name: "", rating: 5, message: "", display_order: 0, active: true };

function TestimonialsAdmin() {
  const [items, setItems] = useState<T[]>([]);
  const [editing, setEditing] = useState<(Omit<T, "id"> & { id?: string }) | null>(null);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("display_order");
    setItems((data as T[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.patient_name || !editing.message) return toast.error("Name and message are required.");
    const payload = { ...editing };
    delete (payload as { id?: string }).id;
    const { error } = editing.id
      ? await supabase.from("testimonials").update(payload).eq("id", editing.id)
      : await supabase.from("testimonials").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Manage patient reviews shown on the homepage.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {items.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-brand">{t.patient_name}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setEditing(t)} className="p-1.5 rounded border border-border hover:bg-soft"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(t.id)} className="p-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-4">{t.message}</p>
            <p className="text-[11px] text-muted-foreground mt-2">Order: {t.display_order} · {t.active ? "Active" : "Inactive"}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-soft w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-brand">{editing.id ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <input className={inputCls} placeholder="Patient name" value={editing.patient_name} onChange={(e) => setEditing({ ...editing, patient_name: e.target.value })} />
              <textarea className={inputCls} rows={4} placeholder="Message" value={editing.message} onChange={(e) => setEditing({ ...editing, message: e.target.value })} />
              <div className="grid grid-cols-3 gap-3">
                <select className={inputCls} value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
                </select>
                <input type="number" className={inputCls} placeholder="Order" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
                <select className={inputCls} value={editing.active ? "1" : "0"} onChange={(e) => setEditing({ ...editing, active: e.target.value === "1" })}>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm rounded border border-border">Cancel</button>
              <button onClick={save} className="px-4 py-2 text-sm rounded bg-brand text-brand-foreground font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand";
