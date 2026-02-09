-- Fix tables to use JSONB columns for simple upsert pattern
-- This matches the app's data layer which stores full JSON objects

-- Resumes: store the entire resume as JSONB
DROP TABLE IF EXISTS resumes CASCADE;
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  resume_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on resumes" ON resumes FOR ALL USING (true) WITH CHECK (true);

-- Analysis results: store as JSONB
DROP TABLE IF EXISTS analysis_results CASCADE;
CREATE TABLE analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  analysis_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on analysis_results" ON analysis_results FOR ALL USING (true) WITH CHECK (true);

-- Skill gap results: store as JSONB
DROP TABLE IF EXISTS skill_gap_results CASCADE;
CREATE TABLE skill_gap_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  skill_gap_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE skill_gap_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on skill_gap_results" ON skill_gap_results FOR ALL USING (true) WITH CHECK (true);

-- Learning resources: store as JSONB array
DROP TABLE IF EXISTS learning_resources CASCADE;
CREATE TABLE learning_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  resources_data JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on learning_resources" ON learning_resources FOR ALL USING (true) WITH CHECK (true);

-- Mock tests: store as JSONB
DROP TABLE IF EXISTS mock_tests CASCADE;
CREATE TABLE mock_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  test_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on mock_tests" ON mock_tests FOR ALL USING (true) WITH CHECK (true);

-- Test evaluations: store as JSONB
DROP TABLE IF EXISTS test_evaluations CASCADE;
CREATE TABLE test_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  evaluation_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE test_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on test_evaluations" ON test_evaluations FOR ALL USING (true) WITH CHECK (true);
