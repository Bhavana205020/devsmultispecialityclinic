import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In or Register — Dev's Multispeciality Clinic" },
      { name: "description", content: "Create your patient account or sign in to manage your appointments." },
    ],
  }),
  component: LoginPage,
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "Password must be 6+ characters").max(72),
});

const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(2, "Name is required").max(100),
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const sendReset = async () => {
    const email = form.email.trim();
    if (!email) return toast.error("Enter your email above first, then click Forgot password.");
    setResetBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/login",
    });
    setResetBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Password reset link sent. Check your inbox.");
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) nav({ to: "/profile" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === "signin" ? signInSchema : signUpSchema;
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin + "/profile",
            data: { full_name: form.full_name },
          },
        });
        if (error) throw error;
        const { error: signErr } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signErr) {
          toast.success("Account created. Please check your email to verify, then sign in.");
          setMode("signin");
          return;
        }
        toast.success("Welcome to Dev's Multispeciality Clinic!");
        nav({ to: "/profile" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        nav({ to: "/profile" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft px-4 py-10">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft border border-border p-8">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Dev's Multispeciality Clinic" className="h-20 w-auto" />
        </Link>
        <h1 className="text-2xl heading-display text-brand text-center">
          {mode === "signin" ? "Welcome Back" : "Create Your Account"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {mode === "signin"
            ? "Sign in to manage your appointments and profile"
            : "Join us to book appointments faster"}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-6 p-1 bg-soft rounded-lg">
          <button
            onClick={() => setMode("signin")}
            className={`py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "signin" ? "bg-background text-brand shadow-sm" : "text-muted-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`py-2 text-sm font-semibold rounded-md transition-colors ${
              mode === "signup" ? "bg-background text-brand shadow-sm" : "text-muted-foreground"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4 mt-6">
          {mode === "signup" && (
            <Field icon={<User className="h-4 w-4" />} label="Full Name">
              <input
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                className={inputCls}
              />
            </Field>
          )}
          <Field icon={<Mail className="h-4 w-4" />} label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className={inputCls}
            />
          </Field>
          <Field icon={<Lock className="h-4 w-4" />} label="Password">
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className={inputCls}
            />
          </Field>
          {mode === "signin" && (
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={sendReset}
                disabled={resetBusy}
                className="text-xs font-semibold text-brand hover:underline disabled:opacity-60"
              >
                {resetBusy ? "Sending..." : "Forgot password?"}
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full btn-gold rounded-md py-3 font-bold disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <Link to="/" className="block text-center text-xs text-muted-foreground mt-5 hover:text-brand">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand";

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/70 inline-flex items-center gap-1.5 mb-1">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
