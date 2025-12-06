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

// Frontend-only demo categories and resources. These are hardcoded so the
// E-Library always has rich content even if the backend database is empty.
const hardcodedCategories = [
  { id: "cat-culture", name: "Cameroonian Culture & History" },
  { id: "cat-professionalism", name: "Professionalism & Career" },
  { id: "cat-entrepreneurship", name: "Entrepreneurship" },
  { id: "cat-courses", name: "Course Books & Academics" },
  { id: "cat-creativity", name: "Creative Industry & Media" },
];

const hardcodedResources = [
  {
    id: "book-culture-1",
    title: "Discover Cameroon: Cultures, Traditions & Peoples",
    description:
      "An illustrated introduction to the diverse cultures, languages, and regions of Cameroon for students.",
    type: "PDF",
    size_label: "2.4 MB",
    file_url:
      "https://cameroonnewsagency.com/wp-content/uploads/2024/06/WhatsApp-Image-2024-06-26-at-11.22.40_cd4c75b6.jpg",
    categoryName: "Cameroonian Culture & History",
    premium: false,
    downloads: 320,
  },
  {
    id: "book-culture-1",
    title: "The Beauty Artifacts of Cameroon: A Visual Journey",
    description:
      "The various cameroonian emblem artifacts and monuments and their historical significance.",
    type: "PDF",
    size_label: "2.4 MB",
    file_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQg4ssIZR4wgNoVTAzTgn8mSPbj7m0rXJIKg&s",
    categoryName: "Cameroonian Culture & History",
    premium: false,
    downloads: 320,
  },
  {
    id: "book-culture-2",
    title: "Heroes of Cameroon: Historical Figures Every Student Should Know",
    description:
      "Short biographies of key figures in Cameroon's political, cultural, and scientific history.",
    type: "PDF",
    size_label: "3.1 MB",
    file_url:
      "data:image/jpeg;base64,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",
    categoryName: "Cameroonian Culture & History",
    premium: false,
    downloads: 210,
  },
  {
    id: "book-prof-1",
    title: "Professionalism for Young Africans: Communication, Emails & Meetings",
    description:
      "Practical guide to professional behavior, email writing, and meeting etiquette in African workplaces.",
    type: "PDF",
    size_label: "1.8 MB",
    file_url:
      "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryName: "Professionalism & Career",
    premium: false,
    downloads: 410,
  },
  {
    id: "book-prof-2",
    title: "CVs, Portfolios & Pitching Your Talent",
    description:
      "Templates and examples to help creatives build strong CVs, portfolios, and short pitches.",
    type: "PDF",
    size_label: "2.0 MB",
    file_url:
      "https://images.pexels.com/photos/1181465/pexels-photo-1181465.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryName: "Professionalism & Career",
    premium: false,
    downloads: 295,
  },
  {
    id: "book-course-1",
    title: "Introduction to Entrepreneurship for Students",
    description:
      "Course-style handbook covering business ideas, validation, budgeting, and basic accounting.",
    type: "PDF",
    size_label: "4.2 MB",
    file_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrrMA0TJ6_qx2FNvwLpcoAHON6fPXo648OpvBXLmrH6zrRvMaV6b1DAIF0mt8CcaUTBAM&usqp=CAU",
    categoryName: "Course Books & Academics",
    premium: false,
    downloads: 368,
  },
  {
    id: "book-course-2",
    title: "Study Skills & Exam Success for University Students",
    description:
      "Techniques for note-taking, revision, and managing stress during exams.",
    type: "PDF",
    size_label: "1.6 MB",
    file_url:
      "https://highstreetbooks.ie/media/catalog/product/cache/eba4cf9a57f7b39ad45f0e2fc1d6db98/s/k/skills-for-exam-success-junior-cert-english.jpg",
    categoryName: "Course Books & Academics",
    premium: false,
    downloads: 187,
  },
  {
    id: "book-creative-1",
    title: "Getting Paid as a Creative in Cameroon",
    description:
      "A practical roadmap for turning singing, dancing, painting and media skills into paid gigs.",
    type: "PDF",
    size_label: "2.9 MB",
    file_url:
      "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600",
    categoryName: "Creative Industry & Media",
    premium: false,
    downloads: 452,
  },
  {
    id: "book-creative-2",
    title: "Content Creation 101: Video, Audio & Social Media",
    description:
      "Beginner-friendly guide to planning, shooting, and editing content for YouTube, TikTok and Instagram.",
    type: "PDF",
    size_label: "3.5 MB",
    file_url:
      "https://www.bellanaija.com/wp-content/uploads/2025/06/ANF-x-DCA-1000x600.jpeg",
    categoryName: "Creative Industry & Media",
    premium: false,
    downloads: 389,
  },
];

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

  // Normalize backend payload so the UI is resilient even if some optional
  // fields (categoryName, premium, downloads) are missing.
  const normalizedResources = resources.map((resource: any) => {
    const categoryName =
      resource.categoryName ||
      categories.find((c: any) => c.id === resource.category_id)?.name ||
      "General";

    return {
      downloads: 0,
      premium: resource.is_premium ?? false,
      ...resource,
      categoryName,
    };
  });

  const mergedCategories = [
    ...hardcodedCategories,
    ...categories.filter(
      (c: any) => !hardcodedCategories.some((h) => h.name === c.name),
    ),
  ];

  const combinedResources = [...hardcodedResources, ...normalizedResources];

  const displayedResources =
    selectedCategory === "All Resources"
      ? combinedResources
      : combinedResources.filter((resource: any) => resource.categoryName === selectedCategory);

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
            {mergedCategories.map((cat: any) => (
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
