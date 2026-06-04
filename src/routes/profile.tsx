import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { ContactFooter } from "@/components/site/ContactFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdminUser } from "@/lib/auth-routing";
import {
  UserRound, Upload, LogOut, Mail, Phone, Calendar, User,
  CalendarCheck, Clock, CheckCircle2, XCircle, Loader2,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — Dev's Multispeciality Clinic" }] }),
  component: ProfilePage,
});

type Profile = {
  full_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  avatar_url: string | null;
};

type Appt = {
  id: string;
  department: string;
  preferred_date: string;
  status: "pending" | "confirmed" | "rejected" | "waiting";
  message: string | null;
  created_at: string;
};

const schema = z.object({
  full_name: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(20).regex(/^[0-9+\-\s()]*$/, "Invalid phone").optional().or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  gender: z.string().max(20).optional().or(z.literal("")),
});

const STATUS_STYLES: Record<Appt["status"], { cls: string; icon: React.ReactNode; label: string }> = {
  pending: { cls: "bg-orange-100 text-orange-700", icon: <Clock className="h-3 w-3" />, label: "Pending" },
  confirmed: { cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" />, label: "Confirmed" },
  rejected: { cls: "bg-red-100 text-red-700", icon: <XCircle className="h-3 w-3" />, label: "Rejected" },
  waiting: { cls: "bg-blue-100 text-blue-700", icon: <Clock className="h-3 w-3" />, label: "Waiting" },
};

function ProfilePage() {
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>({
    full_name: "", phone: "", date_of_birth: "", gender: "", avatar_url: null,
  });
  const [appts, setAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const resolveAvatar = async (stored: string | null) => {
    if (!stored) { setAvatarSrc(null); return; }
    const path = stored.includes("/avatars/")
      ? stored.split("/avatars/").pop()!
      : stored;
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 3600);
    setAvatarSrc(error ? null : data?.signedUrl ?? null);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav({ to: "/login" });
    });

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        nav({ to: "/login" });
        return;
      }
      if (await isAdminUser(session.user.id)) {
        nav({ to: "/admin" });
        return;
      }
      setUserId(session.user.id);
      setEmail(session.user.email ?? "");

      const [{ data: prof }, { data: apptData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", session.user.id).maybeSingle(),
        supabase
          .from("appointments")
          .select("id,department,preferred_date,status,message,created_at")
          .eq("phone", "__never__") // placeholder; real lookup below
          .order("created_at", { ascending: false }),
      ]);

      if (prof) {
        setProfile({
          full_name: prof.full_name ?? "",
          phone: prof.phone ?? "",
          date_of_birth: prof.date_of_birth ?? "",
          gender: prof.gender ?? "",
          avatar_url: prof.avatar_url ?? null,
        });
        await resolveAvatar(prof.avatar_url ?? null);
      }

      // Look up patient appointments by their phone (after profile loads)
      if (prof?.phone) {
        const { data: phoneAppts } = await supabase
          .from("appointments")
          .select("id,department,preferred_date,status,message,created_at")
          .eq("phone", prof.phone)
          .order("created_at", { ascending: false });
        setAppts((phoneAppts as Appt[]) ?? []);
      } else {
        setAppts([]);
      }

      setLoading(false);
    })();

    return () => sub.subscription.unsubscribe();
  }, [nav]);

  const handleUpload = async (file: File) => {
    if (!userId) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image.");
    if (file.size > 3 * 1024 * 1024) return toast.error("Image must be under 3 MB.");

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploading(false);
      return toast.error(upErr.message);
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setProfile((p) => ({ ...p, avatar_url: data.publicUrl }));
    setUploading(false);
    toast.success("Photo uploaded — remember to save.");
  };

  const save = async () => {
    if (!userId) return;
    const parsed = schema.safeParse(profile);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          full_name: profile.full_name || null,
          phone: profile.phone || null,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          avatar_url: profile.avatar_url,
        },
        { onConflict: "user_id" }
      );
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <p className="section-eyebrow">Patient Portal</p>
            <h1 className="text-3xl md:text-4xl heading-display mt-1">My Profile</h1>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 text-sm font-semibold border border-border rounded-full px-4 py-2 hover:bg-soft"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile card */}
          <section className="md:col-span-2 bg-card rounded-2xl shadow-card border border-border p-6">
            <h2 className="text-lg font-bold text-brand mb-5">Personal Information</h2>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6 pb-5 border-b border-border">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-soft border-4 border-gold/30 flex items-center justify-center shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserRound className="h-12 w-12 text-brand/40" />
                    )}
                  </div>
                  <div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                    />
                    <button
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center gap-2 text-sm font-semibold border border-border rounded-md px-3 py-2 hover:bg-soft disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploading ? "Uploading..." : "Change Photo"}
                    </button>
                    <p className="text-[11px] text-muted-foreground mt-1.5">JPG/PNG, max 3 MB.</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field icon={<User className="h-3.5 w-3.5" />} label="Full Name">
                    <input
                      value={profile.full_name ?? ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field icon={<Mail className="h-3.5 w-3.5" />} label="Email (read-only)">
                    <input value={email} readOnly className={`${inputCls} bg-soft text-muted-foreground`} />
                  </Field>
                  <Field icon={<Phone className="h-3.5 w-3.5" />} label="Phone">
                    <input
                      value={profile.phone ?? ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </Field>
                  <Field icon={<Calendar className="h-3.5 w-3.5" />} label="Date of Birth">
                    <input
                      type="date"
                      value={profile.date_of_birth ?? ""}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className={inputCls}
                    />
                  </Field>
                  <Field icon={<User className="h-3.5 w-3.5" />} label="Gender">
                    <select
                      value={profile.gender ?? ""}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </Field>
                </div>

                  <button
                  onClick={save}
                  disabled={saving}
                    className="mt-6 w-full sm:w-auto btn-gold rounded-md px-6 py-2.5 font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </button>
              </>
            )}
          </section>

          {/* Appointments sidebar */}
          <aside className="bg-card rounded-2xl shadow-card border border-border p-6">
            <h2 className="text-lg font-bold text-brand mb-4 inline-flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" /> My Appointments
            </h2>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : appts.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No appointments yet.</p>
                <Link
                  to="/"
                  hash="appointment"
                  className="inline-block mt-3 text-xs font-semibold text-brand hover:underline"
                >
                  Book your first appointment →
                </Link>
                <p className="text-[11px] text-muted-foreground mt-3">
                  Add your phone number above to link past bookings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {appts.map((a) => {
                  const s = STATUS_STYLES[a.status];
                  return (
                    <div key={a.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-brand">{a.department}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${s.cls}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: <span className="font-medium text-foreground">{a.preferred_date}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      </main>
      <ContactFooter />
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand";

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 inline-flex items-center gap-1.5 mb-1">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
