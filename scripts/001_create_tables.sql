-- Resume data storage
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  personal JSONB NOT NULL DEFAULT '{}',
  summary TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  custom_sections JSONB DEFAULT '[]',
  photo_url TEXT,
  selected_template TEXT DEFAULT 'modern-swe',
  template_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_session ON resumes(session_id);

-- Analysis results
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  overall_score INT,
  ats_score INT,
  template_compatibility INT,
  missing_sections TEXT[] DEFAULT '{}',
  weak_sections JSONB DEFAULT '[]',
  formatting_issues TEXT[] DEFAULT '{}',
  keyword_coverage JSONB DEFAULT '{}',
  suggestions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_session ON analysis_results(session_id);

-- Skill gap results
CREATE TABLE IF NOT EXISTS skill_gap_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  target_role TEXT,
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  weak_skills TEXT[] DEFAULT '{}',
  recommended_skills TEXT[] DEFAULT '{}',
  overall_match INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skillgap_session ON skill_gap_results(session_id);

-- Learning resources
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  skill TEXT NOT NULL,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_session ON learning_resources(session_id);

-- Mock test results
CREATE TABLE IF NOT EXISTS mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  role TEXT,
  seniority TEXT,
  test_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mocktest_session ON mock_tests(session_id);

-- Test evaluations
CREATE TABLE IF NOT EXISTS test_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  total_score INT,
  mcq_score INT,
  coding_score INT,
  scenario_score INT,
  topic_performance JSONB DEFAULT '[]',
  improvements TEXT[] DEFAULT '{}',
  learning_priorities TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eval_session ON test_evaluations(session_id);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT UNIQUE NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT DEFAULT '',
  job_type TEXT,
  experience TEXT,
  posted_date TIMESTAMPTZ,
  source_name TEXT NOT NULL,
  apply_url TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_title ON jobs(job_title);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_posted ON jobs(posted_date DESC);

-- Disable RLS since this is session-based (no auth)
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_gap_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow public access (session-based, no auth required)
CREATE POLICY "Allow all on resumes" ON resumes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on analysis_results" ON analysis_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on skill_gap_results" ON skill_gap_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on learning_resources" ON learning_resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on mock_tests" ON mock_tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on test_evaluations" ON test_evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
