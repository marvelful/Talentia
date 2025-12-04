import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Users, 
  Library,
  ChevronDown
} from "lucide-react";

const navLinks = [
  { name: "Discover Talent", href: "/marketplace", icon: Users },
  { name: "Training Hub", href: "/training", icon: BookOpen },
  { name: "Opportunities", href: "/opportunities", icon: Briefcase },
  { name: "E-Library", href: "/library", icon: Library },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const getHomeRouteForRole = (role?: string | null) => {
    if (!role) return "/";
    if (role === "COMPANY") return "/company-dashboard";
    if (role === "MENTOR") return "/mentor-dashboard";
    if (role === "UNIVERSITY_ADMIN") return "/university-dashboard";
    if (role === "SUPER_ADMIN") return "/admin-dashboard";
    return "/dashboard";
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
    if (stored) {
      try {
        const user = JSON.parse(stored);
        navigate(getHomeRouteForRole(user.role));
        return;
      } catch {
        // fall through to landing page
      }
    }
    navigate("/");
  };

  const handleSignOut = () => {
    localStorage.removeItem("talentia_token");
    localStorage.removeItem("talentia_user");
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome ? "bg-transparent" : "glass border-b border-border/50"
    }`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={handleLogoClick}>
            <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className={`text-xl font-bold ${isHome ? "text-primary-foreground" : "text-foreground"}`}>
              TALENTIA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isHome 
                    ? "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / User Info */}
          <div className="hidden lg:flex items-center gap-3">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-card border border-border">
                  <div className="w-8 h-8 rounded-full bg-coral/20 flex items-center justify-center text-xs font-semibold text-coral">
                    {currentUser.firstName?.[0] || "U"}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground leading-tight">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight uppercase">
                      {currentUser.role}
                    </p>
                  </div>
                </div>
                <Button variant={isHome ? "hero-outline" : "ghost"} size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant={isHome ? "hero-outline" : "ghost"} size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="coral" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isHome ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
                >
                  <link.icon className="w-5 h-5 text-coral" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50 space-y-2">
                {currentUser ? (
                  <>
                    <div className="flex items-center justify-between px-2 text-sm text-foreground">
                      <span>
                        {currentUser.firstName} {currentUser.lastName}
                      </span>
                      <span className="text-[10px] uppercase text-muted-foreground">
                        {currentUser.role}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                      <Button variant="coral" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
