import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Verified, 
  Grid3X3, 
  List,
  ChevronDown,
  Briefcase
} from "lucide-react";

const categories = [
  "All Categories",
  "Graphic Design",
  "UI/UX Design",
  "Video Editing",
  "Photography",
  "Music & Vocals",
  "Dance & Choreography",
  "Cultural Performance",
  "Writing & Storytelling",
  "Web Development",
  "Animation",
  "Brand Design",
];

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const { data: talents = [], isLoading } = useQuery({
    queryKey: ["talents"],
    queryFn: () => api.talents.list(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            >
              Discover Creative Talent
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Find and hire top university students for your creative projects
            </motion.p>
          </div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col lg:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by skill, name, or university..."
                className="pl-12 h-12 rounded-xl"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-12 px-4 pr-10 rounded-xl border border-input bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              </div>
              <Button variant="outline" size="lg" className="h-12">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </Button>
              <div className="flex rounded-xl border border-input overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {isLoading ? (
                <span>Loading talents...</span>
              ) : (
                <>
                  Showing <span className="font-medium text-foreground">{talents.length}</span> talents
                </>
              )}
            </p>
            <select className="text-sm border-none bg-transparent text-muted-foreground focus:outline-none cursor-pointer">
              <option>Sort by: Best Match</option>
              <option>Highest Rated</option>
              <option>Most Reviews</option>
              <option>Lowest Price</option>
            </select>
          </div>

          {/* Talent Grid */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {(!isLoading && talents.length === 0) && (
              <p className="text-sm text-muted-foreground">
                No talents have been rated yet. Complete gigs and leave reviews to see students here.
              </p>
            )}
            {talents.map((talent: any, index: number) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className={`bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  viewMode === "list" ? "flex" : ""
                }`}>
                  {/* Portfolio Preview (placeholder for now) */}
                  <div className={`${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <div className="grid grid-cols-2 gap-0.5 p-0.5">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={talent.avatarUrl}
                          alt={talent.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                        <span>{talent.skill || "Top student talent"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={talent.avatarUrl}
                          alt={talent.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-card"
                        />
                        {talent.verified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal flex items-center justify-center">
                            <Verified className="w-3 h-3 text-accent-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate group-hover:text-coral transition-colors">
                          {talent.name}
                        </h3>
                        <p className="text-sm text-coral font-medium">
                          {talent.skill}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-foreground">
                          {talent.hourlyRate ?? "Rate TBD"}
                        </span>
                        <span className="text-xs text-muted-foreground">/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{talent.university}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(talent.skills || []).map((skill: string) => (
                        <span
                          key={skill}
                          className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-gold text-gold" />
                          <span className="font-semibold text-foreground">
                            {talent.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({talent.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5" />
                          {talent.gigs} gigs
                        </div>
                      </div>
                      <Button variant="coral" size="sm">
                        View Profile
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
              Load More Talent
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
