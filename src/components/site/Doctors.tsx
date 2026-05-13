import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, Award, X, GraduationCap, Briefcase, Stethoscope, Calendar, Mail, Phone } from "lucide-react";
import { DoctorCardSkeleton } from "@/components/ui/skeleton-cards";

type Doctor = {
  id: string;
  name: string;
  title: string;
  qualifications: string | null;
  specialty: string;
  photo_url: string | null;
  description: string | null;
  experience: string | null;
};

export function Doctors() {
  const [docs, setDocs] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Doctor | null>(null);

  useEffect(() => {
    supabase
      .from("doctors")
      .select("*")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => {
        setDocs((data as Doctor[]) ?? []);
        setLoading(false);
      });
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  return (
    <section id="doctors" className="py-20 bg-soft/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Our Consultant Doctors</p>
          <h2 className="text-3xl md:text-4xl heading-display mt-2">
            Expert Care!.. <span className="text-gold">That You Can Trust!.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loading && Array.from({ length: 3 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
          {!loading && docs.map((d) => (
            <article
              key={d.id}
              className="bg-card border border-border rounded-2xl p-6 text-center shadow-card hover:shadow-soft transition-shadow"
            >
              <div className="mx-auto w-28 h-28 rounded-full overflow-hidden bg-soft border-4 border-gold/30 mb-4 flex items-center justify-center">
                {d.photo_url ? (
                  <img src={d.photo_url} alt={d.name} className="w-full h-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-brand/40" />
                )}
              </div>
              <h3 className="text-xl font-bold text-brand">{d.name}</h3>
              <p className="text-sm font-medium text-foreground mt-1">{d.title}</p>
              <p className="text-xs mt-2 inline-block px-3 py-0.5 rounded-full bg-gold/15 text-gold-foreground font-medium">
                {d.specialty}
              </p>
              {d.qualifications && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2">{d.qualifications}</p>
              )}
              {d.experience && (
                <p className="text-xs text-brand mt-2 inline-flex items-center gap-1 font-semibold">
                  <Award className="h-3 w-3" /> {d.experience}
                </p>
              )}
              <button
                onClick={() => setActive(d)}
                className="mt-4 text-xs font-semibold text-brand border border-brand/30 rounded-full px-4 py-1.5 hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                View Profile
              </button>
            </article>
          ))}
        </div>
      </div>

      {active && <DoctorProfileModal doctor={active} onClose={() => setActive(null)} />}
    </section>
  );
}

function parseList(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/[\n,•|]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function DoctorProfileModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const educations = parseList(doctor.qualifications);
  const experiences = parseList(doctor.description);

  const scrollToBooking = () => {
    onClose();
    setTimeout(() => document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-0 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background w-full md:max-w-4xl md:rounded-3xl max-h-screen md:max-h-[92vh] overflow-y-auto shadow-soft relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          aria-label="Close profile"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-white/95 hover:bg-white text-brand flex items-center justify-center shadow-card"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero */}
        <header className="relative bg-gradient-to-br from-brand via-brand to-[color-mix(in_oklab,var(--brand)_70%,black)] text-brand-foreground px-6 md:px-10 pt-12 pb-10 overflow-hidden">
          {/* decorative blobs */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
            <div className="mx-auto md:mx-0 h-36 w-36 md:h-44 md:w-44 rounded-full overflow-hidden border-4 border-gold shadow-2xl bg-soft flex items-center justify-center shrink-0">
              {doctor.photo_url ? (
                <img src={doctor.photo_url} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <UserRound className="h-20 w-20 text-brand/40" />
              )}
            </div>

            <div className="text-center md:text-left">
              <span className="inline-block text-[10px] tracking-[0.2em] uppercase bg-gold text-gold-foreground font-bold px-3 py-1 rounded-full">
                Consultant Doctor
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-3">{doctor.name}</h2>
              <p className="mt-1 text-base md:text-lg opacity-95">{doctor.title}</p>

              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                <Pill icon={<Stethoscope className="h-3.5 w-3.5" />}>{doctor.specialty}</Pill>
                {doctor.experience && <Pill icon={<Award className="h-3.5 w-3.5" />}>{doctor.experience}</Pill>}
              </div>

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={scrollToBooking}
                  className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-5 py-2.5 rounded-full hover:brightness-95 transition"
                >
                  <Calendar className="h-4 w-4" /> Book Appointment
                </button>
                <a
                  href="tel:+919666205020"
                  className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur font-semibold px-5 py-2.5 rounded-full transition"
                >
                  <Phone className="h-4 w-4" /> Call Clinic
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="px-6 md:px-10 py-10 space-y-10">
          {/* About */}
          {doctor.description && (
            <Section index="01" label="About" title="Profile Overview">
              <p className="text-foreground/80 leading-relaxed">{doctor.description}</p>
            </Section>
          )}

          {/* Education */}
          <Section index="02" label="Education" title="Academic Qualifications" icon={<GraduationCap className="h-5 w-5" />}>
            {educations.length ? (
              <ul className="grid md:grid-cols-2 gap-3">
                {educations.map((e, i) => (
                  <li
                    key={i}
                    className="bg-card border border-border rounded-xl p-4 text-sm flex gap-3 hover:border-gold/60 hover:shadow-card transition"
                  >
                    <span className="h-9 w-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0 font-bold text-xs">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-foreground/85 font-medium leading-snug">{e}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Education details available on request.</p>
            )}
          </Section>

          {/* Experience timeline */}
          <Section index="03" label="Experience" title="Professional Journey" icon={<Briefcase className="h-5 w-5" />}>
            {experiences.length ? (
              <ol className="relative border-l-2 border-gold/30 pl-6 space-y-5 ml-2">
                {experiences.map((x, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-gold border-4 border-background shadow-card" />
                    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition">
                      <p className="text-xs font-bold text-gold uppercase tracking-wider">Milestone {i + 1}</p>
                      <p className="text-sm text-foreground/85 mt-1 leading-relaxed">{x}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">
                {doctor.experience ?? "Experienced consultant. Get in touch for full credentials."}
              </p>
            )}
          </Section>

          {/* Footer CTA */}
          <div className="rounded-2xl border-2 border-dashed border-gold/50 bg-soft p-6 text-center">
            <h4 className="text-lg font-bold text-brand">Consult {doctor.name.split(" ")[0]} today</h4>
            <p className="text-sm text-muted-foreground mt-1">Same-day appointments available.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm">
              <a href="mailto:devsclinic20@gmail.com" className="inline-flex items-center gap-2 text-brand hover:underline">
                <Mail className="h-4 w-4" /> devsclinic20@gmail.com
              </a>
              <a href="tel:+919666205020" className="inline-flex items-center gap-2 text-brand hover:underline">
                <Phone className="h-4 w-4" /> +91 9666 20 50 20
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full">
      {icon}
      {children}
    </span>
  );
}

function Section({
  index,
  label,
  title,
  icon,
  children,
}: {
  index: string;
  label: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl font-extrabold text-gold/40 tabular-nums leading-none">{index}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-gold/60 to-transparent" />
        <div className="flex items-center gap-2">
          {icon && <span className="text-gold">{icon}</span>}
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-brand">{label}</p>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-brand mb-4 font-display">{title}</h3>
      {children}
    </section>
  );
}
