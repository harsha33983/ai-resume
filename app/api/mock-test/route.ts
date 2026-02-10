import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { role, seniority, missingSkills } = body

    // Proxy to Python Backend
    let backendUrl = "http://127.0.0.1:8000/mock-test"

    if (process.env.VERCEL_URL) {
      backendUrl = `https://${process.env.VERCEL_URL}/api/py/mock-test`
    } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      backendUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/py/mock-test`
    }

    console.log(`Mock Test Backend URL: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, seniority, missingSkills }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Unknown backend error" }))
      console.error("Backend error:", errorData)
      return NextResponse.json({ error: errorData.detail || "Backend failed" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error: any) {
    console.error("Mock test proxy error:", error)
    return NextResponse.json({ error: "Failed to generate mock test" }, { status: 500 })
  }
}
