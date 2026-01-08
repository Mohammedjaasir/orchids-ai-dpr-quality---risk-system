"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DPR, Assessment } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Plus,
  ArrowUpRight,
  Activity,
  Layers,
  PieChart as PieChartIcon,
  FileStack
} from "lucide-react"

const RISK_COLORS = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
}

const STATUS_COLORS = {
  pending: "#94a3b8",
  analyzing: "#3b82f6",
  reviewed: "#22d3ee",
  approved: "#10b981",
  rejected: "#ef4444",
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export default function DashboardPage() {
  const [dprs, setDprs] = useState<(DPR & { assessments: Assessment[] })[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("dprs")
        .select("*, assessments(*)")
        .order("created_at", { ascending: false })

      if (data) {
        setDprs(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const stats = {
    total: dprs.length,
    pending: dprs.filter((d) => d.status === "pending" || d.status === "analyzing").length,
    approved: dprs.filter((d) => d.status === "approved").length,
    rejected: dprs.filter((d) => d.status === "rejected").length,
    avgScore:
      dprs.length > 0
        ? Math.round(
            dprs
              .filter((d) => d.assessments?.length > 0)
              .reduce((acc, d) => acc + (d.assessments[0]?.quality_score || 0), 0) /
              (dprs.filter((d) => d.assessments?.length > 0).length || 1)
          )
        : 0,
  }

  const riskDistribution = [
    {
      name: "Low Risk",
      value: dprs.filter((d) => d.assessments?.[0]?.delay_risk === "low").length,
      color: RISK_COLORS.low,
    },
    {
      name: "Medium Risk",
      value: dprs.filter((d) => d.assessments?.[0]?.delay_risk === "medium").length,
      color: RISK_COLORS.medium,
    },
    {
      name: "High Risk",
      value: dprs.filter((d) => d.assessments?.[0]?.delay_risk === "high").length,
      color: RISK_COLORS.high,
    },
  ].filter((r) => r.value > 0)

  const statusData = [
    { status: "Pending", count: dprs.filter((d) => d.status === "pending").length, fill: STATUS_COLORS.pending },
    { status: "Analyzing", count: dprs.filter((d) => d.status === "analyzing").length, fill: STATUS_COLORS.analyzing },
    { status: "Reviewed", count: dprs.filter((d) => d.status === "reviewed").length, fill: STATUS_COLORS.reviewed },
    { status: "Approved", count: dprs.filter((d) => d.status === "approved").length, fill: STATUS_COLORS.approved },
    { status: "Rejected", count: dprs.filter((d) => d.status === "rejected").length, fill: STATUS_COLORS.rejected },
  ].filter((s) => s.count > 0)

  const recentDprs = dprs.slice(0, 5)

  const qualityTrend = dprs
    .filter((d) => d.assessments?.length > 0)
    .slice(0, 10)
    .reverse()
    .map((d, i) => ({
      name: `DPR ${i + 1}`,
      score: d.assessments[0]?.quality_score || 0,
    }))

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 rounded-full" />
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl font-black tracking-tight mb-2">Executive Overview</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Live performance metrics and project risk stratification
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Link href="/dashboard/upload">
              <Button className="gradient-accent hover:opacity-90 shadow-lg shadow-blue-500/20 rounded-xl px-6 py-6 h-auto font-bold flex items-center gap-2 group">
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                New DPR Analysis
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total DPRs", value: stats.total, icon: FileText, color: "blue" },
            { label: "Pending Review", value: stats.pending, icon: Clock, color: "amber" },
            { label: "Approved Projects", value: stats.approved, icon: CheckCircle, color: "green" },
            { label: "Avg Quality Score", value: stats.avgScore, icon: TrendingUp, color: "cyan", isScore: true },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={fadeInUp}>
              <Card className="glass-card border-white/5 overflow-hidden group hover:border-blue-500/20 transition-all duration-300">
                <CardContent className="p-6 relative">
                  <div className={`absolute -top-6 -right-6 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`} />
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <p className={`text-4xl font-black ${stat.isScore ? 'text-gradient' : ''}`}>{stat.value}</p>
                    {stat.isScore && <span className="text-sm text-muted-foreground mb-1 font-bold">/ 100</span>}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <Card className="glass-card border-white/5 h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-blue-400" />
                  </div>
                  <CardTitle className="text-lg font-bold">Status Distribution</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {statusData.length > 0 ? (
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="status" 
                          stroke="#94a3b8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={11} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground italic">
                    Insufficient data for distribution analysis
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="glass-card border-white/5 h-full">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <PieChartIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <CardTitle className="text-lg font-bold">Risk Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {riskDistribution.length > 0 ? (
                  <div className="relative h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Project</p>
                      <p className="text-2xl font-black">Risks</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground italic text-center px-6">
                    No risk assessment data available for current DPR cycle
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {riskDistribution.map((r) => (
                    <div key={r.name} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/5 border border-white/5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{r.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {qualityTrend.length > 0 && (
          <motion.div variants={fadeInUp}>
            <Card className="glass-card border-white/5">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg font-bold">Quality Trajectory</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={qualityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={[0, 100]} 
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          border: "1px solid #1e293b",
                          borderRadius: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#fff", stroke: "#22d3ee", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={fadeInUp}>
          <Card className="glass-card border-white/5 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <CardTitle className="text-lg font-bold">Recent Submissions</CardTitle>
              </div>
              <Link
                href="/dashboard/dprs"
                className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest flex items-center gap-1 group"
              >
                View Analytics 
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentDprs.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {recentDprs.map((dpr) => (
                    <Link
                      key={dpr.id}
                      href={`/dashboard/dprs/${dpr.id}`}
                      className="flex items-center justify-between px-8 py-5 hover:bg-white/[0.02] transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/50 flex items-center justify-center border border-white/5 group-hover:border-blue-500/20 transition-colors">
                          <FileText className="w-6 h-6 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div>
                          <p className="font-bold text-base leading-tight mb-1">{dpr.title}</p>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{dpr.project_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        {dpr.assessments?.[0] && (
                          <div className="text-right hidden md:block">
                            <div className="flex items-center justify-end gap-1.5 mb-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Score</span>
                              <span className="text-sm font-black text-blue-400">{dpr.assessments[0].quality_score}</span>
                            </div>
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Risk</span>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] uppercase tracking-widest py-0 px-2 border-0 bg-${RISK_COLORS[dpr.assessments[0].delay_risk as keyof typeof RISK_COLORS] || '#94a3b8'}/10 text-${RISK_COLORS[dpr.assessments[0].delay_risk as keyof typeof RISK_COLORS] || '#94a3b8'}`}
                                style={{ 
                                  color: RISK_COLORS[dpr.assessments[0].delay_risk as keyof typeof RISK_COLORS],
                                  backgroundColor: `${RISK_COLORS[dpr.assessments[0].delay_risk as keyof typeof RISK_COLORS]}15`
                                }}
                              >
                                {dpr.assessments[0].delay_risk}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4">
                          <Badge
                            variant="outline"
                            className="capitalize rounded-full px-3 py-1 font-bold text-[10px] tracking-wider"
                            style={{ 
                              borderColor: `${STATUS_COLORS[dpr.status as keyof typeof STATUS_COLORS]}40`,
                              color: STATUS_COLORS[dpr.status as keyof typeof STATUS_COLORS],
                              backgroundColor: `${STATUS_COLORS[dpr.status as keyof typeof STATUS_COLORS]}10`
                            }}
                          >
                            {dpr.status}
                          </Badge>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 px-6">
                  <div className="w-20 h-20 rounded-3xl bg-secondary/50 flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <FileStack className="w-10 h-10 text-muted-foreground opacity-30" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Registry is Empty</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                    No DPR documents have been processed by the system yet. Upload your first technical report to begin.
                  </p>
                  <Link href="/dashboard/upload">
                    <Button variant="outline" className="border-white/10 hover:bg-white/5 h-12 px-8 rounded-xl font-bold">
                      Upload Initial DPR
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
