-- ============================================
-- KeyTyping - Supabase Database Schema
-- Typing Speed Test Application
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. APP CONFIGURATION TABLE
-- ============================================
-- Stores application settings, routing, maintenance mode
-- Similar to Zodiakku-web app_config

CREATE TABLE IF NOT EXISTS app_config (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) DEFAULT '1.0.0',
    mode VARCHAR(20) DEFAULT 'production', -- 'production', 'development', 'maintenance'

    -- Features toggle
    features JSONB DEFAULT '{
        "leaderboard": true,
        "cloudSync": true,
        "multiplayer": false,
        "soundEffects": true,
        "achievements": false
    }'::jsonb,

    -- Theme settings
    theme JSONB DEFAULT '{
        "default": "dark",
        "available": ["dark", "light", "ocean", "forest"]
    }'::jsonb,

    -- Maintenance mode
    maintenance JSONB DEFAULT '{
        "enabled": false,
        "message": "Sedang dalam pemeliharaan. Silakan kembali lagi nanti.",
        "estimated_end": null
    }'::jsonb,

    -- Routing/Web Switching
    routing JSONB DEFAULT '{
        "enabled": false,
        "active_web": "web1",
        "webs": {
            "web1": {
                "name": "KeyTyping Original",
                "redirect_url": null
            },
            "web2": {
                "name": "KeyTyping V2",
                "redirect_url": null
            }
        }
    }'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default config
INSERT INTO app_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. TYPING RESULTS TABLE
-- ============================================
-- Stores user typing test results

CREATE TABLE IF NOT EXISTS typing_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),

    -- Results
    wpm INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    correct_chars INTEGER DEFAULT 0,
    incorrect_chars INTEGER DEFAULT 0,
    total_chars INTEGER DEFAULT 0,
    completed_words INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,

    -- Test settings
    mode VARCHAR(20) DEFAULT 'time', -- 'time' or 'words'
    mode_value INTEGER DEFAULT 60,
    difficulty VARCHAR(20) DEFAULT 'medium',
    language VARCHAR(10) DEFAULT 'id',

    -- User info (optional)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    username VARCHAR(100),

    -- Metadata
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_typing_results_session ON typing_results(session_id);
CREATE INDEX IF NOT EXISTS idx_typing_results_wpm ON typing_results(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_typing_results_created ON typing_results(created_at DESC);

-- ============================================
-- 3. LEADERBOARD TABLE
-- ============================================
-- Top scores for leaderboard

CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    username VARCHAR(100) NOT NULL,
    wpm INTEGER NOT NULL,
    accuracy INTEGER NOT NULL,
    mode VARCHAR(20) DEFAULT 'time',
    mode_value INTEGER DEFAULT 60,
    difficulty VARCHAR(20) DEFAULT 'medium',
    language VARCHAR(10) DEFAULT 'id',

    -- Optional user reference
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_wpm ON leaderboard(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_mode ON leaderboard(mode, mode_value);

-- ============================================
-- 4. WORD SETS TABLE (Optional)
-- ============================================
-- Custom word sets that can be managed via Supabase

CREATE TABLE IF NOT EXISTS word_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL DEFAULT 'id',
    difficulty VARCHAR(20) NOT NULL DEFAULT 'medium',
    category VARCHAR(50), -- 'general', 'programming', 'science', etc.

    words TEXT[] NOT NULL, -- Array of words

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for word sets
CREATE INDEX IF NOT EXISTS idx_word_sets_language ON word_sets(language);
CREATE INDEX IF NOT EXISTS idx_word_sets_difficulty ON word_sets(difficulty);

-- ============================================
-- 5. USER ACHIEVEMENTS TABLE (Optional)
-- ============================================

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    session_id VARCHAR(100),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    achievement_code VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,

    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- App Config: Public read access
CREATE POLICY "Allow public read on app_config"
    ON app_config FOR SELECT
    TO anon, authenticated
    USING (true);

-- Typing Results: Anonymous insert, authenticated users can see their own
CREATE POLICY "Allow anonymous insert on typing_results"
    ON typing_results FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to see own results"
    ON typing_results FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow anonymous to see own session results"
    ON typing_results FOR SELECT
    TO anon
    USING (true); -- Limited by session_id in app

-- Leaderboard: Public read, authenticated write
CREATE POLICY "Allow public read on leaderboard"
    ON leaderboard FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow authenticated insert on leaderboard"
    ON leaderboard FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on leaderboard"
    ON leaderboard FOR INSERT
    TO anon
    WITH CHECK (true);

-- Word Sets: Public read
CREATE POLICY "Allow public read on word_sets"
    ON word_sets FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

-- Achievements: Users can see their own
CREATE POLICY "Allow users to see own achievements"
    ON user_achievements FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Allow insert achievements"
    ON user_achievements FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for app_config
CREATE TRIGGER update_app_config_updated_at
    BEFORE UPDATE ON app_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for word_sets
CREATE TRIGGER update_word_sets_updated_at
    BEFORE UPDATE ON word_sets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROUTING/WEB SWITCHING MANAGEMENT
-- ============================================
-- Similar to Zodiakku-web routing system

-- Enable routing
-- UPDATE app_config SET routing = jsonb_set(routing, '{enabled}', 'true') WHERE id = 1;

-- Disable routing
-- UPDATE app_config SET routing = jsonb_set(routing, '{enabled}', 'false') WHERE id = 1;

-- Switch to Web 2
-- UPDATE app_config SET routing = jsonb_set(routing, '{active_web}', '"web2"') WHERE id = 1;

-- Add new web destination
-- UPDATE app_config SET routing = jsonb_set(
--     routing,
--     '{webs,web3}',
--     '{"name": "KeyTyping V3", "redirect_url": "https://keytyping-v3.vercel.app"}'::jsonb
-- ) WHERE id = 1;

-- ============================================
-- MAINTENANCE MODE MANAGEMENT
-- ============================================

-- Enable maintenance
-- UPDATE app_config SET maintenance = '{
--     "enabled": true,
--     "message": "Sedang dalam pemeliharaan...",
--     "estimated_end": "2026-12-31T12:00:00Z"
-- }'::jsonb WHERE id = 1;

-- Disable maintenance
-- UPDATE app_config SET maintenance = jsonb_set(maintenance, '{enabled}', 'false') WHERE id = 1;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample word set
INSERT INTO word_sets (name, language, difficulty, category, words)
VALUES (
    'Kata Umum Indonesia',
    'id',
    'easy',
    'general',
    ARRAY['dan', 'di', 'ini', 'itu', 'yang', 'untuk', 'pada', 'dengan', 'ada', 'dari']
) ON CONFLICT DO NOTHING;

INSERT INTO word_sets (name, language, difficulty, category, words)
VALUES (
    'Common English Words',
    'en',
    'easy',
    'general',
    ARRAY['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it']
) ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- View for daily statistics
CREATE OR REPLACE VIEW daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_tests,
    AVG(wpm)::INTEGER as avg_wpm,
    AVG(accuracy)::INTEGER as avg_accuracy,
    MAX(wpm) as best_wpm
FROM typing_results
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View for top scores
CREATE OR REPLACE VIEW top_scores AS
SELECT
    username,
    wpm,
    accuracy,
    mode,
    difficulty,
    created_at
FROM leaderboard
ORDER BY wpm DESC
LIMIT 100;
