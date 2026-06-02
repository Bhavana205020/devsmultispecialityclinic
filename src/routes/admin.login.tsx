import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { isAdminUser } from "@/lib/auth-routing";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — Dev's Multispeciality Clinic" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && await isAdminUser(session.user.id)) nav({ to: "/admin" });
    });
  }, [nav]);

  const sendToAdminIfAllowed = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user && await isAdminUser(userData.user.id)) {
      nav({ to: "/admin" });
      return;
    }
    await supabase.auth.signOut();
    toast.error("This login is not assigned admin access.");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Signing you in...");
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) return toast.error(signErr.message);
      await sendToAdminIfAllowed();
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      await sendToAdminIfAllowed();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft border border-border p-8">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-20 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold text-brand text-center">Admin {mode === "signin" ? "Login" : "Setup"}</h1>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Authorized personnel only — devsclinic20@gmail.com
        </p>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-brand outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-brand outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand text-brand-foreground rounded-md py-2.5 font-semibold disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Admin Account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-xs text-muted-foreground hover:text-brand mt-4 w-full text-center"
        >
          {mode === "signin"
            ? "First time? Set up the admin account →"
            : "← Back to sign in"}
        </button>
        <Link to="/" className="block text-center text-xs text-muted-foreground mt-3 hover:text-brand">
          ← Back to website
        </Link>
      </div>
    </div>
  );
}
