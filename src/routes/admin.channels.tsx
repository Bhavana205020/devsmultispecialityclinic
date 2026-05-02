import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Youtube, Instagram, Facebook, Video, Globe } from "lucide-react";

export const Route = createFileRoute("/admin/channels")({
  component: ChannelsAdmin,
});

type Channel = { id: string; platform: string; url: string; handle: string | null; display_order: number; active: boolean };
type FVideo = { id: string; title: string | null; person_name: string; role: string | null; thumbnail_url: string | null; video_url: string | null; display_order: number; active: boolean };

const emptyCh: Omit<Channel, "id"> = { platform: "youtube", url: "", handle: "", display_order: 0, active: true };
const emptyVid: Omit<FVideo, "id"> = { title: "", person_name: "", role: "", thumbnail_url: "", video_url: "", display_order: 0, active: true };

function ChannelsAdmin() {
  const [tab, setTab] = useState<"channels" | "videos">("channels");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [videos, setVideos] = useState<FVideo[]>([]);
  const [editCh, setEditCh] = useState<(Omit<Channel, "id"> & { id?: string }) | null>(null);
  const [editVid, setEditVid] = useState<(Omit<FVideo, "id"> & { id?: string }) | null>(null);

  const load = async () => {
    const [c, v] = await Promise.all([
      supabase.from("social_channels").select("*").order("display_order"),
      supabase.from("featured_videos").select("*").order("display_order"),
    ]);
    setChannels((c.data as Channel[]) ?? []);
    setVideos((v.data as FVideo[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const saveCh = async () => {
    if (!editCh) return;
    if (!editCh.platform || !editCh.url) return toast.error("Platform and URL are required.");
    const payload = { ...editCh }; delete (payload as { id?: string }).id;
    const { error } = editCh.id ? await supabase.from("social_channels").update(payload).eq("id", editCh.id) : await supabase.from("social_channels").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved."); setEditCh(null); load();
  };
  const removeCh = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("social_channels").delete().eq("id", id);
    if (error) return toast.error(error.message); load();
  };
  const saveVid = async () => {
    if (!editVid) return;
    if (!editVid.person_name) return toast.error("Person name required.");
    const payload = { ...editVid }; delete (payload as { id?: string }).id;
    const { error } = editVid.id ? await supabase.from("featured_videos").update(payload).eq("id", editVid.id) : await supabase.from("featured_videos").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved."); setEditVid(null); load();
  };
  const removeVid = async (id: string) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("featured_videos").delete().eq("id", id);
    if (error) return toast.error(error.message); load();
  };

  const platIcon = (p: string) => {
    const k = p.toLowerCase();
    if (k === "youtube") return Youtube;
    if (k === "instagram") return Instagram;
    if (k === "facebook") return Facebook;
    return Globe;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-brand">Channels & Videos</h1>
      <p className="text-muted-foreground mt-1">Social links and featured video thumbnails for the Subscribe section.</p>

      <div className="mt-4 flex gap-2 border-b border-border">
        {(["channels", "videos"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 ${tab === t ? "border-gold text-brand" : "border-transparent text-muted-foreground"}`}>
            {t === "channels" ? "Social Channels" : "Featured Videos"}
          </button>
        ))}
      </div>

      {tab === "channels" && (
        <>
          <div className="flex justify-end mt-4">
            <button onClick={() => setEditCh({ ...emptyCh })} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Channel
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3 mt-4">
            {channels.map((c) => {
              const Icon = platIcon(c.platform);
              return (
                <div key={c.id} className="bg-card border border-border rounded-xl p-4 shadow-card flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-soft flex items-center justify-center"><Icon className="h-5 w-5 text-brand" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand capitalize">{c.platform}</p>
                    <a href={c.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground truncate block hover:text-brand">{c.url}</a>
                  </div>
                  <button onClick={() => setEditCh(c)} className="p-1.5 rounded border border-border"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => removeCh(c.id)} className="p-1.5 rounded border border-destructive/30 text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === "videos" && (
        <>
          <div className="flex justify-end mt-4">
            <button onClick={() => setEditVid({ ...emptyVid })} className="btn-gold rounded-md px-4 py-2 text-sm font-semibold inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Video
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {videos.map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
                <div className="aspect-[4/3] bg-soft bg-cover bg-center" style={{ backgroundImage: v.thumbnail_url ? `url("${v.thumbnail_url}")` : undefined }}>
                  {!v.thumbnail_url && <div className="h-full flex items-center justify-center text-muted-foreground"><Video className="h-8 w-8" /></div>}
                </div>
                <div className="p-3">
                  <p className="font-bold text-brand text-sm">{v.person_name}</p>
                  {v.role && <p className="text-xs text-muted-foreground">{v.role}</p>}
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setEditVid(v)} className="flex-1 text-xs py-1 rounded border border-border inline-flex items-center justify-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>
                    <button onClick={() => removeVid(v.id)} className="flex-1 text-xs py-1 rounded border border-destructive/30 text-destructive inline-flex items-center justify-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editCh && (
        <Modal title={editCh.id ? "Edit Channel" : "Add Channel"} onClose={() => setEditCh(null)} onSave={saveCh}>
          <Field label="Platform">
            <select className={inputCls} value={editCh.platform} onChange={(e) => setEditCh({ ...editCh, platform: e.target.value })}>
              <option value="youtube">YouTube</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="URL"><input className={inputCls} value={editCh.url} onChange={(e) => setEditCh({ ...editCh, url: e.target.value })} placeholder="https://..." /></Field>
          <Field label="Handle (optional)"><input className={inputCls} value={editCh.handle ?? ""} onChange={(e) => setEditCh({ ...editCh, handle: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order"><input type="number" className={inputCls} value={editCh.display_order} onChange={(e) => setEditCh({ ...editCh, display_order: Number(e.target.value) })} /></Field>
            <Field label="Active">
              <select className={inputCls} value={editCh.active ? "1" : "0"} onChange={(e) => setEditCh({ ...editCh, active: e.target.value === "1" })}>
                <option value="1">Yes</option><option value="0">No</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}

      {editVid && (
        <Modal title={editVid.id ? "Edit Video" : "Add Video"} onClose={() => setEditVid(null)} onSave={saveVid}>
          <Field label="Person Name"><input className={inputCls} value={editVid.person_name} onChange={(e) => setEditVid({ ...editVid, person_name: e.target.value })} /></Field>
          <Field label="Role / Title"><input className={inputCls} value={editVid.role ?? ""} onChange={(e) => setEditVid({ ...editVid, role: e.target.value })} /></Field>
          <Field label="Thumbnail URL"><input className={inputCls} value={editVid.thumbnail_url ?? ""} onChange={(e) => setEditVid({ ...editVid, thumbnail_url: e.target.value })} placeholder="https://..." /></Field>
          <Field label="Video URL (YouTube/Instagram link)"><input className={inputCls} value={editVid.video_url ?? ""} onChange={(e) => setEditVid({ ...editVid, video_url: e.target.value })} placeholder="https://..." /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Order"><input type="number" className={inputCls} value={editVid.display_order} onChange={(e) => setEditVid({ ...editVid, display_order: Number(e.target.value) })} /></Field>
            <Field label="Active">
              <select className={inputCls} value={editVid.active ? "1" : "0"} onChange={(e) => setEditVid({ ...editVid, active: e.target.value === "1" })}>
                <option value="1">Yes</option><option value="0">No</option>
              </select>
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-soft w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold text-brand">{title}</h2>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="p-5 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded border border-border">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 text-sm rounded bg-brand text-brand-foreground font-semibold">Save</button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-sm font-medium">{label}</span><div className="mt-1">{children}</div></label>;
}
