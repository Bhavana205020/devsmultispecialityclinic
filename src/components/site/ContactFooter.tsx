import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

export function ContactFooter() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <section id="contact" className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border-2 border-gold rounded-full px-6 py-2.5 mb-6 bg-soft/60">
              <Clock className="h-5 w-5 text-gold" />
              <h3 className="text-xl font-extrabold text-brand">Clinic Timings</h3>
            </div>
            <p className="text-3xl md:text-4xl font-extrabold text-brand tracking-wide">08 : 00 AM – 09 : 00 PM</p>
            <p className="text-lg text-foreground/70 mt-2 font-semibold">Monday – Saturday</p>
            <div className="mt-6 space-y-2 text-sm text-foreground/80">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gold mt-0.5" />
                402, 4th Floor, SMR Vinay Iconia Plaza, Masjid Banda, Kondapur, Hyderabad
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href="tel:+919666205020" className="hover:text-brand">+91 9666 20 50 20</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:devsclinic20@gmail.com" className="hover:text-brand">
                  devsclinic20@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card border border-border h-72">
            <iframe
              title="Clinic Map"
              src="https://maps.google.com/maps?q=SMR%20Vinay%20Iconia%20Plaza%20Kondapur%20Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <footer className="bg-brand text-brand-foreground pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <img src={logo} alt="Dev's Multispeciality Clinic" className="h-14 w-auto bg-white/95 rounded-md p-1" />
            <p className="text-xs mt-3 opacity-80">
              Consultation | Rehabilitation | Pharmacy | Surgicals | Diagnostics
            </p>
            <div className="flex gap-3 mt-4">
              <a aria-label="Instagram" href="#" className="p-2 rounded-full bg-brand-foreground/10 hover:bg-gold/30"><Instagram className="h-4 w-4" /></a>
              <a aria-label="Facebook" href="#" className="p-2 rounded-full bg-brand-foreground/10 hover:bg-gold/30"><Facebook className="h-4 w-4" /></a>
              <a aria-label="YouTube" href="#" className="p-2 rounded-full bg-brand-foreground/10 hover:bg-gold/30"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ["home", "Home"],
                ["services", "Services"],
                ["doctors", "Our Doctors"],
                ["contact", "Contact Us"],
                ["appointment", "Book Appointment"],
              ].map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="hover:text-gold opacity-90">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold mb-3">Our Services</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Pharmacy</li>
              <li>Orthopaedic</li>
              <li>Physiotherapy</li>
              <li>Gastroenterology</li>
              <li>General Physician</li>
              <li>Surgicals</li>
              <li>Digital X-ray</li>
              <li>Diagnostics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold mb-3">Contact Us</h4>
            <p className="text-sm opacity-90">Call Or WhatsApp</p>
            <a href="tel:+919666205020" className="text-sm font-semibold hover:text-gold">
              +91 9666 20 50 20
            </a>
            <p className="text-sm opacity-90 mt-3">Mail</p>
            <a href="mailto:devsclinic20@gmail.com" className="text-sm font-semibold hover:text-gold">
              devsclinic20@gmail.com
            </a>
          </div>
        </div>
        <div className="mt-10 pt-5 border-t border-brand-foreground/20 text-center text-xs opacity-70">
          @{new Date().getFullYear()} Devsmultispecialityclinic – All Rights Reserved
        </div>
      </footer>
    </>
  );
}
