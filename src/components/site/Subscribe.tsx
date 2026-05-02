import { useEffect, useState } from "react";
import { Mail, Play, Youtube, Instagram, Facebook } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const schema = z.string().trim().email("Enter a valid email").max(255);

type Video = {
  id: string;
  title: string | null;
  person_name: string;
  role: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
};

type Channel = { id: string; platform: string; url: string };

const ICONS: Record<string, typeof Youtube> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
};

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    supabase.from("featured_videos").select("*").eq("active", true).order("display_order")
      .then(({ data }) => setVideos((data as Video[]) ?? []));
    supabase.from("social_channels").select("id,platform,url").eq("active", true).order("display_order")
      .then(({ data }) => setChannels((data as Channel[]) ?? []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email: parsed.data });
    setLoading(false);
    if (error) {
      if (error.code === "23505") return toast.success("You're already subscribed!");
      return toast.error(error.message);
    }
    toast.success("Subscribed! We'll keep you posted.");
    setEmail("");
  };

  return (
    <section className="py-16 bg-brand text-brand-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Join Our Channels</h2>
        <p className="text-brand-foreground/80 mt-2">To Stay Up to Date For The Latest News</p>

        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-background rounded-full p-2 shadow-soft">
          <div className="flex items-center gap-2 flex-1 px-4">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Mail" className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60">
            {loading ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>

        {channels.length > 0 && (
          <div className="mt-6 flex justify-center gap-3">
            {channels.map((c) => {
              const Icon = ICONS[c.platform.toLowerCase()] ?? Youtube;
              return (
                <a key={c.id} href={c.url} target="_blank" rel="noreferrer" aria-label={c.platform}
                  className="h-10 w-10 rounded-full bg-background/15 hover:bg-gold hover:text-gold-foreground flex items-center justify-center transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}

        {videos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.slice(0, 4).map((v) => {
              const inner = (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand/40" />
                  {v.thumbnail_url && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform" style={{ backgroundImage: `url("${v.thumbnail_url}")` }} />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-background/95 flex items-center justify-center shadow-soft">
                      <Play className="h-5 w-5 text-brand fill-brand ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-background/95 px-3 py-2 text-left">
                    <p className="text-[11px] font-bold text-brand leading-tight">{v.person_name}</p>
                    {v.role && <p className="text-[10px] text-muted-foreground leading-tight">{v.role}</p>}
                  </div>
                </>
              );
              const cls = "relative rounded-2xl overflow-hidden bg-soft shadow-card aspect-[4/3] group cursor-pointer block";
              return v.video_url ? (
                <a key={v.id} href={v.video_url} target="_blank" rel="noreferrer" className={cls}>{inner}</a>
              ) : (
                <div key={v.id} className={cls}>{inner}</div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
