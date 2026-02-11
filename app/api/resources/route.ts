import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { skills } = body

    if (!Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: "No skills provided" }, { status: 400 })
    }

    // Proxy to Python Backend
    // Use Render backend as default
    const backendUrl = process.env.RESUME_BACKEND_URL || "https://ai-resume-qzt9.onrender.com/resources"

    console.log(`Resources Backend URL: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skills }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown backend error" }))
      console.error("Backend error:", errorData)
      return NextResponse.json({ error: errorData.detail || "Backend failed" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: any) {
    console.error("Resources proxy error:", error)
    return NextResponse.json({ error: "Failed to generate resources" }, { status: 500 })
  }
}
