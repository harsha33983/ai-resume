import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const analysisSchema = {
  type: "OBJECT",
  properties: {
    overallScore: { type: "NUMBER" },
    atsScore: { type: "NUMBER" },
    templateCompatibility: { type: "NUMBER" },
    missingSections: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    weakSections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          section: { type: "STRING" },
          reason: { type: "STRING" },
        },
      },
    },
    formattingIssues: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    keywordCoverage: {
      type: "OBJECT",
      properties: {
        found: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
        missing: {
          type: "ARRAY",
          items: { type: "STRING" },
        },
      },
    },
    suggestions: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
}

export async function POST(req: Request) {
  try {
    const { resumeData, templateId } = await req.json()

    if (!resumeData) {
      return Response.json({ error: "No resume data" }, { status: 400 })
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert resume analyst and ATS specialist. Analyze the resume data and provide scores and feedback.
Score all numeric fields from 0-100.
Be specific and actionable in suggestions.
Consider the template "${templateId}" when evaluating compatibility.
Check for: missing critical sections, weak bullet points, formatting issues, ATS-friendliness, keyword coverage for tech roles.

Analyze this resume:
${JSON.stringify(resumeData, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({ data: output })
  } catch (error) {
    console.error("Analyze error:", error)
    return Response.json({ error: "Failed to analyze" }, { status: 500 })
  }
}
