"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { roleSkillMap } from "@/lib/templates"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Brain,
  Loader2,
  CheckCircle,
  XCircle,
  Trophy,
  BookOpen,
  Code,
  MessageSquare,
  Timer,
  Bolt,
  ArrowRight,
  ArrowLeft,
  Share2,
  Download,
  AlertCircle,
  TrendingDown,
  School,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"
import type { MockTest, TestEvaluation } from "@/lib/types"

type TestStep = 'config' | 'loading' | 'active' | 'results'

export default function MockTestPage() {
  const {
    mockTest,
    setMockTest,
    testEvaluation,
    setTestEvaluation,
    skillGapResult,
  } = useStore()

  const [step, setStep] = useState<TestStep>('config')
  const [targetRole, setTargetRole] = useState("")
  const [seniority, setSeniority] = useState("mid-level")
  const [questionCount, setQuestionCount] = useState("20")

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({})
  const [codingAnswers, setCodingAnswers] = useState<Record<string, string>>({})
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, string>>({})

  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [evaluating, setEvaluating] = useState(false)

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (step === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [step, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateTest = async () => {
    if (!targetRole) {
      toast.error("Select a role first")
      return
    }
    setStep('loading')
    setTestEvaluation(null)
    setMcqAnswers({})
    setCodingAnswers({})
    setScenarioAnswers({})

    try {
      // Simulate loading progress
      await new Promise(resolve => setTimeout(resolve, 2000))

      const res = await fetch("/api/mock-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetRole,
          seniority,
          missingSkills: skillGapResult?.missingSkills || [],
          count: parseInt(questionCount)
        }),
      })
      const { data } = await res.json()
      setMockTest(data)
      setStep('active')
      setTimeLeft(30 * 60)
      setCurrentQuestionIndex(0)
      toast.success("Mock test generated!")
    } catch {
      toast.error("Failed to generate test")
      setStep('config')
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
      setStep('results')
      toast.success("Test evaluated!")
    } catch {
      toast.error("Failed to evaluate test")
    } finally {
      setEvaluating(false)
    }
  }

  // Combine all questions into a flat array for traversal
  const allQuestions = mockTest ? [
    ...mockTest.mcqs.map(q => ({ ...q, type: 'mcq' as const })),
    ...mockTest.codingQuestions.map(q => ({ ...q, type: 'coding' as const })),
    ...mockTest.scenarioQuestions.map(q => ({ ...q, type: 'scenario' as const }))
  ] : []

  const currentQuestion = allQuestions[currentQuestionIndex]

  const handleAnswer = (val: string | number) => {
    if (!currentQuestion) return

    if (currentQuestion.type === 'mcq') {
      setMcqAnswers(prev => ({ ...prev, [currentQuestion.id]: val as number }))
    } else if (currentQuestion.type === 'coding') {
      setCodingAnswers(prev => ({ ...prev, [currentQuestion.id]: val as string }))
    } else {
      setScenarioAnswers(prev => ({ ...prev, [currentQuestion.id]: val as string }))
    }
  }

  const getAnswer = () => {
    if (!currentQuestion) return ""
    if (currentQuestion.type === 'mcq') return mcqAnswers[currentQuestion.id]?.toString()
    if (currentQuestion.type === 'coding') return codingAnswers[currentQuestion.id] || ""
    return scenarioAnswers[currentQuestion.id] || ""
  }

  const downloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      const element = document.getElementById('test-results')
      if (!element) return

      const canvas = await html2canvas(element)
      const data = canvas.toDataURL('image/png')

      const pdf = new jsPDF()
      const imgProperties = pdf.getImageProperties(data)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('mock-test-results.pdf')
      toast.success("PDF downloading...")
    } catch {
      toast.error("Failed to download PDF")
    }
  }

  const shareScore = () => {
    const text = `I just scored ${testEvaluation?.totalScore}% on my AI Mock Test for ${mockTest?.role}! 🚀 Check out AI Resume Studio.`
    navigator.clipboard.writeText(text)
    toast.success("Score copied to clipboard!")
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-slate-900 dark:text-slate-100">
        <AppNav />
        <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* SECTION 1: CONFIGURATION */}
          {step === 'config' && (
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-wrap justify-between gap-3 mb-6">
                <div className="flex min-w-72 flex-col gap-2">
                  <p className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">AI Mock Test Generator</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-normal">Customize your practice session to match your career goals.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden">
                <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight px-6 pb-3 pt-6">Test Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col gap-4">
                    <Label className="flex flex-col flex-1 gap-2">
                      <span className="text-slate-700 dark:text-slate-300 text-base font-semibold">Target Skill</span>
                      <Select value={targetRole} onValueChange={setTargetRole}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-base">
                          <SelectValue placeholder="Select target role" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(roleSkillMap).map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Label>

                    <div>
                      <span className="text-slate-700 dark:text-slate-300 text-base font-semibold pb-2 block">Difficulty Level</span>
                      <RadioGroup value={seniority} onValueChange={setSeniority} className="flex h-12 w-full rounded-lg bg-slate-100 dark:bg-zinc-800 p-1">
                        {['junior', 'mid-level', 'senior'].map((level) => (
                          <Label
                            key={level}
                            className={cn(
                              "flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 text-sm font-bold transition-all capitalize",
                              seniority === level
                                ? "bg-white dark:bg-zinc-700 shadow-sm text-primary"
                                : "text-slate-500 dark:text-slate-400 active:scale-95"
                            )}
                          >
                            {level}
                            <RadioGroupItem value={level} className="hidden" />
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Label className="flex flex-col flex-1 gap-2">
                      <span className="text-slate-700 dark:text-slate-300 text-base font-semibold">Question Count</span>
                      <Select value={questionCount} onValueChange={setQuestionCount}>
                        <SelectTrigger className="w-full h-14 bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-base">
                          <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Questions (Quick practice)</SelectItem>
                          <SelectItem value="20">20 Questions (Standard test)</SelectItem>
                          <SelectItem value="50">50 Questions (Comprehensive)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Label>
                    <div className="mt-auto">
                      <Button
                        onClick={generateTest}
                        disabled={!targetRole}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] text-base"
                      >
                        <Bolt className="w-5 h-5 fill-current" />
                        Generate Test with AI
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: LOADING STATE */}
          {step === 'loading' && (
            <section className="mb-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-white dark:bg-zinc-900 rounded-xl p-12 border border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <Sparkles className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">AI is curating your test...</h3>
                <p className="text-slate-500 max-w-sm">Generating {questionCount} {seniority} {targetRole} questions based on current industry standards and documentation.</p>
                <div className="w-full max-w-md bg-slate-100 dark:bg-zinc-800 h-2 rounded-full mt-8 overflow-hidden">
                  <div className="bg-primary h-full w-[65%] animate-pulse"></div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: ACTIVE TEST STATE */}
          {step === 'active' && currentQuestion && (
            <section className="mb-12 animate-in slide-in-from-right-8 duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-zinc-800 gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <Timer className="text-slate-400 w-6 h-6" />
                  <div className="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="flex-1 max-w-md px-10 hidden sm:block">
                  <div className="flex justify-between mb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>Question {currentQuestionIndex + 1} of {allQuestions.length}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / allQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>
                <Button variant="destructive" onClick={() => submitTest()} disabled={evaluating} className="bg-red-50 hover:bg-red-100 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                  {evaluating ? "Submitting..." : "End Session"}
                </Button>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-slate-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap w-fit">
                      {currentQuestion.type}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold leading-relaxed">{currentQuestion.question}</h3>
                  </div>

                  <div className="mb-10 min-h-[300px]">
                    {/* MCQ Layout */}
                    {currentQuestion.type === 'mcq' && (
                      <div className="space-y-4">
                        {(currentQuestion as any).options.map((opt: string, i: number) => (
                          <label
                            key={i}
                            className={cn(
                              "flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all group",
                              getAnswer() === i.toString()
                                ? "border-primary bg-primary/5"
                                : "border-slate-100 dark:border-zinc-800 hover:border-primary/50"
                            )}
                          >
                            <input
                              type="radio"
                              name={`q-${currentQuestion.id}`}
                              className="w-5 h-5 text-primary border-slate-300 focus:ring-primary"
                              checked={getAnswer() === i.toString()}
                              onChange={() => handleAnswer(i)}
                            />
                            <span className={cn(
                              "ml-4 font-medium",
                              getAnswer() === i.toString()
                                ? "text-slate-900 dark:text-white font-bold"
                                : "text-slate-700 dark:text-slate-300"
                            )}>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Coding/Scenario Layout */}
                    {(currentQuestion.type === 'coding' || currentQuestion.type === 'scenario') && (
                      <textarea
                        className="w-full h-64 p-4 rounded-xl border-2 border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:border-primary focus:ring-primary font-mono text-sm resize-none"
                        placeholder={currentQuestion.type === 'coding' ? "Write your code solution here..." : "Describe your approach..."}
                        value={getAnswer()}
                        onChange={(e) => handleAnswer(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-6 border-t border-slate-100 dark:border-zinc-800 gap-4 sm:gap-0">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold w-full sm:w-auto"
                    >
                      <ArrowLeft className="w-5 h-5" /> Previous
                    </Button>
                    <div className="flex flex-col-reverse sm:flex-row gap-4 w-full sm:w-auto">
                      <Button variant="outline" className="hidden sm:flex font-bold hover:bg-slate-50 dark:hover:bg-zinc-800">
                        Mark for Review
                      </Button>
                      {currentQuestionIndex < allQuestions.length - 1 ? (
                        <Button
                          onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                          className="w-full sm:w-auto px-8 bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
                        >
                          Next Question
                        </Button>
                      ) : (
                        <Button
                          onClick={submitTest}
                          disabled={evaluating}
                          className="w-full sm:w-auto px-8 bg-primary text-white font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
                        >
                          Finish Test
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: POST-TEST STATE */}
          {/* Detailed Results with Answer Review */}
          {step === 'results' && testEvaluation && mockTest && (
            <section className="mb-12 animate-in zoom-in-95 duration-500" id="test-results">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
                <h2 className="text-2xl sm:text-3xl font-black">Performance Analytics</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-initial gap-2" onClick={downloadPDF}>
                    <Download className="w-4 h-4" /> PDF Report
                  </Button>
                  <Button className="flex-1 sm:flex-initial gap-2 bg-primary shadow-md shadow-primary/20" onClick={shareScore}>
                    <Share2 className="w-4 h-4" /> Share Score
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Score Summary Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-slate-200 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-slate-100 dark:text-zinc-800" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                      <circle
                        className={cn(
                          testEvaluation.totalScore >= 70 ? "text-green-500" : testEvaluation.totalScore >= 40 ? "text-amber-500" : "text-red-500"
                        )}
                        cx="80" cy="80" fill="transparent" r="70" stroke="currentColor"
                        strokeDasharray="440"
                        strokeDashoffset={440 - (440 * testEvaluation.totalScore) / 100}
                        strokeLinecap="round" strokeWidth="12"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{testEvaluation.totalScore}%</span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">
                    {testEvaluation.totalScore >= 80 ? "Excellent Work!" : testEvaluation.totalScore >= 60 ? "Good Job!" : "Needs Improvement"}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">Based on your performance in {mockTest?.role}</p>

                  <div className="grid grid-cols-3 w-full gap-4 border-t border-slate-100 dark:border-zinc-800 pt-6">
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{testEvaluation.mcqScore}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">MCQ</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{testEvaluation.codingScore}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Code</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">{testEvaluation.scenarioScore}%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Scenario</p>
                    </div>
                  </div>
                </div>

                {/* Weak Topics & Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-amber-500" />
                      Focus Areas
                    </h4>
                    <div className="space-y-4">
                      {testEvaluation.improvements.slice(0, 3).map((imp, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg flex items-center justify-center">
                              <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-white">{imp}</p>
                              <p className="text-xs text-slate-500">Recommended for review</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                        <School className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">Ready for more?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Jump back into your personalized learning path to bridge the gaps.</p>
                      </div>
                      <Button onClick={() => setStep('config')} className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20">
                        New Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Answer Review */}
              <div className="space-y-8 mt-12 bg-white dark:bg-zinc-900 p-4 sm:p-8 rounded-xl border border-slate-200 dark:border-zinc-800">
                <h3 className="text-xl sm:text-2xl font-bold">Answer Review</h3>

                <Tabs defaultValue="mcq" className="w-full">
                  <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-6 bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl h-auto">
                    <TabsTrigger value="mcq" className="rounded-lg font-bold py-2">MCQ Review</TabsTrigger>
                    <TabsTrigger value="coding" className="rounded-lg font-bold py-2">Coding Review</TabsTrigger>
                    <TabsTrigger value="scenario" className="rounded-lg font-bold py-2">Scenario Review</TabsTrigger>
                  </TabsList>

                  <TabsContent value="mcq" className="space-y-4">
                    {mockTest.mcqs.map((q, i) => {
                      const userAnswer = mcqAnswers[q.id]
                      const correct = userAnswer === q.correctAnswer
                      return (
                        <div key={q.id} className={cn("p-4 rounded-lg border-2", correct ? "border-green-100 bg-green-50 dark:bg-green-900/10 dark:border-green-900/30" : "border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30")}>
                          <div className="flex gap-3">
                            {correct ? <CheckCircle className="w-6 h-6 text-green-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 dark:text-white mb-2">Q{i + 1}. {q.question}</p>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-semibold">Your Answer:</span> {q.options[userAnswer] || "Skipped"}</p>
                                {!correct && <p className="text-green-700 dark:text-green-400"><span className="font-semibold">Correct Answer:</span> {q.options[q.correctAnswer]}</p>}
                                <p className="text-slate-500 mt-2 bg-white dark:bg-black/20 p-2 rounded">💡 {q.explanation}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </TabsContent>

                  <TabsContent value="coding" className="space-y-6">
                    {mockTest.codingQuestions.map((q, i) => (
                      <div key={q.id} className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg">Q{i + 1}. {q.question}</h4>
                          <Badge>{q.difficulty}</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-lg">
                            <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">Expected Approach</span>
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{q.expectedApproach}</p>
                          </div>
                          <div className="p-4 bg-slate-950 text-slate-50 rounded-lg font-mono text-sm overflow-x-auto">
                            <span className="text-xs font-bold uppercase text-slate-500 mb-2 block">Sample Solution</span>
                            <pre>{q.sampleSolution}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="scenario" className="space-y-6">
                    {mockTest.scenarioQuestions.map((q, i) => (
                      <div key={q.id} className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800">
                        <h4 className="font-bold text-lg mb-4">Q{i + 1}. {q.question}</h4>
                        <div className="bg-slate-50 dark:bg-zinc-800 p-5 rounded-lg">
                          <h5 className="font-bold text-sm mb-2 text-primary">Key Evaluation Criteria</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 dark:text-slate-300">
                            {q.evaluationCriteria.map((c, ci) => (
                              <li key={ci}>{c}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-4">
                          <h5 className="font-bold text-sm mb-2">Expected Answer Strategy</h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{q.expectedAnswer}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          )}

        </main>
      </div>
    </AuthWrapper>
  )
}

