
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    const isProd = process.env.NODE_ENV === "production"
    const backendUrl = isProd
      ? "https://" + process.env.VERCEL_URL + "/api/py"
      : "http://127.0.0.1:8000"

    if (contentType.includes("application/json")) {
      // Handle Text Paste
      const body = await req.json()
      if (!body.text) {
        return Response.json({ error: "No text provided" }, { status: 400 })
      }

      console.log(`Forwarding text parse request to ${backendUrl}/parse-text`)

      const backendRes = await fetch(`${backendUrl}/parse-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: body.text }),
      })

      if (!backendRes.ok) {
        const errorText = await backendRes.text()
        console.error("Backend text parse error:", errorText)
        return Response.json({ error: `Backend failed: ${backendRes.statusText}` }, { status: backendRes.status })
      }

      const data = await backendRes.json()
      console.log("Backend response data (text):", JSON.stringify(data).substring(0, 100) + "...")
      return Response.json({ data })

    } else {
      // Handle File Upload (FormData)
      const formData = await req.formData()
      const file = formData.get("file")

      if (!file) {
        return Response.json({ error: "No file uploaded" }, { status: 400 })
      }

      const backendFormData = new FormData()
      backendFormData.append("file", file)

      console.log(`Forwarding file parse request to ${backendUrl}/parse-resume`)

      const backendRes = await fetch(`${backendUrl}/parse-resume`, {
        method: "POST",
        body: backendFormData,
      })

      if (!backendRes.ok) {
        const errorText = await backendRes.text()
        console.error("Backend file parse error:", errorText)
        return Response.json({ error: `Backend failed: ${backendRes.statusText}` }, { status: backendRes.status })
      }

      const data = await backendRes.json()
      console.log("Backend response data (file):", JSON.stringify(data).substring(0, 100) + "...")
      return Response.json({ data })
    }

  } catch (error: any) {
    console.error("Proxy error:", error)
    return Response.json(
      { error: "Internal server error during parsing proxy" },
      { status: 500 }
    )
  }
}
