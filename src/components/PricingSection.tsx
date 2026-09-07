import { Check, Info } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";


type Branch = "nakshtra" | "sarju";

const nakshtraPricing = [
  {
    plan: "18 Hours – Reserved Seat",
    desc: "7 AM to 1 AM",
    prices: { "1m": "₹1,500", "3m": "₹4,200", "6m": "₹8,000", "12m": "₹15,000" },
    popular: true,
  },
  {
    plan: "18 Hours – Unreserved Seat",
    desc: "7 AM to 1 AM",
    prices: { "1m": "₹1,000", "3m": "₹2,700", "6m": "₹5,000", "12m": "₹9,500" },
    popular: false,
  },
  {
    plan: "6 Hours – Morning Shift",
    desc: "7 AM to 1 PM",
    prices: { "1m": "₹500", "3m": "₹1,200", "6m": "₹2,100", "12m": "₹4,000" },
    popular: false,
  },
  {
    plan: "6 Hours – Afternoon Shift",
    desc: "1 PM to 7 PM",
    prices: { "1m": "₹800", "3m": "₹2,100", "6m": "₹4,000", "12m": "₹7,500" },
    popular: false,
  },
  {
    plan: "6 Hours – Night Shift",
    desc: "7 PM to 1 AM",
    prices: { "1m": "₹500", "3m": "₹1,200", "6m": "₹2,100", "12m": "₹4,000" },
    popular: false,
  },
  {
    plan: "9 Hours Shift",
    desc: "7 AM – 4 PM or 4 PM – 1 AM",
    prices: { "1m": "₹800", "3m": "₹2,100", "6m": "₹4,000", "12m": "₹7,500" },
    popular: false,
  },
];

const sarjuPricing = [
  {
    plan: "18 Hours – Reserved Seat",
    desc: "7 AM to 1 AM",
    prices: { "1m": "₹2,000", "3m": "₹5,600", "6m": "₹11,000", "12m": "₹21,000" },
    popular: true,
  },
  {
    plan: "18 Hours – Unreserved Seat",
    desc: "7 AM to 1 AM",
    prices: { "1m": "₹1,600", "3m": "₹4,400", "6m": "₹9,000", "12m": "₹17,000" },
    popular: false,
  },
  {
    plan: "6 Hours – Morning Shift",
    desc: "7 AM to 1 PM",
    prices: { "1m": "₹800", "3m": "₹2,100", "6m": "₹3,800", "12m": "₹7,000" },
    popular: false,
  },
  {
    plan: "6 Hours – Afternoon Shift",
    desc: "1 PM to 7 PM",
    prices: { "1m": "₹1,200", "3m": "₹3,300", "6m": "₹6,100", "12m": "₹11,000" },
    popular: false,
  },
  {
    plan: "6 Hours – Night Shift",
    desc: "7 PM to 1 AM",
    prices: { "1m": "₹600", "3m": "₹1,500", "6m": "₹2,800", "12m": "₹5,000" },
    popular: false,
  },
  {
    plan: "9 Hours Shift",
    desc: "4 PM to 1 AM",
    prices: { "1m": "₹1,000", "3m": "₹2,700", "6m": "₹5,700", "12m": "₹9,000" },
    popular: false,
  },
];

const durations = [
  { key: "1m", label: "1 Month" },
  { key: "3m", label: "3 Months" },
  { key: "6m", label: "6 Months" },
  { key: "12m", label: "12 Months" },
] as const;

type Duration = (typeof durations)[number]["key"];

const PricingSection = () => {
  const [branch, setBranch] = useState<Branch>("nakshtra");
  const [duration, setDuration] = useState<Duration>("1m");

  const pricing = branch === "nakshtra" ? nakshtraPricing : sarjuPricing;
  const contactNumber = branch === "nakshtra" ? "9974912122" : "7383212122";

  return (
    <section id="pricing" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <Reveal className="text-center mb-12">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Plans</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            Transparent <span className="gold-text">Pricing</span>
          </h2>
          <p className="text-foreground/40 text-sm">Per Day: ₹100 · Demo: ₹100</p>
        </Reveal>


        {/* Branch Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass-card rounded-full p-1 inline-flex gap-1">
            <button
              onClick={() => setBranch("nakshtra")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                branch === "nakshtra" ? "gold-gradient text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Nakshtra Branch
            </button>
            <button
              onClick={() => setBranch("sarju")}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                branch === "sarju" ? "gold-gradient text-primary-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              Shree Sarju Heights Branch
            </button>
          </div>
        </div>

        {/* Duration Toggle */}
        <div className="flex justify-center mb-12">
          <div className="glass-card rounded-full p-1 inline-flex gap-1">
            {durations.map((d) => (
              <button
                key={d.key}
                onClick={() => setDuration(d.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  duration === d.key ? "gold-gradient text-primary-foreground" : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.plan}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className={`rounded-2xl p-7 relative hover:shadow-xl transition-shadow duration-500 ${
                plan.popular ? "gold-gradient text-primary-foreground" : "glass-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary text-xs font-bold px-4 py-1 rounded-full">
                  BEST VALUE
                </span>
              )}
              <h3 className="font-serif text-lg font-semibold mb-1">{plan.plan}</h3>
              <p className={`text-sm mb-5 ${plan.popular ? "text-primary-foreground/70" : "text-foreground/40"}`}>
                {plan.desc}
              </p>
              <p className="text-3xl font-bold mb-6">
                {plan.prices[duration]}
                <span className={`text-sm font-normal ml-1 ${plan.popular ? "text-primary-foreground/60" : "text-foreground/30"}`}>
                  /{durations.find((d) => d.key === duration)?.label.toLowerCase()}
                </span>
              </p>
              <a
                href="#inquiry"
                className={`block text-center py-3 rounded-lg font-semibold transition-colors text-sm ${
                  plan.popular
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "border border-primary/30 text-primary hover:bg-primary/10"
                }`}
              >
                Book Now
              </a>
            </motion.div>
          ))}
        </div>


        <p className="text-center text-foreground/30 text-sm mt-8">
          <Info size={14} className="inline mr-1 -mt-0.5" />
          Contact: {contactNumber} ({branch === "nakshtra" ? "Nakshtra" : "Sarju Heights"} Branch)
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
