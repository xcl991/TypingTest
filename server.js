/**
 * KeyTyping - Express Server
 * Backend API for typing test application
 * Similar to Zodiakku-web server.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configuration (can be moved to .env file)
const CONFIG = {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY || 'your-service-key',
    MAX_LEADERBOARD_ENTRIES: 100
};

// Helper function for fetching with timeout
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// ============================================
// API Routes
// ============================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * Get app configuration
 */
app.get('/api/config', async (req, res) => {
    try {
        // If Supabase is configured, fetch from there
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co') {
            const response = await fetchWithTimeout(
                `${CONFIG.SUPABASE_URL}/rest/v1/app_config?select=*&limit=1`,
                {
                    headers: {
                        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    return res.json(data[0]);
                }
            }
        }

        // Return default config
        res.json({
            version: '1.0.0',
            mode: 'local',
            features: {
                leaderboard: false,
                cloudSync: false
            },
            maintenance: {
                enabled: false
            },
            routing: {
                enabled: false
            }
        });

    } catch (error) {
        console.error('Config fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch configuration' });
    }
});

/**
 * Save typing result
 */
app.post('/api/results', async (req, res) => {
    try {
        const result = req.body;

        // Validate required fields
        if (typeof result.wpm !== 'number' || typeof result.accuracy !== 'number') {
            return res.status(400).json({ error: 'Invalid result data' });
        }

        // If Supabase is configured, save there
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co') {
            const response = await fetchWithTimeout(
                `${CONFIG.SUPABASE_URL}/rest/v1/typing_results`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        ...result,
                        created_at: new Date().toISOString()
                    })
                }
            );

            if (response.ok) {
                return res.json({ success: true, message: 'Result saved to cloud' });
            }
        }

        // Fallback - just acknowledge
        res.json({ success: true, message: 'Result acknowledged' });

    } catch (error) {
        console.error('Save result error:', error);
        res.status(500).json({ error: 'Failed to save result' });
    }
});

/**
 * Get leaderboard
 */
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { mode = 'time', value = 60, difficulty = 'medium', limit = 20 } = req.query;

        // If Supabase is configured, fetch from there
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co') {
            const response = await fetchWithTimeout(
                `${CONFIG.SUPABASE_URL}/rest/v1/leaderboard?` +
                `mode=eq.${mode}&mode_value=eq.${value}&difficulty=eq.${difficulty}` +
                `&select=*&order=wpm.desc&limit=${Math.min(limit, CONFIG.MAX_LEADERBOARD_ENTRIES)}`,
                {
                    headers: {
                        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return res.json(data);
            }
        }

        // Return empty leaderboard
        res.json([]);

    } catch (error) {
        console.error('Leaderboard fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
});

/**
 * Submit score to leaderboard
 */
app.post('/api/leaderboard', async (req, res) => {
    try {
        const { username, wpm, accuracy, mode, mode_value, difficulty, language } = req.body;

        // Validate
        if (!username || typeof wpm !== 'number' || typeof accuracy !== 'number') {
            return res.status(400).json({ error: 'Invalid leaderboard entry' });
        }

        // Sanitize username
        const sanitizedUsername = username.trim().substring(0, 50);

        // If Supabase is configured, save there
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co') {
            const response = await fetchWithTimeout(
                `${CONFIG.SUPABASE_URL}/rest/v1/leaderboard`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        username: sanitizedUsername,
                        wpm,
                        accuracy,
                        mode: mode || 'time',
                        mode_value: mode_value || 60,
                        difficulty: difficulty || 'medium',
                        language: language || 'id',
                        created_at: new Date().toISOString()
                    })
                }
            );

            if (response.ok) {
                return res.json({ success: true, message: 'Score submitted' });
            }
        }

        res.json({ success: true, message: 'Score acknowledged' });

    } catch (error) {
        console.error('Leaderboard submit error:', error);
        res.status(500).json({ error: 'Failed to submit score' });
    }
});

/**
 * Get custom word sets
 */
app.get('/api/words', async (req, res) => {
    try {
        const { language = 'id', difficulty = 'medium' } = req.query;

        // If Supabase is configured, fetch from there
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co') {
            const response = await fetchWithTimeout(
                `${CONFIG.SUPABASE_URL}/rest/v1/word_sets?` +
                `language=eq.${language}&difficulty=eq.${difficulty}&is_active=eq.true` +
                `&select=*`,
                {
                    headers: {
                        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Combine all words from matching sets
                const words = data.reduce((acc, set) => {
                    return acc.concat(set.words || []);
                }, []);
                return res.json({ words });
            }
        }

        // Return fallback words
        res.json({ words: getFallbackWords(language, difficulty) });

    } catch (error) {
        console.error('Words fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch words' });
    }
});

/**
 * Get fallback words when database is not available
 */
function getFallbackWords(language, difficulty) {
    const fallbackWords = {
        id: {
            easy: ['dan', 'di', 'ini', 'itu', 'yang', 'untuk', 'pada', 'dengan', 'ada', 'dari'],
            medium: ['pekerjaan', 'pendidikan', 'kesehatan', 'keluarga', 'masyarakat'],
            hard: ['implementasi', 'transformasi', 'optimalisasi', 'standardisasi']
        },
        en: {
            easy: ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'it'],
            medium: ['about', 'above', 'across', 'after', 'again', 'against'],
            hard: ['absolutely', 'accomplish', 'achievement', 'acknowledge']
        }
    };

    const langWords = fallbackWords[language] || fallbackWords.id;
    return langWords[difficulty] || langWords.easy;
}

// ============================================
// Serve Static Files
// ============================================

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║          KeyTyping Server Started          ║
╠════════════════════════════════════════════╣
║  Local:   http://localhost:${PORT}             ║
║  Mode:    ${process.env.NODE_ENV || 'development'}                    ║
╚════════════════════════════════════════════╝
    `);
});

module.exports = app;
