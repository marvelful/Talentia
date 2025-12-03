import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  "Music Production",
  "Writing & Content",
  "Web Development",
  "Animation",
  "Brand Design",
];

const talents = [
  {
    id: 1,
    name: "Sarah Okonkwo",
    skill: "UI/UX Designer",
    university: "University of Lagos",
    rating: 4.9,
    reviews: 47,
    gigs: 28,
    hourlyRate: "XAF 25",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=150&fit=crop",
    ],
    verified: true,
    skills: ["Figma", "Adobe XD", "Prototyping"],
  },
  {
    id: 2,
    name: "Emmanuel Adebayo",
    skill: "Video Editor",
    university: "Covenant University",
    rating: 4.8,
    reviews: 62,
    gigs: 45,
    hourlyRate: "XAF 30",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=150&fit=crop",
    ],
    verified: true,
    skills: ["Premiere Pro", "After Effects", "DaVinci"],
  },
  {
    id: 3,
    name: "Chioma Nwosu",
    skill: "Brand Designer",
    university: "University of Nigeria",
    rating: 5.0,
    reviews: 38,
    gigs: 32,
    hourlyRate: "XAF 35",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=200&h=150&fit=crop",
    ],
    verified: true,
    skills: ["Illustrator", "Photoshop", "InDesign"],
  },
  {
    id: 4,
    name: "Tunde Ajayi",
    skill: "Motion Graphics",
    university: "Obafemi Awolowo University",
    rating: 4.7,
    reviews: 24,
    gigs: 19,
    hourlyRate: "XAF 28",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&h=150&fit=crop",
    ],
    verified: false,
    skills: ["After Effects", "Cinema 4D", "Blender"],
  },
  {
    id: 5,
    name: "Amina Hassan",
    skill: "Photographer",
    university: "Ahmadu Bello University",
    rating: 4.9,
    reviews: 53,
    gigs: 41,
    hourlyRate: "XAF 40",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=200&h=150&fit=crop",
    ],
    verified: true,
    skills: ["Portrait", "Product", "Lightroom"],
  },
  {
    id: 6,
    name: "David Okeke",
    skill: "Web Developer",
    university: "University of Benin",
    rating: 4.8,
    reviews: 31,
    gigs: 27,
    hourlyRate: "XAF 35",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=150&fit=crop",
    ],
    verified: true,
    skills: ["React", "Node.js", "TypeScript"],
  },
];

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

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
              Showing <span className="font-medium text-foreground">{talents.length}</span> talents
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
            {talents.map((talent, index) => (
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
                  {/* Portfolio Preview */}
                  <div className={`${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <div className="grid grid-cols-2 gap-0.5 p-0.5">
                      {talent.portfolio.map((img, i) => (
                        <div key={i} className="aspect-[4/3] overflow-hidden">
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-5 flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <img
                          src={talent.image}
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
                        <span className="text-lg font-bold text-foreground">{talent.hourlyRate}</span>
                        <span className="text-xs text-muted-foreground">/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{talent.university}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {talent.skills.map((skill) => (
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
