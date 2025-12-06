import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Award,
  Filter,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";

const categories = [
  { name: "All Courses", count: 156 },
  { name: "Graphic Design", count: 34 },
  { name: "Dancing", count: 34 },
  { name: "UI/UX Design", count: 28 },
  { name: "Video Production", count: 22 },
 { name: "Art and Painting", count: 18 },
  { name: "Music & Audio", count: 15 },
  { name: "Writing", count: 20 },
  { name: "Web Development", count: 19 },
];

const featuredCourses: any[] = [];

const levelColors = {
  Beginner: "bg-teal/10 text-teal",
  Intermediate: "bg-coral/10 text-coral",
  Advanced: "bg-indigo/10 text-indigo",
  "All Levels": "bg-gold/10 text-gold-light",
};



export default function Training() {
  const [selectedCategory, setSelectedCategory] = useState("All Courses");

  const { data: featuredCourses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.courses.list(),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="gradient-hero py-16 mb-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4"
              >
                Level Up Your Creative Skills
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-primary-foreground/80 mb-8"
              >
                Learn from industry experts and earn certificates to boost your portfolio
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
                  placeholder="Search for courses..."
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border-none bg-card text-foreground shadow-xl focus:outline-none focus:ring-2 focus:ring-coral"
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
              { icon: BookOpen, value: "150+", label: "Courses" },
              { icon: Users, value: "50K+", label: "Students" },
              { icon: Award, value: "1.2K+", label: "Certificates Issued" },
              { icon: Star, value: "4.8", label: "Average Rating" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl border border-border p-5 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-coral" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        selectedCategory === cat.name
                          ? "bg-coral/10 text-coral"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {cat.name}
                      <span className={`text-xs ${
                        selectedCategory === cat.name ? "text-coral" : "text-muted-foreground"
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Courses Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {selectedCategory}
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredCourses.map((course: any, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-coral flex items-center justify-center shadow-glow">
                            <Play className="w-8 h-8 text-accent-foreground ml-1" />
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            levelColors[course.level as keyof typeof levelColors]
                          }`}>
                            {course.level}
                          </span>
                        </div>
                        {course.price === "Free" && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-teal text-accent-foreground">
                              Free
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="text-xs text-coral font-medium mb-1">
                          {course.categoryName}
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-coral transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          by {course.instructor}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons} lessons
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-gold text-gold" />
                              <span className="font-medium text-foreground">
                                {course.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-4 h-4" />
                              {course.students.toLocaleString()}
                            </div>
                          </div>
                          <Button variant="coral" size="sm">
                            Enroll
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
                  Load More Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
