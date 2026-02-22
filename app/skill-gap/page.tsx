"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { roleSkillMap } from "@/lib/templates"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function SkillGapPage() {
  const { resumeData, skillGapResult, setSkillGapResult, setResources } = useStore()
  const [loading, setLoading] = useState(false)
  const [loadingResources, setLoadingResources] = useState(false)
  const [targetRole, setTargetRole] = useState("")
  const router = useRouter()

  const runAnalysis = async () => {
    if (!resumeData || !targetRole) {
      toast.error("Select a role and upload a resume first")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          skills: (resumeData.skills || []).flatMap((s: any) =>
            typeof s === "string" ? s : s.items || []
          ),
          targetRole,
        }),
      })
      const { data } = await res.json()
      setSkillGapResult(data)
      toast.success("Skill gap analysis complete!")
    } catch {
      toast.error("Failed to analyze skill gap")
    } finally {
      setLoading(false)
    }
  }

  const getResources = async () => {
    if (!skillGapResult) return
    const missingSkills = [
      ...skillGapResult.missingSkills.slice(0, 3),
      ...skillGapResult.weakSkills.slice(0, 2),
    ]
    if (missingSkills.length === 0) {
      toast.info("No skill gaps found!")
      return
    }
    setLoadingResources(true)
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: missingSkills }),
      })
      const { data } = await res.json()
      setResources(data)
      toast.success("Resources generated!")
      router.push("/resources")
    } catch {
      toast.error("Failed to generate resources")
    } finally {
      setLoadingResources(false)
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Skill Gap Analysis
          </h1>
          <p className="mt-2 text-muted-foreground">
            Compare your resume skills against the requirements for your target
            role and discover what to learn next.
          </p>

          {!resumeData ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  No Resume Data
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload or build your resume first.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Role Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Target Role</CardTitle>
                  <CardDescription>
                    Choose the role you are targeting to compare your skills.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Select value={targetRole} onValueChange={setTargetRole}>
                      <SelectTrigger className="sm:w-64">
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(roleSkillMap).map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={runAnalysis} disabled={loading || !targetRole}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Target className="mr-2 h-4 w-4" />
                          Analyze Skill Gap
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {skillGapResult && (
                <>
                  {/* Overall Match */}
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Overall Match for {skillGapResult.targetRole}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Skill Match
                          </span>
                          <span className="text-2xl font-bold text-foreground">
                            {skillGapResult.overallMatch}%
                          </span>
                        </div>
                        <Progress value={skillGapResult.overallMatch} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Matched Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          Matched Skills ({skillGapResult.matchedSkills.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGapResult.matchedSkills.map((s) => (
                            <Badge key={s} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Missing Skills */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <XCircle className="h-4 w-4 text-destructive" />
                          Missing Skills ({skillGapResult.missingSkills.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {skillGapResult.missingSkills.map((s) => (
                            <Badge key={s} variant="destructive">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weak Skills */}
                    {skillGapResult.weakSkills.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Weak Skills ({skillGapResult.weakSkills.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1.5">
                            {skillGapResult.weakSkills.map((s) => (
                              <Badge key={s} variant="outline" className="border-amber-300 text-amber-700">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recommended Skills */}
                    {skillGapResult.recommendedSkills.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Recommended Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1.5">
                            {skillGapResult.recommendedSkills.map((s) => (
                              <Badge key={s} variant="secondary">
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={getResources} disabled={loadingResources} size="lg">
                      {loadingResources ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finding Resources...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Get Free Learning Resources
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </AuthWrapper>
  )
}
