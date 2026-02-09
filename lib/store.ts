"use client"

import { createContext, useContext } from "react"
import type {
  ResumeData,
  TemplateConfig,
  AnalysisResult,
  SkillGapResult,
  LearningResource,
  MockTest,
  TestEvaluation,
} from "./types"

export interface StoreState {
  resumeData: ResumeData | null
  setResumeData: (data: ResumeData | null) => void
  selectedTemplateId: string
  setSelectedTemplateId: (id: string) => void
  templateConfig: TemplateConfig | null
  setTemplateConfig: (config: TemplateConfig | null) => void
  analysisResult: AnalysisResult | null
  setAnalysisResult: (result: AnalysisResult | null) => void
  skillGapResult: SkillGapResult | null
  setSkillGapResult: (result: SkillGapResult | null) => void
  resources: LearningResource[]
  setResources: (resources: LearningResource[]) => void
  mockTest: MockTest | null
  setMockTest: (test: MockTest | null) => void
  testEvaluation: TestEvaluation | null
  setTestEvaluation: (evaluation: TestEvaluation | null) => void
}

export const StoreContext = createContext<StoreState | null>(null)

export function useStore(): StoreState {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
