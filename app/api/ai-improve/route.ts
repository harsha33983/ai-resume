import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const improvedSchema = {
  type: "OBJECT",
  properties: {
    improved: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
  },
}

export async function POST(req: Request) {
  try {
    const { bullets, sectionType } = await req.json()

    if (!Array.isArray(bullets) || bullets.length === 0) {
      return Response.json({ error: "Invalid input" }, { status: 400 })
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert resume writer and ATS optimization specialist.
Improve the provided ${sectionType || "resume"} bullet points:
- Rewrite professionally using strong action verbs
- Add measurable achievements where possible (numbers, percentages, metrics)
- Optimize for ATS keyword matching
- Keep each bullet concise (1-2 lines)
- Improve clarity and impact
- Return the SAME NUMBER of bullets as provided

Improve these bullet points:
${bullets.map((b: string, i: number) => `${i + 1}. ${b}`).join("\n")}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: improvedSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({ data: output?.improved || bullets })
  } catch (error) {
    console.error("AI improve error:", error)
    return Response.json({ error: "Failed to improve text" }, { status: 500 })
  }
}
