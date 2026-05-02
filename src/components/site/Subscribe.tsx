import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.string().trim().email("Enter a valid email").max(255);

export function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Subscribed! We'll keep you posted.");
      setEmail("");
      setLoading(false);
    }, 400);
  };

  return (
    <section className="py-16 bg-brand text-brand-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Join Our Channels</h2>
        <p className="text-gold mt-2">To Stay Up to Date For The Latest News</p>

        <form
          onSubmit={submit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto bg-background rounded-full p-2 shadow-soft"
        >
          <div className="flex items-center gap-2 flex-1 px-4">
            <Mail className="h-4 w-4 text-brand shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Mail"
              className="flex-1 bg-transparent py-3 text-sm text-foreground outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-gold rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {loading ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>
      </div>
    </section>
  );
}
