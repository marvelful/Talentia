import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Filter,
  BookOpen,
  Video,
  Music,
  ChevronDown
} from "lucide-react";

const typeColors = {
  PDF: "bg-coral/10 text-coral",
  ZIP: "bg-teal/10 text-teal",
  VIDEO: "bg-indigo/10 text-indigo",
  XLSX: "bg-gold/10 text-gold-light",
};

export default function Library() {
  const [selectedCategory, setSelectedCategory] = useState("All Resources");

  const { data: categories = [] } = useQuery({
    queryKey: ["library-categories"],
    queryFn: () => api.library.listCategories(),
  });

  const { data: resources = [] } = useQuery({
    queryKey: ["library-resources"],
    queryFn: () => api.library.listResources(),
  });

  const displayedResources =
    selectedCategory === "All Resources"
      ? resources
      : resources.filter((resource: any) => resource.categoryName === selectedCategory);

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
              E-Library
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Access free and premium resources to boost your creative skills
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" className="h-12">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            <button
              key="All Resources"
              onClick={() => setSelectedCategory("All Resources")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === "All Resources"
                  ? "bg-coral text-accent-foreground"
                  : "bg-card border border-border text-muted-foreground hover:border-coral/50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              All Resources
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === cat.name
                    ? "bg-coral text-accent-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-coral/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </motion.div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedResources.map((resource: any, index: number) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={resource.file_url}
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="w-10 h-10 rounded-full bg-card flex items-center justify-center hover:bg-coral transition-colors">
                        <Eye className="w-5 h-5 text-foreground hover:text-accent-foreground" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-coral flex items-center justify-center hover:bg-coral-light transition-colors">
                        <Download className="w-5 h-5 text-accent-foreground" />
                      </button>
                    </div>
                    {resource.premium && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gold text-foreground">
                          Premium
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        typeColors[resource.type as keyof typeof typeColors]
                      }`}>
                        {resource.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="text-xs text-coral font-medium mb-1">
                      {resource.categoryName}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-coral transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                      <span>{resource.size_label}</span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Resources
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
