"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { FileText, Shield, BarChart3, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success("Logged in successfully")
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen gradient-bg flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center glow-blue">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">DPR Assessment</span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              AI-Powered DPR Quality
              <br />
              <span className="text-gradient">Assessment System</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Ministry of Development of North Eastern Region
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Risk Prediction</h3>
                <p className="text-muted-foreground text-sm">
                  ML-powered delay, cost & implementation risk analysis
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Quality Scoring</h3>
                <p className="text-muted-foreground text-sm">
                  Automated 0-100 quality scores with explainable AI
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">DPR Assessment</span>
            </div>
          </div>

          <div className="gradient-card rounded-2xl p-8 border border-white/5">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to access the DPR assessment platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-secondary/50 border-white/10 focus:border-primary h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-secondary/50 border-white/10 focus:border-primary h-11"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 gradient-accent hover:opacity-90 transition-opacity font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
