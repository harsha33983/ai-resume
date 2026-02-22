"use client"

import { useState, useEffect, useCallback, useRef, type ReactNode } from "react"
import { useAuth } from "@/components/auth-provider"
import { StoreContext, type StoreState } from "@/lib/store"
import type {
  ResumeData,
  TemplateConfig,
  AnalysisResult,
  SkillGapResult,
  LearningResource,
  MockTest,
  TestEvaluation,
} from "@/lib/types"
import { getTemplate } from "@/lib/templates"
import { createClient } from "@/lib/supabase/client"

function useDebouncedSave(type: string, data: unknown, ready: boolean, userId: string | undefined) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const supabase = createClient()

  useEffect(() => {
    if (!ready || data === null || data === undefined || !userId) return
    if (Array.isArray(data) && data.length === 0) return

    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("users")
          .upsert({ id: userId, [type]: data }, { onConflict: "id" })

        if (error) throw error
        console.log(`[v0] Saved ${type} to Supabase`)
      } catch (err) {
        console.error(`Failed to save ${type} (Details):`, JSON.stringify(err, null, 2))
        console.error(`Failed to save ${type} (Original):`, err)
      }
    }, 800)

    return () => clearTimeout(timer.current)
  }, [type, data, ready, userId, supabase])
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState("modern-swe")
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(
    getTemplate("modern-swe")
  )
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [skillGapResult, setSkillGapResult] = useState<SkillGapResult | null>(null)
  const [resources, setResources] = useState<LearningResource[]>([])
  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [testEvaluation, setTestEvaluation] = useState<TestEvaluation | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user, loading } = useAuth()
  const supabase = createClient()

  // Check auth and load persisted data from Supabase on mount
  useEffect(() => {
    const initData = async () => {
      if (loading) return

      if (!user) {
        console.log("[v0] No authenticated user found")
        setHydrated(true)
        return
      }

      console.log("[v0] User authenticated:", user.id)
      setIsAuthenticated(true)

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (data) {
          if (data.resume) setResumeData(data.resume as ResumeData)
          if (data.analysis) setAnalysisResult(data.analysis as AnalysisResult)
          if (data.skillGap) setSkillGapResult(data.skillGap as SkillGapResult)
          if (data.resources && Array.isArray(data.resources)) setResources(data.resources as LearningResource[])
          if (data.mockTest) setMockTest(data.mockTest as MockTest)
          if (data.evaluation) setTestEvaluation(data.evaluation as TestEvaluation)
          console.log("[v0] Session data loaded from Supabase")
        }
      } catch (err) {
        console.error("Failed to load session:", err)
      } finally {
        setHydrated(true)
      }
    }

    initData()
  }, [user, loading, supabase])

  // Auto-save whenever state changes (debounced) - only for authenticated users
  useDebouncedSave("resume", resumeData, hydrated && isAuthenticated, user?.id)
  useDebouncedSave("analysis", analysisResult, hydrated && isAuthenticated, user?.id)
  useDebouncedSave("skillGap", skillGapResult, hydrated && isAuthenticated, user?.id)
  useDebouncedSave("resources", resources, hydrated && isAuthenticated, user?.id)
  useDebouncedSave("mockTest", mockTest, hydrated && isAuthenticated, user?.id)
  useDebouncedSave("evaluation", testEvaluation, hydrated && isAuthenticated, user?.id)

  const value: StoreState = {
    resumeData,
    setResumeData,
    selectedTemplateId,
    setSelectedTemplateId: (id: string) => {
      setSelectedTemplateId(id)
      setTemplateConfig(getTemplate(id))
    },
    templateConfig,
    setTemplateConfig,
    analysisResult,
    setAnalysisResult,
    skillGapResult,
    setSkillGapResult,
    resources,
    setResources,
    mockTest,
    setMockTest,
    testEvaluation,
    setTestEvaluation,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
