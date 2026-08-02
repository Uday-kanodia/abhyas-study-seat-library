const SeatAvailability = () => {
  const total = 74;
  const occupied = 43;
  const available = total - occupied;
  const percent = Math.round((occupied / total) * 100);


  return (
    <section id="seats" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Live Status</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Seat <span className="gold-text">Availability</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-3 gap-6 text-center mb-10">
            <div>
              <p className="text-4xl md:text-5xl font-bold font-serif text-foreground">{total}</p>
              <p className="text-foreground/40 mt-2 text-sm">Total Seats</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold font-serif text-primary">{occupied}</p>
              <p className="text-foreground/40 mt-2 text-sm">Occupied</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold font-serif text-green-400">{available}</p>
              <p className="text-foreground/40 mt-2 text-sm">Available</p>
            </div>
          </div>

          <div className="w-full h-3 bg-secondary rounded-full overflow-hidden mb-8">
            <div
              className="h-full gold-gradient rounded-full transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="text-center">
            <a
              href="#seat-map"
              className="inline-block gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Seating Arrangement
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SeatAvailability;
