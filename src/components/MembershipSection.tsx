import { useEffect, useState } from "react";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import {
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  Sofa,
  User as UserIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearStudentSession, getStudentSession, STUDENT_SESSION_EVENT, setStudentSession } from "@/lib/studentSession";


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

const querySchema = z
  .string()
  .trim()
  .min(5, "Enter your registered email or phone number")
  .max(255, "That looks too long");

const formatDate = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const daysLeft = (expiry: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${expiry}T00:00:00`);
  return Math.round((end.getTime() - today.getTime()) / 86_400_000);
};

const statusOf = (expiry: string) => {
  const left = daysLeft(expiry);
  if (left < 0) return { label: "Expired", tone: "border-destructive/40 bg-destructive/10 text-destructive", left };
  if (left <= 7)
    return { label: "Expiring Soon", tone: "border-primary/40 bg-primary/10 text-primary", left };
  return { label: "Active", tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400", left };
};

const Row = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-primary">{icon}</span>
    <div>
      <p className="text-xs uppercase tracking-wider text-foreground/40">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const MembershipSection = () => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Membership[] | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user ?? null),
    );
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const lookup = async (value: string) => {
    const parsed = querySchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setError(null);
    setNotFound(false);
    setLoading(true);
    const { data, error: fnError } = await supabase.functions.invoke("membership-lookup", {
      body: { query: parsed.data },
    });
    setLoading(false);

    if (fnError || data?.error) {
      setError(data?.error ?? "Could not load your membership. Please try again.");
      return;
    }
    const found = (data?.memberships ?? []) as Membership[];
    if (found.length === 0) {
      setResults(null);
      setNotFound(true);
      return;
    }
    setResults(found);
  };

  // Auto-load for signed-in members
  useEffect(() => {
    if (user?.email && results === null && !notFound && !loading) {
      setQuery(user.email);
      lookup(user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // Auto-load for a logged-in student portal session
  useEffect(() => {
    const session = getStudentSession();
    if (session?.query) {
      setQuery(session.query);
      lookup(session.query);
    }
    const onSession = (e: Event) => {
      const detail = (e as CustomEvent).detail as { query?: string } | null;
      if (detail?.query) {
        setQuery(detail.query);
        lookup(detail.query);
      } else {
        setResults(null);
        setNotFound(false);
        setError(null);
        setQuery("");
      }
    };
    window.addEventListener(STUDENT_SESSION_EVENT, onSession);
    return () => window.removeEventListener(STUDENT_SESSION_EVENT, onSession);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    clearStudentSession();
    setResults(null);
    setNotFound(false);
    setError(null);
    setQuery("");
  };


  const inputClass =
    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";

  return (
    <section id="membership" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Members</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            My <span className="gold-text">Membership</span>
          </h2>
          <p className="text-foreground/40 text-sm mt-3">
            Check your plan, seat and validity with your registered email or phone number.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {!results && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                lookup(query);
              }}
              className="glass-card rounded-2xl p-6 md:p-8 space-y-4"
            >
              <div>
                <input
                  className={inputClass}
                  placeholder="Registered email or phone number"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  maxLength={255}
                />
                {error && <p className="text-destructive text-sm mt-2">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient text-primary-foreground py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {loading ? "Checking…" : "View My Membership"}
              </button>

              {notFound && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm space-y-3">
                  <p className="flex items-center gap-2 text-destructive">
                    <AlertCircle size={15} />
                    No membership found for those details.
                  </p>
                  <a
                    href="#inquiry"
                    className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    Submit an Admission Inquiry
                  </a>
                </div>
              )}
            </form>
          )}

          {results && (
            <div className="space-y-6">
              {results.map((m) => {
                const status = statusOf(m.expiry_date);
                const due = Number(m.fee_total) - Number(m.fee_paid);
                return (
                  <div key={m.id} className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl font-semibold">{m.name}</h3>
                        <p className="text-sm text-foreground/40">{m.plan_type}</p>
                      </div>
                      <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${status.tone}`}>
                        {status.label}
                        {status.label === "Expiring Soon" && ` · ${status.left} day${status.left === 1 ? "" : "s"} left`}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 border-t border-border/40 pt-6">
                      <Row icon={<Mail size={16} />} label="Email" value={m.email} />
                      <Row icon={<Phone size={16} />} label="Phone" value={m.phone} />
                      <Row icon={<MapPin size={16} />} label="Branch" value={m.branch} />
                      <Row
                        icon={<UserIcon size={16} />}
                        label="Shift Timings"
                        value={m.shift_timings || "—"}
                      />
                      <Row
                        icon={<Sofa size={16} />}
                        label="Seat"
                        value={
                          m.is_reserved && m.seat_number
                            ? `Reserved · Seat ${m.seat_number}`
                            : "Unreserved seating"
                        }
                      />
                      <Row
                        icon={<CalendarDays size={16} />}
                        label="Validity"
                        value={`${formatDate(m.start_date)} — ${formatDate(m.expiry_date)}`}
                      />
                      <Row
                        icon={<IndianRupee size={16} />}
                        label="Fees"
                        value={
                          due > 0 ? (
                            <span className="text-destructive">₹{due.toLocaleString("en-IN")} outstanding</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400">
                              <BadgeCheck size={14} /> Fully paid
                            </span>
                          )
                        }
                      />
                      {m.notes && <Row icon={<AlertCircle size={16} />} label="Note" value={m.notes} />}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={reset}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary py-3 text-sm font-medium hover:border-primary/50 hover:text-primary transition-colors"
              >
                <RotateCcw size={15} /> Search another email or number
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
