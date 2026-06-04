import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { ContactFooter } from "@/components/site/ContactFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Dev's Multispeciality Clinic" },
      { name: "description", content: "Terms of service for using Dev's Multispeciality Clinic website and appointment booking." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl heading-display text-brand">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-2">Last updated: June 2026</p>
        <div className="mt-8 space-y-6 text-foreground/85 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-brand">1. Using this website</h2>
            <p>This website provides information about Dev's Multispeciality Clinic services and allows you to request appointments. Content is for general information only and is not a substitute for professional medical advice.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">2. Appointment requests</h2>
            <p>Submitting an appointment request does not guarantee a slot. Our team will contact you to confirm based on doctor availability.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">3. Medical disclaimer</h2>
            <p>In a medical emergency, please call your local emergency number or visit the nearest hospital. Do not rely on this website or the chat assistant for urgent care.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">4. Changes</h2>
            <p>We may update these terms from time to time. Continued use of the website indicates acceptance of the updated terms.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-brand">5. Contact</h2>
            <p>For any questions, reach us at <a className="text-gold underline" href="mailto:devsclinic20@gmail.com">devsclinic20@gmail.com</a> or +91 9666 20 50 20.</p>
          </section>
        </div>
        <Link to="/" className="inline-block mt-10 text-sm font-semibold text-brand hover:text-gold">← Back to home</Link>
      </main>
      <ContactFooter />
    </div>
  );
}
