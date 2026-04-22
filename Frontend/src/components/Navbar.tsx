import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Brain, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't show navbar on auth pages
  if (["/login", "/signup"].includes(location.pathname)) return null;
  if (!isAuthenticated) return null;

  const isTherapist = user?.role === "therapist";
  const links = isTherapist
    ? [{ to: "/therapist", label: "Patients" }]
    : [
        { to: "/journal", label: "Journal" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/analytics", label: "Analytics" },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to={isTherapist ? "/therapist" : "/dashboard"} className="flex items-center gap-2.5 transition-transform hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-calm shadow-lg">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PsyNex</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                location.pathname === l.to
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <span className="text-sm font-medium text-foreground">Hi, <span className="text-primary font-semibold capitalize">{user?.first_name}</span></span>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden rounded-lg p-2 hover:bg-muted/50" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card/95 backdrop-blur px-4 py-3 md:hidden">
          <div className="mb-4 px-4 py-2 border-b border-border/50">
            <span className="text-sm font-medium text-foreground">Hi, <span className="text-primary font-semibold capitalize">{user?.first_name}</span></span>
          </div>
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                location.pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >{l.label}</Link>
          ))}
          <button onClick={() => { logout(); setMobileOpen(false); }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
