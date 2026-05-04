import { Phone, Calendar, MessageCircle } from "lucide-react";
import hero from "@/assets/hero-clinic.jpg";

export function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-in">
          <p className="section-eyebrow text-sm">Dev's Multispeciality Clinic</p>
          <h1 className="text-5xl md:text-6xl heading-display leading-[1.05]">
            Complete Care
            <br />
            <span className="text-gold">Under One Roof</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg">
            Consultation, Advanced Diagnostic, Rehabilitation & Pharmacy — all your healthcare
            needs, in one place.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 items-center">
            <a
              href="tel:+919666205020"
              className="inline-flex items-center gap-3 rounded-full bg-brand text-brand-foreground pl-2 pr-5 py-2 font-semibold shadow-soft hover:opacity-90"
            >
              <span className="h-9 w-9 rounded-full bg-brand-foreground/15 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gold" />
              </span>
              <span className="leading-tight text-left">
                <span className="block text-[10px] font-normal opacity-80">Call Now</span>
                <span className="text-sm">+91 9686 20 50 20</span>
              </span>
            </a>
            <a
              href="tel:+919666205020"
              className="inline-flex items-center gap-3 rounded-full btn-gold pl-2 pr-5 py-2 font-semibold shadow-soft"
            >
              <span className="h-9 w-9 rounded-full bg-background/30 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gold-foreground" />
              </span>
              <span className="leading-tight text-left">
                <span className="block text-[10px] font-normal opacity-80">Call Now</span>
                <span className="text-sm">+91 9686 20 50 20</span>
              </span>
            </a>
            <a
              href="https://wa.me/919666205020"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-background border border-border text-brand px-5 py-3 text-sm font-semibold shadow-soft hover:bg-soft"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              Chat On WhatsApp
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gold/10 rounded-3xl blur-2xl" />
          <img
            src={hero}
            alt="Dev's Multispeciality Clinic reception"
            width={1280}
            height={768}
            className="relative rounded-2xl shadow-soft w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}
