import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LogIn, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import AuthDialog from "./AuthDialog";
import { clearStudentSession, getStudentSession, STUDENT_SESSION_EVENT, type StudentSession } from "@/lib/studentSession";
import logo from "@/assets/unnamed_7.webp.asset.json";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#seats", label: "Availability" },
  { href: "#pricing", label: "Pricing" },
  { href: "#rules", label: "Rules" },
  { href: "#inquiry", label: "Inquiry" },
  { href: "#membership", label: "My Membership" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentSession | null>(getStudentSession());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const onStudent = (e: Event) => setStudent((e as CustomEvent).detail ?? null);
    window.addEventListener(STUDENT_SESSION_EVENT, onStudent);
    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener(STUDENT_SESSION_EVENT, onStudent);
    };
  }, []);

  const signOut = async () => {
    clearStudentSession();
    if (user) await supabase.auth.signOut();
  };

  const loggedIn = Boolean(user || student);
  const label = student?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "";

  const btn =
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5";

  const account = (compact = false) =>
    loggedIn ? (
      <div className={compact ? "space-y-2" : "flex items-center gap-2"}>
        {user && (
          <Link
            to="/admin"
            className={`${btn} border border-primary/30 text-primary hover:bg-primary/10 ${compact ? "w-full px-4 py-3" : "px-4 py-2"}`}
          >
            <ShieldCheck size={15} /> Admin
          </Link>
        )}
        <button
          onClick={signOut}
          className={`${btn} border border-border bg-secondary text-foreground hover:border-primary/50 hover:text-primary ${
            compact ? "w-full px-4 py-3" : "px-4 py-2"
          }`}
        >
          <LogOut size={15} /> {label ? `Sign out (${label})` : "Sign out"}
        </button>
      </div>
    ) : (
      <button
        onClick={() => {
          setOpen(false);
          setAuthOpen(true);
        }}
        className={`${btn} gold-gradient text-primary-foreground ${compact ? "w-full px-4 py-3" : "px-5 py-2.5"}`}
      >
        <LogIn size={15} /> Login / Sign Up
      </button>
    );

  return (
    <>
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

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            {account()}
          </div>

          <button className="lg:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden glass-card mt-2 mx-4 rounded-lg p-4 animate-fade-in">
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
            <div className="pt-4">{account(true)}</div>
          </div>
        )}
      </nav>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};

export default Navbar;
