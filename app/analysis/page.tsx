"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  BarChart3,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Target,
  Shield,
} from "lucide-react"
import { toast } from "sonner"
import type { AnalysisResult } from "@/lib/types"

export default function AnalysisPage() {
  const { resumeData, analysisResult, setAnalysisResult, selectedTemplateId } = useStore()
  const [loading, setLoading] = useState(false)

  const runAnalysis = async () => {
    if (!resumeData) {
      toast.error("Upload a resume first")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, templateId: selectedTemplateId }),
      })
      const { data } = await res.json()
      setAnalysisResult(data)
      toast.success("Analysis complete!")
    } catch {
      toast.error("Failed to analyze resume")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Resume Analysis
              </h1>
              <p className="mt-2 text-muted-foreground">
                AI-powered analysis of your resume with ATS scoring, formatting
                checks, and actionable suggestions.
              </p>
            </div>
            <Button onClick={runAnalysis} disabled={loading || !resumeData}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {analysisResult ? "Re-analyze" : "Analyze Resume"}
                </>
              )}
            </Button>
          </div>

          {!resumeData && (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  No Resume Data
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload or build your resume first to run analysis.
                </p>
              </CardContent>
            </Card>
          )}

          {analysisResult && <AnalysisResults result={analysisResult} />}
        </main>
      </div>
    </AuthWrapper>
  )
}

function ScoreCircle({ score, label, size = "lg" }: { score: number; label: string; size?: "sm" | "lg" }) {
  const color =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-500" : "text-destructive"
  const dim = size === "lg" ? "h-28 w-28" : "h-20 w-20"
  const textSize = size === "lg" ? "text-3xl" : "text-xl"

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${dim} flex flex-col items-center justify-center rounded-full border-4 ${score >= 80
          ? "border-emerald-200 bg-emerald-50"
          : score >= 60
            ? "border-amber-200 bg-amber-50"
            : "border-red-200 bg-red-50"
        }`}>
        <span className={`${textSize} font-bold ${color}`}>{score}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  )
}

function AnalysisResults({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-6">
      {/* Scores Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Score Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <ScoreCircle score={result.overallScore} label="Overall" />
            <ScoreCircle score={result.atsScore} label="ATS Score" size="sm" />
            <ScoreCircle
              score={result.templateCompatibility}
              label="Template Fit"
              size="sm"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Missing Sections */}
        {result.missingSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <XCircle className="h-4 w-4 text-destructive" />
                Missing Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.missingSections.map((s) => (
                  <Badge key={s} variant="destructive">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weak Sections */}
        {result.weakSections.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Weak Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.weakSections.map((w, i) => (
                  <div key={i} className="rounded-md bg-amber-50 p-2">
                    <p className="text-sm font-medium text-amber-800">{w.section}</p>
                    <p className="text-xs text-amber-600">{w.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formatting Issues */}
        {result.formattingIssues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-muted-foreground" />
                Formatting Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {result.formattingIssues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    {issue}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Keyword Coverage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Keyword Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="mb-1 text-xs font-medium text-emerald-600">Found Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {result.keywordCoverage.found.map((k) => (
                    <Badge key={k} variant="secondary" className="text-xs bg-emerald-50 text-emerald-700">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <p className="mb-1 text-xs font-medium text-destructive">Missing Keywords</p>
                <div className="flex flex-wrap gap-1">
                  {result.keywordCoverage.missing.map((k) => (
                    <Badge key={k} variant="outline" className="text-xs text-destructive border-destructive/30">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Improvement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
