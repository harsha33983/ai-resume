import { GoogleGenAI } from "@google/genai"
import { templates } from "@/lib/templates"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const recommendSchema = {
  type: "OBJECT",
  properties: {
    templateId: { type: "STRING" },
    reasoning: { type: "STRING" },
    alternativeId: { type: "STRING" },
    alternativeReasoning: { type: "STRING" },
  },
}

export async function POST(req: Request) {
  try {
    const { resumeData } = await req.json()

    if (!resumeData) {
      return Response.json({ error: "No resume data" }, { status: 400 })
    }

    const templateSummary = templates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
      columns: t.layout.columns,
    }))

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a resume design advisor. Based on the resume data, recommend the best template.
Available templates: ${JSON.stringify(templateSummary)}
Consider: experience level, target role, number of sections with content, ATS needs, design appropriateness.
Provide clear reasoning for your recommendation.

Recommend a template for this resume:
${JSON.stringify(resumeData, null, 2)}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({ data: output })
  } catch (error) {
    console.error("Recommend error:", error)
    return Response.json({ error: "Failed to recommend template" }, { status: 500 })
  }
}