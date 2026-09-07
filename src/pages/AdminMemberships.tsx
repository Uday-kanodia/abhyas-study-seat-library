import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarPlus,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import AdminNav from "@/components/AdminNav";


type Membership = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan_type: string;
  branch: string;
  shift_timings: string | null;
  seat_number: number | null;
  is_reserved: boolean;
  start_date: string;
  expiry_date: string;
  fee_total: number;
  fee_paid: number;
  notes: string | null;
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  plan_type: "18 Hours – Reserved",
  branch: "Shree Sarju Heights",
  shift_timings: "",
  seat_number: "",
  is_reserved: false,
  start_date: new Date().toISOString().slice(0, 10),
  expiry_date: "",
  fee_total: "",
  fee_paid: "0",
  notes: "",
};

type FormState = typeof emptyForm;

const PLAN_TYPES = [
  "18 Hours – Reserved",
  "18 Hours – Unreserved",
  "6 Hours – Morning Shift",
  "6 Hours – Afternoon Shift",
  "6 Hours – Night Shift",
  "9 Hours – Evening Shift",
];

const BRANCHES = ["Shree Sarju Heights", "Nakshtra"];

const AdminMemberships = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [members, setMembers] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(null);
      setMembers([]);
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
      .from("memberships")
      .select("*")
      .order("expiry_date", { ascending: true });
    setLoading(false);
    if (error) {
      toast.error("Could not load memberships.");
      return;
    }
    setMembers((data ?? []) as Membership[]);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (m: Membership) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      plan_type: m.plan_type,
      branch: m.branch,
      shift_timings: m.shift_timings ?? "",
      seat_number: m.seat_number != null ? String(m.seat_number) : "",
      is_reserved: m.is_reserved,
      start_date: m.start_date,
      expiry_date: m.expiry_date,
      fee_total: String(m.fee_total),
      fee_paid: String(m.fee_paid),
      notes: m.notes ?? "",
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      toast.error("Name, email and phone are required.");
      return;
    }
    if (!form.expiry_date) {
      toast.error("Set an expiry date.");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      plan_type: form.plan_type,
      branch: form.branch,
      shift_timings: form.shift_timings.trim() || null,
      seat_number: form.seat_number ? Number(form.seat_number) : null,
      is_reserved: form.is_reserved,
      start_date: form.start_date,
      expiry_date: form.expiry_date,
      fee_total: Number(form.fee_total) || 0,
      fee_paid: Number(form.fee_paid) || 0,
      notes: form.notes.trim() || null,
    };
    const { error } = editingId
      ? await supabase.from("memberships").update(payload).eq("id", editingId)
      : await supabase.from("memberships").insert(payload);
    setSaving(false);
    if (error) {
      toast.error("Could not save this membership.");
      return;
    }
    toast.success(editingId ? "Membership updated." : "Member added.");
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    load();
  };

  const renew = async (m: Membership) => {
    const base = new Date(Math.max(Date.now(), new Date(`${m.expiry_date}T00:00:00`).getTime()));
    base.setMonth(base.getMonth() + 1);
    const { error } = await supabase
      .from("memberships")
      .update({ expiry_date: base.toISOString().slice(0, 10) })
      .eq("id", m.id);
    if (error) {
      toast.error("Could not renew.");
      return;
    }
    toast.success(`Renewed until ${base.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}.`);
    load();
  };

  const remove = async (m: Membership) => {
    if (!window.confirm(`Delete membership for ${m.name}?`)) return;
    const { error } = await supabase.from("memberships").delete().eq("id", m.id);
    if (error) {
      toast.error("Could not delete.");
      return;
    }
    toast.success("Membership deleted.");
    setMembers((prev) => prev.filter((x) => x.id !== m.id));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      [m.name, m.phone, m.email, m.plan_type, m.branch, String(m.seat_number ?? "")]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [members, query]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
    }));

  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";
  const labelClass = "text-xs uppercase tracking-wider text-foreground/40 block mb-1.5";

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={15} /> Back to inquiries
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-3">
              Member <span className="gold-text">Management</span>
            </h1>
          </div>
          <GoogleAuthButton />
        </div>

        <AdminNav />


        {!user && (
          <div className="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto">
            <p className="text-muted-foreground">Sign in with Google to manage members.</p>
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
              <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, phone, email, seat…"
                  className={`${inputClass} pl-10`}
                />
              </div>
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 rounded-lg gold-gradient text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={15} /> Add Member
              </button>
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60"
              >
                <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
              <span className="text-sm text-muted-foreground">{filtered.length} total</span>
            </div>

            {showForm && (
              <div className="glass-card rounded-2xl p-6 md:p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl font-semibold">
                    {editingId ? "Edit Membership" : "Add New Member"}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    aria-label="Close form"
                    className="rounded-lg border border-border p-2 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input className={inputClass} value={form.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" className={inputClass} value={form.email} onChange={set("email")} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input className={inputClass} value={form.phone} onChange={set("phone")} />
                  </div>
                  <div>
                    <label className={labelClass}>Plan Type</label>
                    <select className={inputClass} value={form.plan_type} onChange={set("plan_type")}>
                      {PLAN_TYPES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Branch</label>
                    <select className={inputClass} value={form.branch} onChange={set("branch")}>
                      {BRANCHES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Shift Timings</label>
                    <input className={inputClass} placeholder="e.g. 7 AM – 1 PM" value={form.shift_timings} onChange={set("shift_timings")} />
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className={labelClass}>Seat Number</label>
                      <input type="number" min={1} max={120} className={inputClass} value={form.seat_number} onChange={set("seat_number")} />
                    </div>
                    <label className="flex items-center gap-2 text-sm pb-3">
                      <input type="checkbox" checked={form.is_reserved} onChange={set("is_reserved")} className="accent-primary" />
                      Reserved
                    </label>
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" className={inputClass} value={form.start_date} onChange={set("start_date")} />
                  </div>
                  <div>
                    <label className={labelClass}>Expiry Date *</label>
                    <input type="date" className={inputClass} value={form.expiry_date} onChange={set("expiry_date")} />
                  </div>
                  <div>
                    <label className={labelClass}>Fee Total (₹)</label>
                    <input type="number" min={0} className={inputClass} value={form.fee_total} onChange={set("fee_total")} />
                  </div>
                  <div>
                    <label className={labelClass}>Fee Paid (₹)</label>
                    <input type="number" min={0} className={inputClass} value={form.fee_paid} onChange={set("fee_paid")} />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className={labelClass}>Notes</label>
                    <textarea rows={2} className={inputClass} value={form.notes} onChange={set("notes")} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={save}
                    disabled={saving}
                    className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    {saving ? "Saving…" : editingId ? "Save Changes" : "Add Member"}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-border bg-secondary px-6 py-3 text-sm hover:border-primary/50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filtered.map((m) => {
                const due = Number(m.fee_total) - Number(m.fee_paid);
                const expired = new Date(`${m.expiry_date}T00:00:00`) < new Date(new Date().toDateString());
                return (
                  <article key={m.id} className="glass-card rounded-xl p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="font-semibold text-lg">{m.name}</h2>
                          <span
                            className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${
                              expired
                                ? "border-destructive/40 bg-destructive/10 text-destructive"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {expired ? "Expired" : "Active"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {m.email} · {m.phone} · {m.plan_type} · {m.branch}
                        </p>
                        <p className="text-sm mt-2">
                          {m.is_reserved && m.seat_number ? `Seat ${m.seat_number} · ` : ""}
                          {new Date(`${m.start_date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          {" → "}
                          {new Date(`${m.expiry_date}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          {due > 0 && <span className="text-destructive"> · ₹{due.toLocaleString("en-IN")} due</span>}
                        </p>
                        {m.notes && <p className="text-xs text-muted-foreground mt-2">{m.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => renew(m)}
                          title="Renew +1 month"
                          aria-label={`Renew membership for ${m.name}`}
                          className="rounded-lg border border-border p-2.5 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <CalendarPlus size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(m)}
                          aria-label={`Edit ${m.name}`}
                          className="rounded-lg border border-border p-2.5 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(m)}
                          aria-label={`Delete membership of ${m.name}`}
                          className="rounded-lg border border-border p-2.5 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
              {!loading && filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-12">No members yet. Click "Add Member" to create the first one.</p>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default AdminMemberships;
