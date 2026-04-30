import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRound } from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  title: string;
  qualifications: string | null;
  specialty: string;
  photo_url: string | null;
};

export function Doctors() {
  const [docs, setDocs] = useState<Doctor[]>([]);

  useEffect(() => {
    supabase
      .from("doctors")
      .select("*")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => setDocs((data as Doctor[]) ?? []));
  }, []);

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
          {docs.map((d) => (
            <article
              key={d.id}
              className="bg-card border border-border rounded-2xl p-6 text-center shadow-card"
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
              {d.qualifications && (
                <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                  {d.qualifications}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
