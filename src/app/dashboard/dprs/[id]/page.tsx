"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/DashboardLayout"
import { DPR, Assessment } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  DollarSign,
  Cog,
  ArrowLeft,
  Download,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const RISK_CONFIG = {
  low: { color: "text-green-400", bg: "bg-green-500/20", icon: CheckCircle },
  medium: { color: "text-amber-400", bg: "bg-amber-500/20", icon: AlertTriangle },
  high: { color: "text-red-400", bg: "bg-red-500/20", icon: AlertCircle },
}

export default function DPRDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [dpr, setDpr] = useState<DPR | null>(null)
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [showDecisionDialog, setShowDecisionDialog] = useState(false)
  const [decisionType, setDecisionType] = useState<"approve" | "reject" | null>(null)
  const [reviewerComments, setReviewerComments] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchDPR = async () => {
      const { data } = await supabase
        .from("dprs")
        .select("*, assessments(*)")
        .eq("id", params.id)
        .single()

      if (data) {
        setDpr(data)
        if (data.assessments && data.assessments.length > 0) {
          setAssessment(data.assessments[0])
        }
      }
      setLoading(false)
    }

    if (params.id) {
      fetchDPR()
    }
  }, [params.id, supabase])

  const handleReanalyze = async () => {
    if (!dpr) return
    setAnalyzing(true)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dprId: dpr.id }),
      })

      if (response.ok) {
        const result = await response.json()
        setAssessment(result.assessment)
        setDpr({ ...dpr, status: "reviewed" })
        toast.success("Analysis completed successfully")
      } else {
        toast.error("Analysis failed")
      }
    } catch (error) {
      toast.error("Failed to analyze DPR")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleDecision = async () => {
    if (!dpr || !decisionType) return
    setSubmitting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (assessment) {
        await supabase
          .from("assessments")
          .update({
            final_decision: decisionType === "approve" ? "approved" : "rejected",
            reviewer_comments: reviewerComments,
            reviewed_by: user?.id,
          })
          .eq("id", assessment.id)
      }

      await supabase
        .from("dprs")
        .update({ status: decisionType === "approve" ? "approved" : "rejected" })
        .eq("id", dpr.id)

      setDpr({ ...dpr, status: decisionType === "approve" ? "approved" : "rejected" })
      if (assessment) {
        setAssessment({
          ...assessment,
          final_decision: decisionType === "approve" ? "approved" : "rejected",
          reviewer_comments: reviewerComments,
        })
      }

      toast.success(`DPR ${decisionType === "approve" ? "approved" : "rejected"} successfully`)
      setShowDecisionDialog(false)
    } catch (error) {
      toast.error("Failed to update decision")
    } finally {
      setSubmitting(false)
    }
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

  if (!dpr) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">DPR not found</p>
        </div>
      </DashboardLayout>
    )
  }

  const RiskBadge = ({ level, label }: { level: "low" | "medium" | "high"; label: string }) => {
    const config = RISK_CONFIG[level]
    const Icon = config.icon
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`text-sm font-medium ${config.color} capitalize`}>
          {level} {label}
        </span>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{dpr.title}</h1>
              <p className="text-muted-foreground">{dpr.project_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className={`capitalize text-sm px-3 py-1 ${
                dpr.status === "approved"
                  ? "border-green-500/50 text-green-400"
                  : dpr.status === "rejected"
                  ? "border-red-500/50 text-red-400"
                  : "border-blue-500/50 text-blue-400"
              }`}
            >
              {dpr.status}
            </Badge>
            {dpr.file_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={dpr.file_url} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>

        {!assessment && dpr.status === "pending" && (
          <Card className="gradient-card border-white/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Ready for Analysis</h3>
              <p className="text-muted-foreground mb-4">
                This DPR hasn&apos;t been analyzed yet. Start AI analysis to get quality scores and risk predictions.
              </p>
              <Button
                onClick={handleReanalyze}
                disabled={analyzing}
                className="gradient-accent hover:opacity-90"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Start Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {assessment && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="gradient-card border-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Quality Score</p>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        assessment.quality_score >= 70
                          ? "bg-green-500/20"
                          : assessment.quality_score >= 40
                          ? "bg-amber-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {assessment.quality_score >= 70 ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : assessment.quality_score >= 40 ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gradient mb-2">
                    {assessment.quality_score}
                  </p>
                  <Progress
                    value={assessment.quality_score}
                    className="h-2"
                  />
                </CardContent>
              </Card>

              <Card className="gradient-card border-white/5">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">
                    AI Recommendation
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                      assessment.recommendation === "approve"
                        ? "bg-green-500/20"
                        : assessment.recommendation === "reject"
                        ? "bg-red-500/20"
                        : "bg-amber-500/20"
                    }`}
                  >
                    {assessment.recommendation === "approve" ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : assessment.recommendation === "reject" ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <span
                      className={`font-semibold capitalize ${
                        assessment.recommendation === "approve"
                          ? "text-green-400"
                          : assessment.recommendation === "reject"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    >
                      {assessment.recommendation}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="gradient-card border-white/5">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">Final Decision</p>
                  {assessment.final_decision ? (
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                        assessment.final_decision === "approved"
                          ? "bg-green-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      {assessment.final_decision === "approved" ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <span
                        className={`font-semibold capitalize ${
                          assessment.final_decision === "approved"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {assessment.final_decision}
                      </span>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Pending review</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="gradient-card border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Delay Risk</span>
                    </div>
                    <RiskBadge level={assessment.delay_risk} label="Risk" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">Cost Overrun Risk</span>
                    </div>
                    <RiskBadge level={assessment.cost_overrun_risk} label="Risk" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Cog className="w-4 h-4" />
                      <span className="text-sm">Implementation Risk</span>
                    </div>
                    <RiskBadge level={assessment.implementation_risk} label="Risk" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">AI Analysis Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {assessment.ai_explanation}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessment.missing_sections && assessment.missing_sections.length > 0 && (
                <Card className="gradient-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-400" />
                      Missing Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessment.missing_sections.map((section, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {assessment.weak_sections && assessment.weak_sections.length > 0 && (
                <Card className="gradient-card border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      Weak Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {assessment.weak_sections.map((section, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          {section}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {assessment.reviewer_comments && (
              <Card className="gradient-card border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg">Reviewer Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{assessment.reviewer_comments}</p>
                </CardContent>
              </Card>
            )}

            {dpr.status === "reviewed" && !assessment.final_decision && (
              <Card className="gradient-card border-white/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Review Decision</h3>
                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setDecisionType("approve")
                        setShowDecisionDialog(true)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve DPR
                    </Button>
                    <Button
                      onClick={() => {
                        setDecisionType("reject")
                        setShowDecisionDialog(true)
                      }}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject DPR
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReanalyze}
                      disabled={analyzing}
                    >
                      {analyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Re-analyze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        <Dialog open={showDecisionDialog} onOpenChange={setShowDecisionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {decisionType === "approve" ? "Approve" : "Reject"} DPR
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to {decisionType} this DPR? This action can be changed later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Comments (Optional)
                </label>
                <Textarea
                  placeholder="Add any comments or notes..."
                  value={reviewerComments}
                  onChange={(e) => setReviewerComments(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDecisionDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleDecision}
                disabled={submitting}
                className={
                  decisionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
                variant={decisionType === "reject" ? "destructive" : "default"}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Confirm {decisionType === "approve" ? "Approval" : "Rejection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
