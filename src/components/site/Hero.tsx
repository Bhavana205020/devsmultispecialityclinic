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

          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="tel:+919666205020"
              className="inline-flex items-center gap-2 rounded-md bg-brand text-brand-foreground px-5 py-3 font-semibold shadow-soft hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              <span>
                <span className="block text-[10px] font-normal opacity-80 leading-none">Call Now</span>
                +91 9666 20 50 20
              </span>
            </a>
            <button
              onClick={() => scrollTo("appointment")}
              className="btn-gold rounded-md px-5 py-3 font-semibold inline-flex items-center gap-2 shadow-soft"
            >
              <Calendar className="h-4 w-4" />
              Book Your Appointment Now
            </button>
            <a
              href="https://wa.me/919666205020"
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-emerald-600 text-white px-5 py-3 font-semibold inline-flex items-center gap-2 shadow-soft hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
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
