"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DPR, Assessment } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">DPR Quality Assessment Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="gradient-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total DPRs</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-3xl font-bold text-green-400">{stats.approved}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-white/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Quality Score</p>
                  <p className="text-3xl font-bold text-gradient">{stats.avgScore}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="gradient-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="status" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="gradient-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {riskDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #1e293b",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  No risk data available
                </div>
              )}
              <div className="flex justify-center gap-6 mt-4">
                {riskDistribution.map((r) => (
                  <div key={r.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="text-sm text-muted-foreground">{r.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {qualityTrend.length > 0 && (
          <Card className="gradient-card border-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Quality Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={qualityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #1e293b",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={{ fill: "#22d3ee", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card className="gradient-card border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent DPRs</CardTitle>
            <Link
              href="/dashboard/dprs"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentDprs.length > 0 ? (
              <div className="space-y-3">
                {recentDprs.map((dpr) => (
                  <Link
                    key={dpr.id}
                    href={`/dashboard/dprs/${dpr.id}`}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{dpr.title}</p>
                        <p className="text-sm text-muted-foreground">{dpr.project_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {dpr.assessments?.[0] && (
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-medium">
                            Score: {dpr.assessments[0].quality_score}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {dpr.assessments[0].delay_risk} risk
                          </p>
                        </div>
                      )}
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          dpr.status === "approved"
                            ? "border-green-500/50 text-green-400"
                            : dpr.status === "rejected"
                            ? "border-red-500/50 text-red-400"
                            : "border-blue-500/50 text-blue-400"
                        }`}
                      >
                        {dpr.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No DPRs uploaded yet</p>
                <Link
                  href="/dashboard/upload"
                  className="text-primary hover:underline text-sm mt-2 inline-block"
                >
                  Upload your first DPR
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
