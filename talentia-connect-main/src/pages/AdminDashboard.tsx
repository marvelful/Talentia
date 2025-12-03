import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Shield, Users, Globe2 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              Platform Admin
            </h1>
            <p className="text-muted-foreground">
              Manage universities, mentors, content, and transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: Globe2, label: "Universities" },
              { icon: Users, label: "Active Users" },
              { icon: Shield, label: "Pending Approvals" },
            ].map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xl font-semibold text-foreground">-</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-coral" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
