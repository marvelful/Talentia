import { motion } from "framer-motion";
import { Star, MapPin, Verified, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const talents = [
  {
    name: "Sarah Okonkwo",
    skill: "UI/UX Designer",
    university: "University of Lagos",
    rating: 4.9,
    gigs: 28,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=200&h=150&fit=crop",
    ],
    verified: true,
  },
  {
    name: "Emmanuel Adebayo",
    skill: "Video Editor",
    university: "Covenant University",
    rating: 4.8,
    gigs: 45,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=200&h=150&fit=crop",
    ],
    verified: true,
  },
  {
    name: "Chioma Nwosu",
    skill: "Brand Designer",
    university: "University of Nigeria",
    rating: 5.0,
    gigs: 32,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&h=150&fit=crop",
    ],
    verified: true,
  },
  {
    name: "Tunde Ajayi",
    skill: "Motion Graphics",
    university: "Obafemi Awolowo University",
    rating: 4.7,
    gigs: 19,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    portfolio: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=150&fit=crop",
    ],
    verified: false,
  },
];

export function TalentShowcase() {
  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            >
              Featured Talents
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Discover top-rated creative students ready to work on your projects
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/marketplace">
              <Button variant="outline" className="group">
                View All Talent
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Talent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {talents.map((talent, index) => (
            <motion.div
              key={talent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Portfolio Preview */}
                <div className="grid grid-cols-3 gap-0.5 p-0.5">
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

                {/* Profile Info */}
                <div className="p-4">
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
                      <h3 className="font-semibold text-foreground truncate">
                        {talent.name}
                      </h3>
                      <p className="text-sm text-coral font-medium">
                        {talent.skill}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{talent.university}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="font-semibold text-foreground">
                        {talent.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {talent.gigs} gigs completed
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
