"use client"

import { useStore } from "@/lib/store"
import { AppNav } from "@/components/app-nav"
import { AuthWrapper } from "@/components/auth-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink, Youtube, FileText } from "lucide-react"

export default function ResourcesPage() {
  const { resources } = useStore()

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-5xl px-4 py-8 lg:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Free Learning Resources
            </h1>
            <p className="mt-2 text-muted-foreground">
              Curated free resources to help you bridge your skill gaps. All
              resources are publicly available at no cost.
            </p>
          </div>

          {resources?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  No Resources Yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run a skill gap analysis first to get personalized free learning
                  resources.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Group by skill */}
              {Object.entries(
                (resources || []).reduce(
                  (acc, r) => {
                    if (!acc[r.skill]) acc[r.skill] = []
                    acc[r.skill].push(r)
                    return acc
                  },
                  {} as Record<string, typeof resources>
                )
              ).map(([skill, items]) => (
                <Card key={skill}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Badge variant="secondary">{skill}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {items.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            {resource.resourceType === "youtube" ? (
                              <Youtube className="h-5 w-5 text-destructive" />
                            ) : resource.resourceType === "documentation" ? (
                              <FileText className="h-5 w-5 text-primary" />
                            ) : (
                              <BookOpen className="h-5 w-5 text-emerald-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-medium text-foreground group-hover:text-primary">
                                {resource.title}
                              </p>
                              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {resource.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs capitalize">
                              {resource.resourceType}
                            </Badge>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthWrapper>

  )
}