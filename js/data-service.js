/**
 * Data Service for KeyTyping
 * Handles data management, caching, and Supabase integration
 * Similar to Zodiakku-web content-service.js
 */

class DataService {
    constructor() {
        this.initPromise = null;
        this.config = null;
        this.supabaseClient = null;
    }

    /**
     * Initialize the service
     */
    async init() {
        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            try {
                // Try to load config from Supabase
                await this.loadConfig();

                // Check for routing/redirect
                await this.checkRouting();

                // Check for maintenance mode
                await this.checkMaintenance();

                return true;
            } catch (error) {
                console.warn('DataService init warning:', error);
                return true; // Continue with local mode
            }
        })();

        return this.initPromise;
    }

    /**
     * Load configuration from Supabase or cache
     */
    async loadConfig() {
        // Skip cache for routing - always fetch fresh config
        // This ensures routing changes take effect immediately
        console.log('Loading config from Supabase...');

        // If Supabase is configured, fetch from there
        if (this.isSupabaseConfigured()) {
            try {
                const response = await this.fetchWithTimeout(
                    `${API_CONFIG.SUPABASE_URL}/rest/v1/${API_CONFIG.TABLES.APP_CONFIG}?select=*&limit=1`,
                    {
                        headers: {
                            'apikey': API_CONFIG.SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`
                        }
                    }
                );

                console.log('Supabase response status:', response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Supabase data:', data);
                    if (data && data.length > 0) {
                        this.config = data[0];
                        console.log('Config loaded:', this.config);
                        return this.config;
                    } else {
                        console.warn('No config data in Supabase table');
                    }
                } else {
                    console.warn('Supabase response not OK:', response.status);
                }
            } catch (error) {
                console.warn('Failed to fetch config from Supabase:', error);
            }
        } else {
            console.warn('Supabase not configured');
        }

        // Return default config
        this.config = this.getDefaultConfig();
        return this.config;
    }

    /**
     * Check if Supabase is properly configured
     */
    isSupabaseConfigured() {
        return API_CONFIG.SUPABASE_URL &&
               API_CONFIG.SUPABASE_URL !== 'https://your-project.supabase.co' &&
               API_CONFIG.SUPABASE_ANON_KEY &&
               API_CONFIG.SUPABASE_ANON_KEY !== 'your-anon-key-here';
    }

    /**
     * Get default configuration
     */
    getDefaultConfig() {
        return {
            version: '1.0.0',
            mode: 'local',
            features: {
                leaderboard: false,
                cloudSync: false,
                multiplayer: false
            },
            theme: 'dark',
            maintenance: {
                enabled: false,
                message: ''
            },
            routing: {
                enabled: false,
                active_web: 'web1',
                webs: {}
            }
        };
    }

    /**
     * Check for web routing/redirect
     */
    async checkRouting() {
        console.log('Checking routing, config:', this.config);

        if (!this.config || !this.config.routing) {
            console.log('No routing config found');
            return;
        }

        const routing = this.config.routing;
        console.log('Routing data:', routing);

        if (routing.enabled && routing.active_web && routing.webs) {
            const activeWeb = routing.webs[routing.active_web];
            console.log('Active web:', routing.active_web, activeWeb);

            if (activeWeb && activeWeb.redirect_url) {
                // Check if we're already on the target URL (prevent infinite loop)
                const currentUrl = window.location.href.replace(/\/$/, ''); // Remove trailing slash
                const targetUrl = activeWeb.redirect_url.replace(/\/$/, '');

                console.log('Current URL:', currentUrl);
                console.log('Target URL:', targetUrl);

                if (currentUrl !== targetUrl && !currentUrl.startsWith(targetUrl)) {
                    console.log('Redirecting to:', activeWeb.redirect_url);
                    this.showRedirectOverlay(activeWeb.redirect_url, activeWeb.name);
                } else {
                    console.log('Already on target URL, skipping redirect');
                }
            }
        }
    }

    /**
     * Show redirect overlay and navigate
     */
    showRedirectOverlay(url, name) {
        const overlay = document.getElementById('redirectOverlay');
        const message = document.getElementById('redirectMessage');

        if (overlay && message) {
            message.textContent = `Mengalihkan ke ${name || 'versi baru'}...`;
            overlay.classList.remove('hidden');

            // Redirect after animation
            setTimeout(() => {
                window.location.href = url;
            }, 1500);
        }
    }

    /**
     * Check for maintenance mode
     */
    async checkMaintenance() {
        if (!this.config || !this.config.maintenance) return;

        const maintenance = this.config.maintenance;

        if (maintenance.enabled) {
            this.showMaintenanceOverlay(maintenance.message);
        }
    }

    /**
     * Show maintenance overlay
     */
    showMaintenanceOverlay(message) {
        const overlay = document.getElementById('maintenanceOverlay');
        const messageEl = document.getElementById('maintenanceMessage');
        const app = document.getElementById('app');

        if (overlay) {
            if (messageEl && message) {
                messageEl.textContent = message;
            }
            overlay.classList.remove('hidden');
            if (app) {
                app.classList.add('hidden');
            }
        }
    }

    /**
     * Fetch with timeout
     */
    async fetchWithTimeout(url, options = {}, timeout = API_CONFIG.REQUEST.TIMEOUT) {
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

    /**
     * Save typing result to Supabase
     */
    async saveResult(result) {
        // Always save to local storage
        this.saveResultLocally(result);

        // Try to save to Supabase if configured
        if (this.isSupabaseConfigured()) {
            try {
                const response = await this.fetchWithTimeout(
                    `${API_CONFIG.SUPABASE_URL}/rest/v1/${API_CONFIG.TABLES.USER_RESULTS}`,
                    {
                        method: 'POST',
                        headers: {
                            'apikey': API_CONFIG.SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${API_CONFIG.SUPABASE_ANON_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            session_id: this.getSessionId(),
                            wpm: result.wpm,
                            accuracy: result.accuracy,
                            correct_chars: result.correctChars,
                            incorrect_chars: result.incorrectChars,
                            total_chars: result.totalChars,
                            completed_words: result.completedWords,
                            duration_seconds: result.duration,
                            mode: result.mode,
                            difficulty: result.difficulty,
                            language: result.language,
                            created_at: new Date().toISOString()
                        })
                    }
                );

                return response.ok;
            } catch (error) {
                console.warn('Failed to save result to Supabase:', error);
            }
        }

        return true;
    }

    /**
     * Save result to local storage
     */
    saveResultLocally(result) {
        const history = this.getHistory();

        history.unshift({
            ...result,
            timestamp: Date.now()
        });

        // Keep only last 100 results
        if (history.length > 100) {
            history.pop();
        }

        this.setCache(API_CONFIG.CACHE_KEYS.HISTORY, history);
        this.updateStats(result);
    }

    /**
     * Get typing history from local storage
     */
    getHistory() {
        return this.getFromCache(API_CONFIG.CACHE_KEYS.HISTORY) || [];
    }

    /**
     * Get statistics
     */
    getStats() {
        const cached = this.getFromCache(API_CONFIG.CACHE_KEYS.STATS);
        if (cached) return cached;

        return {
            bestWpm: 0,
            avgWpm: 0,
            avgAccuracy: 0,
            totalTests: 0,
            totalChars: 0,
            totalTime: 0
        };
    }

    /**
     * Update statistics
     */
    updateStats(result) {
        const stats = this.getStats();
        const history = this.getHistory();

        // Update best WPM
        if (result.wpm > stats.bestWpm) {
            stats.bestWpm = result.wpm;
        }

        // Calculate averages from history
        if (history.length > 0) {
            const totalWpm = history.reduce((sum, h) => sum + h.wpm, 0);
            const totalAccuracy = history.reduce((sum, h) => sum + h.accuracy, 0);

            stats.avgWpm = Math.round(totalWpm / history.length);
            stats.avgAccuracy = Math.round(totalAccuracy / history.length);
        }

        stats.totalTests = history.length;
        stats.totalChars += result.totalChars;
        stats.totalTime += result.duration;

        this.setCache(API_CONFIG.CACHE_KEYS.STATS, stats);
        return stats;
    }

    /**
     * Clear history
     */
    clearHistory() {
        localStorage.removeItem(API_CONFIG.CACHE_KEYS.HISTORY);
        localStorage.removeItem(API_CONFIG.CACHE_KEYS.STATS);
    }

    /**
     * Get settings
     */
    getSettings() {
        const cached = this.getFromCache(API_CONFIG.CACHE_KEYS.SETTINGS);
        if (cached) return cached;

        return {
            theme: 'dark',
            fontSize: 'medium',
            showKeyboard: true,
            language: 'id',
            difficulty: 'medium',
            sound: false,
            autoClear: true
        };
    }

    /**
     * Save settings
     */
    saveSettings(settings) {
        this.setCache(API_CONFIG.CACHE_KEYS.SETTINGS, settings, API_CONFIG.CACHE_TTL.SETTINGS);
    }

    /**
     * Get session ID
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('keytyping_session');

        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('keytyping_session', sessionId);
        }

        return sessionId;
    }

    /**
     * Cache helpers
     */
    getFromCache(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;

            const parsed = JSON.parse(item);

            // Check TTL if exists
            if (parsed._expiry && Date.now() > parsed._expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return parsed._data !== undefined ? parsed._data : parsed;
        } catch (error) {
            return null;
        }
    }

    setCache(key, data, ttl = null) {
        try {
            const item = ttl ? {
                _data: data,
                _expiry: Date.now() + ttl
            } : data;

            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.warn('Failed to set cache:', error);
        }
    }
}

// Create singleton instance
const dataService = new DataService();
