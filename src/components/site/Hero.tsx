import { Phone, MessageCircle, CalendarDays } from "lucide-react";
import hero from "@/assets/hero-clinic.jpg";

export function Hero() {
  return (
    <section id="home" className="relative">
      <div className="relative w-full overflow-hidden">
        {/* Background image */}
        <div
          className="relative w-full bg-cover bg-center min-h-[420px] md:min-h-[520px] lg:min-h-[560px]"
          style={{ backgroundImage: `url(${hero})` }}
        >
          {/* White side fade overlay (stronger on left, fades to transparent on right) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
            <div className="max-w-2xl space-y-5 md:space-y-6 animate-fade-in">
              <p className="text-brand font-bold text-base md:text-lg">
                Dev's Multispeciality Clinic
              </p>
              <h1 className="heading-display leading-[1.05] text-5xl md:text-6xl lg:text-7xl">
                <span className="block text-brand">Complete Care</span>
                <span className="block text-gold mt-2">Under One Roof</span>
              </h1>
              <p className="text-base md:text-lg text-foreground/80 font-medium max-w-xl">
                Consultation, Advanced Diagnostic, Rehabilitation &amp; Pharmacy - all your
                health care needs, in one place
              </p>

              <div className="flex flex-wrap gap-4 pt-4 items-center">
                {/* Call Now (teal) */}
                <a
                  href="tel:+919666205020"
                  className="inline-flex items-center gap-3 rounded-2xl bg-brand text-brand-foreground pl-2 pr-5 py-2 shadow-soft hover:opacity-95 transition"
                >
                  <span className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </span>
                  <span className="leading-tight text-left">
                    <span className="block text-[11px] font-normal opacity-90">Call Now</span>
                    <span className="block text-sm font-semibold">+91 9666 20 50 20</span>
                  </span>
                </a>

                {/* Book Appointment (gold) */}
                <button
                  onClick={() =>
                    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-3 rounded-2xl btn-gold pl-2 pr-5 py-2 shadow-soft"
                >
                  <span className="h-10 w-10 rounded-xl bg-white/25 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-gold-foreground" />
                  </span>
                  <span className="leading-tight text-left">
                    <span className="block text-[11px] font-normal opacity-90">Book Your</span>
                    <span className="block text-sm font-semibold">Appointment Now</span>
                  </span>
                </button>

                {/* WhatsApp (white pill outlined) */}
                <a
                  href="https://wa.me/919666205020"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-foreground/15 text-foreground px-5 py-3 text-sm font-semibold shadow-soft hover:bg-soft transition"
                >
                  <span className="h-7 w-7 rounded-full border border-emerald-600 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                  </span>
                  Chat On What'sApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
