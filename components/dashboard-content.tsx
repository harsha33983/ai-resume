"use client"

import Link from "next/link"
import { useStore } from "@/lib/store"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Upload,
    FileText,
    BarChart3,
    Target,
    BookOpen,
    Brain,
    Briefcase,
    ArrowRight,
    CheckCircle2,
    Circle,
    GraduationCap,
} from "lucide-react"

const steps = [
    {
        key: "upload",
        label: "Upload Resume",
        description: "Upload or paste your resume to get started",
        href: "/upload",
        icon: Upload,
    },
    {
        key: "builder",
        label: "Build & Edit",
        description: "Customize your resume with the visual builder",
        href: "/builder",
        icon: FileText,
    },
    {
        key: "analysis",
        label: "AI Analysis",
        description: "Get ATS score and improvement suggestions",
        href: "/analysis",
        icon: BarChart3,
    },
    {
        key: "skillgap",
        label: "Skill Gap",
        description: "Identify missing skills for your target role",
        href: "/skill-gap",
        icon: Target,
    },
    {
        key: "resources",
        label: "Learn & Grow",
        description: "Free curated resources to bridge your gaps",
        href: "/resources",
        icon: BookOpen,
    },
    {
        key: "mocktest",
        label: "Mock Test",
        description: "Practice interview questions tailored to you",
        href: "/mock-test",
        icon: Brain,
    },
    {
        key: "jobs",
        label: "Job Board",
        description: "Browse aggregated jobs and apply on company websites",
        href: "/jobs",
        icon: Briefcase,
    },
    {
        key: "placement",
        label: "Placement Hub",
        description: "Curated materials to ace your placements",
        href: "/placement-prep",
        icon: GraduationCap,
    },
]

export function DashboardContent() {
    const {
        resumeData,
        analysisResult,
        skillGapResult,
        resources,
        mockTest,
        testEvaluation,
    } = useStore()

    const completedSteps = [
        resumeData !== null,
        resumeData !== null,
        analysisResult !== null,
        skillGapResult !== null,
        resources.length > 0,
        testEvaluation !== null,
        true, // Jobs board is always available
        true, // Placement Hub is always available
    ]

    const completedCount = completedSteps.filter(Boolean).length
    const progressPercent = Math.round((completedCount / steps.length) * 100)

    return (
        <>
            {/* Journey Progress */}
            <section className="mb-10">
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                    Your Journey
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, i) => {
                        const Icon = step.icon
                        const done = completedSteps[i]
                        return (
                            <Link key={step.key} href={step.href}>
                                <Card
                                    className={`group cursor-pointer transition-all hover:shadow-md ${done ? "border-primary/30 bg-primary/5" : ""
                                        }`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-lg ${done
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-secondary text-muted-foreground"
                                                    }`}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            {done ? (
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            ) : (
                                                <Circle className="h-5 w-5 text-border" />
                                            )}
                                        </div>
                                        <CardTitle className="mt-3 text-sm group-hover:text-primary">
                                            {step.label}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-xs">
                                            {step.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* Quick Stats */}
            {(analysisResult || skillGapResult || testEvaluation) && (
                <section className="mb-10">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Quick Stats
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {analysisResult && (
                            <>
                                <StatCard
                                    label="Overall Score"
                                    value={analysisResult.overallScore}
                                    suffix="/100"
                                />
                                <StatCard
                                    label="ATS Score"
                                    value={analysisResult.atsScore}
                                    suffix="/100"
                                />
                            </>
                        )}
                        {skillGapResult && (
                            <StatCard
                                label="Skill Match"
                                value={skillGapResult.overallMatch}
                                suffix="%"
                            />
                        )}
                        {testEvaluation && (
                            <StatCard
                                label="Test Score"
                                value={testEvaluation.totalScore}
                                suffix="/100"
                            />
                        )}
                    </div>
                </section>
            )}

            {/* Skill Gap Summary */}
            {skillGapResult && (
                <section className="mb-10">
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Skill Overview
                    </h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Target: {skillGapResult.targetRole}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {skillGapResult.matchedSkills.length} matched,{" "}
                                {skillGapResult.missingSkills.length} missing,{" "}
                                {skillGapResult.weakSkills.length} weak
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={skillGapResult.overallMatch} className="h-3" />
                            <div className="mt-4 flex flex-wrap gap-1.5">
                                {skillGapResult.matchedSkills.slice(0, 8).map((s) => (
                                    <Badge key={s} variant="secondary" className="bg-emerald-50 text-emerald-700 text-xs">
                                        {s}
                                    </Badge>
                                ))}
                                {skillGapResult.missingSkills.slice(0, 6).map((s) => (
                                    <Badge key={s} variant="outline" className="border-destructive/30 text-destructive text-xs">
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link href="/skill-gap">
                                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
                                        View Full Analysis
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Badge>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </>
    )
}

function StatCard({
    label,
    value,
    suffix,
}: {
    label: string
    value: number
    suffix: string
}) {
    const color =
        value >= 80
            ? "text-emerald-600"
            : value >= 60
                ? "text-amber-500"
                : "text-destructive"

    return (
        <Card>
            <CardContent className="py-5">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <div className="mt-1 flex items-baseline gap-0.5">
                    <span className={`text-2xl font-bold ${color}`}>{value}</span>
                    <span className="text-sm text-muted-foreground">{suffix}</span>
                </div>
                <Progress value={value} className="mt-2 h-1.5" />
            </CardContent>
        </Card>
    )
}