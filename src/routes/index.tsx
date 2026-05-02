import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Doctors } from "@/components/site/Doctors";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Testimonials } from "@/components/site/Testimonials";
import { Subscribe } from "@/components/site/Subscribe";
import { ContactFooter } from "@/components/site/ContactFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dev's Multispeciality Clinic — Complete Care Under One Roof | Kondapur, Hyderabad" },
      {
        name: "description",
        content:
          "Consultation, Orthopaedic, Gastroenterology, Physiotherapy, Pharmacy, Diagnostics & Digital X-ray at Dev's Multispeciality Clinic, Kondapur, Hyderabad. Book your appointment online.",
      },
      { property: "og:title", content: "Dev's Multispeciality Clinic — Complete Care Under One Roof" },
      {
        property: "og:description",
        content: "Expert doctors, advanced facilities and minimal waiting time. Book online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <WhyChooseUs />
        <AppointmentForm />
        <Testimonials />
        <Subscribe />
        <ContactFooter />
      </main>
    </div>
  );
}
