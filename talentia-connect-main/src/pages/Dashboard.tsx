import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Home,
  Target,
  Palette,
  Briefcase,
  BookOpen,
  Users2,
  Library,
  Settings,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Star,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  LogOut
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
  { icon: Target, label: "Assessment", href: "/assessment" },
  { icon: Palette, label: "Portfolio", href: "/portfolio" },
  { icon: Briefcase, label: "Opportunities", href: "/opportunities" },
  { icon: BookOpen, label: "Training", href: "/training" },
  { icon: Users2, label: "Mentorship", href: "/mentorship" },
  { icon: Library, label: "E-Library", href: "/library" },
];

const stats = [
  { label: "Profile Views", value: "1,284", change: "+12%", icon: TrendingUp },
  { label: "Skill Score", value: "85%", change: "+5%", icon: Star },
  { label: "Gigs Completed", value: "12", change: "+2", icon: Briefcase },
  { label: "Hours Trained", value: "48", change: "+8h", icon: Clock },
];

const opportunities = [
  {
    title: "UI Designer for Mobile App",
    company: "TechStart Inc.",
    budget: "XAF 50000 - XAF 80000",
    deadline: "3 days left",
    tags: ["UI/UX", "Mobile", "Figma"],
  },
  {
    title: "Afrobeat dance group",
    company: "Canal 2 International",
    budget: "XAF 30000 - XAF 50000",
    deadline: "5 days left",
    tags: ["Afrobeat", "Mbole", "pop"],
  },
  {
    title: "Video Editor for Social Media",
    company: "ViralMedia Co.",
    budget: "XAF 20000 - XAF 40000",
    deadline: "7 days left",
    tags: ["Video", "Social Media", "Adobe"],
  },
];

