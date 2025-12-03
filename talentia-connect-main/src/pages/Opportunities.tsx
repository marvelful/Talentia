import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign,
  Building2,
  Bookmark,
  ArrowUpRight,
  ChevronDown
} from "lucide-react";

const categories = [
  "All",
  "Design",
  "Video",
  "Photography",
  "Writing",
  "Development",
  "Music",
  "Marketing",
];

// Opportunities will be loaded from the API; keep a placeholder type here
// shape aligned with backend GigOut

const typeColors = {
  Contract: "bg-indigo/10 text-indigo",
  Gig: "bg-coral/10 text-coral",
  Project: "bg-teal/10 text-teal",
  Ongoing: "bg-gold/10 text-gold-light",
};

export default function Opportunities() {
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [applyGig, setApplyGig] = useState<any | null>(null);
  const [proposal, setProposal] = useState("");

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isStudent = currentUser?.role === "STUDENT";

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["gigs", { category: selectedCategory }],
    queryFn: () => api.marketplace.listGigs(),
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("talentia_token");
      if (!token) throw new Error("You must be logged in as a student to apply.");
      if (!applyGig) throw new Error("No opportunity selected.");

      return api.marketplace.applyToGig(
        applyGig.id,
        { proposal: proposal || undefined },
        token,
      );
    },
    onSuccess: () => {
      setProposal("");
      setApplyGig(null);
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
  });

  const filtered =
    selectedCategory === "All"
      ? opportunities
      : opportunities.filter((opp: any) => opp.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-2"
              >
                Find Opportunities
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground"
              >
                Discover gigs, contracts, and projects that match your skills
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button variant="coral">
                <Building2 className="w-5 h-5 mr-2" />
                Post an Opportunity
              </Button>
            </motion.div>
          </div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select className="h-12 px-4 pr-10 rounded-xl border border-input bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>All Locations</option>
                    <option>Remote</option>
                    <option>Lagos</option>
                    <option>Abuja</option>
                    <option>Port Harcourt</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="h-12 px-4 pr-10 rounded-xl border border-input bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>All Types</option>
                    <option>Contract</option>
                    <option>Gig</option>
                    <option>Project</option>
                    <option>Ongoing</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
                <Button variant="outline" className="h-12">
                  <Filter className="w-5 h-5 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-coral text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                <span>Loading opportunities...</span>
              ) : (
                <>
                  Showing <span className="font-medium text-foreground">{filtered.length}</span> opportunities
                </>
              )}
            </p>
            <select className="text-sm border-none bg-transparent text-muted-foreground focus:outline-none cursor-pointer">
              <option>Sort by: Most Recent</option>
              <option>Highest Budget</option>
              <option>Deadline Soon</option>
              <option>Most Applicants</option>
            </select>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {!isLoading && filtered.map((opp: any, index: number) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-card rounded-2xl border border-border p-6 hover:border-coral/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <img
                        src={opp.companyLogo}
                        alt={opp.company}
                        className="w-16 h-16 rounded-xl object-cover border border-border"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-coral transition-colors">
                              {opp.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              typeColors[opp.type as keyof typeof typeColors]
                            }`}>
                              {opp.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {opp.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {opp.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Bookmark className="w-5 h-5 text-muted-foreground" />
                          </button>
                          <Button
                            variant="coral"
                            className="group/btn"
                            onClick={() => {
                              if (!isStudent) {
                                alert("You must be logged in as a student to apply.");
                                return;
                              }
                              setApplyGig(opp);
                            }}
                          >
                            Apply Now
                            <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {opp.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {opp.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-lg bg-muted text-sm font-medium text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 font-semibold text-teal">
                          <DollarSign className="w-4 h-4" />
                          {opp.budget}
                        </span>
                        <span className="flex items-center gap-1 text-coral">
                          <Clock className="w-4 h-4" />
                          {opp.deadline}
                        </span>
                        <span className="text-muted-foreground">
                          {opp.applicants ?? 0} applicants
                        </span>
                        <span className="text-muted-foreground">
                          Posted {opp.posted}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Opportunities
            </Button>
          </div>
        </div>
      </main>

      {applyGig && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Apply to {applyGig.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Write a short proposal or message to the company.
            </p>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                applyMutation.mutate();
              }}
            >
              <textarea
                className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm"
                placeholder="Describe why you're a good fit..."
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
              />

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyGig(null)}
                  disabled={applyMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="coral" disabled={applyMutation.isPending}>
                  {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>

              {applyMutation.isError && (
                <p className="text-sm text-destructive mt-1">
                  {(applyMutation.error as Error).message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
