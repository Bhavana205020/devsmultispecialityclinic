import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Clock, Send, ShieldCheck, Stethoscope, HeartPulse, ArrowRight, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.webp";
import { externalLinkProps } from "@/lib/external-link";

type SocialChannel = { id: string; platform: string; url: string };

export function ContactFooter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [channels, setChannels] = useState<SocialChannel[]>([]);

  useEffect(() => {
    supabase
      .from("social_channels")
      .select("id,platform,url")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => setChannels(data ?? []));
  }, []);

  const iconFor = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("insta")) return <Instagram className="h-4 w-4" />;
    if (p.includes("face")) return <Facebook className="h-4 w-4" />;
    if (p.includes("you")) return <Youtube className="h-4 w-4" />;
    return <MessageCircle className="h-4 w-4" />;
  };


  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = z.string().trim().email("Enter a valid email").max(255).safeParse(email);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.from("subscribers").insert({ email: parsed.data });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Subscribed! Thank you.");
    setEmail("");
  };

  return (
    <>
      {/* Contact + Map */}
      <section id="contact" className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border-2 border-gold rounded-full px-6 py-2.5 mb-6 bg-soft/60">
                <Clock className="h-5 w-5 text-gold" />
                <h3 className="text-xl font-extrabold text-brand">Clinic Timings</h3>
              </div>
              <p className="text-3xl md:text-4xl font-extrabold text-brand tracking-wide">08 : 00 AM – 09 : 00 PM</p>
              <p className="text-lg text-foreground/70 mt-2 font-semibold">Monday – Saturday</p>
              <p className="text-sm text-muted-foreground mt-1">Sunday: Emergency consultations only</p>

              <div className="mt-6 space-y-3 text-sm text-foreground/85">
                <ContactRow icon={<MapPin className="h-4 w-4" />}>
                  <a
                    {...externalLinkProps("https://www.google.com/maps/place/Dev's+Multispeciality+Clinic/@17.4677618,78.3326512,17z")}
                    className="hover:text-brand"
                  >
                    402, 4th Floor, SMR Vinay Iconia Plaza, Masjid Banda, Kondapur, Hyderabad — 500084
                  </a>
                </ContactRow>
                <ContactRow icon={<Phone className="h-4 w-4" />}>
                  <a href="tel:+919666205020" className="hover:text-brand font-semibold">+91 9666 20 50 20</a>
                </ContactRow>
                <ContactRow icon={<Mail className="h-4 w-4" />}>
                  <a href="mailto:devsclinic20@gmail.com" className="hover:text-brand">devsclinic20@gmail.com</a>
                </ContactRow>
                <a
                  {...externalLinkProps("https://wa.me/919666205020?text=Hello%20Dev%27s%20Multispeciality%20Clinic")}
                  className="inline-flex items-center gap-2 mt-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm font-semibold shadow-soft"
                >
                  <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-card border border-border h-72 relative">
              <iframe
                title="Clinic Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.83182158289!2d78.33265117493664!3d17.467761783433144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb933c2c681471%3A0x2fb7c840e0283252!2sDev's%20Multispeciality%20Clinic!5e0!3m2!1sen!2sin!4v1779957430865!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <a
                {...externalLinkProps("https://www.google.com/maps/place/Dev's+Multispeciality+Clinic/@17.4677618,78.3326512,17z")}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur px-3 py-1.5 text-xs font-semibold text-brand shadow-soft hover:bg-background"
              >
                <MapPin className="h-3.5 w-3.5" /> Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-brand text-brand-foreground pt-14 pb-6">
        {/* Brand band */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
            <span className="text-gold">D</span>ev's <span className="text-gold">M</span>ultispeciality <span className="text-gold">C</span>linic
          </h2>
          <p className="text-xs md:text-sm opacity-90 mt-2">
            Consultation | Rehabilitation | Pharmacy | Surgicals | Diagnostics
          </p>
          <div className="mt-3 mx-auto h-[2px] w-32 bg-gold/70 rounded-full" />
        </div>

        {/* Trust badges */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: <ShieldCheck className="h-5 w-5 text-gold" />, label: "Licensed & Certified" },
            { icon: <HeartPulse className="h-5 w-5 text-gold" />, label: "Compassionate Care" },
            { icon: <Stethoscope className="h-5 w-5 text-gold" />, label: "Expert Doctors" },
            { icon: <Clock className="h-5 w-5 text-gold" />, label: "13 Hours Daily" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-3 bg-brand-foreground/5 border border-brand-foreground/10 rounded-xl px-4 py-3">
              {b.icon}
              <span className="text-sm font-semibold">{b.label}</span>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="md:col-span-4">
            <img src={logo} alt="Dev's Multispeciality Clinic" className="h-20 w-auto bg-white/95 rounded-md p-1" />
            <p className="text-sm opacity-90 mt-4 leading-relaxed">
              A trusted multispeciality clinic in Kondapur, Hyderabad — bringing consultation, diagnostics, pharmacy, surgicals and rehabilitation under one roof.
            </p>
            <p className="text-xs opacity-75 mt-3">@devsmultispecialityclinic</p>
            {channels.length > 0 && (
              <div className="flex gap-3 mt-4">
                {channels.map((c) => (
                  <Social key={c.id} label={c.platform} href={c.url}>
                    {iconFor(c.platform)}
                  </Social>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-gold mb-4 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ["home", "Home"],
                ["services", "Services"],
                ["doctors", "Our Doctors"],
                ["why", "Why Choose Us"],
                ["contact", "Contact Us"],
                ["appointment", "Book Appointment"],
              ].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="hover:text-gold opacity-90 inline-flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-gold" /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-gold mb-4 uppercase tracking-wider text-xs">Our Services</h4>
            <ul className="space-y-2.5 text-sm opacity-90">
              {[
                "General Physician",
                "Orthopaedic",
                "Physiotherapy",
                "Gastroenterology",
                "Pharmacy",
                "Digital X-ray",
                "Diagnostics",
                "Surgicals",
              ].map((s) => (
                <li key={s} className="hover:text-gold transition-colors">• {s}</li>
              ))}
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-gold mb-4 uppercase tracking-wider text-xs">Get In Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-gold" />
                </span>
                <div>
                  <p className="text-xs opacity-75">Call or WhatsApp</p>
                  <a href="tel:+919666205020" className="font-semibold hover:text-gold">+91 9666 20 50 20</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-gold" />
                </span>
                <div>
                  <p className="text-xs opacity-75">Email us</p>
                  <a href="mailto:devsclinic20@gmail.com" className="font-semibold hover:text-gold break-all">devsclinic20@gmail.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-gold" />
                </span>
                <div>
                  <p className="text-xs opacity-75">Visit</p>
                  <p className="font-semibold leading-snug">Kondapur, Hyderabad</p>
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <form onSubmit={subscribe} className="mt-6">
              <p className="text-xs uppercase tracking-wider font-bold text-gold mb-2">Health tips in your inbox</p>
              <div className="flex bg-white/10 rounded-full p-1 border border-white/15 focus-within:border-gold transition">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent px-4 py-2 text-sm placeholder:text-white/50 outline-none"
                />
                <button
                  type="submit"
                  disabled={busy}
                  aria-label="Subscribe"
                  className="h-9 w-9 rounded-full bg-gold text-gold-foreground flex items-center justify-center hover:brightness-95 disabled:opacity-50"
                >
                  {busy ? <span className="h-3 w-3 rounded-full border-2 border-gold-foreground/30 border-t-gold-foreground animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-5 border-t border-brand-foreground/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-80">
            <p>© {new Date().getFullYear()} Dev's Multispeciality Clinic — All Rights Reserved</p>
            <div className="flex gap-5">
              <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gold">Terms of Service</Link>
              <button onClick={() => scrollTo("home")} className="hover:text-gold inline-flex items-center gap-1">
                Back to top <ArrowRight className="h-3 w-3 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function ContactRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="h-8 w-8 rounded-full bg-gold/15 text-gold flex items-center justify-center shrink-0">{icon}</span>
      <span className="pt-1">{children}</span>
    </div>
  );
}

function Social({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  return (
    <a aria-label={label} href={href} className="p-2.5 rounded-full bg-brand-foreground/10 hover:bg-gold hover:text-gold-foreground transition-colors">
      {children}
    </a>
  );
}
