import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Calendar, Video } from "lucide-react";

export default function MentorDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Mentor Dashboard
              </h1>
              <p className="text-muted-foreground">
                View your upcoming sessions, mentees, and feedback.
              </p>
            </div>
            <Button variant="coral" size="lg">
              <Calendar className="w-5 h-5 mr-2" />
              Open Availability
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {["Upcoming Sessions", "Active Mentees", "Avg Rating"].map((label, idx) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className="text-xl font-semibold text-foreground">-</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-coral" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Video className="w-5 h-5 text-coral" />
                Upcoming Sessions
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              API wiring for mentor-specific sessions and mentees will go here.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
