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
    budget: "XAF 500 - XAF 800",
    deadline: "3 days left",
    tags: ["UI/UX", "Mobile", "Figma"],
  },
  {
    title: "Brand Identity Package",
    company: "Fashion Forward",
    budget: "XAF 300 - XAF 500",
    deadline: "5 days left",
    tags: ["Branding", "Logo", "Print"],
  },
  {
    title: "Video Editor for Social Media",
    company: "ViralMedia Co.",
    budget: "XAF 200 - XAF 400",
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
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
              navigate("/auth");
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
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face"
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
