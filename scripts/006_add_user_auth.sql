-- Add user_id column to all tables and set up RLS policies

-- 1. Add user_id to resumes table
ALTER TABLE public.resumes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);

-- 2. Add user_id to analysis_results table
ALTER TABLE public.analysis_results ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_analysis_results_user_id ON public.analysis_results(user_id);

-- 3. Add user_id to skill_gap_results table
ALTER TABLE public.skill_gap_results ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_skill_gap_results_user_id ON public.skill_gap_results(user_id);

-- 4. Add user_id to learning_resources table
ALTER TABLE public.learning_resources ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_learning_resources_user_id ON public.learning_resources(user_id);

-- 5. Add user_id to mock_tests table
ALTER TABLE public.mock_tests ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_mock_tests_user_id ON public.mock_tests(user_id);

-- 6. Add user_id to test_evaluations table
ALTER TABLE public.test_evaluations ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX idx_test_evaluations_user_id ON public.test_evaluations(user_id);

-- Drop old policies that allow all access
DROP POLICY IF EXISTS "Allow all on resumes" ON public.resumes;
DROP POLICY IF EXISTS "Allow all on analysis_results" ON public.analysis_results;
DROP POLICY IF EXISTS "Allow all on skill_gap_results" ON public.skill_gap_results;
DROP POLICY IF EXISTS "Allow all on learning_resources" ON public.learning_resources;
DROP POLICY IF EXISTS "Allow all on mock_tests" ON public.mock_tests;
DROP POLICY IF EXISTS "Allow all on test_evaluations" ON public.test_evaluations;

-- Create RLS policies for resumes
CREATE POLICY "Users can view their own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resumes" ON public.resumes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for analysis_results
CREATE POLICY "Users can view their own analysis" ON public.analysis_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own analysis" ON public.analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analysis" ON public.analysis_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analysis" ON public.analysis_results FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for skill_gap_results
CREATE POLICY "Users can view their own skill gaps" ON public.skill_gap_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own skill gaps" ON public.skill_gap_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skill gaps" ON public.skill_gap_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skill gaps" ON public.skill_gap_results FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for learning_resources
CREATE POLICY "Users can view their own resources" ON public.learning_resources FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resources" ON public.learning_resources FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resources" ON public.learning_resources FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own resources" ON public.learning_resources FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for mock_tests
CREATE POLICY "Users can view their own tests" ON public.mock_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tests" ON public.mock_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tests" ON public.mock_tests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tests" ON public.mock_tests FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for test_evaluations
CREATE POLICY "Users can view their own evaluations" ON public.test_evaluations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own evaluations" ON public.test_evaluations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own evaluations" ON public.test_evaluations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own evaluations" ON public.test_evaluations FOR DELETE USING (auth.uid() = user_id);

-- Jobs table: Allow all users to view jobs (public), but system can insert/update/delete
DROP POLICY IF EXISTS "Allow all on jobs" ON public.jobs;
CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
