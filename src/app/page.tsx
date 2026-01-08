import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Shield,
  BarChart3,
  Brain,
  CheckCircle,
  ArrowRight,
  Zap,
  TrendingUp,
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen gradient-bg">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">DPR Assessment</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="gradient-accent hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">AI-Powered Assessment</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              DPR Quality Assessment &
              <br />
              <span className="text-gradient">Risk Prediction System</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Ministry of Development of North Eastern Region (MDoNER) - Streamline DPR
              evaluation with AI-powered quality scoring, risk prediction, and automated
              approval workflows.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gradient-accent hover:opacity-90 h-12 px-8 font-semibold">
                  Start Free Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Sign in to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Comprehensive tools for evaluating Detailed Project Reports with precision and speed
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gradient-card rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2">NLP Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced text extraction and content analysis to identify missing or weak sections
                </p>
              </div>

              <div className="gradient-card rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2">Quality Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Automated 0-100 quality scores with transparent, explainable AI reasoning
                </p>
              </div>

              <div className="gradient-card rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">Risk Prediction</h3>
                <p className="text-sm text-muted-foreground">
                  ML-powered delay, cost overrun, and implementation risk predictions
                </p>
              </div>

              <div className="gradient-card rounded-2xl p-6 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold mb-2">Approval Workflow</h3>
                <p className="text-sm text-muted-foreground">
                  Streamlined DPR approval and rejection workflow with reviewer comments
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-blue-500/5">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  How It Works
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Upload DPR Document</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload PDF or DOCX files with project details, budget, timeline, and risk assessments
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">AI Analyzes Content</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI extracts text and analyzes against 18 critical DPR sections
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Get Risk Predictions</h4>
                      <p className="text-sm text-muted-foreground">
                        ML models predict delay, cost overrun, and implementation risks
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Review & Approve</h4>
                      <p className="text-sm text-muted-foreground">
                        Reviewers make informed decisions with AI-generated recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gradient-card rounded-2xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-semibold">Sample Assessment</h4>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                    Analyzed
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                      <span className="text-2xl font-bold text-gradient">78</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full w-[78%] gradient-accent rounded-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-green-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Delay Risk</p>
                      <p className="text-sm font-semibold text-green-400">Low</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Cost Risk</p>
                      <p className="text-sm font-semibold text-amber-400">Medium</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-green-500/10">
                      <p className="text-xs text-muted-foreground mb-1">Impl. Risk</p>
                      <p className="text-sm font-semibold text-green-400">Low</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-400 font-medium mb-1">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      Approve with minor revisions to budget breakdown section
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join MDoNER&apos;s digital transformation in project evaluation. Start assessing DPRs with AI today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gradient-accent hover:opacity-90 h-12 px-8 font-semibold">
                  Create Free Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">DPR Assessment System</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Ministry of Development of North Eastern Region (MDoNER)
          </p>
        </div>
      </footer>
    </div>
  )
}
