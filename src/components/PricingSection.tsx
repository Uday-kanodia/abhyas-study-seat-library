import { Check } from "lucide-react";

const plans = [
  {
    name: "Weekly",
    price: "₹350",
    period: "/week",
    features: ["Individual Seat", "AC Hall Access", "WiFi", "Locker Facility"],
    popular: false,
  },
  {
    name: "Monthly",
    price: "₹1,200",
    period: "/month",
    features: ["Individual Seat", "AC Hall Access", "WiFi", "Locker Facility", "Power Backup", "Flexible Timing"],
    popular: true,
  },
  {
    name: "Quarterly",
    price: "₹3,000",
    period: "/3 months",
    features: ["Individual Seat", "AC Hall Access", "WiFi", "Locker Facility", "Power Backup", "Flexible Timing", "Priority Seating"],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Plans</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Simple <span className="gold-text">Pricing</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 ${
                plan.popular
                  ? "gold-gradient text-primary-foreground relative"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <h3 className="font-serif text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className={plan.popular ? "text-primary-foreground/70" : "text-foreground/40"}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <Check size={16} className={plan.popular ? "text-primary-foreground" : "text-primary"} />
                    <span className={plan.popular ? "" : "text-foreground/70"}>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#inquiry"
                className={`block text-center py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "border border-primary/30 text-primary hover:bg-primary/10"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
