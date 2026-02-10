"use client"

import { useState } from "react"
import type { ResumeData, ExperienceItem, ProjectItem, EducationItem, CertificationItem, CustomSectionItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Trash2, Sparkles, Loader2, GripVertical, Camera } from "lucide-react"
import { toast } from "sonner"

interface Props {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function EditorPanels({ data, onChange }: Props) {
  return (
    <div className="space-y-2 p-4">
      <Accordion type="multiple" defaultValue={["personal", "summary", "skills"]} className="space-y-2">
        <PersonalSection data={data} onChange={onChange} />
        <SummarySection data={data} onChange={onChange} />
        <SkillsSection data={data} onChange={onChange} />
        <ExperienceSection data={data} onChange={onChange} />
        <ProjectsSection data={data} onChange={onChange} />
        <EducationSection data={data} onChange={onChange} />
        <CertificationsSection data={data} onChange={onChange} />
        <CustomSections data={data} onChange={onChange} />
      </Accordion>
    </div>
  )
}

function PersonalSection({ data, onChange }: Props) {
  const update = (field: keyof ResumeData["personal"], value: string) => {
    onChange({ ...data, personal: { ...data.personal, [field]: value } })
  }

  return (
    <AccordionItem value="personal" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Personal Information
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 gap-3 pb-2">
          <div>
            <Label className="text-xs text-muted-foreground">Full Name</Label>
            <Input value={data.personal.fullName || ""} onChange={(e) => update("fullName", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Job Title</Label>
            <Input value={data.personal.title || ""} onChange={(e) => update("title", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input value={data.personal.email || ""} onChange={(e) => update("email", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Phone</Label>
            <Input value={data.personal.phone || ""} onChange={(e) => update("phone", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Location</Label>
            <Input value={data.personal.location || ""} onChange={(e) => update("location", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">LinkedIn</Label>
            <Input value={data.personal.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">GitHub</Label>
            <Input value={data.personal.github || ""} onChange={(e) => update("github", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Portfolio</Label>
            <Input value={data.personal.portfolio || ""} onChange={(e) => update("portfolio", e.target.value)} className="mt-1 h-8 text-sm" />
          </div>
          <div className="col-span-2">
            <Label className="text-xs text-muted-foreground">Profile Photo</Label>
            <div className="mt-1 flex items-center gap-3">
              {data.personal.photoUrl ? (
                <img src={data.personal.photoUrl || "/placeholder.svg"} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-1 gap-2">
                <Input
                  value={data.personal.photoUrl || ""}
                  onChange={(e) => update("photoUrl", e.target.value)}
                  placeholder="Paste image URL or upload"
                  className="h-8 text-sm"
                />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          update("photoUrl", reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  <Button variant="outline" size="sm" type="button" asChild className="bg-transparent">
                    <span>Upload</span>
                  </Button>
                </label>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Photo is used in photo-enabled templates only.</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function SummarySection({ data, onChange }: Props) {
  const [improving, setImproving] = useState(false)

  const handleImprove = async () => {
    if (!data.summary) return
    setImproving(true)
    try {
      const res = await fetch("/api/ai-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullets: [data.summary], sectionType: "summary" }),
      })
      const { data: improved } = await res.json()
      if (improved?.[0]) {
        onChange({ ...data, summary: improved[0] })
        toast.success("Summary improved!")
      }
    } catch {
      toast.error("Failed to improve summary")
    } finally {
      setImproving(false)
    }
  }

  return (
    <AccordionItem value="summary" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Professional Summary
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pb-2">
          <Textarea
            value={data.summary || ""}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            rows={4}
            className="text-sm"
            placeholder="Write a professional summary..."
          />
          <Button variant="outline" size="sm" onClick={handleImprove} disabled={improving || !data.summary}>
            {improving ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
            Improve with AI
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}


function SkillsSection({ data, onChange }: Props) {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (!newSkill.trim()) return
    onChange({ ...data, skills: [...(data.skills || []), newSkill.trim()] })
    setNewSkill("")
  }

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: (data.skills || []).filter((_, i) => i !== index) })
  }

  return (
    <AccordionItem value="skills" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Skills ({(data.skills || []).length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 pb-2">
          <div className="flex flex-wrap gap-1.5">
            {(data.skills || []).map((skill, i) => (
              <span
                key={i}
                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                {skill}
                <button onClick={() => removeSkill(i)} className="ml-0.5 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="Add a skill..."
              className="h-8 text-sm"
            />
            <Button variant="outline" size="sm" onClick={addSkill}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function ExperienceSection({ data, onChange }: Props) {
  const [improving, setImproving] = useState<string | null>(null)

  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      bullets: [""],
    }
    onChange({ ...data, experience: [...(data.experience || []), newExp] })
  }

  const updateExp = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    const updated = [...(data.experience || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, experience: updated })
  }

  const removeExp = (index: number) => {
    onChange({ ...data, experience: (data.experience || []).filter((_, i) => i !== index) })
  }

  const improveBullets = async (index: number) => {
    const exp = (data.experience || [])[index]
    if (!exp.bullets.length) return
    setImproving(exp.id)
    try {
      const res = await fetch("/api/ai-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullets: exp.bullets, sectionType: "experience" }),
      })
      const { data: improved } = await res.json()
      if (improved) {
        updateExp(index, "bullets", improved)
        toast.success("Bullets improved!")
      }
    } catch {
      toast.error("Failed to improve")
    } finally {
      setImproving(null)
    }
  }

  return (
    <AccordionItem value="experience" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Experience ({(data.experience || []).length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {(data.experience || []).map((exp, i) => (
            <div key={exp.id} className="space-y-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Experience {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeExp(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={exp.role || ""} onChange={(e) => updateExp(i, "role", e.target.value)} placeholder="Job Title" className="h-8 text-sm" />
                <Input value={exp.company || ""} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Company" className="h-8 text-sm" />
                <Input value={exp.startDate || ""} onChange={(e) => updateExp(i, "startDate", e.target.value)} placeholder="Start Date" className="h-8 text-sm" />
                <Input value={exp.endDate || ""} onChange={(e) => updateExp(i, "endDate", e.target.value)} placeholder="End Date" className="h-8 text-sm" />
                <Input value={exp.location || ""} onChange={(e) => updateExp(i, "location", e.target.value)} placeholder="Location" className="col-span-2 h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Bullet Points</Label>
                {(exp.bullets || []).map((bullet, bi) => (
                  <div key={bi} className="flex gap-1">
                    <Input
                      value={bullet}
                      onChange={(e) => {
                        const bullets = [...(exp.bullets || [])]
                        bullets[bi] = e.target.value
                        updateExp(i, "bullets", bullets)
                      }}
                      className="h-8 text-sm"
                      placeholder="Describe achievement..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => {
                      const bullets = (exp.bullets || []).filter((_, j) => j !== bi)
                      updateExp(i, "bullets", bullets)
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateExp(i, "bullets", [...(exp.bullets || []), ""])}>
                    <Plus className="mr-1 h-3 w-3" /> Add Bullet
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => improveBullets(i)} disabled={improving === exp.id}>
                    {improving === exp.id ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1 h-3 w-3" />}
                    AI Improve
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addExperience} className="w-full bg-transparent">
            <Plus className="mr-1 h-3 w-3" /> Add Experience
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function ProjectsSection({ data, onChange }: Props) {
  const addProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      description: "",
      technologies: [],
      bullets: [""],
      link: "",
    }
    onChange({ ...data, projects: [...(data.projects || []), newProj] })
  }

  const updateProj = (index: number, field: keyof ProjectItem, value: string | string[]) => {
    const updated = [...(data.projects || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, projects: updated })
  }

  const removeProj = (index: number) => {
    onChange({ ...data, projects: (data.projects || []).filter((_, i) => i !== index) })
  }

  return (
    <AccordionItem value="projects" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Projects ({(data.projects || []).length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {(data.projects || []).map((proj, i) => (
            <div key={proj.id} className="space-y-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Project {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeProj(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={proj.name || ""} onChange={(e) => updateProj(i, "name", e.target.value)} placeholder="Project Name" className="h-8 text-sm" />
                <Input value={proj.link || ""} onChange={(e) => updateProj(i, "link", e.target.value)} placeholder="Project Link" className="h-8 text-sm" />
              </div>
              <Textarea value={proj.description || ""} onChange={(e) => updateProj(i, "description", e.target.value)} placeholder="Description" rows={2} className="text-sm" />
              <Input
                value={(proj.technologies || []).join(", ")}
                onChange={(e) => updateProj(i, "technologies", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
                placeholder="Technologies (comma separated)"
                className="h-8 text-sm"
              />
              <div className="space-y-1">
                {(proj.bullets || []).map((bullet, bi) => (
                  <div key={bi} className="flex gap-1">
                    <Input
                      value={bullet}
                      onChange={(e) => {
                        const bullets = [...(proj.bullets || [])]
                        bullets[bi] = e.target.value
                        updateProj(i, "bullets", bullets)
                      }}
                      className="h-8 text-sm"
                      placeholder="Bullet point..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => {
                      updateProj(i, "bullets", (proj.bullets || []).filter((_, j) => j !== bi))
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => updateProj(i, "bullets", [...(proj.bullets || []), ""])}>
                  <Plus className="mr-1 h-3 w-3" /> Add Bullet
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addProject} className="w-full bg-transparent">
            <Plus className="mr-1 h-3 w-3" /> Add Project
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function EducationSection({ data, onChange }: Props) {
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    onChange({ ...data, education: [...(data.education || []), newEdu] })
  }

  const updateEdu = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...(data.education || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, education: updated })
  }

  const removeEdu = (index: number) => {
    onChange({ ...data, education: (data.education || []).filter((_, i) => i !== index) })
  }

  return (
    <AccordionItem value="education" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Education ({(data.education || []).length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {(data.education || []).map((edu, i) => (
            <div key={edu.id} className="space-y-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Education {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeEdu(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={edu.institution || ""} onChange={(e) => updateEdu(i, "institution", e.target.value)} placeholder="Institution" className="h-8 text-sm" />
                <Input value={edu.degree || ""} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="Degree" className="h-8 text-sm" />
                <Input value={edu.field || ""} onChange={(e) => updateEdu(i, "field", e.target.value)} placeholder="Field of Study" className="h-8 text-sm" />
                <Input value={edu.gpa || ""} onChange={(e) => updateEdu(i, "gpa", e.target.value)} placeholder="GPA" className="h-8 text-sm" />
                <Input value={edu.startDate || ""} onChange={(e) => updateEdu(i, "startDate", e.target.value)} placeholder="Start Date" className="h-8 text-sm" />
                <Input value={edu.endDate || ""} onChange={(e) => updateEdu(i, "endDate", e.target.value)} placeholder="End Date" className="h-8 text-sm" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEducation} className="w-full bg-transparent">
            <Plus className="mr-1 h-3 w-3" /> Add Education
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function CertificationsSection({ data, onChange }: Props) {
  const addCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
      link: "",
    }
    onChange({ ...data, certifications: [...(data.certifications || []), newCert] })
  }

  const updateCert = (index: number, field: keyof CertificationItem, value: string) => {
    const updated = [...(data.certifications || [])]
    updated[index] = { ...updated[index], [field]: value }
    onChange({ ...data, certifications: updated })
  }

  const removeCert = (index: number) => {
    onChange({ ...data, certifications: (data.certifications || []).filter((_, i) => i !== index) })
  }

  return (
    <AccordionItem value="certifications" className="rounded-lg border border-border bg-card px-4">
      <AccordionTrigger className="text-sm font-semibold text-foreground">
        <span className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
          Certifications ({(data.certifications || []).length})
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pb-2">
          {(data.certifications || []).map((cert, i) => (
            <div key={cert.id} className="space-y-2 rounded-md border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Certification {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeCert(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={cert.name || ""} onChange={(e) => updateCert(i, "name", e.target.value)} placeholder="Certification Name" className="h-8 text-sm" />
                <Input value={cert.issuer || ""} onChange={(e) => updateCert(i, "issuer", e.target.value)} placeholder="Issuer" className="h-8 text-sm" />
                <Input value={cert.date || ""} onChange={(e) => updateCert(i, "date", e.target.value)} placeholder="Date" className="h-8 text-sm" />
                <Input value={cert.link || ""} onChange={(e) => updateCert(i, "link", e.target.value)} placeholder="Link" className="h-8 text-sm" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addCert} className="w-full bg-transparent">
            <Plus className="mr-1 h-3 w-3" /> Add Certification
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function CustomSections({ data, onChange }: Props) {
  const [newSectionTitle, setNewSectionTitle] = useState("")

  const addSection = () => {
    if (!newSectionTitle.trim()) return
    const newSection: CustomSectionItem = {
      id: `custom-${Date.now()}`,
      title: newSectionTitle.trim(),
      content: [],
    }
    onChange({ ...data, customSections: [...(data.customSections || []), newSection] })
    setNewSectionTitle("")
  }

  const removeSection = (index: number) => {
    const updated = [...(data.customSections || [])]
    updated.splice(index, 1)
    onChange({ ...data, customSections: updated })
  }

  const updateSectionTitle = (index: number, title: string) => {
    const updated = [...(data.customSections || [])]
    updated[index] = { ...updated[index], title }
    onChange({ ...data, customSections: updated })
  }

  const addItemToSection = (sectionIndex: number) => {
    const updated = [...(data.customSections || [])]
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      content: [...updated[sectionIndex].content, ""],
    }
    onChange({ ...data, customSections: updated })
  }

  const updateItem = (sectionIndex: number, itemIndex: number, value: string) => {
    const updated = [...(data.customSections || [])]
    const content = [...updated[sectionIndex].content]
    content[itemIndex] = value
    updated[sectionIndex] = { ...updated[sectionIndex], content }
    onChange({ ...data, customSections: updated })
  }

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    const updated = [...(data.customSections || [])]
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      content: updated[sectionIndex].content.filter((_, i) => i !== itemIndex),
    }
    onChange({ ...data, customSections: updated })
  }

  return (
    <>
      {(data.customSections || []).map((section, i) => (
        <AccordionItem key={section.id} value={`custom-${section.id}`} className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="text-sm font-semibold text-foreground">
            <span className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {section.title}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionTitle(i, e.target.value)}
                  className="h-8 text-sm font-semibold max-w-[200px]"
                />
                <Button variant="ghost" size="sm" onClick={() => removeSection(i)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>

              <div className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-2">
                    <Textarea
                      value={item}
                      onChange={(e) => updateItem(i, itemIndex, e.target.value)}
                      className="text-sm min-h-[60px]"
                      placeholder="Description or bullet point..."
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeItem(i, itemIndex)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addItemToSection(i)}>
                  <Plus className="mr-1 h-3 w-3" /> Add Item
                </Button>
              </div>

            </div>
          </AccordionContent>
        </AccordionItem>
      ))}

      <div className="rounded-lg border border-dashed border-border p-4">
        <h4 className="mb-2 text-sm font-medium">Add Custom Section</h4>
        <div className="flex gap-2">
          <Input
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Section Title (e.g. Volunteering)"
            className="h-9"
            onKeyDown={(e) => e.key === "Enter" && addSection()}
          />
          <Button onClick={addSection} disabled={!newSectionTitle.trim()}>
            <Plus className="mr-1 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </>
  )
}