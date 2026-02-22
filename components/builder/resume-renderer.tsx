"use client"

import React from "react"

import type { ResumeData, TemplateConfig, BlockType, SkillCategory } from "@/lib/types"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  data: ResumeData
  config: TemplateConfig
  scale?: number
}

export function ResumeRenderer({ data, config, scale = 1 }: Props) {
  const styles = {
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize.body}px`,
    lineHeight: config.spacing.lineHeight,
    color: config.colors.text,
    backgroundColor: config.colors.background,
    backgroundImage: config.decoration === "gradient"
      ? `linear-gradient(to bottom right, ${config.colors.background}, ${config.colors.background}, ${config.colors.accent}10)`
      : config.backgroundImage || "none",
  }

  const renderBlock = (blockType: BlockType) => {
    if (!config.sectionVisibility[blockType]) return null

    switch (blockType) {
      case "header":
        return <HeaderBlock key="header" data={data} config={config} />
      case "summary":
        return data.summary ? (
          <SectionWrapper key="summary" title="Summary" config={config}>
            <p style={{ fontSize: `${config.fontSize.body}px` }}>{data.summary}</p>
          </SectionWrapper>
        ) : null
      case "experience":
        return (data.experience || []).length > 0 ? (
          <SectionWrapper key="experience" title="Experience" config={config}>
            {(data.experience || []).map((exp) => (
              <div key={exp.id} style={{ marginBottom: `${config.spacing.itemGap}px` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: `${config.fontSize.subheading}px`, fontWeight: 600, color: config.colors.heading }}>
                      {exp.role}
                    </p>
                    <p style={{ fontSize: `${config.fontSize.body}px`, color: config.colors.secondary }}>
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </p>
                  </div>
                  <p style={{ fontSize: `${config.fontSize.small}px`, color: config.colors.secondary, whiteSpace: "nowrap" }}>
                    {exp.startDate} - {exp.endDate}
                  </p>
                </div>
                <ul className="ml-4 mt-1 list-disc" style={{ fontSize: `${config.fontSize.body}px` }}>
                  {(exp.bullets || []).map((b, i) => (
                    <li key={i} className="mt-0.5">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </SectionWrapper>
        ) : null
      case "projects":
        return (data.projects || []).length > 0 ? (
          <SectionWrapper key="projects" title="Projects" config={config}>
            {(data.projects || []).map((proj) => (
              <div key={proj.id} style={{ marginBottom: `${config.spacing.itemGap}px` }}>
                <div className="flex items-start justify-between">
                  <p style={{ fontSize: `${config.fontSize.subheading}px`, fontWeight: 600, color: config.colors.heading }}>
                    {proj.name}
                  </p>
                  {proj.link && (
                    <span style={{ fontSize: `${config.fontSize.small}px`, color: config.colors.accent }}>{proj.link}</span>
                  )}
                </div>
                {proj.description && (
                  <p style={{ fontSize: `${config.fontSize.body}px`, color: config.colors.secondary }}>{proj.description}</p>
                )}
                {(proj.technologies || []).length > 0 && (
                  <p style={{ fontSize: `${config.fontSize.small}px`, color: config.colors.accent, marginTop: 2 }}>
                    {(proj.technologies || []).join(" | ")}
                  </p>
                )}
                <ul className="ml-4 mt-1 list-disc" style={{ fontSize: `${config.fontSize.body}px` }}>
                  {(proj.bullets || []).map((b, i) => (
                    <li key={i} className="mt-0.5">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </SectionWrapper>
        ) : null
      case "skills":
        // Handle both legacy string[] and new SkillCategory[]
        const skillsData = (data.skills || [])
        const isLegacy = skillsData.length > 0 && typeof skillsData[0] === "string"
        const categories = isLegacy
          ? [{ id: "gen", name: "", items: skillsData as unknown as string[] }]
          : (skillsData as unknown as SkillCategory[])

        return categories.length > 0 ? (
          <SectionWrapper key="skills" title="Skills" config={config}>
            <div className="space-y-3">
              {categories.map((cat, i) => (
                <div key={i}>
                  {cat.name && (
                    <h4
                      style={{
                        fontSize: `${config.fontSize.subheading}px`,
                        fontWeight: 600,
                        color: config.colors.secondary,
                        marginBottom: 4,
                      }}
                    >
                      {cat.name}
                    </h4>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {cat.items.map((skill: string, si: number) => (
                      <span
                        key={si}
                        className="inline-block rounded px-1.5 py-0.5"
                        style={{
                          fontSize: `${config.fontSize.small}px`,
                          backgroundColor: `${config.colors.accent}15`,
                          color: config.colors.accent,
                          border: `1px solid ${config.colors.accent}30`,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        ) : null
      case "education":
        return (data.education || []).length > 0 ? (
          <SectionWrapper key="education" title="Education" config={config}>
            {(data.education || []).map((edu) => (
              <div key={edu.id} style={{ marginBottom: `${config.spacing.itemGap}px` }}>
                <p style={{ fontSize: `${config.fontSize.subheading}px`, fontWeight: 600, color: config.colors.heading }}>
                  {edu.degree} in {edu.field}
                </p>
                <p style={{ fontSize: `${config.fontSize.body}px`, color: config.colors.secondary }}>
                  {edu.institution}
                </p>
                <p style={{ fontSize: `${config.fontSize.small}px`, color: config.colors.secondary }}>
                  {edu.startDate} - {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </SectionWrapper>
        ) : null
      case "certifications":
        return (data.certifications || []).length > 0 ? (
          <SectionWrapper key="certifications" title="Certifications" config={config}>
            {(data.certifications || []).map((cert) => (
              <div key={cert.id} style={{ marginBottom: `${config.spacing.itemGap}px` }}>
                <p style={{ fontSize: `${config.fontSize.subheading}px`, fontWeight: 600, color: config.colors.heading }}>
                  {cert.name}
                </p>
                <p style={{ fontSize: `${config.fontSize.small}px`, color: config.colors.secondary }}>
                  {cert.issuer} {cert.date && `| ${cert.date}`}
                </p>
              </div>
            ))}
          </SectionWrapper>
        ) : null
      case "custom":
        return (data.customSections || []).map((sec) => (
          <SectionWrapper key={sec.id} title={sec.title} config={config}>
            <ul className="ml-4 list-disc" style={{ fontSize: `${config.fontSize.body}px` }}>
              {(sec.content || []).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </SectionWrapper>
        ))
      default:
        return null
    }
  }

  const renderContent = () => {
    if (config.layout.columns === 2) {
      const sidebarSections = config.layout.sidebarSections || []
      const mainSections = config.layout.mainSections || []
      const isLeft = config.layout.sidebarPosition === "left"

      const sidebar = (
        <div className="space-y-2" style={{ width: "35%" }}>
          {sidebarSections.map(renderBlock)}
        </div>
      )

      const main = (
        <div className="space-y-2" style={{ flex: 1 }}>
          {mainSections.map(renderBlock)}
        </div>
      )

      return (
        <div>
          {renderBlock("header")}
          <div className="flex gap-4" style={{ marginTop: `${config.spacing.sectionGap}px` }}>
            {isLeft ? (
              <>
                {sidebar}
                {main}
              </>
            ) : (
              <>
                {main}
                {sidebar}
              </>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-1">
        {config.sectionOrder.map(renderBlock)}
      </div>
    )
  }

  return (
    <div
      id="resume-canvas"
      style={{
        ...styles,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 16mm",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      {renderContent()}
    </div>
  )
}

function PhotoAvatar({ url, size = 80, accent }: { url: string; size?: number; accent: string }) {
  if (!url) {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: `${accent}20`,
          border: `3px solid ${accent}`,
        }}
      >
        <span style={{ fontSize: size * 0.35, color: accent, fontWeight: 700 }}>?</span>
      </div>
    )
  }
  return (
    <img
      src={url || "/placeholder.svg"}
      alt="Profile"
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size, border: `3px solid ${accent}` }}
    />
  )
}

function HeaderBlock({ data, config }: { data: ResumeData; config: TemplateConfig }) {
  const showPhoto = config.hasPhoto && (data.personal.photoUrl || config.hasPhoto)
  const photoPos = config.photoPosition || "left"
  const variant = config.headerVariant || "default"

  // Common contact items
  const contactItems = (
    <div
      className={cn("mt-2 flex flex-wrap items-center gap-3", variant === "banner" ? "text-white/90 justify-center" : "text-slate-500 justify-center")}
      style={{
        fontSize: `${config.fontSize.small}px`,
        color: variant === "banner" ? "#ffffffdd" : config.colors.secondary
      }}
    >
      {data.personal.email && (
        <span className="flex items-center gap-1">
          <Mail style={{ width: 10, height: 10 }} />
          {data.personal.email}
        </span>
      )}
      {data.personal.phone && (
        <span className="flex items-center gap-1">
          <Phone style={{ width: 10, height: 10 }} />
          {data.personal.phone}
        </span>
      )}
      {data.personal.location && (
        <span className="flex items-center gap-1">
          <MapPin style={{ width: 10, height: 10 }} />
          {data.personal.location}
        </span>
      )}
      {data.personal.linkedin && (
        <span className="flex items-center gap-1">
          <Linkedin style={{ width: 10, height: 10 }} />
          {data.personal.linkedin}
        </span>
      )}
      {data.personal.github && (
        <span className="flex items-center gap-1">
          <Github style={{ width: 10, height: 10 }} />
          {data.personal.github}
        </span>
      )}
      {data.personal.portfolio && (
        <span className="flex items-center gap-1">
          <Globe style={{ width: 10, height: 10 }} />
          {data.personal.portfolio}
        </span>
      )}
    </div>
  )



  // Banner Variant (for Creative Canvas)
  if (variant === "banner") {
    return (
      <div
        className="text-center relative overflow-hidden rounded-xl mb-6 p-8"
        style={{
          backgroundColor: config.colors.heading,
          color: "#ffffff",
          marginBottom: `${config.spacing.sectionGap}px`
        }}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {showPhoto && (
          <div className="mb-4 flex justify-center">
            <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
              <PhotoAvatar url={data.personal.photoUrl} size={100} accent="#ffffff" />
            </div>
          </div>
        )}

        <h1 style={{ fontSize: `${config.fontSize.name}px`, fontWeight: 800, fontFamily: config.headingFont, color: "#ffffff", letterSpacing: "-0.02em" }}>
          {data.personal.fullName || "Your Name"}
        </h1>

        {data.personal.title && (
          <p style={{ fontSize: `${config.fontSize.heading}px`, color: "#ffffffcc", marginTop: 8, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>
            {data.personal.title}
          </p>
        )}

        <div className="mt-6 pt-6 border-t border-white/20">
          {contactItems}
        </div>
      </div>
    )
  }

  // Modern Variant (for Modern Gradient)
  if (variant === "modern") {
    return (
      <div className="flex items-center gap-6 pb-6 border-b" style={{ marginBottom: `${config.spacing.sectionGap}px`, borderColor: config.colors.border }}>
        {showPhoto && (
          <PhotoAvatar url={data.personal.photoUrl} size={90} accent={config.colors.accent} />
        )}

        <div className="flex-1">
          <h1 style={{ fontSize: `${config.fontSize.name}px`, fontWeight: 800, fontFamily: config.headingFont, color: config.colors.primary }}>
            {data.personal.fullName || "Your Name"}
          </h1>
          {data.personal.title && (
            <p className="font-bold flex items-center gap-2" style={{ fontSize: `${config.fontSize.subheading}px`, color: config.colors.accent }}>
              {data.personal.title}
              <span className="h-0.5 flex-1 bg-gradient-to-r from-current to-transparent opacity-50 block" />
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {contactItems}
          </div>
        </div>
      </div>
    )
  }

  // Center photo layout - photo above name
  if (showPhoto && photoPos === "center") {
    return (
      <div className="text-center" style={{ marginBottom: `${config.spacing.sectionGap}px` }}>
        <div className="mb-3 flex justify-center">
          <PhotoAvatar url={data.personal.photoUrl} size={90} accent={config.colors.accent} />
        </div>
        <h1 style={{ fontSize: `${config.fontSize.name}px`, fontWeight: 700, color: config.colors.primary, fontFamily: config.headingFont }}>
          {data.personal.fullName || "Your Name"}
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: `${config.fontSize.subheading}px`, color: config.colors.secondary, marginTop: 4 }}>
            {data.personal.title}
          </p>
        )}
        {contactItems}
      </div>
    )
  }

  // Left or Right photo layout - photo beside name
  if (showPhoto && (photoPos === "left" || photoPos === "right")) {
    const photoElement = <PhotoAvatar url={data.personal.photoUrl} size={80} accent={config.colors.accent} />

    const textElement = (
      <div className="flex-1" style={{ textAlign: photoPos === "left" ? "left" : "right" }}>
        <h1 style={{ fontSize: `${config.fontSize.name}px`, fontWeight: 700, color: config.colors.primary, fontFamily: config.headingFont }}>
          {data.personal.fullName || "Your Name"}
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: `${config.fontSize.subheading}px`, color: config.colors.secondary, marginTop: 4 }}>
            {data.personal.title}
          </p>
        )}
      </div>
    )

    return (
      <div style={{ marginBottom: `${config.spacing.sectionGap}px` }}>
        <div className="flex items-center gap-4">
          {photoPos === "left" ? (
            <>
              {photoElement}
              {textElement}
            </>
          ) : (
            <>
              {textElement}
              {photoElement}
            </>
          )}
        </div>
        <div style={{ textAlign: "center" }}>{contactItems}</div>
      </div>
    )
  }

  // Default no-photo header
  return (
    <div className="text-center" style={{ marginBottom: `${config.spacing.sectionGap}px` }}>
      <h1 style={{ fontSize: `${config.fontSize.name}px`, fontWeight: 700, color: config.colors.primary, fontFamily: config.headingFont }}>
        {data.personal.fullName || "Your Name"}
      </h1>
      {data.personal.title && (
        <p style={{ fontSize: `${config.fontSize.subheading}px`, color: config.colors.secondary, marginTop: 4 }}>
          {data.personal.title}
        </p>
      )}
      {contactItems}
    </div>
  )
}

function SectionWrapper({ title, config, children }: { title: string; config: TemplateConfig; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: `${config.spacing.sectionGap}px` }}>
      <h2
        style={{
          fontSize: `${config.fontSize.heading}px`,
          fontWeight: 700,
          color: config.colors.heading,
          fontFamily: config.headingFont,
          borderBottom: `2px solid ${config.colors.accent}`,
          paddingBottom: 4,
          marginBottom: `${config.spacing.itemGap}px`,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
