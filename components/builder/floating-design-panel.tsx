"use client"

import { useState } from "react"
import { TemplateConfig } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Settings2, X, Move, Type, Palette, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingDesignPanelProps {
    config: TemplateConfig
    onChange: (config: TemplateConfig) => void
}

export function FloatingDesignPanel({ config, onChange }: FloatingDesignPanelProps) {
    const [isOpen, setIsOpen] = useState(false)

    const updateSpacing = (key: keyof typeof config.spacing, value: number) => {
        onChange({
            ...config,
            spacing: { ...config.spacing, [key]: value }
        })
    }

    const updateFontSize = (key: keyof typeof config.fontSize, value: number) => {
        onChange({
            ...config,
            fontSize: { ...config.fontSize, [key]: value }
        })
    }

    const updateColor = (key: keyof typeof config.colors, value: string) => {
        onChange({
            ...config,
            colors: { ...config.colors, [key]: value }
        })
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 rounded-full h-14 w-14 shadow-xl border-2 border-white bg-primary hover:bg-primary/90 transition-all hover:scale-110"
            >
                <Settings2 className="w-6 h-6 text-white" />
            </Button>
        )
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in slide-in-from-bottom-5 fade-in duration-300 flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 rounded-t-xl">
                <div className="flex items-center gap-2 font-bold text-sm">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Design Studio
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Spacing Controls */}
                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        <Layout className="w-3 h-3" /> Layout & Spacing
                    </h4>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Section Gap</span>
                                <span className="text-slate-500">{config.spacing.sectionGap}px</span>
                            </div>
                            <Slider
                                value={[config.spacing.sectionGap]}
                                min={8}
                                max={48}
                                step={2}
                                onValueChange={([val]) => updateSpacing("sectionGap", val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Item Gap</span>
                                <span className="text-slate-500">{config.spacing.itemGap}px</span>
                            </div>
                            <Slider
                                value={[config.spacing.itemGap]}
                                min={4}
                                max={24}
                                step={1}
                                onValueChange={([val]) => updateSpacing("itemGap", val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Line Height</span>
                                <span className="text-slate-500">{config.spacing.lineHeight}</span>
                            </div>
                            <Slider
                                value={[config.spacing.lineHeight]}
                                min={1}
                                max={2}
                                step={0.05}
                                onValueChange={([val]) => updateSpacing("lineHeight", val)}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-zinc-800" />

                {/* Typography Controls */}
                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        <Type className="w-3 h-3" /> Typography
                    </h4>
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Name Size</span>
                                <span className="text-slate-500">{config.fontSize.name}px</span>
                            </div>
                            <Slider
                                value={[config.fontSize.name]}
                                min={18}
                                max={64}
                                step={1}
                                onValueChange={([val]) => updateFontSize("name", val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Heading Size</span>
                                <span className="text-slate-500">{config.fontSize.heading}px</span>
                            </div>
                            <Slider
                                value={[config.fontSize.heading]}
                                min={12}
                                max={32}
                                step={1}
                                onValueChange={([val]) => updateFontSize("heading", val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Body Size</span>
                                <span className="text-slate-500">{config.fontSize.body}px</span>
                            </div>
                            <Slider
                                value={[config.fontSize.body]}
                                min={8}
                                max={16}
                                step={0.5}
                                onValueChange={([val]) => updateFontSize("body", val)}
                            />
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-zinc-800" />

                {/* Color Controls */}
                <div className="space-y-4">
                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        <Palette className="w-3 h-3" /> Theme Colors
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs">Primary</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: config.colors.primary }} />
                                <Input
                                    type="color"
                                    value={config.colors.primary}
                                    onChange={(e) => updateColor("primary", e.target.value)}
                                    className="w-full h-8 p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Accent</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: config.colors.accent }} />
                                <Input
                                    type="color"
                                    value={config.colors.accent}
                                    onChange={(e) => updateColor("accent", e.target.value)}
                                    className="w-full h-8 p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Heading</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: config.colors.heading }} />
                                <Input
                                    type="color"
                                    value={config.colors.heading}
                                    onChange={(e) => updateColor("heading", e.target.value)}
                                    className="w-full h-8 p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Text</Label>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: config.colors.text }} />
                                <Input
                                    type="color"
                                    value={config.colors.text}
                                    onChange={(e) => updateColor("text", e.target.value)}
                                    className="w-full h-8 p-1 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-3 border-t border-slate-100 dark:border-zinc-800 text-center bg-slate-50/50 rounded-b-xl">
                <p className="text-[10px] text-slate-400">Edits appear in specific templates only.</p>
            </div>
        </div>
    )
}