const courses = [
  {
    title: "Advanced UI Design",
    progress: 75,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=120&fit=crop",
  },
  {
    title: "Motion Graphics Basics",
    progress: 40,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=120&fit=crop",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const displayName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Sarah Okonkwo";
  const displayRole = currentUser ? currentUser.role : "STUDENT";

  const getHomeRouteForRole = (role?: string | null) => {
    if (!role) return "/";
    if (role === "COMPANY") return "/company-dashboard";
    if (role === "MENTOR") return "/mentor-dashboard";
    if (role === "UNIVERSITY_ADMIN") return "/university-dashboard";
    if (role === "SUPER_ADMIN") return "/admin-dashboard";
    return "/dashboard";
  };

  const handleSidebarLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const stored = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
    if (stored) {
      try {
        const user = JSON.parse(stored);
        navigate(getHomeRouteForRole(user.role));
        return;
      } catch {
        // fall through
      }
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2" onClick={handleSidebarLogoClick}>
            <div className="w-10 h-10 rounded-xl bg-coral flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TALENTIA</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                item.active
                  ? "bg-coral/10 text-coral"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
            onClick={() => {
              localStorage.removeItem("talentia_token");
              localStorage.removeItem("talentia_user");
              navigate("/");
            }}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search opportunities, courses..."
                className="w-80 h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-coral" />
              </button>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:inline-flex text-xs"
                onClick={() => navigate("/messages")}
              >
                Messages
              </Button>
            <div className="flex items-center gap-3">
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAflBMVEX///8AAAD8/Pz39/fu7u6dnZ2Tk5O4uLj19fWCgoLh4eHx8fEnJyfT09NMTEyWlpaIiIiysrJtbW3d3d2Ojo7n5+e3t7ceHh5JSUliYmLAwMBlZWWjo6N7e3tERERvb28MDAwzMzNVVVU7OzsjIyMvLy8WFhYLCwvIyMiqqqqmr9iUAAAF00lEQVR4nO2c6WKiMBSFK6gVXBAsWm3VotXq+7/gTKeTm0BRtqzt+X5WU08g3C03PDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+J346TSO5kEQzKN4mvqm5cgmjPfHnsgxiUPTouQxjme9MmbXvmlpUkiDt9L5/SNITcvrzCi4Pb1/bMemJXYjrpjfJ1fTIjuQrmtMsNc7OLtUL6taE+z1zhvTUtvxWjKXj0l2+ij5+8C02DYMC5NYBcvwy8/74XL+Xvh0blhtC57y03sq+vdwmJ9kYERlBwai+klcFqR58Un80lC7xk48itqj0Y1v+bnrEGtV2JGFIHy3uPfFZ+GbU236OuNlXPb2fhbhbYXF7GnS1x0hUqt+uiLhamjQJgVhjdbxc4LfdGWd8mernpfjnnOnWJkkNiR4XXNE4pg9pVu4qpvgjidsyNEFY3OhG/JYewy/7S7E4JQx1V2jn7ywQQdluqSR0u1oUmnio+zPFa9M6kujYXs27FWRLnnQIm3m28iHWr9MR2QVGw7csYG3wnRbmDKhTZMhSjMuSnTJg4Q2DcBCNjBSoksezGKcmy62EfP6zSyUftjuRHODwUzURIEqmbC11jwRopRLgSqZtH+aKImyOzQlZ9G8VL9kQ+3ekBozmfWjbgZF33bHbT9/hn77VUoFSMu32368pfkF3uLne3wWta1aR22JEl3yaB15U4Joe+R9aSvUmeypdQZMNUjLncUvqGJ0rkTZv6PftZroQLdbq4pw0maQKXhVv36Fvs0Yc3hUF3yvaxZH1LKQWR6UftFld22pVJk0mu6Q8tYbR3ZIeVW4nu0XWk5c2eUWOxWqgzdhgs50Kjz4QrPTtsJ2CFdj4lB7e65j6J4PTx3tGCp2fd26jZ67XV+1Ovd8pzv3it2Xp2Gxuy2Mstw3HGwwLXbQ7oLNov+5Xr3+YhPsCp8+mZbbhpIu6PPklGWT8/cP7M+ZSrmUdXSXYnvl4ibjl+rJ/WVt917MHbxp1YGZL7ZTh1y9QP+1aE1ucxzYvR1TRhqU2JM7vG0dKF8I9LfVc/rG3p376D9VT6eUue3dQv9Z3lifq2x3WCdJsj7sshsnoj5ciE3DsvNqx2RwWYg+ob+4DJJjyTfX1j+O8bcDo29JHJZ7Ay+M99/vt93HEb19Ue/L5n7BbbxJikMSi71jmBXERnWilf6gcN8n907ZGGVTEFrbbBTOeFlbF77mRK6ujYq710lutJWdwlFO4rxpND3OO1EL88WcwOc2T9Ii914C63L+3ASHLXcfBhZPUdR2bl8VnIqxjlWlKdHIzLrks+ODnebmIsiqqnFXIJ64tMdppIKo7jZQrNFZ4vo9IYKW0e4jPNMnOwI4YV3JMQ7CFK1oARNeXyLLTQsL1YJMI+X5z17aP+XL4sN8aYOXRGfyHhqfOw3j7Sc8nzjLrOv2ues33Lzg8ZRAbmWe9wKszNpTnlDIDiO5tTGaZlCvpYJD2LxibnJbg+9LyN+D570ABls0+iRCxftz5vTfzXkMelZqv1ugCWN6CZGxVHFEEtRs4dImslRH1ATKCt/VGHSPKnCmMsWZagF0CXdmmjK5sVPlkz1qBDDTLkXFJ3WGgEyZkXed+ZT4qjPm5I6MpMK0SGcKf6Tl6Q05UEiqcleTOgBNBKdkSVU6Kzp12/SQkQToPKzaYzyUYOs/DkU1UrUtaRTX6K+dUkFMbU2TXgii/0GkQ61ql88o02Cxy2HXVnWliB5Exb/zDcruVWc2FNbozi+oUqS6FEbFPN0+X9sP06Vs/h6KblBio7qHKWWtKLpzRPZ4KDalwsk93aUMtrOg/lWOLIXRvQ3FjLj683Qs/tV9yJttnah3xOyXnpX/Uh59V3atbbXkedY+Q935E6vnqy+gsHKQ7to+q2Go75Zg2YX2OsbX9r2OvuxHIw7/4fN43TbS05SdRtuh9e3fAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGryB2rnOmTX6XSbAAAAAElFTkSuQmCC"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-coral/20"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your creative journey today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-coral" />
                  </div>
                  <span className="text-xs font-medium text-teal bg-teal/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Opportunities */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended Opportunities
                </h2>
                <Link to="/opportunities">
                  <Button variant="ghost" size="sm">
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {opportunities.map((opp, index) => (
                  <motion.div
                    key={opp.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-coral/30 hover:bg-muted/50 transition-all cursor-pointer group"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-foreground group-hover:text-coral transition-colors">
                            {opp.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{opp.company}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-coral transition-colors" />
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-teal">{opp.budget}</span>
                        <span className="text-muted-foreground">{opp.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {opp.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Continue Learning */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    Continue Learning
                  </h2>
                  <Link to="/training">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {courses.map((course) => (
                    <div
                      key={course.title}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-16 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground group-hover:text-coral transition-colors truncate">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-coral"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Assessment CTA */}
              <div className="bg-gradient-to-br from-coral/10 to-teal/10 rounded-2xl border border-coral/20 p-6">
                <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  Complete Your Assessment
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover your creative strengths and get personalized recommendations.
                </p>
                <Link to="/assessment">
                  <Button variant="coral" size="sm" className="w-full">
                    Start Assessment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
