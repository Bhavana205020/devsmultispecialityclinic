import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const CLINIC_INFO = `
You are "Dev's Clinic Assistant" — a warm, concise AI receptionist for Dev's Multispeciality Clinic in Kondapur, Hyderabad.

CLINIC PROFILE
- Name: Dev's Multispeciality Clinic
- Location: Kondapur, Hyderabad, Telangana
- Phone: +91 98765 43210 (call to confirm exact number with the front desk)
- Timings: Mon–Sat, 9:00 AM – 9:00 PM. Sunday: emergency only.
- Approach: Affordable, family-centred multispeciality care under one roof — consultations, diagnostics, pharmacy and minor procedures.

CORE SERVICES (refer patients to the right department)
- General Physician — fever, infections, diabetes, hypertension, thyroid, preventive checkups.
- Orthopaedic — joint pain, fractures, sports injuries, arthritis, back & neck pain.
- Physiotherapy — back pain, post-surgical rehab, sports injuries, stroke recovery, posture.
- Gastroenterology — acidity, IBS, fatty liver, ulcers, jaundice, endoscopy referrals.
- Diagnostics — blood tests, urine, hormones, full-body health checkups (NABL-grade).
- Digital X-Ray — chest, bone, sinus imaging with low-radiation digital sensors.
- Pharmacy — genuine medicines, drug-interaction counselling, in-house dispensing.
- Surgicals — minor surgeries, day-care procedures, dressings, suturing, biopsies.

HOW TO BEHAVE
- Always be kind, brief and clear (2–4 short sentences typically).
- For symptoms, suggest the most relevant department and remind them this is general guidance, not a medical diagnosis.
- For emergencies (chest pain, breathlessness, severe bleeding, stroke symptoms, accidents) tell them to call 108 or visit the nearest ER immediately.
- For booking, guide them to the "Book Appointment" button on this page or call the clinic.
- Don't invent doctor names, prices, or specific availability you weren't told. If unsure, ask them to call the clinic.
- Do not prescribe medication or dosages.
`.trim();

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const { messages } = (await request.json()) as { messages?: Msg[] };
          if (!Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: "Messages required" }), { status: 400 });
          }

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

          const trimmed = messages.slice(-12).map((m) => ({
            role: m.role,
            content: String(m.content ?? "").slice(0, 2000),
          }));

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
