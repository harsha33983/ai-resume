"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useStore } from "@/lib/store"
import { defaultResumeData, getTemplate } from "@/lib/templates"
import type { ResumeData, TemplateConfig } from "@/lib/types"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { EditorPanels } from "@/components/builder/editor-panels"
import { ResumeRenderer } from "@/components/builder/resume-renderer"
import { StyleControls } from "@/components/builder/style-controls"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Save,
  Download,
  BarChart3,
  Loader2,
  Lightbulb,
  FileText,
  Paintbrush,
} from "lucide-react"
import { toast } from "sonner"

export default function BuilderPage() {
  const store = useStore()
  const [localData, setLocalData] = useState<ResumeData>(
    store.resumeData || defaultResumeData
  )
  const [localConfig, setLocalConfig] = useState<TemplateConfig>(
    store.templateConfig || getTemplate("modern-swe")
  )
  const [analyzing, setAnalyzing] = useState(false)
  const [recommending, setRecommending] = useState(false)
  const [scale, setScale] = useState(0.55)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (store.resumeData) {
      setLocalData(store.resumeData)
    }
  }, [store.resumeData])

  const handleSave = useCallback(() => {
    store.setResumeData(localData)
    store.setTemplateConfig(localConfig)
    toast.success("Resume saved!")
  }, [localData, localConfig, store])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: localData,
          templateId: localConfig.id,
        }),
      })
      const { data } = await res.json()
      store.setAnalysisResult(data)
      toast.success("Analysis complete!")
    } catch {
      toast.error("Analysis failed")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleRecommend = async () => {
    setRecommending(true)
    try {
      const res = await fetch("/api/recommend-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData: localData }),
      })
      const { data } = await res.json()
      if (data?.templateId) {
        const newConfig = getTemplate(data.templateId)
        setLocalConfig(newConfig)
        store.setSelectedTemplateId(data.templateId)
        toast.success(`Recommended: ${newConfig.name} - ${data.reasoning}`)
      }
    } catch {
      toast.error("Recommendation failed")
    } finally {
      setRecommending(false)
    }
  }

  const handleExportPDF = () => {
    window.print()
  }

  const handleTemplateSwitch = (id: string) => {
    const newConfig = getTemplate(id)
    setLocalConfig(newConfig)
    store.setSelectedTemplateId(id)
  }

  return (
    <AuthWrapper>
      <div className="flex h-screen flex-col bg-background">
        <AppNav />

        {/* Top Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <h2 className="text-sm font-semibold text-foreground">
            AI Resume Builder Studio
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRecommend} disabled={recommending}>
              {recommending ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Lightbulb className="mr-1 h-3 w-3" />}
              AI Recommend
            </Button>
            <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <BarChart3 className="mr-1 h-3 w-3" />}
              Analyze
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="mr-1 h-3 w-3" /> Save
            </Button>
            <Button size="sm" onClick={handleExportPDF}>
              <Download className="mr-1 h-3 w-3" /> Export PDF
            </Button>
          </div>
        </div>

        {/* Three-panel layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Editor */}
          <div className="w-80 shrink-0 border-r border-border lg:w-96">
            <Tabs defaultValue="content" className="flex h-full flex-col">
              <TabsList className="mx-2 mt-2 grid w-auto grid-cols-2">
                <TabsTrigger value="content" className="gap-1.5 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="style" className="gap-1.5 text-xs">
                  <Paintbrush className="h-3.5 w-3.5" />
                  Style
                </TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <EditorPanels data={localData} onChange={setLocalData} />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="style" className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <StyleControls
                    config={localConfig}
                    onChange={setLocalConfig}
                    onTemplateSwitch={handleTemplateSwitch}
                  />
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Center - Canvas */}
          <div className="flex-1 overflow-auto bg-muted/50 p-6">
            <div className="mb-4 flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Zoom:</span>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-xs text-muted-foreground">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex justify-center">
              <div ref={canvasRef} className="print-resume">
                <ResumeRenderer data={localData} config={localConfig} scale={scale} />
              </div>
            </div>
          </div>
        </div>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            .print-resume, .print-resume * { visibility: visible; }
            .print-resume {
              position: absolute;
              left: 0;
              top: 0;
            }
            #resume-canvas {
              transform: none !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </div>
    </AuthWrapper>
  )
}
