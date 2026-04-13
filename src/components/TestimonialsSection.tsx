import { Star } from "lucide-react";

const testimonials = [
  { name: "Ravi Patel", text: "Best study environment in Chandkheda. The silent zone and AC make it perfect for long study sessions.", rating: 5 },
  { name: "Priya Sharma", text: "I cleared my GPSC exam thanks to the focused atmosphere here. Highly recommended for serious aspirants.", rating: 5 },
  { name: "Amit Desai", text: "Clean, well-maintained, and affordable. The individual seating is a game changer for concentration.", rating: 5 },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Reviews</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            What Students <span className="gold-text">Say</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card rounded-xl p-8 hover:gold-shadow transition-all duration-500">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/60 leading-relaxed mb-6 italic">"{t.text}"</p>
              <p className="font-semibold text-foreground">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
