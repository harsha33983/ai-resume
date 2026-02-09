import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.MOCK_TEST_API_KEY || process.env.GEMINI_API_KEY })

const mockTestSchema = {
  type: "OBJECT",
  properties: {
    mcqs: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          question: { type: "STRING" },
          options: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          correctAnswer: { type: "NUMBER" },
          difficulty: { type: "STRING" }, // Enum handling simplified to string for GenAI compatibility
          skillTag: { type: "STRING" },
          explanation: { type: "STRING" },
        },
      },
    },
    codingQuestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          question: { type: "STRING" },
          difficulty: { type: "STRING" },
          skillTag: { type: "STRING" },
          expectedApproach: { type: "STRING" },
          sampleSolution: { type: "STRING" },
        },
      },
    },
    scenarioQuestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          question: { type: "STRING" },
          difficulty: { type: "STRING" },
          skillTag: { type: "STRING" },
          expectedAnswer: { type: "STRING" },
          evaluationCriteria: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
      },
    },
  },
}

export async function POST(req: Request) {
  try {
    const { role, seniority, missingSkills } = await req.json()

    if (!role) {
      return Response.json({ error: "No role specified" }, { status: 400 })
    }

    console.log("Mock Test: Generating for role:", role)
    console.log("Mock Test: API Key configured:", !!process.env.GEMINI_API_KEY)
    if (process.env.GEMINI_API_KEY) {
      console.log("Mock Test: API Key prefix:", process.env.GEMINI_API_KEY.substring(0, 5))
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a technical interview question generator. Generate a comprehensive mock test for a ${seniority || "mid-level"} ${role}.
              
Generate:
- 10 MCQ questions (mix of easy, medium, hard) with 4 options each. correctAnswer is the 0-based index.
- 5 coding/practical questions
- 3 scenario/system design questions

Focus on: ${missingSkills?.length ? `especially these gap areas: ${missingSkills.join(", ")}` : "core skills for the role"}

Use IDs like "mcq-1", "coding-1", "scenario-1".
Make questions realistic and relevant to actual interviews.

Generate a mock test for ${role} position at ${seniority || "mid"} level.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: mockTestSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({
      data: { ...output, role, seniority: seniority || "mid-level" },
    })
  } catch (error) {
    console.error("Mock test error:", error)
    return Response.json({ error: "Failed to generate mock test" }, { status: 500 })
  }
}
