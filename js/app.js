/**
 * KeyTyping - Main Application
 * Typing Speed Test with mobile support
 */

class KeyTypingApp {
    constructor() {
        // DOM Elements
        this.elements = {
            // Views
            practiceView: document.getElementById('practiceView'),
            statsView: document.getElementById('statsView'),
            settingsView: document.getElementById('settingsView'),

            // Navigation
            navBtns: document.querySelectorAll('.nav-btn'),
            menuToggle: document.getElementById('menuToggle'),
            mobileNav: document.getElementById('mobileNav'),

            // Typing Area
            textDisplay: document.getElementById('textDisplay'),
            textContent: document.getElementById('textContent'),
            typingInput: document.getElementById('typingInput'),

            // Stats Display
            liveWpm: document.getElementById('liveWpm'),
            liveAccuracy: document.getElementById('liveAccuracy'),
            liveTimer: document.getElementById('liveTimer'),
            timerLabel: document.getElementById('timerLabel'),

            // Mode Buttons
            modeBtns: document.querySelectorAll('.mode-btn'),

            // Action Buttons
            restartBtn: document.getElementById('restartBtn'),
            newTestBtn: document.getElementById('newTestBtn'),

            // Results Modal
            resultsModal: document.getElementById('resultsModal'),
            resultWpm: document.getElementById('resultWpm'),
            resultAccuracy: document.getElementById('resultAccuracy'),
            resultChars: document.getElementById('resultChars'),
            resultErrors: document.getElementById('resultErrors'),
            correctChars: document.getElementById('correctChars'),
            incorrectChars: document.getElementById('incorrectChars'),
            completedWords: document.getElementById('completedWords'),
            totalTime: document.getElementById('totalTime'),
            tryAgainBtn: document.getElementById('tryAgainBtn'),
            newTestModalBtn: document.getElementById('newTestModalBtn'),

            // Stats View
            bestWpm: document.getElementById('bestWpm'),
            avgWpm: document.getElementById('avgWpm'),
            avgAccuracy: document.getElementById('avgAccuracy'),
            totalTests: document.getElementById('totalTests'),
            historyList: document.getElementById('historyList'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),

            // Settings
            themeSetting: document.getElementById('themeSetting'),
            fontSizeSetting: document.getElementById('fontSizeSetting'),
            showKeyboardSetting: document.getElementById('showKeyboardSetting'),
            languageSetting: document.getElementById('languageSetting'),
            difficultySetting: document.getElementById('difficultySetting'),
            soundSetting: document.getElementById('soundSetting'),
            autoClearSetting: document.getElementById('autoClearSetting'),

            // Keyboard
            keyboardContainer: document.getElementById('keyboardContainer'),
            virtualKeyboard: document.getElementById('virtualKeyboard'),

            // Overlays
            loadingOverlay: document.getElementById('loadingOverlay')
        };

        // Test State
        this.state = {
            mode: 'time',       // 'time' or 'words'
            modeValue: 60,      // seconds or word count
            isActive: false,
            isFinished: false,
            startTime: null,
            endTime: null,
            timerInterval: null,
            currentWordIndex: 0,
            currentCharIndex: 0,
            words: [],
            typedChars: [],
            correctChars: 0,
            incorrectChars: 0,
            completedWords: 0
        };

        // Settings
        this.settings = {
            theme: 'dark',
            fontSize: 'medium',
            showKeyboard: true,
            language: 'id',
            difficulty: 'medium',
            sound: false,
            autoClear: true
        };

        // Keyboard Layout
        this.keyboardLayout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
            ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
            ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
            ['space']
        ];

        // Audio context for sounds
        this.audioContext = null;

        // Initialize
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading
            this.showLoading(true);

            // Initialize data service
            await dataService.init();

            // Load settings
            this.loadSettings();

            // Apply settings
            this.applySettings();

            // Render keyboard
            this.renderKeyboard();

            // Setup event listeners
            this.setupEventListeners();

            // Generate initial test
            this.generateTest();

            // Update stats display
            this.updateStatsDisplay();

            // Hide loading
            this.showLoading(false);

