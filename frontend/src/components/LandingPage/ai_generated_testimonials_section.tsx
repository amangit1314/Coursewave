"use client"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "Tech Startup",
      image: "/professional-woman-developer.png",
      content:
        "The AI-powered learning path completely transformed how I approach coding. I went from beginner to landing my dream job in just 6 months!",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      company: "Fortune 500",
      image: "/professional-man-developer.png",
      content:
        "The interactive coding exercises and real-time feedback helped me master React faster than I ever thought possible. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "Frontend Developer",
      company: "Design Agency",
      image: "/professional-woman-frontend-developer.jpg",
      content:
        "Having access to expert mentors made all the difference. The personalized guidance helped me overcome every challenge I faced.",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "DevOps Engineer",
      company: "Cloud Company",
      image: "/professional-devops-engineer.png",
      content:
        "The flexibility to learn at my own pace while working full-time was exactly what I needed. The platform adapts perfectly to my schedule.",
      rating: 5,
    },
    {
      name: "Lisa Thompson",
      role: "Data Scientist",
      company: "AI Research Lab",
      image: "/professional-woman-data-scientist.png",
      content:
        "The comprehensive curriculum and hands-on projects gave me the confidence to transition into data science successfully.",
      rating: 5,
    },
    {
      name: "Alex Morgan",
      role: "Mobile Developer",
      company: "App Studio",
      image: "/professional-person-mobile-developer.jpg",
      content:
        "The instant feedback system and AI assistance made learning mobile development engaging and efficient. Best investment I've made!",
      rating: 5,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">What Our Students Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Real stories from developers who transformed their careers with our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border hover:shadow-lg transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-primary/60 mr-2" />
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
