"use client"
import { motion } from "framer-motion"
import { Users, BookOpen, TrendingUp, Clock, Rocket, Heart } from "lucide-react"

const StatsSection = () => {
  const stats = [
    {
      icon: Rocket,
      value: "Beta",
      label: "Early Access",
      description: "Join our exclusive beta program",
      color: "from-primary to-accent",
    },
    {
      icon: BookOpen,
      value: "25+",
      label: "Courses Ready",
      description: "Carefully crafted learning modules",
      color: "from-accent to-primary",
    },
    {
      icon: Users,
      value: "500+",
      label: "Beta Testers",
      description: "Developers testing our platform",
      color: "from-primary to-accent",
    },
    {
      icon: Heart,
      value: "100%",
      label: "Passion Driven",
      description: "Built by developers, for developers",
      color: "from-accent to-primary",
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Always Available",
      description: "Learn whenever inspiration strikes",
      color: "from-primary to-accent",
    },
    {
      icon: TrendingUp,
      value: "Growing",
      label: "Community",
      description: "Join us on this exciting journey",
      color: "from-accent to-primary",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 via-background to-muted/30 relative overflow-hidden">
      {/* Blurred edge masks */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-muted/30 via-background to-muted/30"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built with ❤️ by a Developer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            This isn't just another corporate LMS. It's a passion project created by someone who understands your
            learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-card/60 backdrop-blur-sm rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
              />

              <div className="relative text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl mx-auto p-8 bg-card/40 backdrop-blur-sm rounded-3xl border border-border/30">
            <p className="text-muted-foreground italic">
              "I'm building this platform because I believe learning to code should be accessible, engaging, and
              tailored to how developers actually learn. Every feature is crafted with real developer needs in mind."
            </p>
            <div className="mt-4 text-sm text-primary font-semibold">- Solo Developer & Founder</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StatsSection
