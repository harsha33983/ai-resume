// ========== Resume Data Schema ==========
export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  title: string
  photoUrl: string
}

export interface ExperienceItem {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  location: string
  bullets: string[]
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  technologies: string[]
  bullets: string[]
  link: string
}

export interface EducationItem {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

export interface CertificationItem {
  id: string
  name: string
  issuer: string
  date: string
  link: string
}

export interface CustomSectionItem {
  id: string
  title: string
  content: string[]
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  skills: string[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  education: EducationItem[]
  certifications: CertificationItem[]
  customSections: CustomSectionItem[]
}

// ========== Template Configuration ==========
export type BlockType =
  | "header"
  | "summary"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "certifications"
  | "custom"

export interface TemplateConfig {
  id: string
  name: string
  description: string
  category: string
  fontFamily: string
  headingFont: string
  fontSize: {
    name: number
    heading: number
    subheading: number
    body: number
    small: number
  }
  spacing: {
    sectionGap: number
    itemGap: number
    lineHeight: number
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
    heading: string
    border: string
  }
  hasPhoto: boolean
  photoPosition?: "left" | "right" | "center"
  layout: {
    columns: 1 | 2
    sidebarPosition?: "left" | "right"
    sidebarSections?: BlockType[]
    mainSections?: BlockType[]
  }
  sectionOrder: BlockType[]
  sectionVisibility: Record<BlockType, boolean>
}

// ========== Analysis Results ==========
export interface AnalysisResult {
  overallScore: number
  atsScore: number
  templateCompatibility: number
  missingSections: string[]
  weakSections: { section: string; reason: string }[]
  formattingIssues: string[]
  keywordCoverage: { found: string[]; missing: string[] }
  suggestions: string[]
}

// ========== Skill Gap ==========
export interface SkillGapResult {
  targetRole: string
  matchedSkills: string[]
  missingSkills: string[]
  weakSkills: string[]
  recommendedSkills: string[]
  overallMatch: number
}

// ========== Learning Resources ==========
export interface LearningResource {
  skill: string
  title: string
  link: string
  resourceType: "youtube" | "documentation" | "course"
  description: string
}

// ========== Mock Test ==========
export interface MCQQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  difficulty: "easy" | "medium" | "hard"
  skillTag: string
  explanation: string
}

export interface CodingQuestion {
  id: string
  question: string
  difficulty: "easy" | "medium" | "hard"
  skillTag: string
  expectedApproach: string
  sampleSolution: string
}

export interface ScenarioQuestion {
  id: string
  question: string
  difficulty: "medium" | "hard"
  skillTag: string
  expectedAnswer: string
  evaluationCriteria: string[]
}

export interface MockTest {
  role: string
  seniority: string
  mcqs: MCQQuestion[]
  codingQuestions: CodingQuestion[]
  scenarioQuestions: ScenarioQuestion[]
}

export interface TestEvaluation {
  totalScore: number
  mcqScore: number
  codingScore: number
  scenarioScore: number
  topicPerformance: { topic: string; score: number; strength: string }[]
  improvements: string[]
  learningPriorities: string[]
}

// ========== App State ==========
export interface AppState {
  resumeData: ResumeData | null
  selectedTemplate: string
  analysisResult: AnalysisResult | null
  skillGapResult: SkillGapResult | null
  resources: LearningResource[]
  mockTest: MockTest | null
  testEvaluation: TestEvaluation | null
}
