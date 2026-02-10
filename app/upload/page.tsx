"use client"

import React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function UploadPage() {
  const router = useRouter()
  const { setResumeData } = useStore()
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [parsed, setParsed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((f: File) => {
    const maxSize = 5 * 1024 * 1024
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (f.size > maxSize) {
      setError("File size must be under 5MB")
      return
    }
    if (!allowedTypes.includes(f.type) && !f.name.endsWith(".txt")) {
      setError("Please upload a PDF, DOCX, or TXT file")
      return
    }

    setFile(f)
    setError(null)
    setParsed(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragActive(false)
      if (e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const handleParse = async () => {
    if (!file) return

    setParsing(true)
    setProgress(10)
    setError(null)

    try {
      setProgress(30)

      const formData = new FormData()
      formData.append("file", file)

      setProgress(50)

      const res = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      })

      setProgress(80)

      if (!res.ok) {
        throw new Error("Failed to parse resume")
      }

      const { data } = await res.json()
      setProgress(100)
      console.log("Parsed Data:", data) // Debugging
      setResumeData(data)
      setParsed(true)
      toast.success("Resume parsed successfully!")
      router.push("/builder")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse resume")
      toast.error("Failed to parse resume")
    } finally {
      setParsing(false)
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Upload Your Resume
            </h1>
            <p className="mt-2 text-muted-foreground">
              Upload your resume in PDF, DOCX, or TXT format. Our AI will parse and
              extract all the information automatically.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resume File</CardTitle>
              <CardDescription>
                Drag and drop your file or click to browse. Max 5MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${dragActive
                  ? "border-primary bg-primary/5"
                  : file
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary"
                  }`}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0])
                  }}
                />
                {file ? (
                  <div className="flex flex-col items-center gap-3">
                    <FileText className="h-12 w-12 text-primary" />
                    <div className="text-center">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {parsing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Parsing resume with AI...</span>
                    <span className="font-medium text-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {parsed && (
                <div className="flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Resume parsed successfully! You can now edit it in the builder.
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={handleParse}
                  disabled={!file || parsing}
                  className="flex-1"
                >
                  {parsing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Parsing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Parse Resume with AI
                    </>
                  )}
                </Button>
                {parsed && (
                  <Button variant="outline" onClick={() => router.push("/builder")}>
                    Open in Builder
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Or Paste Resume Text</CardTitle>
              <CardDescription>
                Paste your resume content directly if you prefer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PasteResumeSection />
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthWrapper>
  )
}

function PasteResumeSection() {
  const { setResumeData } = useStore()
  const router = useRouter()
  const [text, setText] = useState("")
  const [parsing, setParsing] = useState(false)

  const handleParse = async () => {
    if (!text.trim()) return
    setParsing(true)
    try {
      const res = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error("Failed to parse")
      const { data } = await res.json()
      console.log("Parsed Text Data:", data) // Debugging
      setResumeData(data)
      toast.success("Resume parsed successfully!")
      router.push("/builder")
    } catch {
      toast.error("Failed to parse resume text")
    } finally {
      setParsing(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your resume content here..."
        className="min-h-[200px] w-full rounded-md border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button onClick={handleParse} disabled={!text.trim() || parsing}>
        {parsing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Parsing...
          </>
        ) : (
          "Parse Text"
        )}
      </Button>
    </div>

  )
}