"use client"

import { useStore } from "@/lib/store"
import { templates, defaultResumeData } from "@/lib/templates"
import { AppNav } from "@/components/app-nav"
import { ResumeRenderer } from "@/components/builder/resume-renderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"

const sampleData = {
  ...defaultResumeData,
  personal: {
    fullName: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    portfolio: "alexjohnson.dev",
    title: "Full Stack Developer",
    photoUrl: "",
  },
  summary:
    "Experienced full stack developer with 4+ years building scalable web applications using React, Node.js, and cloud technologies. Passionate about clean code and delivering impactful user experiences.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "Tailwind CSS",
    "Git",
  ],
  experience: [
    {
      id: "exp-1",
      company: "TechCorp",
      role: "Senior Frontend Developer",
      startDate: "Jan 2022",
      endDate: "Present",
      location: "San Francisco, CA",
      bullets: [
        "Led the redesign of the main product dashboard, improving user engagement by 35%",
        "Implemented a micro-frontend architecture serving 500K+ monthly active users",
        "Mentored 3 junior developers through code reviews and pair programming sessions",
      ],
    },
    {
      id: "exp-2",
      company: "StartupXYZ",
      role: "Full Stack Developer",
      startDate: "Jun 2020",
      endDate: "Dec 2021",
      location: "Remote",
      bullets: [
        "Built RESTful APIs handling 10K+ daily requests with Node.js and Express",
        "Developed a real-time notification system using WebSockets and Redis",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Code Review Tool",
      description: "An automated code review tool powered by OpenAI GPT-4",
      technologies: ["Next.js", "OpenAI API", "PostgreSQL", "Docker"],
      bullets: [
        "Reduced code review time by 40% for teams of 5-10 developers",
        "Integrated with GitHub Actions for automated PR reviews",
      ],
      link: "github.com/alexj/ai-reviewer",
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "UC Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.8",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      link: "",
    },
  ],
  customSections: [],
}

export default function TemplatesPage() {
  const store = useStore()
  const router = useRouter()

  const selectTemplate = (id: string) => {
    store.setSelectedTemplateId(id)
    router.push("/builder")
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Resume Templates
          </h1>
          <p className="mt-2 text-muted-foreground">
            Choose from 10 professionally designed templates, including 4 with
            photo support. Each is fully customizable in the builder.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => {
            const isSelected = store.selectedTemplateId === template.id
            return (
              <Card
                key={template.id}
                className={`overflow-hidden transition-all hover:shadow-md ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="mt-1 text-xs">
                        {template.description}
                      </CardDescription>
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {template.layout.columns === 2 ? "Two Column" : "Single Column"}
                    </Badge>
                    {template.hasPhoto && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs hover:bg-emerald-100">
                        Photo
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="mb-3 overflow-hidden rounded-md border border-border bg-card" style={{ height: 280 }}>
                    <div className="pointer-events-none origin-top-left">
                      <ResumeRenderer
                        data={sampleData}
                        config={template}
                        scale={0.28}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => selectTemplate(template.id)}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    {isSelected ? "Selected" : "Use Template"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
