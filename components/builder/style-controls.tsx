"use client"

import type { TemplateConfig, BlockType } from "@/lib/types"
import { templates } from "@/lib/templates"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"

interface Props {
  config: TemplateConfig
  onChange: (config: TemplateConfig) => void
  onTemplateSwitch: (id: string) => void
}

const fontOptions = [
  { value: "'Inter', sans-serif", label: "Inter" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "'Roboto Mono', monospace", label: "Roboto Mono" },
  { value: "'Lato', sans-serif", label: "Lato" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
]

const sectionLabels: Record<BlockType, string> = {
  header: "Header",
  summary: "Summary",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certifications: "Certifications",
  custom: "Custom Sections",
}

export function StyleControls({ config, onChange, onTemplateSwitch }: Props) {
  const updateColor = (key: keyof TemplateConfig["colors"], value: string) => {
    onChange({ ...config, colors: { ...config.colors, [key]: value } })
  }

  const updateFontSize = (key: keyof TemplateConfig["fontSize"], value: number) => {
    onChange({ ...config, fontSize: { ...config.fontSize, [key]: value } })
  }

  const toggleVisibility = (section: BlockType) => {
    onChange({
      ...config,
      sectionVisibility: {
        ...config.sectionVisibility,
        [section]: !config.sectionVisibility[section],
      },
    })
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Template
        </Label>
        <Select value={config.id} onValueChange={onTemplateSwitch}>
          <SelectTrigger className="mt-2 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Colors
        </Label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["primary", "accent", "text", "heading", "background", "border"] as const).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={config.colors[key]}
                onChange={(e) => updateColor(key, e.target.value)}
                className="h-7 w-7 cursor-pointer rounded border border-border"
              />
              <span className="text-xs capitalize text-muted-foreground">{key}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Typography
        </Label>
        <div className="mt-2 space-y-3">
          <div>
            <span className="text-xs text-muted-foreground">Body Font</span>
            <Select value={config.fontFamily} onValueChange={(v) => onChange({ ...config, fontFamily: v })}>
              <SelectTrigger className="mt-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Heading Font</span>
            <Select value={config.headingFont} onValueChange={(v) => onChange({ ...config, headingFont: v })}>
              <SelectTrigger className="mt-1 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map((f) => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Name Size: {config.fontSize.name}px</span>
            <Slider
              value={[config.fontSize.name]}
              onValueChange={([v]) => updateFontSize("name", v)}
              min={18}
              max={40}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Heading Size: {config.fontSize.heading}px</span>
            <Slider
              value={[config.fontSize.heading]}
              onValueChange={([v]) => updateFontSize("heading", v)}
              min={10}
              max={24}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Body Size: {config.fontSize.body}px</span>
            <Slider
              value={[config.fontSize.body]}
              onValueChange={([v]) => updateFontSize("body", v)}
              min={8}
              max={16}
              step={0.5}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Spacing
        </Label>
        <div className="mt-2 space-y-3">
          <div>
            <span className="text-xs text-muted-foreground">Section Gap: {config.spacing.sectionGap}px</span>
            <Slider
              value={[config.spacing.sectionGap]}
              onValueChange={([v]) => onChange({ ...config, spacing: { ...config.spacing, sectionGap: v } })}
              min={6}
              max={30}
              step={1}
              className="mt-1"
            />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Line Height: {config.spacing.lineHeight}</span>
            <Slider
              value={[config.spacing.lineHeight]}
              onValueChange={([v]) => onChange({ ...config, spacing: { ...config.spacing, lineHeight: v } })}
              min={1.1}
              max={2}
              step={0.05}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Section Visibility
        </Label>
        <div className="mt-2 space-y-2">
          {(Object.keys(sectionLabels) as BlockType[]).map((section) => (
            <div key={section} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{sectionLabels[section]}</span>
              <Switch
                checked={config.sectionVisibility[section]}
                onCheckedChange={() => toggleVisibility(section)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
