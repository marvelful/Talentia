import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Nathlie Quinn",
    role: "Graphic Design Student",
    university: "University of Yaounde I",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
    content: "TALENTIA helped me discover my passion for UI design. I've completed 15 gigs and earned enough to fund my final year project!",
    rating: 5,
  },
  {
    name: "David Chenjou",
    role: "Film & Media Student",
    university: "University of Dschang",
    image: "data:image/jpeg;base64,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",
    content: "The mentorship program connected me with a professional videographer who helped me land my first commercial project.",
    rating: 5,
  },
  {
    name: "Fatima Bello",
    role: "Music Production Student",
    university: "Institut Universitaire de la Cote",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCKWNiXfQ3elM3W6DRx92IfXey1hcT6eGuj9TX1Mo5&s",
    content: "From the talent assessment to the marketplace, everything is designed to help students succeed. I've grown so much in 6 months!",
    rating: 5,
  },
  {
    name: "Emmanuel Nkenfack",
    role: "Photography Student",
    university: "University of Douala",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJkv0_63DkDzj8_UEQA4rm78LggLaf9V4Pkw&s",
    content: "The portfolio builder is amazing! Companies can now easily find my work, and I've tripled my freelance clients.",
    rating: 5,
  },
  {
    name: "Grace bekoko",
    role: "Fashion Design Student",
    university: "University of Bamenda",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ7r08wzjojQ2e1Ctn7HyUXecHS2d6mfVjrQ&s",
    content: "The training courses helped me learn fashion illustration digitally. Now I create designs for local boutiques!",
    rating: 5,
  },
  {
    name: "Michael Sangou",
    role: "Web Development Student",
    university: "University of Maroua",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTssbhQD4PvKYUShn-xzInZfKiYYHxbcRY4Mg&s",
    content: "TALENTIA's structured approach to skill development gave me the confidence to take on professional projects.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20 mb-6"
          >
            <Quote className="w-4 h-4 text-teal" />
            <span className="text-sm font-medium text-teal">Student Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Trusted by <span className="text-coral">50,000+</span> Students
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            See how TALENTIA is transforming creative careers across universities
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-coral/30 shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-coral/20"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-coral">
                      {testimonial.university}
                    </p>
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
