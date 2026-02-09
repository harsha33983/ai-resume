import { GoogleGenAI } from "@google/genai"

// Use specific key first, fallback to general key
const genAI = new GoogleGenAI({
    apiKey: process.env.INTERVIEW_PREP_API_KEY || process.env.GEMINI_API_KEY
})

export async function POST(req: Request) {
    try {
        const { messages, role, topic } = await req.json()

        // Log to debug (mask sensitive parts)
        const keyUsed = process.env.INTERVIEW_PREP_API_KEY ? "INTERVIEW_PREP_API_KEY" : "GEMINI_API_KEY"
        console.log(`Interview Prep: Using key from ${keyUsed}`)

        const systemPrompt = `You are an expert technical interviewer conducting a mock interview for a ${role} position. 
    The focus area is: ${topic}.
    
    Your goal is to assess the candidate's knowledge, problem-solving skills, and communication.
    - Ask ONE question at a time.
    - If the candidate answers correctly, acknowledge it briefly and move to a slightly harder or related question.
    - If the candidate is wrong or stuck, provide a helpful hint or guidance without giving the full answer immediately, then ask a follow-up.
    - Keep your responses concise and conversational (suitable for voice interaction).
    - Do not output markdown lists or long code blocks unless absolutely necessary, as this is primarily a voice/text chat.
    - Be professional, encouraging, but rigorous.
    
    Start by introducing yourself and asking the first question about ${topic}.`

        let contents = [];

        if (!messages || messages.length === 0) {
            contents = [{ role: "user", parts: [{ text: "Hello, I am ready for the interview." }] }];
        } else {
            contents = messages.map((m: any) => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));
        }

        const response = await genAI.models.generateContent({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                }
            },
            contents: contents,
        })

        if (!response.text) {
            throw new Error("No response text from Gemini")
        }

        return Response.json({
            content: response.text
        })

    } catch (error) {
        console.error("Interview Prep API Error:", error)
        // Check for common errors like quota or auth
        return Response.json({ error: "Failed to generate interview response", details: String(error) }, { status: 500 })
    }
}
