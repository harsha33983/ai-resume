import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        // Use Render backend as default
        const backendBase = "https://ai-resume-qzt9.onrender.com"
        const backendUrl = process.env.RESUME_BACKEND_URL || backendBase

        console.log(`Forwarding interview prep request to ${backendUrl}/interview-prep for role: ${body.role}`)

        const backendRes = await fetch(`${backendUrl}/interview-prep`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })

        if (!backendRes.ok) {
            const errorText = await backendRes.text()
            console.error("Backend interview prep error:", errorText)
            return NextResponse.json({ error: `Backend failed: ${backendRes.statusText}`, details: errorText }, { status: backendRes.status })
        }

        const data = await backendRes.json()
        return NextResponse.json(data)

    } catch (error: any) {
        console.error("Interview Prep Proxy Error:", error)
        return NextResponse.json({ error: "Internal server error during interview proxy", details: String(error) }, { status: 500 })
    }
}
