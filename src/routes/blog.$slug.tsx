import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Tag, CheckCircle2, Share2 } from "lucide-react";
import { blogBySlug, type BlogPost } from "@/lib/blog-content";
import { Header } from "@/components/site/Header";
import { ContactFooter } from "@/components/site/ContactFooter";
import { FloatingActions } from "@/components/site/FloatingActions";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = blogBySlug[params.slug];
    if (!post) return { meta: [{ title: "Article not found" }] };
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.metaDescription },
        { name: "keywords", content: post.keywords.join(", ") },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:image", content: post.heroImage },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.heroImage },
      ],
    };
  },
  loader: ({ params }) => {
    const post = blogBySlug[params.slug];
    if (!post) throw notFound();
    return { post };
  },
  component: BlogPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-brand">Article not found</h1>
      <Link to="/" className="mt-4 text-gold hover:underline">← Back home</Link>
    </div>
  ),
});

function BlogPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={post.heroImage} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/30" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-white">
          <Link to="/" className="inline-flex items-center gap-2 text-sm opacity-90 hover:opacity-100">
            <ArrowLeft className="h-4 w-4" /> Back to clinic
          </Link>
          <span className="inline-block mt-6 text-xs font-bold tracking-wider uppercase bg-gold text-gold-foreground px-3 py-1 rounded-full">
            {post.category}
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold font-display leading-tight">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm opacity-90">
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readTime}</span>
            <span className="inline-flex items-center gap-1.5"><Tag className="h-4 w-4" />Dev's Multispeciality Clinic</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-lg md:text-xl text-foreground/85 leading-relaxed font-medium border-l-4 border-gold pl-5 italic">
          {post.intro}
        </p>

        {post.sections.map((s, i) => (
          <section key={i} className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold text-brand mb-4">
              <span className="text-gold mr-2">{String(i + 1).padStart(2, "0")}.</span>
              {s.heading}
            </h2>
            <p className="text-foreground/80 leading-relaxed text-[15px] md:text-base">{s.body}</p>
            {s.image && (
              <figure className="mt-6 rounded-2xl overflow-hidden border border-border shadow-card">
                <img src={s.image} alt={s.heading} className="w-full h-64 md:h-80 object-cover" loading="lazy" />
              </figure>
            )}
          </section>
        ))}

        {/* Key takeaways */}
        <aside className="mt-14 rounded-2xl border-2 border-gold/40 bg-soft p-6 md:p-8">
          <h3 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-gold" /> Key Takeaways
          </h3>
          <ul className="space-y-2.5">
            {post.takeaways.map((t, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/85">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </aside>

        {/* CTA */}
        <div className="mt-14 rounded-2xl bg-brand text-brand-foreground p-8 text-center">
          <h3 className="text-2xl font-bold">Need a personal consultation?</h3>
          <p className="mt-2 text-sm opacity-90">Book an appointment with our specialists today.</p>
          <Link
            to="/"
            hash="appointment"
            className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-full bg-gold text-gold-foreground font-semibold hover:brightness-95"
          >
            Book Appointment
          </Link>
        </div>

        {/* Share */}
        <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-2 hover:text-brand">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <button
            onClick={() => navigator.share?.({ title: post.title, url: location.href }).catch(() => {})}
            className="inline-flex items-center gap-2 hover:text-brand"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </article>

      <ContactFooter />
      <FloatingActions />
    </div>
  );
}
