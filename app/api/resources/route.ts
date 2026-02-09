import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const resourcesSchema = {
  type: "OBJECT",
  properties: {
    resources: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          skill: { type: "STRING" },
          title: { type: "STRING" },
          link: { type: "STRING" },
          resourceType: { type: "STRING" },
          description: { type: "STRING" },
        },
      },
    },
  },
}

export async function POST(req: Request) {
  try {
    const { skills } = await req.json()

    if (!Array.isArray(skills) || skills.length === 0) {
      return Response.json({ error: "No skills provided" }, { status: 400 })
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a learning resource curator. For each skill provided, generate exactly 2 free learning resources:
1. One YouTube video or channel (use real, well-known YouTube channels like freeCodeCamp, Traversy Media, Fireship, Tech With Tim, etc.)
2. One free documentation or course (use real free resources like MDN, official docs, freeCodeCamp.org courses, W3Schools, etc.)

IMPORTANT CONSTRAINTS:
- Only suggest publicly available FREE resources
- Use real, verifiable URLs from known educational platforms
- NO paid platforms (Udemy, Coursera paid, LinkedIn Learning, etc.)
- Format YouTube links as: https://www.youtube.com/results?search_query=[skill]+tutorial
- Format documentation links as the official documentation URL for that technology

Generate free learning resources for these skills: ${skills.join(", ")}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: resourcesSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({ data: output?.resources || [] })
  } catch (error) {
    console.error("Resources error:", error)
    return Response.json({ error: "Failed to generate resources" }, { status: 500 })
  }
}
