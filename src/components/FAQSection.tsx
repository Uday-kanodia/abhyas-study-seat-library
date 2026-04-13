import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "What are the library timings?", a: "We operate from 6:00 AM to 12:00 AM (midnight), 7 days a week. You can choose morning, afternoon, or night batches." },
  { q: "Is the library air-conditioned?", a: "Yes, our entire study hall is fully air-conditioned for your comfort throughout the year." },
  { q: "Can I get a locker for my belongings?", a: "Yes, we provide individual lockers for all monthly and quarterly plan members at no extra cost." },
  { q: "Is there a trial or daily pass available?", a: "Yes, we offer a daily pass for ₹70. You can try the library before committing to a longer plan." },
  { q: "Are there separate sections for different exams?", a: "We maintain a common silent study hall. All students study together in a disciplined environment regardless of their exam preparation." },
];

const FAQSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">FAQ</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Frequently Asked <span className="gold-text">Questions</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl px-6 border-none">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/50 leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
