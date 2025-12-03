import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  Search, 
  Star, 
  Calendar, 
  Clock, 
  Video,
  MessageSquare,
  Award,
  Verified,
  ChevronRight
} from "lucide-react";


export default function Mentorship() {
  const { data: mentors = [] } = useQuery({
    queryKey: ["mentors"],
    queryFn: () => api.mentorship.listMentors(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo/5 to-teal/5 py-16 mb-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-foreground mb-4"
              >
                Learn from Industry{" "}
                <span className="text-coral">Professionals</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Get personalized guidance from experienced mentors who've been where you want to go
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative max-w-xl mx-auto"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search mentors by skill or industry..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-input bg-card text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-coral"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-8">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {[
              { value: "200+", label: "Expert Mentors" },
              { value: "5,000+", label: "Sessions Completed" },
              { value: "4.9", label: "Average Rating" },
              { value: "95%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl border border-border p-5 text-center"
              >
                <div className="text-2xl font-bold text-coral">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Mentor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="p-6 pb-0">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img
                          src={mentor.image}
                          alt={mentor.name}
                          className="w-16 h-16 rounded-xl object-cover border-2 border-card"
                        />
                        {mentor.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-teal flex items-center justify-center">
                            <Verified className="w-3.5 h-3.5 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-coral transition-colors">
                          {mentor.name}
                        </h3>
                        <p className="text-sm text-coral font-medium">{mentor.title}</p>
                        <p className="text-sm text-muted-foreground">{mentor.company}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mentor.available 
                          ? "bg-teal/10 text-teal" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {mentor.available ? "Available" : "Busy"}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {mentor.bio}
                    </p>

                    {/* Expertise */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {mentor.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-gold text-gold" />
                        <span className="font-medium text-foreground">{mentor.rating}</span>
                        <span className="text-muted-foreground">({mentor.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {mentor.sessions} sessions
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <span className="text-xl font-bold text-foreground">
                          {mentor.hourly_rate ? `XAF ${mentor.hourly_rate}` : ""}
                        </span>
                        <span className="text-sm text-muted-foreground">/session</span>
                      </div>
                      <Button variant="coral" size="sm" disabled={!mentor.available}>
                        Book Session
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Mentors
            </Button>
          </div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-12">
              How Mentorship Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Search,
                  title: "Find Your Mentor",
                  description: "Browse our curated list of industry professionals and find the perfect match for your goals.",
                },
                {
                  icon: Calendar,
                  title: "Book a Session",
                  description: "Schedule a convenient time slot and prepare your questions for the session.",
                },
                {
                  icon: Video,
                  title: "Connect & Learn",
                  description: "Join the video call, get personalized guidance, and accelerate your growth.",
                },
              ].map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-coral/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-coral" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
