import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, CalendarDays } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(7, "Valid phone required").max(20).regex(/^[0-9+\-\s()]+$/, "Invalid phone"),
  department: z.string().min(1, "Select a department"),
  preferred_date: z.string().min(1, "Select a date"),
  message: z.string().max(500).optional(),
});

export function AppointmentForm() {
  const [departments, setDepartments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    department: "",
    preferred_date: "",
    message: "",
  });

  useEffect(() => {
    supabase
      .from("services")
      .select("name")
      .eq("active", true)
      .order("display_order")
      .then(({ data }) => setDepartments(data?.map((d) => d.name) ?? []));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      department: parsed.data.department,
      preferred_date: parsed.data.preferred_date,
      message: parsed.data.message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Appointment request sent! We'll contact you shortly.");
    setForm({ full_name: "", phone: "", department: "", preferred_date: "", message: "" });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="appointment" className="py-20 bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8">
        <div className="bg-brand text-brand-foreground rounded-2xl p-8 flex flex-col justify-center shadow-soft">
          <CalendarDays className="h-10 w-10 text-gold mb-4" />
          <h3 className="text-2xl font-bold">Book Your Appointment</h3>
          <p className="text-gold font-semibold mt-1">We're Here to Help You</p>
          <p className="text-sm opacity-80 mt-4">
            Fill in your details and our team will connect with you shortly.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Quick Appointment", "Priority Consultation", "Trusted by Hundreds"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={submit}
          className="bg-soft rounded-2xl p-6 md:p-8 shadow-card grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-1">
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Enter Your Full Name"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <input
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Enter Your Mobile Number"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Select Department</label>
            <select
              required
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="">Choose a department</option>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Preferred Date</label>
            <input
              required
              type="date"
              min={today}
              value={form.preferred_date}
              onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-foreground">Message (Optional)</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write Your Message"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 btn-gold rounded-md py-3 font-semibold disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Book Appointment Now"}
          </button>
        </form>
      </div>
    </section>
  );
}
