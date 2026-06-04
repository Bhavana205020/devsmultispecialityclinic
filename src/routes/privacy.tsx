import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { ContactFooter } from "@/components/site/ContactFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Dev's Multispeciality Clinic" },
      {
        name: "description",
        content:
          "How Dev's Multispeciality Clinic collects, uses, and protects your personal and health information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl heading-display text-brand">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: June 2026</p>

        <div className="prose prose-sm mt-8 space-y-6 text-foreground/85">
          <section>
            <h2 className="text-lg font-bold text-brand">1. Information we collect</h2>
            <p>When you book an appointment, subscribe to updates, or contact us, we collect your name, phone number, email, and any medical details you share to help us serve you better.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">2. How we use your information</h2>
            <p>We use your information only to confirm and manage your appointments, share health updates you've requested, and improve our services. We never sell your data.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">3. Data security</h2>
            <p>Your records are stored on secured infrastructure with access restricted to authorized clinic staff. We follow industry-standard practices to protect your personal and health information.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">4. Your rights</h2>
            <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us at <a className="text-gold underline" href="mailto:devsclinic20@gmail.com">devsclinic20@gmail.com</a>.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">5. Contact</h2>
            <p>Dev's Multispeciality Clinic, 402, 4th Floor, SMR Vinay Iconia Plaza, Masjid Banda, Kondapur, Hyderabad — 500084. Phone: +91 9666 20 50 20.</p>
          </section>
        </div>

        <Link to="/" className="inline-block mt-10 text-sm font-semibold text-brand hover:text-gold">← Back to home</Link>
      </main>
      <ContactFooter />
    </div>
  );
}
