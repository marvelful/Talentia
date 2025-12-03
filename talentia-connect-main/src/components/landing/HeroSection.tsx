import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Star, Users, Award, Briefcase } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Creative Students" },
  { icon: Award, value: "1,200+", label: "Skills Certified" },
  { icon: Briefcase, value: "8K+", label: "Gigs Completed" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Cultural Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('../../unifac pic/african-culture-banner.jpg')" }}
      />
      <div className="absolute inset-0 gradient-hero opacity-90" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-coral rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[15%] w-16 h-16 rounded-2xl bg-coral/20 backdrop-blur-sm border border-coral/30"
        />
        <motion.div
          animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-[10%] w-20 h-20 rounded-full bg-teal/20 backdrop-blur-sm border border-teal/30"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[8%] w-12 h-12 rounded-xl bg-gold/20 backdrop-blur-sm border border-gold/30"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8"
          >
            <Star className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary-foreground">
              #1 University Talent Platform
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-primary-foreground leading-tight mb-6"
          >
            Discover Your{" "}
            <span className="relative">
              <span className="text-coral">Creative</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--coral))" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
            <br />
            Talent & Shine
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            TALENTIA empowers university students to identify their unique talents, 
            build stunning portfolios, access world-class training, and connect 
            with paid opportunities.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-5 h-5 text-coral" />
                  <span className="text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sm text-primary-foreground/60">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-coral/20 via-teal/20 to-coral/20 rounded-3xl blur-2xl" />
            <div className="relative bg-card rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
              <div className="h-8 bg-muted flex items-center gap-2 px-4 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-gold/60" />
                <div className="w-3 h-3 rounded-full bg-teal/60" />
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Preview Cards */}
                  <div className="space-y-4">
                    <div className="h-32 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20 p-4">
                      <div className="w-10 h-10 rounded-lg bg-coral/20 flex items-center justify-center mb-3">
                        <Award className="w-5 h-5 text-coral" />
                      </div>
                      <div className="h-3 w-24 bg-foreground/10 rounded" />
                      <div className="h-2 w-16 bg-foreground/5 rounded mt-2" />
                    </div>
                    <div className="h-24 rounded-xl bg-muted border border-border p-4">
                      <div className="h-3 w-20 bg-foreground/10 rounded" />
                      <div className="h-2 w-full bg-foreground/5 rounded mt-3" />
                      <div className="h-2 w-3/4 bg-foreground/5 rounded mt-1" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="h-48 rounded-xl bg-gradient-to-br from-indigo-light/10 to-teal/10 border border-teal/20 p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-teal/20" />
                        <div>
                          <div className="h-3 w-24 bg-foreground/10 rounded" />
                          <div className="h-2 w-16 bg-foreground/5 rounded mt-1" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="aspect-square rounded-lg bg-foreground/5" />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-20 rounded-xl bg-gold/10 border border-gold/20 p-3">
                        <div className="h-3 w-16 bg-foreground/10 rounded" />
                        <div className="text-xl font-bold text-gold mt-2">85%</div>
                      </div>
                      <div className="h-20 rounded-xl bg-coral/10 border border-coral/20 p-3">
                        <div className="h-3 w-16 bg-foreground/10 rounded" />
                        <div className="text-xl font-bold text-coral mt-2">12 Gigs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center pt-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50" />
        </div>
      </motion.div>
    </section>
  );
}
