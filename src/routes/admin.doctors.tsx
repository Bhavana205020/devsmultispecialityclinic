import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, UserRound, X } from "lucide-react";

export const Route = createFileRoute("/admin/doctors")({
  component: DoctorsAdmin,
});

type Doctor = {
  id: string;
  name: string;
  title: string;
  qualifications: string | null;
  specialty: string;
  photo_url: string | null;
  description: string | null;
  experience: string | null;
  display_order: number;
  active: boolean;
};

const empty: Omit<Doctor, "id"> = {
  name: "",
  title: "",
  qualifications: "",
  specialty: "",
  photo_url: null,
  description: "",
  experience: "",
  display_order: 0,
  active: true,
};

function DoctorsAdmin() {
  const [docs, setDocs] = useState<Doctor[]>([]);
  const [editing, setEditing] = useState<(Omit<Doctor, "id"> & { id?: string }) | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("doctors").select("*").order("display_order");
    setDocs((data as Doctor[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const handleUpload = async (file: File) => {
    if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
      toast.error("Please upload a JPEG image only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setUploading(true);
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const { error } = await supabase.storage.from("doctor-photos").upload(path, file, {
      contentType: "image/jpeg",
      upsert: false,
    });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("doctor-photos").getPublicUrl(path);
    setEditing((p) => (p ? { ...p, photo_url: data.publicUrl } : p));
    setUploading(false);
    toast.success("Photo uploaded.");
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name || !editing.title || !editing.specialty) {
      return toast.error("Name, title, and specialty are required.");
    }
    const payload = {
      name: editing.name,
      title: editing.title,
      qualifications: editing.qualifications,
      specialty: editing.specialty,
      photo_url: editing.photo_url,
      description: editing.description,
      experience: editing.experience,
      display_order: editing.display_order,
      active: editing.active,
    };
    const { error } = editing.id
      ? await supabase.from("doctors").update(payload).eq("id", editing.id)
      : await supabase.from("doctors").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Doctor updated." : "Doctor added.");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted.");
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand">Doctors</h1>
          <p className="text-muted-foreground mt-1">Manage consultant profiles, photos & details.</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Doctor
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {docs.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-soft border-2 border-gold/30 flex items-center justify-center shrink-0">
                {d.photo_url ? <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" /> : <UserRound className="h-8 w-8 text-brand/40" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-brand truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{d.title}</p>
                <p className="text-xs mt-1 inline-block px-2 py-0.5 rounded bg-gold/15 text-gold-foreground">{d.specialty}</p>
                {d.experience && <p className="text-[11px] text-muted-foreground mt-1">{d.experience}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditing(d)} className="flex-1 text-xs py-1.5 rounded border border-border hover:bg-soft inline-flex items-center justify-center gap-1">
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button onClick={() => remove(d.id)} className="flex-1 text-xs py-1.5 rounded border border-destructive/30 text-destructive hover:bg-destructive/10 inline-flex items-center justify-center gap-1">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-soft w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-brand">{editing.id ? "Edit Doctor" : "Add Doctor"}</h2>
              <button onClick={() => setEditing(null)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-soft border-2 border-gold/30 flex items-center justify-center">
                  {editing.photo_url ? <img src={editing.photo_url} className="w-full h-full object-cover" alt="" /> : <UserRound className="h-9 w-9 text-brand/40" />}
                </div>
                <div className="flex-1">
                  <input ref={fileRef} type="file" accept="image/jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded border border-border hover:bg-soft disabled:opacity-50">
                    <Upload className="h-4 w-4" />
                    {uploading ? "Uploading..." : "Upload JPEG photo"}
                  </button>
                  <p className="text-[11px] text-muted-foreground mt-1">JPEG only, max 5 MB.</p>
                </div>
              </div>

              <Field label="Full Name"><input className={inputCls} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
              <Field label="Title / Designation"><input className={inputCls} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
              <Field label="Specialization"><input className={inputCls} value={editing.specialty} onChange={(e) => setEditing({ ...editing, specialty: e.target.value })} /></Field>
              <Field label="Qualifications"><textarea rows={2} className={inputCls} value={editing.qualifications ?? ""} onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })} /></Field>
              <Field label="Experience (e.g. '12 years')"><input className={inputCls} value={editing.experience ?? ""} onChange={(e) => setEditing({ ...editing, experience: e.target.value })} /></Field>
              <Field label="Description"><textarea rows={3} className={inputCls} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Display Order"><input type="number" className={inputCls} value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></Field>
                <Field label="Active">
                  <select className={inputCls} value={editing.active ? "1" : "0"} onChange={(e) => setEditing({ ...editing, active: e.target.value === "1" })}>
                    <option value="1">Yes</option><option value="0">No</option>
                  </select>
                </Field>
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
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-medium">{label}</span><div className="mt-1">{children}</div></label>;
}
