import { MapPin, Clock, Phone } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden md:block bg-brand text-brand-foreground text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gold" />
          <span className="opacity-90">402, 4th Floor, SMR Vinay Iconia Plaza, Masjid Banda, Kondapur, Hyderabad</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-gold" />
            <span className="opacity-90">Mon – Sat: 8:00 AM – 9:00 PM</span>
          </div>
          <a href="tel:+919666205020" className="flex items-center gap-2 hover:text-gold">
            <Phone className="h-3.5 w-3.5 text-gold" />
            <span className="font-semibold">+91 9666 20 50 20</span>
          </a>
        </div>
      </div>
    </div>
  );
}
