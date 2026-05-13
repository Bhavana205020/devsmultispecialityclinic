import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stethoscope } from "lucide-react";
import { ServiceCardSkeleton } from "@/components/ui/skeleton-cards";

type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

// Map service name (normalized) → uploaded PNG filename in /public/services/
const NAME_TO_IMAGE: Record<string, string> = {
  "orthopaedic": "Orthopaedic.png",
  "orthopedic": "Orthopaedic.png",
  "diagnostics": "Diagnostics.png",
  "digital x-ray": "Digital_X-ray.png",
  "digital xray": "Digital_X-ray.png",
  "x-ray": "Digital_X-ray.png",
  "gastroenterology": "Gastroenterology.png",
  "general physician": "General_physician.png",
  "consultation": "General_physician.png",
  "pharmacy": "Pharmacy.png",
  "physiotherapy": "Physiotherapy.png",
  "surgicals": "Surgicals.png",
  "surgical": "Surgicals.png",
};

function imageFor(name: string): string | null {
  const key = name.trim().toLowerCase();
  if (NAME_TO_IMAGE[key]) return `/services/${NAME_TO_IMAGE[key]}`;
  // try first word match
  const first = key.split(/\s|\//)[0];
  if (NAME_TO_IMAGE[first]) return `/services/${NAME_TO_IMAGE[first]}`;
  return null;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("services")
      .select("id,name,description,icon")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => {
        setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="services" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Our Medical Services</p>
          <h2 className="text-3xl md:text-4xl heading-display mt-2">
            Wide Range of Healthcare Services
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {loading && Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          {!loading && services.map((s) => {
            const img = imageFor(s.name);
            return (
              <div key={s.id} className="service-card p-6 text-center flex flex-col">
                <div className="mx-auto h-24 w-24 flex items-center justify-center mb-4">
                  {img ? (
                    <img
                      src={img}
                      alt={s.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Stethoscope className="h-12 w-12 text-gold" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-brand mb-3">{s.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {s.description}
                </p>
                <button
                  onClick={() => document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-4 text-xs font-semibold text-gold hover:underline self-center"
                >
                  Read More →
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
