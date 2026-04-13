import { MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-primary uppercase tracking-[0.2em] text-sm mb-3">Visit Us</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Contact & <span className="gold-text">Location</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="text-primary mt-1 shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-foreground/50">Abhyas Reading Library, Chandkheda, Ahmedabad, Gujarat</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="text-primary mt-1 shrink-0" size={20} />
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-foreground/50">+91 98765 43210</p>
              </div>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden h-[300px] md:h-auto">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.0!2d72.57!3d23.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sChandkheda%2C+Ahmedabad!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 300 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Abhyas Reading Library Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
