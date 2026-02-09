import { GoogleGenAI } from "@google/genai"

const genAI = new GoogleGenAI({ apiKey: process.env.RESUME_PARSER_API_KEY || process.env.GEMINI_API_KEY })

const resumeSchema = {
  type: "OBJECT",
  properties: {
    personal: {
      type: "OBJECT",
      properties: {
        fullName: { type: "STRING" },
        email: { type: "STRING" },
        phone: { type: "STRING" },
        location: { type: "STRING" },
        linkedin: { type: "STRING" },
        github: { type: "STRING" },
        portfolio: { type: "STRING" },
        title: { type: "STRING" },
      },
      required: ["fullName", "email"],
    },
    summary: { type: "STRING" },
    skills: {
      type: "ARRAY",
      items: { type: "STRING" },
    },
    experience: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          company: { type: "STRING" },
          role: { type: "STRING" },
          startDate: { type: "STRING" },
          endDate: { type: "STRING" },
          location: { type: "STRING" },
          bullets: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
        },
      },
    },
    projects: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          name: { type: "STRING" },
          description: { type: "STRING" },
          technologies: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          bullets: {
            type: "ARRAY",
            items: { type: "STRING" },
          },
          link: { type: "STRING" },
        },
      },
    },
    education: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          institution: { type: "STRING" },
          degree: { type: "STRING" },
          field: { type: "STRING" },
          startDate: { type: "STRING" },
          endDate: { type: "STRING" },
          gpa: { type: "STRING" },
        },
      },
    },
    certifications: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          name: { type: "STRING" },
          issuer: { type: "STRING" },
          date: { type: "STRING" },
          link: { type: "STRING" },
        },
      },
    },
    customSections: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          title: { type: "STRING" },
          content: {
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
    const body = await req.json()
    console.log("Parse Resume parsing body:", JSON.stringify(body).slice(0, 200)) // Log first 200 chars

    const { text, fileData, mimeType } = body

    if ((!text && !fileData) || (fileData && !mimeType)) {
      console.log("Invalid input: Missing text or fileData/mimeType")
      return Response.json(
        { error: "Invalid input" },
        { status: 400 }
      )
    }

    // Prepare content parts based on input type
    let parts = []
    if (fileData) {
      parts = [
        {
          text: `You are a resume parser. Extract structured data from the resume file provided. 
Generate unique IDs for each item using the format "item-1", "item-2", etc.
If a field is not found, use an empty string. 
For skills, extract individual skill names as separate items.
For bullets in experience and projects, extract each achievement or responsibility as a separate item.
Be thorough and accurate.`
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: fileData
          }
        }
      ]
    } else {
      if (text.length > 50000) {
        console.log("Input too long:", text.length)
        return Response.json(
          { error: "Oversized input" },
          { status: 400 }
        )
      }
      parts = [
        {
          text: `You are a resume parser. Extract structured data from the resume text provided. 
Generate unique IDs for each item using the format "item-1", "item-2", etc.
If a field is not found, use an empty string. 
For skills, extract individual skill names as separate items.
For bullets in experience and projects, extract each achievement or responsibility as a separate item.
Be thorough and accurate.

Resume Text:
${text}`
        }
      ]
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: parts,
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    })

    const responseText = response.text
    const parsedData = JSON.parse(responseText || "{}")

    return Response.json({ data: parsedData })
  } catch (error) {
    console.error("Parse error:", error)
    return Response.json(
      { error: "Failed to parse resume" },
      { status: 500 }
    )
  }
}
