import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GoogleAuthButton from "@/components/GoogleAuthButton";
import AdminNav from "@/components/AdminNav";

type Row = {
  id: string;
  name: string;
  phone: string;
  seat_number: number | null;
  is_reserved: boolean;
  expiry_date: string;
  plan_type: string;
};

const TOTAL_SEATS = 74;

const AdminSeats = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("memberships")
      .select("id, name, phone, seat_number, is_reserved, expiry_date, plan_type");
    setLoading(false);
    if (error) {
      toast.error("Could not load seat data.");
      return;
    }
    setRows((data ?? []) as Row[]);
  };

  useEffect(() => {
    load();
  }, []);

  const today = new Date(new Date().toDateString());

  const seatMap = useMemo(() => {
    const map = new Map<number, Row>();
    rows.forEach((r) => {
      if (r.seat_number && new Date(`${r.expiry_date}T00:00:00`) >= today) map.set(r.seat_number, r);
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const activeMembers = rows.filter((r) => new Date(`${r.expiry_date}T00:00:00`) >= today).length;
  const taken = seatMap.size;

  const stats = [
    { label: "Total Seats", value: TOTAL_SEATS },
    { label: "Seats Assigned", value: taken },
    { label: "Seats Free", value: TOTAL_SEATS - taken },
    { label: "Active Members", value: activeMembers },
  ];

  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={15} /> Back to site
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-3">
              Seat <span className="gold-text">Tracking</span>
            </h1>
          </div>
          <GoogleAuthButton />
        </div>

        <AdminNav />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 transition-transform duration-300 hover:-translate-y-1">
              <p className="text-xs uppercase tracking-wider text-foreground/40">{s.label}</p>
              <p className="font-serif text-3xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-60"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
          <span className="text-sm text-muted-foreground">Click a seat to see who holds it</span>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((seat) => {
              const holder = seatMap.get(seat);
              return (
                <button
                  key={seat}
                  title={holder ? `${holder.name} · ${holder.phone}` : `Seat ${seat} free`}
                  onClick={() =>
                    holder
                      ? toast(`Seat ${seat}: ${holder.name}`, { description: `${holder.plan_type} · ${holder.phone}` })
                      : toast(`Seat ${seat} is free`)
                  }
                  className={`h-10 w-10 rounded-md border text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    holder
                      ? "gold-gradient text-primary-foreground border-transparent"
                      : "bg-background text-foreground/60 border-primary/25 hover:border-primary"
                  }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex gap-6 text-xs text-foreground/50">
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded gold-gradient" /> Assigned
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded border border-primary/25 bg-background" /> Free
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminSeats;
