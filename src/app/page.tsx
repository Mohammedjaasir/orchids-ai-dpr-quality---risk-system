"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  FileText,
  Shield,
  BarChart3,
  Brain,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  LayoutDashboard,
  Search,
  Activity,
  Award
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg relative selection:bg-blue-500/30">
      {/* Professional Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-cyan-500/10 rounded-full blur-[100px]"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[10%] left-[20%] w-[45%] h-[45%] bg-indigo-500/10 rounded-full blur-[150px]"
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
              <FileText className="w-6 h-6 text-white" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight">DPR <span className="text-blue-400">Genius</span></span>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            </nav>
            <Link href="/dashboard">
              <Button className="gradient-accent hover:opacity-90 shadow-lg shadow-blue-500/20 rounded-full px-6">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
          <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -z-10" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-10"
            >
              <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">MDoNER Excellence Initiative</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
            >
              Next-Gen DPR <br />
              <span className="text-gradient">Intelligence</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Revolutionizing infrastructure project evaluation for MDoNER with AI-powered quality scoring, 
              predictive risk modeling, and precision analytics.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/dashboard">
                <Button size="lg" className="gradient-accent hover:opacity-90 h-14 px-10 text-lg font-bold rounded-full shadow-2xl shadow-blue-500/30 group">
                  Start Analysis
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold overflow-hidden ring-2 ring-blue-500/20">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="pl-6 text-sm text-muted-foreground flex items-center">
                  Trusted by 24+ Reviewers
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for High-Impact <br />Project Oversight</h2>
                <p className="text-xl text-muted-foreground">
                  Our comprehensive AI engine processes complex DPR data to provide actionable insights in seconds.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                  <p className="text-3xl font-bold text-blue-400">99%</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Accuracy</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px]">
                  <p className="text-3xl font-bold text-cyan-400">10x</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Faster</p>
                </div>
              </div>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Brain,
                  title: "Cognitive NLP Engine",
                  desc: "Semantic understanding of technical specs and compliance requirements.",
                  color: "blue"
                },
                {
                  icon: TrendingUp,
                  title: "Predictive Analytics",
                  desc: "Forecasting project timelines and potential budget overruns with ML.",
                  color: "cyan"
                },
                {
                  icon: Shield,
                  title: "Compliance Shield",
                  desc: "Automated checks against MDoNER guidelines and regulatory frameworks.",
                  color: "amber"
                },
                {
                  icon: Search,
                  title: "Deep Section Analysis",
                  desc: "Scrutinizing 18+ critical components of Detailed Project Reports.",
                  color: "indigo"
                },
                {
                  icon: Activity,
                  title: "Real-time Monitoring",
                  desc: "Live tracking of DPR status from submission to final approval.",
                  color: "green"
                },
                {
                  icon: Award,
                  title: "Quality Benchmarking",
                  desc: "Compare DPR quality against historical high-performing projects.",
                  color: "rose"
                }
              ].map((feature, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="group p-8 rounded-3xl bg-secondary/20 border border-white/5 hover:border-blue-500/20 transition-all duration-300 hover:bg-secondary/30 relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}-500/5 blur-3xl -z-10 group-hover:bg-${feature.color}-500/10 transition-colors`} />
                  <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-10">Streamlined <br />Review Protocol</h2>
                <div className="space-y-12">
                  {[
                    { step: "01", title: "Digital Submission", desc: "Upload complex technical documents in any format." },
                    { step: "02", title: "Neural Processing", desc: "AI extracts and cross-references data points instantly." },
                    { step: "03", title: "Risk Stratification", desc: "ML models categorize risks and generate scores." },
                    { step: "04", title: "Executive Approval", desc: "Reviewers authorize with data-backed confidence." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-8 group">
                      <div className="text-4xl font-black text-white/5 group-hover:text-blue-500/20 transition-colors shrink-0 leading-none">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 rounded-[40px] blur-2xl opacity-50" />
                <div className="relative glass-card rounded-[32px] p-10 border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">DPR_Analysis_Report</h4>
                        <p className="text-xs text-muted-foreground">Updated 2m ago</p>
                      </div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                      Live Assessment
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quality Quotient</span>
                        <span className="text-4xl font-black text-gradient">84.2</span>
                      </div>
                      <div className="h-3 bg-secondary/50 rounded-full overflow-hidden p-1 border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "84.2%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full gradient-accent rounded-full shadow-lg shadow-blue-500/20" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { label: "Delay", value: "Low", color: "green" },
                        { label: "Cost", value: "High", color: "rose" },
                        { label: "Impl.", value: "Med", color: "amber" }
                      ].map((risk, idx) => (
                        <div key={idx} className={`text-center p-4 rounded-2xl bg-${risk.color}-500/5 border border-${risk.color}-500/10`}>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1 font-bold">{risk.label}</p>
                          <p className={`text-sm font-bold text-${risk.color}-400`}>{risk.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <Brain className="w-12 h-12 text-blue-400" />
                      </div>
                      <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">AI Reasoning</p>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        "High cost risk identified in phase 2 excavation. Recommend detailed 
                        geological survey validation before financial clearance."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 px-6 relative">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight">Accelerate Your <br />Impact Today</h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Empower your department with the world&apos;s most advanced DPR intelligence system.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gradient-accent hover:opacity-90 h-16 px-12 text-xl font-black rounded-full shadow-2xl shadow-blue-600/40 group">
                Access Dashboard
                <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-16 px-6 bg-secondary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">DPR Genius</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Precision intelligence for the Ministry of Development of North Eastern Region.
            </p>
          </div>
          <div className="flex gap-12 text-sm text-muted-foreground">
            <div className="flex flex-col gap-3">
              <span className="font-bold text-foreground mb-1 uppercase tracking-widest text-[10px]">Platform</span>
              <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
              <Link href="#" className="hover:text-primary transition-colors">API Status</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-foreground mb-1 uppercase tracking-widest text-[10px]">Company</span>
              <Link href="#" className="hover:text-primary transition-colors">About MDoNER</Link>
              <Link href="#" className="hover:text-primary transition-colors">Gov Portal</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          © 2024 DPR Genius Intelligence Systems. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}
