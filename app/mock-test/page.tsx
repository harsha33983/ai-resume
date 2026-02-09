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
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Brain,
  Loader2,
  Play,
  CheckCircle,
  XCircle,
  Send,
  BarChart3,
  Trophy,
  BookOpen,
  Code,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"
import type { MockTest, TestEvaluation } from "@/lib/types"

export default function MockTestPage() {
  const {
    mockTest,
    setMockTest,
    testEvaluation,
    setTestEvaluation,
    skillGapResult,
  } = useStore()
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState(false)
  const [targetRole, setTargetRole] = useState("")
  const [seniority, setSeniority] = useState("mid-level")
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({})
  const [codingAnswers, setCodingAnswers] = useState<Record<string, string>>({})
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const generateTest = async () => {
    if (!targetRole) {
      toast.error("Select a role first")
      return
    }
    setLoading(true)
    setSubmitted(false)
    setTestEvaluation(null)
    setMcqAnswers({})
    setCodingAnswers({})
    setScenarioAnswers({})
    try {
      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetRole,
          seniority,
          missingSkills: skillGapResult?.missingSkills || [],
        }),
      })
      const { data } = await res.json()
      setMockTest(data)
      toast.success("Mock test generated!")
    } catch {
      toast.error("Failed to generate test")
    } finally {
      setLoading(false)
    }
  }

  const submitTest = async () => {
    if (!mockTest) return
    setEvaluating(true)
    try {
      const answers = {
        mcq: mcqAnswers,
        coding: codingAnswers,
        scenario: scenarioAnswers,
      }
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mockTest, answers }),
      })
      const { data } = await res.json()
      setTestEvaluation(data)
      setSubmitted(true)
      toast.success("Test evaluated!")
    } catch {
      toast.error("Failed to evaluate test")
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Mock Test
            </h1>
          <p className="mt-2 text-muted-foreground">
            AI-generated interview questions tailored to your target role and
            skill level. Includes MCQs, coding challenges, and system design
            scenarios.
          </p>
        </div>

        {/* Generate Test Section */}
        {!mockTest && (
          <Card>
            <CardHeader>
              <CardTitle>Generate Mock Test</CardTitle>
              <CardDescription>
                Select your target role and seniority level to generate a
                customized test.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground">Target Role</Label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger className="mt-1">
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
                </div>
                <div className="w-48">
                  <Label className="text-sm text-muted-foreground">Seniority</Label>
                  <Select value={seniority} onValueChange={setSeniority}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid-level">Mid-Level</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={generateTest} disabled={loading || !targetRole}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Generate Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Questions */}
        {mockTest && !submitted && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {mockTest.role} - {mockTest.seniority}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {mockTest.mcqs.length} MCQs, {mockTest.codingQuestions.length}{" "}
                  Coding, {mockTest.scenarioQuestions.length} Scenario Questions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setMockTest(null); setTestEvaluation(null) }}>
                  New Test
                </Button>
                <Button onClick={submitTest} disabled={evaluating}>
                  {evaluating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Test
                    </>
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="mcq">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mcq" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  MCQ ({mockTest.mcqs.length})
                </TabsTrigger>
                <TabsTrigger value="coding" className="gap-1.5">
                  <Code className="h-3.5 w-3.5" />
                  Coding ({mockTest.codingQuestions.length})
                </TabsTrigger>
                <TabsTrigger value="scenario" className="gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Scenario ({mockTest.scenarioQuestions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mcq" className="space-y-4">
                {mockTest.mcqs.map((q, i) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">
                          Q{i + 1}. {q.question}
                        </CardTitle>
                        <div className="flex gap-1.5">
                          <Badge variant={q.difficulty === "easy" ? "secondary" : q.difficulty === "medium" ? "outline" : "destructive"} className="text-xs">
                            {q.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {q.skillTag}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={mcqAnswers[q.id]?.toString()}
                        onValueChange={(v) => setMcqAnswers((prev) => ({ ...prev, [q.id]: parseInt(v) }))}
                      >
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                            <RadioGroupItem value={oi.toString()} id={`${q.id}-${oi}`} />
                            <Label htmlFor={`${q.id}-${oi}`} className="text-sm font-normal text-foreground">
                              {opt}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="coding" className="space-y-4">
                {mockTest.codingQuestions.map((q, i) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">
                          Q{i + 1}. {q.question}
                        </CardTitle>
                        <div className="flex gap-1.5">
                          <Badge variant={q.difficulty === "easy" ? "secondary" : q.difficulty === "medium" ? "outline" : "destructive"} className="text-xs">
                            {q.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {q.skillTag}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={codingAnswers[q.id] || ""}
                        onChange={(e) => setCodingAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        rows={6}
                        className="font-mono text-sm"
                        placeholder="Write your solution here..."
                      />
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="scenario" className="space-y-4">
                {mockTest.scenarioQuestions.map((q, i) => (
                  <Card key={q.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-sm">
                          Q{i + 1}. {q.question}
                        </CardTitle>
                        <div className="flex gap-1.5">
                          <Badge variant={q.difficulty === "medium" ? "outline" : "destructive"} className="text-xs">
                            {q.difficulty}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {q.skillTag}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={scenarioAnswers[q.id] || ""}
                        onChange={(e) => setScenarioAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        rows={6}
                        className="text-sm"
                        placeholder="Describe your approach..."
                      />
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Test Results */}
        {submitted && testEvaluation && mockTest && (
          <TestResults evaluation={testEvaluation} mockTest={mockTest} mcqAnswers={mcqAnswers} onRetake={() => { setSubmitted(false); setTestEvaluation(null); setMockTest(null) }} />
        )}
        </main>
      </div>
      </AuthWrapper>
  )
}

function TestResults({
  evaluation,
  mockTest,
  mcqAnswers,
  onRetake,
}: {
  evaluation: TestEvaluation
  mockTest: MockTest
  mcqAnswers: Record<string, number>
  onRetake: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Test Results</h2>
        <Button variant="outline" onClick={onRetake}>
          Take Another Test
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center">
            <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${
              evaluation.totalScore >= 70
                ? "border-emerald-300 bg-emerald-50"
                : evaluation.totalScore >= 50
                  ? "border-amber-300 bg-amber-50"
                  : "border-red-300 bg-red-50"
            }`}>
              <div className="text-center">
                <Trophy className={`mx-auto h-6 w-6 ${
                  evaluation.totalScore >= 70 ? "text-emerald-600" : evaluation.totalScore >= 50 ? "text-amber-600" : "text-red-600"
                }`} />
                <span className={`text-3xl font-bold ${
                  evaluation.totalScore >= 70 ? "text-emerald-600" : evaluation.totalScore >= 50 ? "text-amber-600" : "text-red-600"
                }`}>
                  {evaluation.totalScore}
                </span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="mt-3 text-lg font-semibold text-foreground">Overall Score</p>
          </div>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "MCQ", score: evaluation.mcqScore, icon: BookOpen },
          { label: "Coding", score: evaluation.codingScore, icon: Code },
          { label: "Scenario", score: evaluation.scenarioScore, icon: MessageSquare },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.score}/100</p>
                </div>
              </div>
              <Progress value={s.score} className="mt-2 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Topic Performance */}
      {evaluation.topicPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {evaluation.topicPerformance.map((t, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-medium text-foreground">{t.topic}</div>
                  <div className="flex-1">
                    <Progress value={t.score} className="h-2" />
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-muted-foreground">
                    {t.score}%
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {t.strength}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* MCQ Answers Review */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">MCQ Answer Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTest.mcqs.map((q, i) => {
              const userAnswer = mcqAnswers[q.id]
              const correct = userAnswer === q.correctAnswer
              return (
                <div key={q.id} className={`rounded-md border p-3 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                  <div className="flex items-start gap-2">
                    {correct ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Q{i + 1}. {q.question}
                      </p>
                      {!correct && (
                        <p className="mt-1 text-xs text-emerald-700">
                          Correct: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Improvements */}
      <div className="grid gap-6 md:grid-cols-2">
        {evaluation.improvements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Areas for Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {evaluation.improvements.map((imp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {imp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {evaluation.learningPriorities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Learning Priorities</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {evaluation.learningPriorities.map((lp, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground">{lp}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    
  )
}
