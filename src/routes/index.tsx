import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { TopBar } from "@/components/site/TopBar";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import heroImg from "@/assets/hero-clinic.jpg";

// Lazy-load below-the-fold sections to keep the initial bundle small and TTI fast
const Services = lazy(() => import("@/components/site/Services").then(m => ({ default: m.Services })));
const Doctors = lazy(() => import("@/components/site/Doctors").then(m => ({ default: m.Doctors })));
const WhyChooseUs = lazy(() => import("@/components/site/WhyChooseUs").then(m => ({ default: m.WhyChooseUs })));
const AppointmentForm = lazy(() => import("@/components/site/AppointmentForm").then(m => ({ default: m.AppointmentForm })));
const Testimonials = lazy(() => import("@/components/site/Testimonials").then(m => ({ default: m.Testimonials })));
const Subscribe = lazy(() => import("@/components/site/Subscribe").then(m => ({ default: m.Subscribe })));
const ContactFooter = lazy(() => import("@/components/site/ContactFooter").then(m => ({ default: m.ContactFooter })));
const FloatingActions = lazy(() => import("@/components/site/FloatingActions").then(m => ({ default: m.FloatingActions })));

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
    links: [
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
  }),
  component: Index,
});

function SectionFallback() {
  return <div className="py-12 flex justify-center"><div className="h-8 w-8 rounded-full border-2 border-brand/30 border-t-brand animate-spin" /></div>;
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback />}><Services /></Suspense>
        <Suspense fallback={<SectionFallback />}><Doctors /></Suspense>
        <Suspense fallback={<SectionFallback />}><WhyChooseUs /></Suspense>
        <Suspense fallback={<SectionFallback />}><AppointmentForm /></Suspense>
        <Suspense fallback={<SectionFallback />}><Testimonials /></Suspense>
        <Suspense fallback={<SectionFallback />}><Subscribe /></Suspense>
        <Suspense fallback={<SectionFallback />}><ContactFooter /></Suspense>
      </main>
      <Suspense fallback={null}><FloatingActions /></Suspense>
    </div>
  );
}
