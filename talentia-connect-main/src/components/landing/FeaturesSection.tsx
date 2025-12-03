import { motion } from "framer-motion";
import { 
  Target, 
  Palette, 
  GraduationCap, 
  Briefcase, 
  Users2, 
  BookOpen,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Target,
    title: "Talent Discovery",
    description: "Take our AI-powered assessment to uncover your unique creative strengths and get personalized recommendations.",
    color: "coral",
    link: "/assessment",
  },
  {
    icon: Palette,
    title: "Portfolio Builder",
    description: "Create a stunning digital portfolio that showcases your best work. Share your profile with a custom URL.",
    color: "teal",
    link: "/portfolio",
  },
  {
    icon: GraduationCap,
    title: "Training Hub",
    description: "Access curated courses, masterclasses, and workshops from industry experts to level up your skills.",
    color: "indigo",
    link: "/training",
  },
  {
    icon: Briefcase,
    title: "Talent Marketplace",
    description: "Connect with companies and event organizers looking for fresh creative talent. Get paid for your skills.",
    color: "gold",
    link: "/marketplace",
  },
  {
    icon: Users2,
    title: "Mentorship",
    description: "Get guidance from industry professionals who can help you navigate your creative career path.",
    color: "coral",
    link: "/mentorship",
  },
  {
    icon: BookOpen,
    title: "E-Library",
    description: "Access a rich collection of resources, templates, eBooks, and case studies to support your growth.",
    color: "teal",
    link: "/library",
  },
];

const colorClasses = {
  coral: {
    bg: "bg-coral/10",
    border: "border-coral/20",
    icon: "text-coral",
    hover: "group-hover:bg-coral/20",
  },
  teal: {
    bg: "bg-teal/10",
    border: "border-teal/20",
    icon: "text-teal",
    hover: "group-hover:bg-teal/20",
  },
  indigo: {
    bg: "bg-indigo/10",
    border: "border-indigo/20",
    icon: "text-indigo",
    hover: "group-hover:bg-indigo/20",
  },
  gold: {
    bg: "bg-gold/10",
    border: "border-gold/20",
    icon: "text-gold",
    hover: "group-hover:bg-gold/20",
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo/5 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-coral/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 border border-coral/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm font-medium text-coral">Powerful Features</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Everything You Need to{" "}
            <span className="text-gradient">Succeed</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            A complete ecosystem designed to help you discover your talents, 
            build your brand, and connect with opportunities.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link} className="group block h-full">
                  <div className={`h-full p-6 rounded-2xl bg-card border ${colors.border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} ${colors.hover} flex items-center justify-center mb-4 transition-colors duration-300`}>
                      <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-coral transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-coral">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/auth?mode=signup">
            <Button variant="coral" size="lg">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
