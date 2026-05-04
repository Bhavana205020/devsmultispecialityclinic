import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Bone, Activity, Stethoscope, Dumbbell, Pill, Scissors, ScanLine, TestTube,
  HeartPulse, Microscope, Baby, Brain, Eye, Smile, Syringe, Hospital,
  type LucideIcon,
} from "lucide-react";
import { ServiceCardSkeleton } from "@/components/ui/skeleton-cards";

const ICONS: Record<string, LucideIcon> = {
  Bone, Activity, Stethoscope, Dumbbell, Pill, Scissors, ScanLine, TestTube,
  HeartPulse, Microscope, Baby, Brain, Eye, Smile, Syringe, Hospital,
};

type Service = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {loading && Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          {!loading && services.map((s) => {
            const Icon = ICONS[s.icon] ?? Stethoscope;
            return (
              <div key={s.id} className="service-card p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-4">
                  <Icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-brand mb-2">{s.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                <button
                  onClick={() => document.getElementById("appointment")?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-3 text-xs font-semibold text-gold hover:underline"
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
