import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import AdminNav from "@/components/AdminNav";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type Staff = { user_id: string; email: string; created_at: string };

const AdminStaff = () => {
  const { user } = useAdminAuth();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.rpc("list_admins");
    if (error) return toast.error(error.message);
    setStaff((data as Staff[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const grant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await supabase.rpc("grant_admin_by_email", { _email: email.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${email} is now an admin.`);
    setEmail("");
    load();
  };

  const revoke = async (s: Staff) => {
    if (!confirm(`Remove admin access for ${s.email}?`)) return;
    const { error } = await supabase.rpc("revoke_admin", { _user_id: s.user_id });
    if (error) return toast.error(error.message);
    toast.success("Admin access removed.");
    load();
  };

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={15} /> Back to site
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-3">
              Staff <span className="gold-text">Access</span>
            </h1>
          </div>
          <GoogleAuthButton />
        </div>
        <AdminNav />

        <form onSubmit={grant} className="glass-card rounded-xl p-5 mb-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the Google email of the person. They must have signed in on the site once before.
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="flex-1 min-w-[220px] bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg gold-gradient text-primary-foreground px-5 py-3 text-sm font-medium disabled:opacity-60">
              <UserPlus size={15} /> Make admin
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {staff.map((s) => (
            <div key={s.user_id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-sm">{s.email}{s.user_id === user?.id && " (you)"}</span>
              </div>
              {s.user_id !== user?.id && (
                <button onClick={() => revoke(s)} aria-label={`Remove ${s.email}`} className="rounded-lg border border-border p-2.5 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminStaff;
