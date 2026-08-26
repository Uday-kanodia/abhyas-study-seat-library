import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import GoogleAuthButton from "./GoogleAuthButton";
import logo from "@/assets/unnamed_7.webp.asset.json";


const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#seats", label: "Availability" },
  { href: "#pricing", label: "Pricing" },
  { href: "#rules", label: "Rules" },
  { href: "#inquiry", label: "Inquiry" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-card py-3 shadow-lg" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 font-serif text-xl font-bold gold-text">
          <img src={logo.url} alt="Abhyas Reading Library logo" className="h-9 w-9 object-contain" />
          Abhyas
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <GoogleAuthButton />
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>


      {open && (
        <div className="md:hidden glass-card mt-2 mx-4 rounded-lg p-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-foreground/70 hover:text-primary transition-colors border-b border-border/30 last:border-0"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4">
            <GoogleAuthButton compact />
          </div>
        </div>

      )}
    </nav>
  );
};

export default Navbar;
