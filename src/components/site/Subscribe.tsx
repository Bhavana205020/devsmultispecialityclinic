import { useState } from "react";
import { Mail, Play } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.string().trim().email("Enter a valid email").max(255);

const VIDEOS = [
  { name: "John Kim", role: "Mobile App Developer" },
  { name: "Daniel Brown", role: "HR Manager" },
  { name: "Laura Patel", role: "University Lecturer" },
  { name: "John Kim", role: "Mobile App Developer" },
];

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Subscribed! We'll keep you posted.");
      setEmail("");
      setLoading(false);
    }, 400);
  };

  return (
    <section className="py-16 bg-brand text-brand-foreground">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Join Our Channels</h2>
        <p className="text-brand-foreground/80 mt-2">To Stay Up to Date For The Latest News</p>

        <form
          onSubmit={submit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-background rounded-full p-2 shadow-soft"
        >
          <div className="flex items-center gap-2 flex-1 px-4">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Mail"
              className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>

        <p className="text-xs md:text-sm text-brand-foreground/80 mt-6 italic">
          He specializes in preventive cardiology, coronary artery disease, hypertension, arrhythmias, and heart failure management.
        </p>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {VIDEOS.map((v, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden bg-soft shadow-card aspect-[4/3] group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-transparent to-brand/40" />
              <div
                className="absolute inset-0 bg-cover bg-center opacity-90 group-hover:scale-105 transition-transform"
                style={{
                  backgroundImage: `url("https://images.unsplash.com/photo-${
                    ["1612349317150-e413f6a5b16d", "1559839734-2b71ea197ec2", "1582750433449-648ed127bb54", "1622253692010-333f2da6031d"][i]
                  }?w=400&q=70")`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-background/95 flex items-center justify-center shadow-soft">
                  <Play className="h-5 w-5 text-brand fill-brand ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 px-3 py-2 text-left">
                <p className="text-[11px] font-bold text-brand leading-tight">{v.name}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{v.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
