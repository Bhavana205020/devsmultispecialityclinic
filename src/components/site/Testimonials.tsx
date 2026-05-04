import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, UserCircle2 } from "lucide-react";
import { TestimonialCardSkeleton } from "@/components/ui/skeleton-cards";

type T = { id: string; patient_name: string; rating: number; message: string };

export function Testimonials() {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase
      .from("testimonials")
      .select("id,patient_name,rating,message")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => {
        setItems((data as T[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="section-eyebrow">Patients Love Us</p>
          <h2 className="text-3xl md:text-4xl heading-display mt-2">What Our Patients Say</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {loading && Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)}
          {!loading && items.map((t) => (
            <div key={t.id} className="bg-soft rounded-2xl p-6 shadow-card">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{t.message}</p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
                <UserCircle2 className="h-9 w-9 text-brand/60" />
                <p className="font-semibold text-brand">{t.patient_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
