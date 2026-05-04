import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, X,
  Bone, Activity, Stethoscope, Dumbbell, Pill, Scissors, ScanLine, TestTube,
  HeartPulse, Microscope, Baby, Brain, Eye, Smile, Syringe, Hospital,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
  display_order: number;
  active: boolean;
};

const empty: Omit<Service, "id"> = {
  name: "",
  description: "",
  icon: "Stethoscope",
  display_order: 0,
  active: true,
};

const ICON_MAP: Record<string, LucideIcon> = {
  Bone, Activity, Stethoscope, Dumbbell, Pill, Scissors, ScanLine, TestTube,
  HeartPulse, Microscope, Baby, Brain, Eye, Smile, Syringe, Hospital,
};
const ICON_OPTIONS = Object.keys(ICON_MAP);

function ServicesAdmin() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<(Omit<Service, "id"> & { id?: string }) | null>(null);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("display_order");
    setItems((data as Service[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    if (!editing.name || !editing.description) return toast.error("Name and description are required.");
    const payload = {
      name: editing.name,
      description: editing.description,
      icon: editing.icon,
      display_order: editing.display_order,
      active: editing.active,
    };
    const { error } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved.");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand">Services</h1>
          <p className="text-muted-foreground mt-1">Edit the medical service cards on the homepage.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl mt-6 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-soft text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Name</th>
              <th className="p-3 hidden md:table-cell">Description</th>
              <th className="p-3">Icon</th>
              <th className="p-3">Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3">{s.display_order}</td>
                <td className="p-3 font-semibold text-brand">{s.name}</td>
                <td className="p-3 hidden md:table-cell text-muted-foreground line-clamp-2">{s.description}</td>
                <td className="p-3">
                  {(() => {
                    const Ico = ICON_MAP[s.icon] ?? Stethoscope;
                    return (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-7 h-7 rounded-full bg-gold/15 inline-flex items-center justify-center">
                          <Ico className="h-4 w-4 text-gold" />
                        </span>
                        <code className="text-[11px] text-muted-foreground">{s.icon}</code>
                      </span>
                    );
                  })()}
                </td>
                <td className="p-3">{s.active ? "✓" : "✗"}</td>
                <td className="p-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditing(s)} className="p-1.5 rounded border border-border hover:bg-soft"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(s.id)} className="p-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-soft w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-brand">{editing.id ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <input className={inputCls} placeholder="Name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              <textarea className={inputCls} rows={3} placeholder="Description" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />

              <div>
                <label className="text-sm font-medium">Pick an icon</label>
                <div className="mt-2 grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {ICON_OPTIONS.map((name) => {
                    const Ico = ICON_MAP[name];
                    const selected = editing.icon === name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setEditing({ ...editing, icon: name })}
                        title={name}
                        className={`aspect-square rounded-lg border-2 flex items-center justify-center transition-all ${
                          selected
                            ? "border-gold bg-gold/15 shadow-sm scale-105"
                            : "border-border bg-background hover:border-gold/50 hover:bg-soft"
                        }`}
                      >
                        <Ico className={`h-5 w-5 ${selected ? "text-gold" : "text-muted-foreground"}`} />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Selected: <code>{editing.icon}</code></p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" className={inputCls} placeholder="Display order" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} />
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
