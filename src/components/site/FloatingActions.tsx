import { MessageCircle, Calendar } from "lucide-react";

const WHATSAPP_NUMBER = "919876543210"; // TODO: replace with real clinic number

export function FloatingActions() {
  const scrollToBooking = () => {
    document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          "Hello, I'd like to book an appointment at Dev's Multispeciality Clinic.",
        )}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-soft flex items-center justify-center transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Sticky Book Appointment (mobile primary) */}
      <button
        onClick={scrollToBooking}
        className="fixed bottom-6 left-6 z-40 md:hidden btn-gold rounded-full px-4 py-3 text-sm font-semibold shadow-soft inline-flex items-center gap-2"
      >
        <Calendar className="h-4 w-4" /> Book Appointment
      </button>
    </>
  );
}
