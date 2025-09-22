"use client"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const CTASection = () => {
  const benefits = [
    "Start learning immediately with AI-guided curriculum",
    "Access to 200+ courses and expert mentorship",
    "Flexible scheduling that fits your lifestyle",
    "Industry-recognized certifications upon completion",
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-primary mr-2" />
            <span className="text-sm font-medium text-primary">Limited Time Offer - 50% Off First Month</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {" "}
              Career?
            </span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Join thousands of successful developers who have accelerated their careers with our AI-powered learning
            platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex items-center text-left"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              Start Your Journey Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/5 text-foreground font-semibold px-8 py-6 text-lg rounded-2xl transition-all duration-300"
            >
              View Course Catalog
            </Button>
          </motion.div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
