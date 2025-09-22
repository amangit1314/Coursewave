"use client"
import { motion } from "framer-motion"
import { Brain, Code, Users, Trophy, Clock, BookOpen, Zap, Target, ArrowRight, Sparkles } from "lucide-react"

const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning Path",
      description: "Smart algorithms create personalized learning journeys that adapt to your pace and skill level.",
      highlight: "Personalized",
      benefits: ["Custom curriculum", "Adaptive difficulty", "Smart recommendations"],
    },
    {
      icon: Code,
      title: "Interactive Code Playground",
      description: "Practice with real-world projects in our browser-based IDE with instant feedback and debugging.",
      highlight: "Hands-on",
      benefits: ["Live code editor", "Instant feedback", "Real projects"],
    },
    {
      icon: Users,
      title: "Community & Mentorship",
      description: "Connect with fellow developers and get guidance from experienced mentors in our active community.",
      highlight: "Connected",
      benefits: ["Peer learning", "Expert mentors", "Active community"],
    },
  ]

  const additionalFeatures = [
    { icon: Trophy, title: "Skill Certifications", description: "Industry-recognized certificates" },
    { icon: Clock, title: "Learn at Your Pace", description: "24/7 access to all content" },
    { icon: BookOpen, title: "Comprehensive Library", description: "Latest tech and frameworks" },
    { icon: Zap, title: "Instant Feedback", description: "Real-time code analysis" },
    { icon: Target, title: "Progress Tracking", description: "Detailed learning analytics" },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Blurred edge masks */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold">Why Choose Our Platform</span>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Learn Smarter, Not Harder
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Experience the future of coding education with our innovative platform designed for modern developers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {feature.highlight}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>

                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30 hover:border-primary/30 transition-all duration-300 text-center"
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
