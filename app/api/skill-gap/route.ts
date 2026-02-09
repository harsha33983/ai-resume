import { GoogleGenAI } from "@google/genai"
import { roleSkillMap } from "@/lib/templates"

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const skillGapSchema = {
  type: "OBJECT",
  properties: {
    matchedSkills: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    missingSkills: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    weakSkills: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    recommendedSkills: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    overallMatch: { type: "NUMBER" },
  },
}

export async function POST(req: Request) {
  try {
    const { skills, targetRole } = await req.json()

    if (!skills || !targetRole) {
      return Response.json({ error: "Missing skills or role" }, { status: 400 })
    }

    const requiredSkills = roleSkillMap[targetRole] || []

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a career advisor. Compare resume skills against role requirements.
Required skills for ${targetRole}: ${requiredSkills.join(", ")}
Analyze which skills match, which are missing, which are weak (mentioned but not demonstrated), and recommend additional skills.
Calculate overallMatch as a percentage (0-100).

Resume skills: ${skills.join(", ")}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: skillGapSchema,
      },
    })

    const responseText = response.text
    const output = JSON.parse(responseText || "{}")

    return Response.json({
      data: { ...output, targetRole },
    })
  } catch (error) {
    console.error("Skill gap error:", error)
    return Response.json({ error: "Failed to analyze skill gap" }, { status: 500 })
  }
}
