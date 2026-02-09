import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const evaluationSchema = {
  type: "OBJECT",
  properties: {
    totalScore: { type: "NUMBER" },
    mcqScore: { type: "NUMBER" },
    codingScore: { type: "NUMBER" },
    scenarioScore: { type: "NUMBER" },
    topicPerformance: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          topic: { type: "STRING" },
          score: { type: "NUMBER" },
          strength: { type: "STRING" },
        },
      },
    },
    improvements: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    learningPriorities: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
}

export async function POST(req: Request) {
  try {
    const { mockTest, answers } = await req.json()

    if (!mockTest || !answers) {
      return Response.json({ error: "Missing data" }, { status: 400 })
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a technical interview evaluator. Evaluate the user's answers against the mock test.
Score each section out of 100.
For MCQs, check correctness against the correct answers.
For coding and scenario questions, evaluate the quality of the response.
Provide topic-wise performance and actionable improvement suggestions.
Calculate totalScore as a weighted average (MCQ 40%, Coding 35%, Scenario 25%).

Mock Test:
${JSON.stringify(mockTest, null, 2)}

User Answers:
${JSON.stringify(answers, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({ data: output })
  } catch (error) {
    console.error("Evaluate error:", error)
    return Response.json({ error: "Failed to evaluate" }, { status: 500 })
  }
}
