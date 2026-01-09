/**
 * API Configuration for KeyTyping
 * Similar to Zodiakku-web structure
 */

const API_CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://fhwgzsxrhwozgjiyvycg.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZod2d6c3hyaHdvemdqaXl2eWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NTExMTQsImV4cCI6MjA4MzUyNzExNH0.dfcY6swn6FJ0dAG4OooeJUfKiNqp5l_kzEPLkJojk0k',

    // Tables
    TABLES: {
        APP_CONFIG: 'app_config',
        USER_RESULTS: 'typing_results',
        LEADERBOARD: 'leaderboard',
        WORD_SETS: 'word_sets'
    },

    // Cache Configuration
    CACHE_KEYS: {
        CONFIG: 'keytyping_config',
        STATS: 'keytyping_stats',
        HISTORY: 'keytyping_history',
        SETTINGS: 'keytyping_settings',
        ROUTING: 'keytyping_routing',
        LAST_FETCH: 'keytyping_last_fetch'
    },

    // Cache TTL (Time To Live) in milliseconds
    CACHE_TTL: {
        CONFIG: 60 * 60 * 1000,      // 1 hour
        STATS: 30 * 60 * 1000,        // 30 minutes
        HISTORY: 24 * 60 * 60 * 1000, // 24 hours
        SETTINGS: 7 * 24 * 60 * 60 * 1000 // 7 days
    },

    // API Endpoints (if using backend server)
    ENDPOINTS: {
        BASE_URL: '/api',
        SAVE_RESULT: '/api/results',
        GET_LEADERBOARD: '/api/leaderboard',
        GET_WORDS: '/api/words'
    },

    // Request Configuration
    REQUEST: {
        TIMEOUT: 10000,    // 10 seconds
        RETRY_COUNT: 2,
        RETRY_DELAY: 1000  // 1 second
    }
};

// Freeze configuration to prevent modifications
Object.freeze(API_CONFIG);
Object.freeze(API_CONFIG.TABLES);
Object.freeze(API_CONFIG.CACHE_KEYS);
Object.freeze(API_CONFIG.CACHE_TTL);
Object.freeze(API_CONFIG.ENDPOINTS);
Object.freeze(API_CONFIG.REQUEST);
