import { motion } from "framer-motion";
import { UserPlus, Target, Palette, Rocket, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up with your university email and complete your basic profile to get started.",
    color: "coral",
  },
  {
    number: "02",
    icon: Target,
    title: "Take the Assessment",
    description: "Complete our talent discovery assessment to identify your creative strengths and skills.",
    color: "teal",
  },
  {
    number: "03",
    icon: Palette,
    title: "Build Your Portfolio",
    description: "Showcase your best work, add certifications, and create a stunning profile page.",
    color: "indigo",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Get Opportunities",
    description: "Apply for gigs, connect with mentors, and start earning from your creative talents.",
    color: "gold",
  },
];

const colorClasses = {
  coral: "bg-coral text-accent-foreground",
  teal: "bg-teal text-accent-foreground",
  indigo: "bg-indigo text-primary-foreground",
  gold: "bg-gold text-foreground",
};

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Get started in minutes and unlock your creative potential
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="text-center">
                {/* Number Badge */}
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 rounded-2xl ${colorClasses[step.color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-9 h-9" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-bold text-foreground shadow-sm">
                    {step.number}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Why Students Love TALENTIA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "AI-powered talent assessment",
                "Professional portfolio builder",
                "Access to paid opportunities",
                "Industry mentorship programs",
                "Verified skill certifications",
                "University-backed platform",
                "Direct company connections",
                "Secure payment system",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-teal" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
