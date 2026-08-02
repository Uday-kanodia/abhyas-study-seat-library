import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { buildInquiryWhatsAppLink } from "@/lib/inquiryNotify";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  email: z.string().trim().email("Enter a valid email").max(255),
  timing: z.string().min(1, "Select a timing"),
  message: z.string().trim().max(1000).optional(),
});

const InquiryForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", timing: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);
  const [seat, setSeat] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => setSeat((e as CustomEvent<number>).detail);
    window.addEventListener("seat-selected", handler);
    return () => window.removeEventListener("seat-selected", handler);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const fullMessage = [seat ? `Preferred seat: ${seat}` : null, result.data.message || null]
      .filter(Boolean)
      .join(" — ");

    const { error } = await supabase.from("admission_inquiries").insert({
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email,
      timing: result.data.timing,
      message: fullMessage || null,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Could not submit your inquiry. Please try again.");
      return;
    }

    const link = buildInquiryWhatsAppLink({
      name: form.name,
      phone: form.phone,
      email: form.email,
      timing: form.timing,
      message: fullMessage,
    });

    setWaLink(link);
    window.open(link, "_blank", "noopener,noreferrer");

    toast.success("Inquiry submitted successfully! We'll contact you soon.");
    setForm({ name: "", phone: "", email: "", timing: "", message: "" });
    setSubmitted(true);
  };

  const inputClass = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all";


  return (
    <section id="inquiry" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Join Us</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Admission <span className="gold-text">Inquiry</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto glass-card rounded-2xl p-8 md:p-12 space-y-5">
          <div>
            <input className={inputClass} placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <input className={inputClass} placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
            </div>
            <div>
              <input className={inputClass} placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
          <div>
            <select className={inputClass} value={form.timing} onChange={(e) => setForm({ ...form, timing: e.target.value })}>
              <option value="">Preferred Timing / Plan</option>
              <option value="18h-reserved">18 Hours Reserved Seat (7 AM – 1 AM)</option>
              <option value="18h-unreserved">18 Hours Unreserved Seat (7 AM – 1 AM)</option>
              <option value="6h-morning">6 Hours Shift (7 AM – 1 PM)</option>
              <option value="6h-afternoon">6 Hours Shift (1 PM – 7 PM)</option>
              <option value="6h-night">6 Hours Shift (7 PM – 1 AM)</option>
              <option value="9h-evening">9 Hours Shift (4 PM – 1 AM)</option>
              <option value="per-day">Per Day / Demo (₹100)</option>
            </select>
            {errors.timing && <p className="text-destructive text-sm mt-1">{errors.timing}</p>}
          </div>
          <div className="flex items-center justify-between rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm">
            <span className="text-foreground/60">
              {seat ? `Selected seat: ` : "No seat selected"}
              {seat && <span className="text-primary font-semibold">{seat}</span>}
            </span>
            <a href="#seat-map" className="text-primary hover:underline">
              {seat ? "Change seat" : "Pick a seat"}
            </a>
          </div>

          <div>
            <textarea className={`${inputClass} min-h-[100px] resize-none`} placeholder="Your Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <button type="submit" disabled={submitting} className="w-full gold-gradient text-primary-foreground py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
            {submitting ? "Submitting…" : "Submit Inquiry"}
          </button>
          {submitted && !submitting && (
            <div className="text-center text-sm text-primary border border-primary/30 bg-primary/5 rounded-lg py-4 px-4 space-y-3">
              <p>Thank you! Your inquiry has been saved. Our team will reach out to you shortly.</p>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-4 py-2 font-medium hover:bg-primary/10 transition-colors"
                >
                  <MessageCircle size={15} /> Notify the library on WhatsApp
                </a>
              )}
            </div>
          )}
        </form>

      </div>
    </section>
  );
};

export default InquiryForm;
