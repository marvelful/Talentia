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
  "UI Design",
  "Video",
  "Dance",
  "Singing",
  "Painting",
  "Writing",
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

// Frontend-only demo opportunities. These are hardcoded and do not exist in the
// backend database. They help keep the page rich even if the API has no data.
const hardcodedOpportunities = [
  {
    id: "demo-singing-1",
    title: "Campus Choir Soloist for Graduation Ceremony",
    type: "Gig",
    category: "Singing",
    company: "University Arts Council",
    companyLogo: "",
    location: "Yaounde - On-site",
    description:
      "Join the university choir to perform a solo and group pieces during the main graduation ceremony.",
    skills: [
      "Vocal performance",
      "Stage presence",
      "French & English songs",
    ],
    budget: "35,000 XAF",
    deadline: "Due in 7 days",
    applicants: 12,
    posted: "2 days ago",
    isDemo: true,
  },
  {
    id: "demo-dance-1",
    title: "Afro Fusion Dance Performance for Tech Conference",
    type: "Gig",
    category: "Dance",
    company: "Cameroon Tech Hub",
    companyLogo: "",
    location: "Douala - On-site",
    description:
      "Perform a short Afro fusion choreography to open and close a regional technology and innovation conference.",
    skills: ["Afro dance", "Choreography", "Teamwork"],
    budget: "45,000 XAF",
    deadline: "Due in 10 days",
    applicants: 8,
    posted: "3 days ago",
    isDemo: true,
  },
  {
    id: "demo-painting-1",
    title: "Mural Painting for Youth Entrepreneurship Center",
    type: "Project",
    category: "Painting",
    company: "Impact Youth Lab",
    companyLogo: "",
    location: "Buea - On-site",
    description:
      "Design and paint an inspiring mural highlighting innovation, culture, and entrepreneurship on the center's main wall.",
    skills: ["Illustration", "Acrylic painting", "Concept design"],
    budget: "80,000 XAF",
    deadline: "Due in 3 weeks",
    applicants: 5,
    posted: "5 days ago",
    isDemo: true,
  },
  {
    id: "demo-video-1",
    title: "Short Documentary on Cameroonian Campus Life",
    type: "Contract",
    category: "Video",
    company: "Student Affairs Office",
    companyLogo: "",
    location: "Remote / On-campus",
    description:
      "Produce a 5-6 minute mini-documentary capturing daily student life, clubs, and creative projects on campus.",
    skills: ["Video shooting", "Editing", "Storytelling"],
    budget: "120,000 XAF",
    deadline: "Due in 1 month",
    applicants: 9,
    posted: "1 week ago",
    isDemo: true,
  },
  {
    id: "demo-writing-1",
    title: "Blog Articles on Cameroonian Creative Careers",
    type: "Ongoing",
    category: "Writing",
    company: "Talentia Stories",
    companyLogo: "",
    location: "Remote",
    description:
      "Write monthly articles profiling young creatives in Cameroon and sharing practical tips for getting paid gigs.",
    skills: ["Content writing", "Research", "SEO basics"],
    budget: "15,000 XAF / article",
    deadline: "Ongoing",
    applicants: 14,
    posted: "Ongoing",
    isDemo: true,
  },
  {
    id: "demo-music-1",
    title: "Original Jingle for Local Radio Show",
    type: "Gig",
    category: "Music",
    company: "Radio Campus FM",
    companyLogo: "",
    location: "Remote",
    description:
      "Compose and produce a short audio jingle (10-15 seconds) for a youth-focused radio program.",
    skills: ["Music production", "Audio mixing", "Branding"],
    budget: "50,000 XAF",
    deadline: "Due in 2 weeks",
    applicants: 6,
    posted: "4 days ago",
    isDemo: true,
  },
];

export default function Opportunities() {
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [applyGig, setApplyGig] = useState<any | null>(null);
  const [proposal, setProposal] = useState("");
  const [experience, setExperience] = useState("");
  const [availability, setAvailability] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [appliedGigIds, setAppliedGigIds] = useState<string[]>([]);

  const storedUser = typeof window !== "undefined" ? localStorage.getItem("talentia_user") : null;
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isStudent = currentUser?.role === "STUDENT";

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ["gigs", { category: selectedCategory }],
    queryFn: () => api.marketplace.listGigs(),
  });

  const combinedOpportunities = [...hardcodedOpportunities, ...opportunities];

  const applyMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("talentia_token");
      if (!token) throw new Error("You must be logged in as a student to apply.");
      if (!applyGig) throw new Error("No opportunity selected.");

      const sections: string[] = [];
      if (proposal.trim()) sections.push(proposal.trim());
      if (experience.trim()) sections.push(`Experience: ${experience.trim()}`);
      if (availability.trim()) sections.push(`Availability: ${availability.trim()}`);
      if (portfolioUrl.trim()) sections.push(`Portfolio: ${portfolioUrl.trim()}`);

      const combinedProposal = sections.join("\n\n");

      const res = await api.marketplace.applyToGig(
        applyGig.id,
        { proposal: combinedProposal || undefined },
        token,
      );

      // mark this gig as applied in UI as well
      setAppliedGigIds((prev) => (prev.includes(applyGig.id) ? prev : [...prev, applyGig.id]));

      return res;
    },
    onSuccess: () => {
      setProposal("");
      setExperience("");
      setAvailability("");
      setPortfolioUrl("");
      setApplyGig(null);
      queryClient.invalidateQueries({ queryKey: ["gigs"] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "";
      if (applyGig && message.includes("already applied")) {
        setAppliedGigIds((prev) => (prev.includes(applyGig.id) ? prev : [...prev, applyGig.id]));
      }
    },
  });

  const filtered =
    selectedCategory === "All"
      ? combinedOpportunities
      : combinedOpportunities.filter((opp: any) => opp.category === selectedCategory);

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
                    <option>Douala</option>
                    <option>Yaounde</option>
                    <option>Buea</option>
                    <option>Bamenda</option>
                    <option>Limbe</option>
                    <option>Ebolowa</option>
                    
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
                      {opp.companyLogo ? (
                        <img
                          src={opp.companyLogo}
                          alt={opp.company}
                          className="w-16 h-16 rounded-xl object-cover border border-border"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-border bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground">
                          {(opp.company || opp.title || "T").charAt(0)}
                        </div>
                      )}
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
                            disabled={!isStudent || appliedGigIds.includes(opp.id)}
                            onClick={() => {
                              if (!isStudent) {
                                alert("You must be logged in as a student to apply.");
                                return;
                              }
                              if (appliedGigIds.includes(opp.id)) {
                                alert("You have already applied to this opportunity with this account.");
                                return;
                              }
                              setApplyGig(opp);
                            }}
                          >
                            {

                              appliedGigIds.includes(opp.id, opp.isDemo)
                              ? "Already Applied"
                              : "Apply Now"}
                            
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Relevant experience</label>
                  <input
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                    placeholder="e.g. 2 years editing videos for campus events"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">Availability</label>
                  <input
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                    placeholder="e.g. evenings and weekends, 10h/week"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground">Portfolio or social link</label>
                <input
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-sm"
                  placeholder="e.g. Behance, YouTube, Instagram, personal site"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
              </div>

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
