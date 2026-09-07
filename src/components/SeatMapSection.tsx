import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import floorPlan from "@/assets/seating-floorplan.jpg";



// Seat layout as per the library floor plan (74 seats)
const rows: { label: string; groups: number[][] }[] = [
  { label: "Wall Row", groups: [[74, 73, 72, 71, 70, 69, 68, 67, 66, 65, 64, 63, 62, 61]] },
  {
    label: "Block A",
    groups: [
      [49, 50, 51, 52, 53, 54],
      [55, 56, 57, 58, 59, 60],
    ],
  },
  {
    label: "Block A (back)",
    groups: [
      [48, 47, 46, 45, 44, 43],
      [42, 41, 40, 39, 38, 37],
    ],
  },
  {
    label: "Block B",
    groups: [
      [25, 26, 27, 28, 29, 30],
      [31, 32, 33, 34, 35, 36],
    ],
  },
  {
    label: "Block B (back)",
    groups: [
      [24, 23, 22, 21, 20, 19],
      [18, 17, 16, 15, 14, 13],
    ],
  },
  { label: "Entrance Row", groups: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]] },
];

// Currently occupied seats (update as admissions change)
const occupiedSeats = new Set([
  1, 2, 4, 5, 7, 9, 12, 13, 14, 16, 18, 19, 21, 22, 25, 26, 27, 29, 31, 33,
  34, 37, 38, 40, 43, 44, 45, 47, 49, 50, 52, 55, 56, 58, 61, 62, 64, 65, 67,
  68, 70, 71, 73,
]);

const totalSeats = 74;

const SeatMapSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [view, setView] = useState<"interactive" | "plan">("interactive");

  const handleSelect = (seat: number) => {
    if (occupiedSeats.has(seat)) return;
    setSelected(seat);
    window.dispatchEvent(new CustomEvent("seat-selected", { detail: seat }));
    toast.success(`Seat ${seat} selected — continue with your inquiry below.`);
  };

  const seatClass = (seat: number) => {
    if (occupiedSeats.has(seat)) return "bg-secondary text-foreground/25 cursor-not-allowed border-border";
    if (selected === seat) return "gold-gradient text-primary-foreground border-transparent scale-110";
    return "bg-background text-foreground/70 border-primary/25 hover:border-primary hover:text-primary";
  };

  return (
    <section id="seat-map" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-8">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Seating Arrangement</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gold-text">Seat</span>
          </h2>
          <p className="text-foreground/50 text-sm max-w-xl mx-auto">
            {totalSeats} individual study desks, laid out exactly as in the library floor plan. Pick an
            available seat to reserve it with your admission inquiry.
          </p>
        </Reveal>


        <div className="flex justify-center mb-10">
          <div className="glass-card rounded-full p-1 inline-flex gap-1">
            {([
              { key: "interactive", label: "Interactive Map" },
              { key: "plan", label: "Official Floor Plan" },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setView(t.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  view === t.key ? "gold-gradient text-primary-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl p-5 md:p-10 max-w-5xl mx-auto overflow-x-auto"
        >
          {view === "plan" ? (
            <img
              src={floorPlan}
              alt="Abhyas Reading Library official seating floor plan with 74 numbered study desks"
              loading="lazy"
              className="w-full rounded-xl"
            />
          ) : (
          <div className="min-w-[640px] space-y-7">
            <div className="flex justify-center gap-3 text-[10px] uppercase tracking-widest text-foreground/35">
              <span className="rounded border border-border px-3 py-1">Washroom</span>
              <span className="rounded border border-border px-3 py-1">Lunch Room</span>
              <span className="rounded border border-border px-3 py-1">Newspaper</span>
            </div>
            {rows.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex justify-center gap-10"
              >
                {row.groups.map((group, gi) => (
                  <div key={gi} className="flex gap-1.5">
                    {group.map((seat) => (
                      <motion.button
                        key={seat}
                        type="button"
                        onClick={() => handleSelect(seat)}
                        whileHover={occupiedSeats.has(seat) ? undefined : { y: -4, scale: 1.08 }}
                        whileTap={occupiedSeats.has(seat) ? undefined : { scale: 0.94 }}
                        aria-label={`Seat ${seat}${occupiedSeats.has(seat) ? " (occupied)" : " (available)"}`}
                        className={`h-9 w-9 shrink-0 rounded-md border text-xs font-semibold transition-colors duration-300 ${seatClass(seat)}`}
                      >
                        {seat}
                      </motion.button>
                    ))}
                  </div>
                ))}
                {i === 0 && <span className="sr-only">Washroom side</span>}
              </motion.div>
            ))}
          </div>
          )}



          {view === "interactive" && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground/50">
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border border-primary/25 bg-background" /> Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded gold-gradient" /> Selected
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded border border-border bg-secondary" /> Occupied
              </span>
            </div>
          )}


          <div className="mt-8 text-center">
            <p className="text-foreground/40 text-sm mb-4">
              {selected ? `Seat ${selected} selected` : "No seat selected yet"} · Reserved seat plans start at ₹2,000/month
            </p>
            <a
              href="#inquiry"
              className="inline-block gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Reserve This Seat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeatMapSection;
