import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GraduationCap, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { setStudentSession } from "@/lib/studentSession";
import GoogleAuthButton from "./GoogleAuthButton";

const querySchema = z
  .string()
  .trim()
  .min(5, "Enter your registered email or phone number")
  .max(255, "That looks too long");

type Mode = "choose" | "student" | "admin";

const AuthDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [mode, setMode] = useState<Mode>("choose");
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const close = () => {
    onOpenChange(false);
    setTimeout(() => {
      setMode("choose");
      setError(null);
      setValue("");
    }, 200);
  };

  const studentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = querySchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setError(null);
    setLoading(true);
    const { data, error: fnError } = await supabase.functions.invoke("membership-lookup", {
      body: { query: parsed.data },
    });
    setLoading(false);
    if (fnError || data?.error) {
      setError(data?.error ?? "Could not verify your details. Please try again.");
      return;
    }
    const found = (data?.memberships ?? []) as { name: string }[];
    if (found.length === 0) {
      setError("No membership found for those details. Please submit an admission inquiry.");
      return;
    }
    setStudentSession({ query: parsed.data, name: found[0].name });
    toast.success(`Welcome back, ${found[0].name.split(" ")[0]}!`);
    close();
    document.getElementById("membership")?.scrollIntoView({ behavior: "smooth" });
  };

  const cardClass =
    "w-full text-left rounded-xl border border-border bg-secondary/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg";

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="glass-card sm:max-w-md border-border">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">
            {mode === "choose" && <>Welcome to <span className="gold-text">Abhyas</span></>}
            {mode === "student" && "Student Portal Login"}
            {mode === "admin" && "Admin Sign In"}
          </DialogTitle>
          <DialogDescription>
            {mode === "choose" && "Choose how you would like to continue."}
            {mode === "student" && "Verify with the email or phone number registered at the library."}
            {mode === "admin" && "Staff access is restricted to approved Google accounts."}
          </DialogDescription>
        </DialogHeader>

        {mode === "choose" && (
          <div className="space-y-3 pt-1">
            <button className={cardClass} onClick={() => setMode("student")}>
              <span className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full gold-gradient flex items-center justify-center shrink-0">
                  <GraduationCap size={18} className="text-primary-foreground" />
                </span>
                <span>
                  <span className="block font-semibold">Student Portal</span>
                  <span className="block text-sm text-foreground/50">View your plan, seat and fees</span>
                </span>
                <ArrowRight size={16} className="ml-auto text-primary" />
              </span>
            </button>
            <button className={cardClass} onClick={() => setMode("admin")}>
              <span className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full border border-primary/40 flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-primary" />
                </span>
                <span>
                  <span className="block font-semibold">Admin / Staff</span>
                  <span className="block text-sm text-foreground/50">Members, inquiries and seats</span>
                </span>
                <ArrowRight size={16} className="ml-auto text-primary" />
              </span>
            </button>
          </div>
        )}

        {mode === "student" && (
          <form onSubmit={studentLogin} className="space-y-4 pt-1">
            <div>
              <input
                autoFocus
                value={value}
                maxLength={255}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Registered email or phone number"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {error && <p className="text-destructive text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground py-3.5 rounded-lg font-semibold inline-flex items-center justify-center gap-2 transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60"
            >
              <Search size={16} /> {loading ? "Verifying…" : "Continue"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setMode("choose")} className="text-foreground/50 hover:text-primary transition-colors">
                Back
              </button>
              <a href="#inquiry" onClick={close} className="text-primary hover:underline">
                New here? Apply for admission
              </a>
            </div>
          </form>
        )}

        {mode === "admin" && (
          <div className="space-y-4 pt-1">
            <GoogleAuthButton compact />
            <button
              onClick={() => {
                close();
                navigate("/admin");
              }}
              className="w-full rounded-lg border border-primary/40 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
            >
              Open Admin Dashboard
            </button>
            <button onClick={() => setMode("choose")} className="text-sm text-foreground/50 hover:text-primary transition-colors">
              Back
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
