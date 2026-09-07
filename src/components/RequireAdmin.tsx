import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import GoogleAuthButton from "./GoogleAuthButton";

const Shell = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
    <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full space-y-5">
      {children}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft size={15} /> Back to site
      </Link>
    </div>
  </main>
);

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, checking } = useAdminAuth();

  if (checking || (user && isAdmin === null)) {
    return (
      <Shell>
        <Loader2 className="mx-auto animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Checking your access…</p>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="h-12 w-12 rounded-full gold-gradient mx-auto flex items-center justify-center">
          <ShieldAlert size={20} className="text-primary-foreground" />
        </div>
        <h1 className="font-serif text-2xl font-bold">Admin Sign In</h1>
        <p className="text-muted-foreground text-sm">
          This area is for library staff. Sign in with your approved Google account to continue.
        </p>
        <GoogleAuthButton compact />
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <div className="h-12 w-12 rounded-full border border-destructive/40 mx-auto flex items-center justify-center">
          <ShieldAlert size={20} className="text-destructive" />
        </div>
        <h1 className="font-serif text-2xl font-bold">No admin access</h1>
        <p className="text-muted-foreground text-sm">
          This account does not have admin rights. Ask the library owner to grant your account admin access.
        </p>
        <GoogleAuthButton compact />
      </Shell>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
