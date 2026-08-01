import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, MessageCircle, Phone, RefreshCw, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { buildApplicantWhatsAppLink } from "@/lib/inquiryNotify";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  timing: string;
  message: string | null;
  created_at: string;
};

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      setInquiries([]);
      return;
    }
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)));
  }, [user]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admission_inquiries")
      .select("id, name, phone, email, timing, message, created_at")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error("Could not load inquiries.");
      return;
    }
    setInquiries(data ?? []);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const remove = async (id: string) => {
    const { error } = await supabase.from("admission_inquiries").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete this inquiry.");
      return;
    }
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    toast.success("Inquiry deleted.");
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      [i.name, i.phone, i.email, i.timing, i.message ?? ""].join(" ").toLowerCase().includes(q),
    );
  }, [inquiries, query]);

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={15} /> Back to site
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-3">
              Admission <span className="gold-text">Inquiries</span>
            </h1>
          </div>
          <GoogleAuthButton />
        </div>

        {!user && (
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto">
            <p className="text-muted-foreground">Sign in with Google to access the inquiry dashboard.</p>
          </div>
        )}

        {user && isAdmin === false && (
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto">
            <p className="text-muted-foreground">
              This account does not have admin access. Ask the library owner to grant your account the admin role.
            </p>
          </div>
        )}

        {user && isAdmin && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, phone, email…"
                className="flex-1 min-w-[220px] bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
              <span className="text-sm text-muted-foreground">{filtered.length} total</span>
            </div>

            <div className="space-y-4">
              {filtered.map((i) => (
                <article key={i.id} className="glass-card rounded-xl p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-lg">{i.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {i.email} · {i.phone} · {i.timing}
                      </p>
                      {i.message && <p className="text-sm mt-3 max-w-2xl">{i.message}</p>}
                      <p className="text-xs text-muted-foreground mt-3">
                        {new Date(i.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={buildApplicantWhatsAppLink(i.phone, i.name)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`WhatsApp ${i.name}`}
                        className="rounded-lg border border-border p-2.5 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        <MessageCircle size={16} />
                      </a>
                      <a
                        href={`tel:${i.phone}`}
                        aria-label={`Call ${i.name}`}
                        className="rounded-lg border border-border p-2.5 hover:border-primary/50 hover:text-primary transition-colors"
                      >
                        <Phone size={16} />
                      </a>
                      <button
                        onClick={() => remove(i.id)}
                        aria-label={`Delete inquiry from ${i.name}`}
                        className="rounded-lg border border-border p-2.5 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {!loading && filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No inquiries yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Admin;
