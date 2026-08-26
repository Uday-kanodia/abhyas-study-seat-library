import heroImg from "@/assets/unnamed.webp.asset.json";
import logo from "@/assets/unnamed_7.webp.asset.json";

import { Snowflake, Volume2, Armchair, Wifi, Zap } from "lucide-react";

const highlights = [
  { icon: Snowflake, label: "Fully Central AC" },
  { icon: Volume2, label: "Silent Zone" },
  { icon: Armchair, label: "Revolving Chairs" },
  { icon: Wifi, label: "High Speed WiFi" },
  { icon: Zap, label: "Power Backup" },
];

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg.url} alt="Abhyas Reading Library study hall interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <img
          src={logo.url}
          alt="Abhyas Reading Library logo"
          className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 object-contain animate-fade-in"
        />
        <p className="text-primary/80 uppercase tracking-[0.3em] text-sm mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          Chandkheda, Ahmedabad
        </p>
        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in-up">
          Where Preparation
          <br />
          <span className="gold-text">Meets Comfort</span>
        </h1>
        <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          Your journey to success starts with the right environment.
        </p>


        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <a href="#seats" className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Book a Seat
          </a>
          <a href="#inquiry" className="border border-primary/30 text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-colors">
            Admission Inquiry
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          {highlights.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-foreground/50">
              <item.icon size={18} className="text-primary" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
