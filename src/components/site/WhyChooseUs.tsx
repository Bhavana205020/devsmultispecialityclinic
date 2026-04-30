import { Stethoscope, Microscope, HeartPulse, Clock4 } from "lucide-react";

const items = [
  { Icon: Stethoscope, title: "Experienced Doctors" },
  { Icon: Microscope, title: "Advanced Facilities" },
  { Icon: HeartPulse, title: "Patient Focused Care" },
  { Icon: Clock4, title: "Minimal Waiting Time" },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-brand text-brand-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gold text-sm font-semibold">Have any confusion at</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Why Choose Us?</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ Icon, title }) => (
            <div key={title} className="flex flex-col items-center text-center gap-3">
              <div className="w-20 h-20 rounded-full border-2 border-gold/60 flex items-center justify-center">
                <Icon className="h-9 w-9 text-gold" />
              </div>
              <p className="font-semibold text-sm md:text-base">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
