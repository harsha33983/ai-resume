"use client"

import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    FileText,
    Video,
    Link as LinkIcon,
    Download,
    ExternalLink,
    BookOpen,
    Code,
    Users,
    Brain,
    GraduationCap,
    CheckCircle2,
    Database,
    Cloud,
    BarChart,
    Briefcase
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Placeholder Data - Replace with actual Google Drive links
const categories = [
    {
        id: "aptitude",
        label: "Aptitude & Logic",
        icon: Brain,
        description: "Master quantitative aptitude, logical reasoning, and data interpretation.",
        resources: [
            {
                title: "Aptitude Resources Drive",
                type: "Drive Folder",
                description: "Comprehensive collection of aptitude study materials.",
                link: "https://drive.google.com/drive/folders/1XmI6Iq_0MXJ6vq6Nkk-DcBK_y_LWNLCM",
                icon: FileText
            },
            {
                title: "Quantitative Aptitude Formula Sheet",
                type: "PDF",
                description: "Essential formulas for speed math, algebra, and geometry.",
                link: "#",
                icon: FileText
            },
            {
                title: "Logical Reasoning Practice Set",
                type: "PDF",
                description: "500+ practice questions on puzzles, seating arrangement, and more.",
                link: "#",
                icon: FileText
            }
        ]
    },
    {
        id: "technical",
        label: "Technical Core",
        icon: Code,
        description: "Deep dive into DSA, DBMS, OS, and CN concepts.",
        resources: [
            {
                title: "DSA Drive Folder",
                type: "Drive Folder",
                description: "Data Structures and Algorithms resources.",
                link: "https://drive.google.com/drive/folders/1Ay5CmkoRJ5eEGcFskULc3CHNQn5iCVs3",
                icon: Code
            },
            {
                title: "CS Fundamentals Drive",
                type: "Drive Folder",
                description: "Core computer science concepts and notes.",
                link: "https://drive.google.com/drive/folders/18FBvExqEtt9mtNKKP65f_ETdtS7nCG1G",
                icon: BookOpen
            },
            {
                title: "DBMS Resources",
                type: "Drive Folder",
                description: "Database Management Systems study materials.",
                link: "https://drive.google.com/drive/folders/1f5dmqV84E-BN1PiVWqUhNXzcVWkCbGPa",
                icon: Database
            },
            {
                title: "Cloud Computing",
                type: "Drive Folder",
                description: "Cloud computing concepts and guides.",
                link: "https://drive.google.com/drive/folders/1_iB9UnsVlOWvdjKVmtC7b8b26L2ORdVR",
                icon: Cloud
            },
            {
                title: "Data Structures & Algorithms Roadmap",
                type: "Guide",
                description: "Step-by-step guide to mastering DSA for interviews.",
                link: "#",
                icon: BookOpen
            }
        ]
    },
    {
        id: "specialized",
        label: "Specialized Tracks",
        icon: Brain,
        description: "Resources for AI, Data Analytics, and specialized fields.",
        resources: [
            {
                title: "Python AI Drive",
                type: "Drive Folder",
                description: "Artificial Intelligence resources using Python.",
                link: "https://drive.google.com/drive/folders/1D0w7UjTJlCEQNj6GXvqCgvlLPbsaCnG_",
                icon: Brain
            },
            {
                title: "Data Analytics Drive",
                type: "Drive Folder",
                description: "Data Analytics tools, techniques and resources.",
                link: "https://drive.google.com/drive/folders/1if09a9QyNfBRlAKey7If5preZ3BswudZ",
                icon: BarChart
            }
        ]
    },
    {
        id: "strategy",
        label: "Placement Strategy",
        icon: Briefcase,
        description: "Strategic preparation for placements and company-specific guides.",
        resources: [
            {
                title: "Placement Preparation Drive",
                type: "Drive Folder",
                description: "General placement preparation materials.",
                link: "https://drive.google.com/drive/folders/1iKiq-ZbI3dTN0igO8xRnyaWJF_RCf2Ym",
                icon: GraduationCap
            },
            {
                title: "Company Wise Questions",
                type: "Drive Folder",
                description: "Questions and patterns for specific companies.",
                link: "https://drive.google.com/drive/folders/1V5-NWPj1JhfBBf6wpU4rV7Ebar2ShSi5",
                icon: Briefcase
            }
        ]
    },
    {
        id: "hr",
        label: "HR & Behavioral",
        icon: Users,
        description: "Prepare for behavioral questions and leadership principles.",
        resources: [
            {
                title: "Common HR Interview Questions",
                type: "PDF",
                description: "How to answer 'Tell me about yourself', 'Weaknesses', etc.",
                link: "#",
                icon: FileText
            },
            {
                title: "STAR Method Guide",
                type: "Guide",
                description: "Structuring your answers using Situation, Task, Action, Result.",
                link: "#",
                icon: BookOpen
            }
        ]
    },
    {
        id: "resume",
        label: "Resume & Portfolio",
        icon: FileText,
        description: "Craft a ATS-friendly resume and a strong portfolio.",
        resources: [
            {
                title: "Resume Action Verbs List",
                type: "PDF",
                description: "Powerful words to make your resume stand out.",
                link: "#",
                icon: FileText
            },
            {
                title: "Portfolio Building Checklist",
                type: "Checklist",
                description: "What to include in your GitHub and project portfolio.",
                link: "#",
                icon: CheckCircle2
            }
        ]
    }
]

export default function PlacementPrepPage() {
    return (
        <div className="min-h-screen bg-background font-sans">
            <AppNav />
            <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
                <AuthWrapper>
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <GraduationCap className="w-6 h-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Placement Preparation Hub
                                </h1>
                            </div>
                            <p className="text-muted-foreground max-w-2xl">
                                A curated collection of recruiter-approved resources to help you ace your next interview.
                                Access high-quality materials directly from our repository.
                            </p>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Request New Resource
                        </Button>
                    </div>

                    <Tabs defaultValue="aptitude" className="w-full space-y-8">
                        <TabsList className="w-full justify-start h-auto p-1 bg-transparent border-b rounded-none gap-6 overflow-x-auto">
                            {categories.map((category) => {
                                const Icon = category.icon
                                return (
                                    <TabsTrigger
                                        key={category.id}
                                        value={category.id}
                                        className="gap-2 px-2 pb-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none select-none transition-all hover:text-primary"
                                    >
                                        <Icon className="w-4 h-4" />
                                        {category.label}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {categories.map((category) => (
                            <TabsContent key={category.id} value={category.id} className="space-y-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                                <div className="flex flex-col gap-2 mb-6">
                                    <h2 className="text-xl font-semibold">{category.label}</h2>
                                    <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {category.resources.map((resource, index) => {
                                        const ResourceIcon = resource.icon
                                        return (
                                            <Card key={index} className="group hover:shadow-md transition-all border-border/60 hover:border-primary/50 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="p-2 bg-secondary/50 rounded-md group-hover:bg-primary/10 transition-colors">
                                                            <ResourceIcon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                                        </div>
                                                        <Badge variant="secondary" className="text-[10px] bg-secondary/50 text-muted-foreground">
                                                            {resource.type}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-base font-medium line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                                                        {resource.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs line-clamp-2 mt-1">
                                                        {resource.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <Button variant="ghost" size="sm" className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                                                        <a href={resource.link} target="_blank" rel="noopener noreferrer">
                                                            Access Material
                                                            <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                                        </a>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </AuthWrapper>
            </main>
        </div>
    )
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