            // Focus input
            this.elements.typingInput.focus();

        } catch (error) {
            console.error('Init error:', error);
            this.showLoading(false);
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Navigation
        this.elements.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        this.elements.menuToggle?.addEventListener('click', () => {
            this.elements.mobileNav.classList.toggle('hidden');
        });

        // Mode selection
        this.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleModeChange(e));
        });

        // Typing input
        this.elements.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.elements.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.elements.typingInput.addEventListener('focus', () => this.handleInputFocus());
        this.elements.typingInput.addEventListener('blur', () => this.handleInputBlur());

        // Action buttons
        this.elements.restartBtn?.addEventListener('click', () => this.restartTest());
        this.elements.newTestBtn?.addEventListener('click', () => this.newTest());
        this.elements.tryAgainBtn?.addEventListener('click', () => this.tryAgain());
        this.elements.newTestModalBtn?.addEventListener('click', () => this.newTestFromModal());

        // Clear history
        this.elements.clearHistoryBtn?.addEventListener('click', () => this.clearHistory());

        // Settings changes
        this.elements.themeSetting?.addEventListener('change', (e) => this.updateSetting('theme', e.target.value));
        this.elements.fontSizeSetting?.addEventListener('change', (e) => this.updateSetting('fontSize', e.target.value));
        this.elements.showKeyboardSetting?.addEventListener('change', (e) => this.updateSetting('showKeyboard', e.target.checked));
        this.elements.languageSetting?.addEventListener('change', (e) => this.updateSetting('language', e.target.value));
        this.elements.difficultySetting?.addEventListener('change', (e) => this.updateSetting('difficulty', e.target.value));
        this.elements.soundSetting?.addEventListener('change', (e) => this.updateSetting('sound', e.target.checked));
        this.elements.autoClearSetting?.addEventListener('change', (e) => this.updateSetting('autoClear', e.target.checked));

        // Keyboard events for highlighting
        document.addEventListener('keydown', (e) => this.highlightKey(e.key, true));
        document.addEventListener('keyup', (e) => this.highlightKey(e.key, false));

        // Prevent pull-to-refresh on mobile
        document.body.addEventListener('touchmove', (e) => {
            if (e.target === this.elements.typingInput) {
                e.preventDefault();
            }
        }, { passive: false });

        // Click on text display to focus input
        this.elements.textDisplay?.addEventListener('click', () => {
            this.elements.typingInput.focus();
        });
    }

    /**
     * Handle navigation
     */
    handleNavigation(e) {
        const view = e.target.dataset.view;
        if (!view) return;

        // Update nav buttons
        this.elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => {
            v.classList.add('hidden');
            v.classList.remove('active');
        });

        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.remove('hidden');
            targetView.classList.add('active');
        }

        // Hide mobile nav
        this.elements.mobileNav?.classList.add('hidden');

        // Update stats when viewing stats
        if (view === 'stats') {
            this.updateStatsDisplay();
        }

        // Focus input when going to practice
        if (view === 'practice') {
            setTimeout(() => this.elements.typingInput.focus(), 100);
        }
    }

    /**
     * Handle mode change
     */
    handleModeChange(e) {
        const btn = e.target;
        const mode = btn.dataset.mode;
        const value = parseInt(btn.dataset.value);

        // Update active button
        this.elements.modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update state
        this.state.mode = mode;
        this.state.modeValue = value;

        // Update timer label
        this.elements.timerLabel.textContent = mode === 'time' ? 'detik' : 'kata';

        // Generate new test
        this.newTest();
    }

    /**
     * Generate test words
     */
    generateTest() {
        const lang = this.settings.language === 'mixed' ? (Math.random() > 0.5 ? 'id' : 'en') : this.settings.language;
        const difficulty = this.settings.difficulty;

        let wordPool = [];

        // Get words from the appropriate pool
        if (WORD_DATA[lang] && WORD_DATA[lang][difficulty]) {
            wordPool = [...WORD_DATA[lang][difficulty]];
        } else if (WORD_DATA.id && WORD_DATA.id[difficulty]) {
            wordPool = [...WORD_DATA.id[difficulty]];
        } else {
            // Fallback to easy Indonesian words
            wordPool = [...WORD_DATA.id.easy];
        }

        // Shuffle words
        this.shuffleArray(wordPool);

        // Determine number of words needed
        let wordCount;
        if (this.state.mode === 'words') {
            wordCount = this.state.modeValue;
        } else {
            // For time-based tests, generate enough words (roughly 100 WPM * minutes + buffer)
            wordCount = Math.ceil((this.state.modeValue / 60) * 120);
        }

        // Select words
        this.state.words = [];
        while (this.state.words.length < wordCount) {
            this.shuffleArray(wordPool);
            this.state.words.push(...wordPool.slice(0, wordCount - this.state.words.length));
        }

        // Render the text
        this.renderText();

        // Update timer display
        this.updateTimerDisplay();
    }

    /**
     * Render text to display
     */
    renderText() {
        let html = '';

        this.state.words.forEach((word, wordIndex) => {
            const wordClass = wordIndex === 0 ? 'word active' : 'word';
            html += `<span class="${wordClass}" data-word="${wordIndex}">`;

            word.split('').forEach((char, charIndex) => {
                const isFirst = wordIndex === 0 && charIndex === 0;
                const charClass = isFirst ? 'char current' : 'char pending';
                html += `<span class="${charClass}" data-word="${wordIndex}" data-char="${charIndex}">${char}</span>`;
            });

            html += '</span> ';
        });

        this.elements.textContent.innerHTML = html;
    }

    /**
     * Handle typing input
     */
    handleInput(e) {
        const inputValue = e.target.value;

        // Start test on first input
        if (!this.state.isActive && !this.state.isFinished && inputValue.length > 0) {
            this.startTest();
        }

        if (!this.state.isActive || this.state.isFinished) return;

        const currentWord = this.state.words[this.state.currentWordIndex];
        const inputLength = inputValue.length;

        // Update character states
        this.updateCharacterStates(inputValue, currentWord);

        // Play sound if enabled
        if (this.settings.sound) {
            this.playKeySound();
        }

        // Check for word completion (space pressed)
        if (inputValue.endsWith(' ')) {
            this.completeWord(inputValue.trim(), currentWord);
        }

        // Update live stats
        this.updateLiveStats();
    }

    /**
     * Handle key down events
     */
    handleKeyDown(e) {
        // Handle backspace
        if (e.key === 'Backspace') {
            // Allow backspace but track corrections
            return;
        }

        // Handle Tab for restart
        if (e.key === 'Tab') {
            e.preventDefault();
            this.restartTest();
            return;
        }

        // Handle Escape to reset
        if (e.key === 'Escape') {
            e.preventDefault();
            this.newTest();
            return;
        }
    }

    /**
     * Update character display states
     */
    updateCharacterStates(inputValue, currentWord) {
        const wordEl = document.querySelector(`.word[data-word="${this.state.currentWordIndex}"]`);
        if (!wordEl) return;

        const charEls = wordEl.querySelectorAll('.char');

        charEls.forEach((charEl, index) => {
            charEl.classList.remove('correct', 'incorrect', 'current', 'pending');

            if (index < inputValue.length) {
                // Character has been typed
                if (inputValue[index] === currentWord[index]) {
                    charEl.classList.add('correct');
                } else {
                    charEl.classList.add('incorrect');
                }
            } else if (index === inputValue.length) {
                // Current character to type
                charEl.classList.add('current');
            } else {
                // Pending characters
                charEl.classList.add('pending');
            }
        });

        // Handle extra characters typed beyond word length
        // Visual indicator could be added here if needed
    }

    /**
     * Complete current word and move to next
     */
    completeWord(typedWord, actualWord) {
        const wordEl = document.querySelector(`.word[data-word="${this.state.currentWordIndex}"]`);

        // Count correct and incorrect chars
        let correctInWord = 0;
        let incorrectInWord = 0;

        for (let i = 0; i < Math.max(typedWord.length, actualWord.length); i++) {
            if (i < typedWord.length && i < actualWord.length) {
                if (typedWord[i] === actualWord[i]) {
                    correctInWord++;
                } else {
                    incorrectInWord++;
                }
            } else if (i < typedWord.length) {
                incorrectInWord++; // Extra chars
            } else {
                incorrectInWord++; // Missing chars
            }
        }

        this.state.correctChars += correctInWord;
        this.state.incorrectChars += incorrectInWord;

        // Mark word as completed
        if (wordEl) {
            wordEl.classList.remove('active');
            if (typedWord === actualWord) {
                wordEl.classList.add('completed');
                this.state.completedWords++;
            } else {
                wordEl.classList.add('error');
            }
        }

        // Move to next word
        this.state.currentWordIndex++;
        this.state.currentCharIndex = 0;

        // Clear input
        if (this.settings.autoClear) {
            this.elements.typingInput.value = '';
        }

        // Check if test is complete (word mode)
        if (this.state.mode === 'words' && this.state.currentWordIndex >= this.state.modeValue) {
            this.endTest();
            return;
        }

        // Check if we need more words
        if (this.state.currentWordIndex >= this.state.words.length) {
            this.endTest();
            return;
        }

        // Mark next word as active
        const nextWordEl = document.querySelector(`.word[data-word="${this.state.currentWordIndex}"]`);
        if (nextWordEl) {
            nextWordEl.classList.add('active');

            // Mark first char as current
            const firstChar = nextWordEl.querySelector('.char');
            if (firstChar) {
                firstChar.classList.remove('pending');
                firstChar.classList.add('current');
            }

            // Scroll word into view if needed
            this.scrollToCurrentWord(nextWordEl);
        }
    }

    /**
     * Scroll to keep current word visible (collapsing scroll effect)
     */
    scrollToCurrentWord(wordEl) {
        const container = this.elements.textDisplay;
        const textContent = this.elements.textContent;

        // Get the position of the word relative to the text content
        const wordRect = wordEl.getBoundingClientRect();
        const contentRect = textContent.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate line height (font-size * line-height)
        const computedStyle = getComputedStyle(textContent);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = fontSize * 2; // line-height is 2

        // Calculate the word's position relative to container top
        const wordTopRelative = wordRect.top - containerRect.top;

        // If word is below the first line, scroll up
        if (wordTopRelative > lineHeight) {
            // Calculate how many lines to scroll
            const linesToScroll = Math.floor(wordTopRelative / lineHeight) - 0;
            const scrollAmount = linesToScroll * lineHeight;

            // Get current transform value
            const currentTransform = textContent.style.transform;
            const currentY = currentTransform ?
                parseFloat(currentTransform.replace('translateY(', '').replace('px)', '')) || 0 : 0;

            // Apply new scroll position
            const newY = currentY - scrollAmount;
            textContent.style.transform = `translateY(${newY}px)`;
        }
    }

    /**
     * Start the test
     */
    startTest() {
        this.state.isActive = true;
        this.state.startTime = Date.now();

        // Start timer for time-based mode
        if (this.state.mode === 'time') {
            let timeLeft = this.state.modeValue;
            this.elements.liveTimer.textContent = timeLeft;

            this.state.timerInterval = setInterval(() => {
                timeLeft--;
                this.elements.liveTimer.textContent = timeLeft;

                if (timeLeft <= 0) {
                    this.endTest();
                }
            }, 1000);
        }
    }

    /**
     * End the test
     */
    endTest() {
        this.state.isActive = false;
        this.state.isFinished = true;
        this.state.endTime = Date.now();

        // Clear timer
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
            this.state.timerInterval = null;
        }

        // Calculate results
        const results = this.calculateResults();

        // Save results
        dataService.saveResult(results);

        // Show results modal
        this.showResults(results);
    }

    /**
     * Calculate test results
     */
    calculateResults() {
        const duration = (this.state.endTime - this.state.startTime) / 1000; // in seconds
        const minutes = duration / 60;

        const totalChars = this.state.correctChars + this.state.incorrectChars;

        // Calculate WPM (standard: 5 characters = 1 word)
        const wpm = Math.round((this.state.correctChars / 5) / minutes);

        // Calculate accuracy
        const accuracy = totalChars > 0
            ? Math.round((this.state.correctChars / totalChars) * 100)
            : 100;

        return {
            wpm,
            accuracy,
            correctChars: this.state.correctChars,
            incorrectChars: this.state.incorrectChars,
            totalChars,
            completedWords: this.state.completedWords,
            duration: Math.round(duration),
            mode: this.state.mode,
            modeValue: this.state.modeValue,
            difficulty: this.settings.difficulty,
            language: this.settings.language
        };
    }

    /**
     * Show results modal
     */
    showResults(results) {
        this.elements.resultWpm.textContent = results.wpm;
        this.elements.resultAccuracy.textContent = results.accuracy + '%';
        this.elements.resultChars.textContent = results.totalChars;
        this.elements.resultErrors.textContent = results.incorrectChars;
        this.elements.correctChars.textContent = results.correctChars;
        this.elements.incorrectChars.textContent = results.incorrectChars;
        this.elements.completedWords.textContent = results.completedWords;
        this.elements.totalTime.textContent = results.duration + 's';

        this.elements.resultsModal.classList.remove('hidden');
    }

    /**
     * Update live stats display
     */
    updateLiveStats() {
        if (!this.state.startTime) return;

        const elapsed = (Date.now() - this.state.startTime) / 1000;
        const minutes = elapsed / 60;

        if (minutes > 0) {
            const wpm = Math.round((this.state.correctChars / 5) / minutes);
            this.elements.liveWpm.textContent = wpm;
        }

        const totalTyped = this.state.correctChars + this.state.incorrectChars;
        const accuracy = totalTyped > 0
            ? Math.round((this.state.correctChars / totalTyped) * 100)
            : 100;
        this.elements.liveAccuracy.textContent = accuracy;

        // Update word count for word mode
        if (this.state.mode === 'words') {
            const remaining = this.state.modeValue - this.state.currentWordIndex;
            this.elements.liveTimer.textContent = remaining;
        }
    }

    /**
     * Update timer display
     */
    updateTimerDisplay() {
        if (this.state.mode === 'time') {
            this.elements.liveTimer.textContent = this.state.modeValue;
            this.elements.timerLabel.textContent = 'detik';
        } else {
            this.elements.liveTimer.textContent = this.state.modeValue;
            this.elements.timerLabel.textContent = 'kata';
        }
    }

    /**
     * Restart the same test
     */
    restartTest() {
        this.resetState();
        this.renderText();
        this.updateTimerDisplay();
        this.elements.typingInput.value = '';
        this.elements.typingInput.focus();
        this.elements.resultsModal.classList.add('hidden');
    }

    /**
     * Generate new test
     */
    newTest() {
        this.resetState();
        this.generateTest();
        this.elements.typingInput.value = '';
        this.elements.typingInput.focus();
        this.elements.resultsModal.classList.add('hidden');
    }

    /**
     * Try again from modal
     */
    tryAgain() {
        this.restartTest();
    }

    /**
     * New test from modal
     */
    newTestFromModal() {
        this.newTest();
    }

    /**
     * Reset test state
     */
    resetState() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }

        this.state.isActive = false;
        this.state.isFinished = false;
        this.state.startTime = null;
        this.state.endTime = null;
        this.state.timerInterval = null;
        this.state.currentWordIndex = 0;
        this.state.currentCharIndex = 0;
        this.state.correctChars = 0;
        this.state.incorrectChars = 0;
        this.state.completedWords = 0;

        // Reset live stats
        this.elements.liveWpm.textContent = '0';
        this.elements.liveAccuracy.textContent = '100';

        // Reset scroll position
        if (this.elements.textContent) {
            this.elements.textContent.style.transform = 'translateY(0)';
        }
    }

    /**
     * Handle input focus
     */
    handleInputFocus() {
        this.elements.textDisplay.classList.add('focused');
    }

    /**
     * Handle input blur
     */
    handleInputBlur() {
        this.elements.textDisplay.classList.remove('focused');
    }

    /**
     * Render virtual keyboard
     */
    renderKeyboard() {
        let html = '';

        this.keyboardLayout.forEach(row => {
            html += '<div class="keyboard-row">';

            row.forEach(key => {
                const isSpace = key === 'space';
                const keyClass = isSpace ? 'key space' : 'key';
                const displayKey = isSpace ? 'Space' : key;

                html += `<div class="${keyClass}" data-key="${key}">${displayKey}</div>`;
            });

            html += '</div>';
        });

        this.elements.virtualKeyboard.innerHTML = html;

        // Show/hide based on settings
        this.updateKeyboardVisibility();
    }

    /**
     * Highlight key on keyboard
     */
    highlightKey(key, isActive) {
        const keyLower = key.toLowerCase();
        const keyEl = this.elements.virtualKeyboard?.querySelector(`[data-key="${keyLower === ' ' ? 'space' : keyLower}"]`);

        if (keyEl) {
            keyEl.classList.toggle('active', isActive);
        }
    }

    /**
     * Update keyboard visibility
     */
    updateKeyboardVisibility() {
        if (this.settings.showKeyboard) {
            this.elements.keyboardContainer?.classList.add('show');
        } else {
            this.elements.keyboardContainer?.classList.remove('show');
        }
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        const saved = dataService.getSettings();
        this.settings = { ...this.settings, ...saved };

        // Update UI elements
        if (this.elements.themeSetting) this.elements.themeSetting.value = this.settings.theme;
        if (this.elements.fontSizeSetting) this.elements.fontSizeSetting.value = this.settings.fontSize;
        if (this.elements.showKeyboardSetting) this.elements.showKeyboardSetting.checked = this.settings.showKeyboard;
        if (this.elements.languageSetting) this.elements.languageSetting.value = this.settings.language;
        if (this.elements.difficultySetting) this.elements.difficultySetting.value = this.settings.difficulty;
        if (this.elements.soundSetting) this.elements.soundSetting.checked = this.settings.sound;
        if (this.elements.autoClearSetting) this.elements.autoClearSetting.checked = this.settings.autoClear;
    }

    /**
     * Apply current settings
     */
    applySettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.theme);

        // Apply font size
        document.documentElement.setAttribute('data-font-size', this.settings.fontSize);

        // Apply keyboard visibility
        this.updateKeyboardVisibility();
    }

    /**
     * Update a single setting
     */
    updateSetting(key, value) {
        this.settings[key] = value;
        dataService.saveSettings(this.settings);
        this.applySettings();

        // Regenerate test if language or difficulty changed
        if (key === 'language' || key === 'difficulty') {
            this.newTest();
        }
    }

    /**
     * Update stats display
     */
    updateStatsDisplay() {
        const stats = dataService.getStats();
        const history = dataService.getHistory();

        this.elements.bestWpm.textContent = stats.bestWpm;
        this.elements.avgWpm.textContent = stats.avgWpm;
        this.elements.avgAccuracy.textContent = stats.avgAccuracy + '%';
        this.elements.totalTests.textContent = stats.totalTests;

        // Render history
        this.renderHistory(history);
    }

    /**
     * Render test history
     */
    renderHistory(history) {
        if (!history || history.length === 0) {
            this.elements.historyList.innerHTML = '<p class="empty-history">Belum ada riwayat tes</p>';
            return;
        }

        let html = '';

        history.slice(0, 20).forEach(item => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });

            html += `
                <div class="history-item">
                    <span class="history-date">${dateStr}</span>
                    <div class="history-stats">
                        <span class="history-wpm">${item.wpm} WPM</span>
                        <span class="history-accuracy">${item.accuracy}%</span>
                    </div>
                </div>
            `;
        });

        this.elements.historyList.innerHTML = html;
    }

    /**
     * Clear test history
     */
    clearHistory() {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat tes?')) {
            dataService.clearHistory();
            this.updateStatsDisplay();
        }
    }

    /**
     * Play key sound
     */
    playKeySound() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return;
            }
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    /**
     * Show/hide loading overlay
     */
    showLoading(show) {
        if (this.elements.loadingOverlay) {
            this.elements.loadingOverlay.classList.toggle('hidden', !show);
        }
    }

    /**
     * Shuffle array helper
     */
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.keyTypingApp = new KeyTypingApp();
});
