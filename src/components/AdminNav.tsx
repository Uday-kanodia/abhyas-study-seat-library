import { Link, useLocation } from "react-router-dom";
import { Armchair, MessageSquare, Users } from "lucide-react";

const tabs = [
  { to: "/admin", label: "Inquiries", icon: MessageSquare },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/seats", label: "Seat Tracking", icon: Armchair },
];

const AdminNav = () => {
  const { pathname } = useLocation();
  return (
    <div className="glass-card rounded-full p-1 inline-flex gap-1 mb-8 flex-wrap">
      {tabs.map((t) => {
        const active = pathname === t.to;
        return (
          <Link
            key={t.to}
            to={t.to}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
              active ? "gold-gradient text-primary-foreground" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AdminNav;
