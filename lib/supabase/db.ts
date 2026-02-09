"use server"

import { createClient } from "@/lib/supabase/server"

// ========== Get Current User ID ==========
// Get the authenticated user's ID from Supabase auth
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

// ========== Resume Data ==========

export async function saveResume(data: Record<string, unknown>) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveResume error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("resumes")
    .upsert(
      {
        user_id: userId,
        resume_data: data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveResume error:", error)
  return !error
}

export async function loadResume() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadResume error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("resume_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadResume error:", error)
  return data?.resume_data ?? null
}

// ========== Analysis Result ==========

export async function saveAnalysis(result: Record<string, unknown>) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveAnalysis error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("analysis_results")
    .upsert(
      {
        user_id: userId,
        analysis_data: result,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveAnalysis error:", error)
  return !error
}

export async function loadAnalysis() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadAnalysis error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("analysis_results")
    .select("analysis_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadAnalysis error:", error)
  return data?.analysis_data ?? null
}

// ========== Skill Gap ==========

export async function saveSkillGap(result: Record<string, unknown>) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveSkillGap error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("skill_gap_results")
    .upsert(
      {
        user_id: userId,
        skill_gap_data: result,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveSkillGap error:", error)
  return !error
}

export async function loadSkillGap() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadSkillGap error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("skill_gap_results")
    .select("skill_gap_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadSkillGap error:", error)
  return data?.skill_gap_data ?? null
}

// ========== Learning Resources ==========

export async function saveResources(resources: Record<string, unknown>[]) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveResources error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("learning_resources")
    .upsert(
      {
        user_id: userId,
        resources_data: resources,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveResources error:", error)
  return !error
}

export async function loadResources() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadResources error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("learning_resources")
    .select("resources_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadResources error:", error)
  return data?.resources_data ?? null
}

// ========== Mock Test ==========

export async function saveMockTest(test: Record<string, unknown>) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveMockTest error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("mock_tests")
    .upsert(
      {
        user_id: userId,
        test_data: test,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveMockTest error:", error)
  return !error
}

export async function loadMockTest() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadMockTest error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("mock_tests")
    .select("test_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadMockTest error:", error)
  return data?.test_data ?? null
}

// ========== Test Evaluation ==========

export async function saveEvaluation(evaluation: Record<string, unknown>) {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("saveEvaluation error: User not authenticated")
    return false
  }

  const { error } = await supabase
    .from("test_evaluations")
    .upsert(
      {
        user_id: userId,
        evaluation_data: evaluation,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
  if (error) console.error("saveEvaluation error:", error)
  return !error
}

export async function loadEvaluation() {
  const supabase = await createClient()
  const userId = await getCurrentUserId()

  if (!userId) {
    console.error("loadEvaluation error: User not authenticated")
    return null
  }

  const { data, error } = await supabase
    .from("test_evaluations")
    .select("evaluation_data")
    .eq("user_id", userId)
    .maybeSingle()
  if (error) console.error("loadEvaluation error:", error)
  return data?.evaluation_data ?? null
}
