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

        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-2xl mx-auto bg-background rounded-2xl sm:rounded-full p-2 shadow-soft">
          <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 min-w-0">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Mail" className="flex-1 min-w-0 bg-transparent py-3 text-sm text-foreground outline-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold rounded-xl sm:rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60 whitespace-nowrap">
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
          <div className="mt-10">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide [scroll-behavior:smooth]">
              {videos.map((v) => {
                const inner = (
                  <>
                    {v.thumbnail_url && (
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url("${v.thumbnail_url}")` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-background/95 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-brand fill-brand ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-left text-white">
                      {v.title && <p className="text-xs font-semibold opacity-90 line-clamp-2">{v.title}</p>}
                      <p className="text-sm font-bold mt-1 leading-tight">{v.person_name}</p>
                      {v.role && <p className="text-[11px] opacity-80 leading-tight">{v.role}</p>}
                    </div>
                  </>
                );
                const cls =
                  "relative shrink-0 w-[200px] sm:w-[220px] aspect-[9/16] rounded-2xl overflow-hidden bg-soft shadow-card group cursor-pointer block snap-start";
                return v.video_url ? (
                  <a key={v.id} href={v.video_url} target="_blank" rel="noreferrer" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <div key={v.id} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-brand-foreground/60 mt-2">← Swipe to see more →</p>
          </div>
        )}
      </div>
    </section>
  );
}
