import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(2000),
});
const BodySchema = z.object({
  messages: z.array(MsgSchema).min(1).max(20),
});

// Simple in-memory IP rate limit: 20 requests / minute per IP
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

const CLINIC_INFO = `
You are "Dev's Clinic Assistant" — a warm, concise AI receptionist for Dev's Multispeciality Clinic in Kondapur, Hyderabad.

CLINIC PROFILE
- Name: Dev's Multispeciality Clinic
- Address: 402, 4th Floor, SMR Vinay Iconia Plaza, Masjid Banda, Kondapur, Hyderabad — 500084, Telangana, India
- Phone / WhatsApp: +91 9666 20 50 20
- Email: devsclinic20@gmail.com
- Timings: Monday – Saturday, 8:00 AM – 9:00 PM (13 hours daily). Sunday: emergency consultations only.
- Google Maps: https://www.google.com/maps/place/Dev's+Multispeciality+Clinic
- Approach: Affordable, family-centred multispeciality care under one roof — consultation, diagnostics, pharmacy, surgicals and rehabilitation.

CORE SERVICES (refer patients to the right department)
- General Physician / Consultation — fever, infections, diabetes, hypertension, thyroid, preventive checkups.
- Orthopaedic — joint pain, fractures, sports injuries, arthritis, back & neck pain.
- Physiotherapy — back pain, post-surgical rehab, sports injuries, stroke recovery, posture correction.
- Gastroenterology — acidity, IBS, fatty liver, ulcers, jaundice, endoscopy referrals.
- Diagnostics — blood tests, urine, hormones, full-body health checkups (NABL-grade lab partners).
- Digital X-Ray — chest, bone, sinus imaging with low-radiation digital sensors, in-house.
- Pharmacy — genuine medicines, drug-interaction counselling, in-house dispensing.
- Surgicals — minor surgeries, day-care procedures, dressings, suturing, biopsies.

BOOKING
- Preferred: tap the "Book Appointment" button on this page — choose department, date & we'll confirm by phone/WhatsApp.
- Alternative: call or WhatsApp +91 9666 20 50 20.

HOW TO BEHAVE
- Be kind, brief and clear — 2 to 4 short sentences in most replies. Use light markdown when useful.
- When sharing doctor info, use ONLY the "OUR DOCTORS" list provided below. Never invent doctor names, specialities, fees or availability.
- For symptoms, suggest the most relevant department and remind them this is general guidance, not a medical diagnosis.
- For emergencies (chest pain, breathlessness, severe bleeding, stroke symptoms, accidents) tell them to call 108 or visit the nearest ER immediately.
- For directions, share the address above and offer the Google Maps link.
- Do not prescribe medication or dosages.
`.trim();


export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            "unknown";
          if (rateLimited(ip)) {
            return new Response(
              JSON.stringify({ error: "Too many requests. Please wait a moment." }),
              { status: 429, headers: { "Content-Type": "application/json" } },
            );
          }

          const raw = await request.json().catch(() => null);
          const parsed = BodySchema.safeParse(raw);
          if (!parsed.success) {
            return new Response(JSON.stringify({ error: "Invalid request" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const { messages } = parsed.data;

          const apiKey = process.env.LOVABLE_API_KEY;
          if (!apiKey) {
            return new Response(JSON.stringify({ error: "AI is not configured." }), { status: 500 });
          }

          // Pull live data so the bot stays in sync with admin changes
          let dynamic = "";
          try {
            const [{ data: services }, { data: doctors }] = await Promise.all([
              supabaseAdmin.from("services").select("name,description").eq("active", true).order("display_order"),
              supabaseAdmin.from("doctors").select("name,title,specialty,qualifications,experience").eq("active", true).order("display_order"),
            ]);
            if (services?.length) {
              dynamic += "\nLIVE SERVICES LIST:\n" + services.map((s) => `- ${s.name}: ${s.description}`).join("\n");
            }
            if (doctors?.length) {
              dynamic += "\n\nOUR DOCTORS:\n" + doctors.map((d) => `- ${d.name} (${d.title}) — ${d.specialty}${d.qualifications ? `; ${d.qualifications}` : ""}${d.experience ? `; ${d.experience}` : ""}`).join("\n");
            }
          } catch {
            /* ignore data errors, fall back to static info */
          }

          const trimmed = messages.slice(-12);

          const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": apiKey,
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "system", content: CLINIC_INFO + dynamic }, ...trimmed],
            }),
          });

          if (!aiRes.ok) {
            const text = await aiRes.text();
            const status = aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500;
            const error =
              aiRes.status === 429
                ? "I'm getting too many requests right now. Please try again in a moment."
                : aiRes.status === 402
                ? "AI credits are exhausted. Please contact the clinic directly."
                : "Sorry, I had trouble responding. Please try again.";
            console.error("AI gateway error", aiRes.status, text);
            return new Response(JSON.stringify({ error }), { status });
          }

          const json = (await aiRes.json()) as { choices?: { message?: { content?: string } }[] };
          const reply = json.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate a response.";
          return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("/api/chat error", err);
          return new Response(JSON.stringify({ error: "Unexpected error" }), { status: 500 });
        }
      },
    },
  },
});
