import { BookOpen, Shield, Clock } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Focused Environment", desc: "A distraction-free zone designed purely for deep work and serious study." },
  { icon: Shield, title: "Discipline & Productivity", desc: "Structured rules and silent zones that help you stay on track every day." },
  { icon: Clock, title: "Flexible Timings", desc: "Morning, afternoon, and night batches to fit your study schedule." },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">About Us</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">
            Your Sanctuary for <span className="gold-text">Serious Study</span>
          </h2>
          <p className="text-foreground/50 max-w-2xl mx-auto text-lg leading-relaxed">
            Abhyas Reading Library is more than just a study space — it's a commitment to your goals.
            Located in the heart of Chandkheda, Ahmedabad, we provide a premium, peaceful, and
            fully-equipped environment for students and professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-xl p-8 text-center hover:gold-shadow transition-all duration-500 group">
              <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-foreground/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
