import { ShieldCheck } from "lucide-react";

const rules = [
  "Fees will be non-refundable, non-extendable, and non-transferable.",
  "Noise, disturbance or unruly behaviour is forbidden in any part of the library.",
  "Smoking, food and drinks are strictly not allowed in the library.",
  "Silence shall be observed in the library. Mobile phones, laptops and watch alarms should be silenced before entering.",
  "Students must not write anything on the study table. Otherwise penalty will be charged.",
  "Users of the library should be decently dressed.",
  "Loitering in the library is prohibited.",
  "The library will not be held responsible for the loss of any personal belongings.",
  "If you have put your books on your seat even after completion of your month, fees will be charged until you take out your books.",
  "Timing of AC will be 9 AM to 10 PM. Further AC will be controlled by staff according to requirements.",
  "Students must use table lights after 10 PM.",
  "If library is temporarily closed due to technical reasons, fees won't be refunded.",
  "Students must obey above given rules. If a student fails to comply, their admission will be cancelled and fees won't be refunded.",
];

const RulesSection = () => {
  return (
    <section id="rules" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Guidelines</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Rules & <span className="gold-text">Regulations</span>
          </h2>
          <p className="text-foreground/40 mt-4 max-w-xl mx-auto">
            To maintain a productive and peaceful study environment, all members are expected to follow these guidelines.
          </p>
        </div>

        <div className="max-w-3xl mx-auto glass-card rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck size={24} className="text-primary" />
            <h3 className="font-serif text-xl font-semibold">Library Code of Conduct</h3>
          </div>
          <ol className="space-y-4">
            {rules.map((rule, i) => (
              <li key={i} className="flex gap-4 text-foreground/60 leading-relaxed">
                <span className="text-primary font-bold font-serif shrink-0 w-7 text-right">{i + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
