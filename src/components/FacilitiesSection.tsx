import {
  Armchair,
  Eye,
  Lightbulb,
  PlugZap,
  Pin,
  Snowflake,
  KeyRound,
  Coffee,
  Newspaper,
  Camera,
  ShieldCheck,
  Wifi,
  Wind,
  Droplets,
  Sparkles,
  TreePine,
} from "lucide-react";

const facilities = [
  { icon: Armchair, label: "Revolving Chair", desc: "Comfortable ergonomic seating" },
  { icon: Eye, label: "Eye Protecting Lights", desc: "Warm LED lighting for long hours" },
  { icon: Lightbulb, label: "Individual Desk Light", desc: "After 11 PM body light support" },
  { icon: PlugZap, label: "Charging Board at Every Seat", desc: "One side pin board per seat" },
  { icon: Snowflake, label: "Fully Central AC", desc: "Air-conditioned hall (9 AM – 10 PM)" },
  { icon: KeyRound, label: "Locker Facility", desc: "Personal secured lockers" },
  { icon: Coffee, label: "Lunch Room", desc: "Separate lunch room & news area" },
  { icon: Newspaper, label: "News Paper Area", desc: "Daily newspapers available" },
  { icon: Camera, label: "CCTV Surveillance", desc: "24/7 security monitoring" },
  { icon: ShieldCheck, label: "Fire Safety", desc: "Complete fire safety equipment" },
  { icon: Wifi, label: "High Speed WiFi", desc: "Dual high speed internet" },
  { icon: Wind, label: "Peaceful Environment", desc: "Clean, calm & quiet atmosphere" },
  { icon: Droplets, label: "Cold / Normal RO Water", desc: "Purified drinking water" },
  { icon: Sparkles, label: "English & Gujarati Newspaper", desc: "Daily updated newspapers" },
  { icon: TreePine, label: "Inspiring Environment", desc: "Designed for strict discipline" },
];

const FacilitiesSection = () => {
  return (
    <section id="facilities" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">What We Offer</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Available <span className="gold-text">Facilities</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {facilities.map((f) => (
            <div
              key={f.label}
              className="glass-card rounded-xl p-5 text-center hover:gold-shadow transition-all duration-500 group"
            >
              <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <f.icon size={20} className="text-primary-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{f.label}</h3>
              <p className="text-foreground/40 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
