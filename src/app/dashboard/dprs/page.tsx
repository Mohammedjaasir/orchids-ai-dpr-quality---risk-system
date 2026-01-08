"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DPR, Assessment } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import {
  FileText,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "text-slate-400", bg: "bg-slate-500/20" },
  analyzing: { icon: Clock, color: "text-blue-400", bg: "bg-blue-500/20" },
  reviewed: { icon: AlertTriangle, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  approved: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/20" },
  rejected: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/20" },
}

export default function DPRListPage() {
  const [dprs, setDprs] = useState<(DPR & { assessments: Assessment[] })[]>([])
  const [filteredDprs, setFilteredDprs] = useState<(DPR & { assessments: Assessment[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchDPRs = async () => {
      const { data } = await supabase
        .from("dprs")
        .select("*, assessments(*)")
        .order("created_at", { ascending: false })

      if (data) {
        setDprs(data)
        setFilteredDprs(data)
      }
      setLoading(false)
    }

    fetchDPRs()
  }, [supabase])

  useEffect(() => {
    let result = [...dprs]

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(
        (dpr) =>
          dpr.title.toLowerCase().includes(search) ||
          dpr.project_name.toLowerCase().includes(search)
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((dpr) => dpr.status === statusFilter)
    }

    if (riskFilter !== "all") {
      result = result.filter(
        (dpr) =>
          dpr.assessments?.[0]?.delay_risk === riskFilter ||
          dpr.assessments?.[0]?.cost_overrun_risk === riskFilter ||
          dpr.assessments?.[0]?.implementation_risk === riskFilter
      )
    }

    setFilteredDprs(result)
  }, [searchTerm, statusFilter, riskFilter, dprs])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">All DPRs</h1>
            <p className="text-muted-foreground">
              {filteredDprs.length} of {dprs.length} DPRs
            </p>
          </div>
          <Button asChild className="gradient-accent hover:opacity-90">
            <Link href="/dashboard/upload">
              <FileText className="w-4 h-4 mr-2" />
              Upload New DPR
            </Link>
          </Button>
        </div>

        <Card className="gradient-card border-white/5">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or project name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary/50 border-white/10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary/50 border-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={riskFilter} onValueChange={setRiskFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary/50 border-white/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredDprs.length > 0 ? (
          <div className="space-y-3">
            {filteredDprs.map((dpr) => {
              const statusConfig = STATUS_CONFIG[dpr.status]
              const StatusIcon = statusConfig.icon
              const assessment = dpr.assessments?.[0]

              return (
                <Link key={dpr.id} href={`/dashboard/dprs/${dpr.id}`}>
                  <Card className="gradient-card border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div
                            className={`w-12 h-12 rounded-xl ${statusConfig.bg} flex items-center justify-center flex-shrink-0`}
                          >
                            <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                              {dpr.title}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {dpr.project_name}
                            </p>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                          {assessment && (
                            <>
                              <div className="text-center">
                                <p className="text-2xl font-bold text-gradient">
                                  {assessment.quality_score}
                                </p>
                                <p className="text-xs text-muted-foreground">Score</p>
                              </div>
                              <div className="flex gap-2">
                                {assessment.delay_risk === "high" && (
                                  <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                                    High Delay
                                  </Badge>
                                )}
                                {assessment.cost_overrun_risk === "high" && (
                                  <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                                    High Cost
                                  </Badge>
                                )}
                              </div>
                            </>
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
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(dpr.created_at)}
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors ml-4" />
                      </div>

                      <div className="md:hidden mt-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {assessment && (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gradient">
                                {assessment.quality_score}
                              </span>
                              <span className="text-xs text-muted-foreground">Score</span>
                            </div>
                          )}
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs ${
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
                        <span className="text-xs text-muted-foreground">
                          {formatDate(dpr.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        ) : (
          <Card className="gradient-card border-white/5">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">No DPRs found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || riskFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Upload your first DPR to get started"}
              </p>
              {!searchTerm && statusFilter === "all" && riskFilter === "all" && (
                <Button asChild className="gradient-accent hover:opacity-90">
                  <Link href="/dashboard/upload">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload DPR
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
