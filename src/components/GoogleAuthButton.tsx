import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 35.6 44 30.3 44 24c0-1.3-.1-2.6-.4-3.9z" />
  </svg>
);

const GoogleAuthButton = ({ compact = false }: { compact?: boolean }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Could not sign in with Google. Please try again.");
      return;
    }
    if (result.redirected) return;
    setLoading(false);
    toast.success("Signed in successfully.");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-60";
  const size = compact ? "w-full px-4 py-3" : "px-4 py-2";

  if (user) {
    return (
      <button onClick={signOut} className={`${base} ${size}`}>
        <LogOut size={15} />
        Sign Out
      </button>
    );
  }

  return (
    <button onClick={signIn} disabled={loading} className={`${base} ${size}`}>
      <GoogleIcon />
      {loading ? "Signing in…" : "Sign in with Google"}
    </button>
  );
};

export default GoogleAuthButton;
