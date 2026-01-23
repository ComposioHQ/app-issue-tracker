-- Apps table (stores enriched_results.json data)
CREATE TABLE IF NOT EXISTS apps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_name TEXT UNIQUE NOT NULL,
    app_level_enrichment JSONB NOT NULL DEFAULT '{}',
    teams TEXT[] NOT NULL DEFAULT '{}',
    qa_issues JSONB DEFAULT '[]',
    partnerships_issues JSONB DEFAULT '[]',
    qa_total_actions INTEGER DEFAULT 0,
    partnerships_total_actions INTEGER DEFAULT 0,
    total_cost_to_unblock TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Solved issues table (replaces localStorage)
CREATE TABLE IF NOT EXISTS solved_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_name TEXT NOT NULL,
    issue_key TEXT NOT NULL,
    solved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(app_name, issue_key)
);

-- Enable RLS
ALTER TABLE apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE solved_issues ENABLE ROW LEVEL SECURITY;

-- Allow public read on apps
CREATE POLICY "Public read apps" ON apps FOR SELECT USING (true);

-- Allow public CRUD on solved_issues (no auth for simplicity)
CREATE POLICY "Public select solved" ON solved_issues FOR SELECT USING (true);
CREATE POLICY "Public insert solved" ON solved_issues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update solved" ON solved_issues FOR UPDATE USING (true);
CREATE POLICY "Public delete solved" ON solved_issues FOR DELETE USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_apps_name ON apps(app_name);
CREATE INDEX IF NOT EXISTS idx_solved_app ON solved_issues(app_name);
CREATE INDEX IF NOT EXISTS idx_solved_key ON solved_issues(issue_key);
