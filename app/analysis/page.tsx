"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  TrendingUp,
  Search,
  Wand2,
  Type,
  FileText,
  Zap,
  BarChart3
} from "lucide-react"
import { toast } from "sonner"
import type { AnalysisResult } from "@/lib/types"
import Link from "next/link"

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
      <div className="min-h-screen bg-[#F9FAFB] font-sans text-black pb-20">
        <AppNav />

        <main className="mx-auto max-w-[1440px] px-6 py-12 lg:py-20 mt-16">

          <div className="mb-8 flex flex-col sm:flex-row items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Resume Analysis
              </h1>
              <p className="mt-2 text-gray-500">
                AI-powered analysis of your resume with ATS scoring, formatting
                checks, and actionable suggestions.
              </p>
            </div>
            <Button onClick={runAnalysis} disabled={loading || !resumeData} className="rounded-full px-6 py-6 border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold transition-all shadow-none shrink-0">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-5 w-5" />
                  {analysisResult ? "Re-analyze" : "Analyze Resume"}
                </>
              )}
            </Button>
          </div>

          {!resumeData && (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-200">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-800">No Resume Data</h2>
              <p className="text-gray-500 mt-2">Upload or build your resume first to run analysis.</p>
            </div>
          )}

          {analysisResult && <AnalysisResults result={analysisResult} />}
        </main>
      </div>
    </AuthWrapper>
  )
}

function AnalysisResults({ result }: { result: AnalysisResult }) {
  const getGrade = (score: number) => {
    if (score >= 90) return "A+ Grade"
    if (score >= 80) return "A Grade"
    if (score >= 70) return "B Grade"
    if (score >= 60) return "C Grade"
    return "Needs Work"
  }

  const getPercentile = (score: number) => {
    if (score >= 95) return "top 1%"
    if (score >= 90) return "top 5%"
    if (score >= 80) return "top 10%"
    if (score >= 70) return "top 25%"
    return "top 50%"
  }

  const atsStatus = result.atsScore >= 80 ? "High" : result.atsScore >= 60 ? "Medium" : "Low"
  const atsColor = result.atsScore >= 80 ? "text-green-600" : result.atsScore >= 60 ? "text-orange-600" : "text-red-600"

  const templateFit = result.templateCompatibility >= 80 ? "Optimal" : result.templateCompatibility >= 60 ? "Good" : "Poor"
  const templateColor = result.templateCompatibility >= 80 ? "text-blue-600" : result.templateCompatibility >= 60 ? "text-orange-600" : "text-red-600"

  const totalImprovements = result.weakSections.length + result.missingSections.length + result.formattingIssues.length

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column */}
      <div className="w-full lg:w-1/3 space-y-8">
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 shadow-sm text-center">
          <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-8">Overall Score</h2>
          <div className="relative inline-flex items-center justify-center mb-8">
            <div
              className="w-48 h-48 rounded-full flex items-center justify-center"
              style={{ background: `conic-gradient(#3B82F6 ${result.overallScore}%, #E5E7EB 0%)` }}
            >
              <div className="w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-6xl font-black text-blue-600">{result.overallScore}</span>
                <span className="text-sm font-bold text-gray-400 uppercase">{getGrade(result.overallScore)}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Your resume is in the <span className="font-bold text-black">{getPercentile(result.overallScore)}</span> of candidates.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium text-gray-600">ATS Compatibility</span>
              <span className={`text-sm font-bold ${atsColor}`}>{atsStatus}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
              <span className="text-sm font-medium text-gray-600">Template Fit</span>
              <span className={`text-sm font-bold ${templateColor}`}>{templateFit}</span>
            </div>
          </div>
        </div>

        <div className="bg-black text-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Ready for the interview?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Start practicing with our AI Coach based on your specific resume content.</p>
            <Link href="/interview-prep" className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              Start AI Prep <Zap className="w-4 h-4" />
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-40"></div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full lg:w-2/3 space-y-6">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Detailed Breakdown</h2>
            <div className="flex flex-wrap gap-2">
              {result.keywordCoverage.found.length > 0 && (
                <span className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">{result.keywordCoverage.found.length} Strengths</span>
              )}
              {totalImprovements > 0 && (
                <span className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-bold uppercase">
                  {totalImprovements} Improvements
                </span>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Keywords (Strengths & Improvements) */}
            <div className="group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-lg">Keyword Coverage</h4>
                    <span className="text-green-600 font-bold hidden sm:inline">{Math.round(result.keywordCoverage.found.length / ((result.keywordCoverage.found.length + result.keywordCoverage.missing.length) || 1) * 100)}/100</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">Your resume strikes a good balance of industry keywords, but could use some targeted additions.</p>

                  {result.keywordCoverage.missing.length > 0 && (
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 mb-4">
                      <p className="text-sm font-bold text-orange-800 mb-3">AI Recommendation (Missing Keywords):</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywordCoverage.missing.map(k => (
                          <span key={k} className="px-3 py-1 bg-white border border-orange-200 rounded-lg text-xs font-medium text-orange-700 break-words max-w-full">
                            + {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.keywordCoverage.found.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.keywordCoverage.found.map(k => (
                        <span key={k} className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-xs font-medium text-green-700 break-words max-w-full">
                          ✓ {k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weak Sections */}
            {result.weakSections.length > 0 && (
              <div className="border-t border-gray-100 pt-8 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-lg text-orange-600">Content Quality</h4>
                      <span className="text-orange-600 font-bold hidden sm:inline">Needs Review</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">Some sections could bear more impactful descriptions.</p>

                    <div className="space-y-3">
                      {result.weakSections.map((w, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-black break-words">{w.section}</div>
                            <div className="text-sm text-gray-600 mt-1 break-words">{w.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Missing Sections */}
            {result.missingSections.length > 0 && (
              <div className="border-t border-gray-100 pt-8 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-lg">Missing Information</h4>
                      <span className="text-blue-600 font-bold hidden sm:inline">Add Sections</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">Your resume is missing some common sections that recruiters look for.</p>

                    <div className="flex flex-wrap gap-2">
                      {result.missingSections.map((s, i) => (
                        <div key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                          + {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Formatting & Logic */}
            {(result.formattingIssues.length > 0 || result.suggestions.length > 0) && (
              <div className="border-t border-gray-100 pt-8 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Type className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-lg">Formatting & Overall Suggestions</h4>
                    </div>

                    <div className="mt-4 space-y-6">
                      {result.formattingIssues.length > 0 && (
                        <div>
                          <p className="text-sm font-bold text-gray-800 mb-3">Formatting Issues:</p>
                          <ul className="space-y-3">
                            {result.formattingIssues.map((issue, i) => (
                              <li key={i} className="text-gray-600 text-sm flex gap-3 break-words">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                                <span className="leading-relaxed">{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.suggestions.length > 0 && (
                        <div>
                          <p className="text-sm font-bold text-gray-800 mb-3">AI Suggestions:</p>
                          <ol className="space-y-3">
                            {result.suggestions.map((s, i) => (
                              <li key={i} className="text-gray-600 text-sm flex gap-3 break-words">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50 text-[10px] font-bold text-purple-600">
                                  {i + 1}
                                </span>
                                <span className="mt-0.5 leading-relaxed">{s}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900">Cover Letter Match</h4>
              <p className="text-sm text-blue-700">Generate a custom cover letter that matches these results.</p>
            </div>
          </div>
          <Link href="/jobs" className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors whitespace-nowrap">
            Job Matches
          </Link>
        </div>
      </div>
    </div>
  )
}
