import { motion } from "framer-motion";
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
        <motion.img
          src={logo.url}
          alt="Abhyas Reading Library logo"
          className="h-20 w-20 md:h-24 md:w-24 mx-auto mb-6 object-contain"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.p
          className="text-primary/80 uppercase tracking-[0.3em] text-sm mb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Chandkheda, Ahmedabad
        </motion.p>
        <motion.h1
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Where Preparation
          <br />
          <span className="gold-text">Meets Comfort</span>
        </motion.h1>
        <motion.p
          className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Your journey to success starts with the right environment.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          <motion.a
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            href="#seats"
            className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold"
          >
            Book a Seat
          </motion.a>
          <motion.a
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            href="#inquiry"
            className="border border-primary/30 text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
          >
            Admission Inquiry
          </motion.a>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6 md:gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          {highlights.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-foreground/50">
              <item.icon size={18} className="text-primary" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
