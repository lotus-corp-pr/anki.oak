// ===== Bustabieren - Practice Page JavaScript =====

// State
let state = {
    currentLevel: 'a1',
    currentDeck: [],
    currentWordIndex: 0,
    currentWord: null,
    correctCount: 0,
    incorrectCount: 0,
    streak: 0,
    maxStreak: 0,
    completedWords: [],
    settings: {
        autoPlay: true,
        caseSensitive: false,
        showTranslation: true
    }
};

// DOM Elements
const elements = {
    // Level selector
    levelButtons: document.querySelectorAll('.level-btn'),
    currentLevelDisplay: document.getElementById('currentLevel'),
    
    // Practice card
    practiceCard: document.getElementById('practiceCard'),
    resultCard: document.getElementById('resultCard'),
    playBtn: document.getElementById('playBtn'),
    wordInput: document.getElementById('wordInput'),
    cardCounter: document.getElementById('cardCounter'),
    audioHint: document.getElementById('audioHint'),
    inputHint: document.getElementById('inputHint'),
    
    // Result card
    resultIcon: document.getElementById('resultIcon'),
    resultTitle: document.getElementById('resultTitle'),
    resultWord: document.getElementById('resultWord'),
    resultTranslation: document.getElementById('resultTranslation'),
    resultDetails: document.getElementById('resultDetails'),
    userAnswer: document.getElementById('userAnswer'),
    
    // Stats
    correctCount: document.getElementById('correctCount'),
    incorrectCount: document.getElementById('incorrectCount'),
    accuracy: document.getElementById('accuracy'),
    progressFill: document.getElementById('progressFill'),
    progressText: document.getElementById('progressText'),
    streakCount: document.getElementById('streakCount'),
    
    // Buttons
    submitBtn: document.getElementById('submitBtn'),
    skipBtn: document.getElementById('skipBtn'),
    nextBtn: document.getElementById('nextBtn'),
    
    // Modal
    deckModal: document.getElementById('deckModal'),
    modalClose: document.getElementById('modalClose'),
    deckList: document.getElementById('deckList'),
    
    // Settings
    settingsBtn: document.getElementById('settingsBtn'),
    settingsPanel: document.getElementById('settingsPanel'),
    autoPlayCheckbox: document.getElementById('autoPlay'),
    caseSensitiveCheckbox: document.getElementById('caseSensitive'),
    showTranslationCheckbox: document.getElementById('showTranslation')
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Practice page loaded!');
    
    // Load state from localStorage
    loadState();
    
    // Initialize event listeners
    initLevelSelector();
    initPracticeCard();
    initResultCard();
    initModal();
    initSettings();
    
    // Load deck and start practice
    loadDeck(state.currentLevel);
});

// ===== Load State =====
function loadState() {
    const savedState = localStorage.getItem('bustabierenState');
    if (savedState) {
        state = { ...state, ...JSON.parse(savedState) };
    }
    
    // Load settings
    const savedSettings = localStorage.getItem('bustabierenSettings');
    if (savedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
    
    // Update UI with loaded state
    updateSettingsUI();
}

// ===== Save State =====
function saveState() {
    localStorage.setItem('bustabierenState', JSON.stringify(state));
    localStorage.setItem('bustabierenSettings', JSON.stringify(state.settings));
}

// ===== Level Selector =====
function initLevelSelector() {
    elements.levelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            elements.levelButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Update state
            state.currentLevel = btn.dataset.level;
            state.currentLevelDisplay.textContent = `Nivel: ${btn.dataset.level.toUpperCase()}`;
            
            // Load deck for selected level
            loadDeck(state.currentLevel);
            
            // Reset practice
            resetPractice();
            
            // Save state
            saveState();
        });
    });
}

// ===== Load Deck =====
function loadDeck(level) {
    const decks = JSON.parse(localStorage.getItem('bustabierenDecks')) || window.Bustabieren?.decksData;
    
    if (!decks || !decks[level]) {
        console.error('No deck found for level:', level);
        return;
    }
    
    state.currentDeck = [...decks[level]];
    state.currentWordIndex = 0;
    
    // Shuffle deck
    shuffleDeck();
    
    // Load first word
    loadNextWord();
    
    console.log(`📚 Loaded deck for level ${level}:`, state.currentDeck.length, 'words');
}

// ===== Shuffle Deck =====
function shuffleDeck() {
    // Fisher-Yates shuffle algorithm
    for (let i = state.currentDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.currentDeck[i], state.currentDeck[j]] = [state.currentDeck[j], state.currentDeck[i]];
    }
}

// ===== Load Next Word =====
function loadNextWord() {
    if (state.currentWordIndex >= state.currentDeck.length) {
        // All words completed
        showCompletionMessage();
        return;
    }
    
    state.currentWord = state.currentDeck[state.currentWordIndex];
    
    // Update UI
    updateCardUI();
    
    // Auto-play audio if setting is enabled
    if (state.settings.autoPlay) {
        setTimeout(() => playAudio(), 300);
    }
    
    // Focus input
    setTimeout(() => elements.wordInput.focus(), 100);
}

// ===== Update Card UI =====
function updateCardUI() {
    // Update counter
    elements.cardCounter.textContent = `${state.currentWordIndex + 1} / ${state.currentDeck.length}`;
    
    // Update level display
    elements.currentLevelDisplay.textContent = `Nivel: ${state.currentLevel.toUpperCase()}`;
    
    // Clear input
    elements.wordInput.value = '';
    elements.wordInput.classList.remove('correct', 'incorrect');
    elements.inputHint.textContent = '';
    elements.inputHint.classList.remove('error');
    
    // Update progress
    updateProgress();
    
    // Update stats
    updateStats();
    
    // Show practice card, hide result card
    elements.practiceCard.classList.remove('hidden');
    elements.resultCard.classList.add('hidden');
    
    // Stop any playing audio
    stopAudio();
}

// ===== Play Audio =====
let audioContext = null;
let audioSource = null;

function playAudio() {
    // Stop any currently playing audio
    stopAudio();
    
    // Create audio context if not exists
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Create oscillator for placeholder audio
    // In production, you would use actual audio files
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // Create a simple tone for demonstration
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Visual feedback
    elements.playBtn.classList.add('playing');
    elements.audioHint.textContent = 'Reproduciendo...';
    
    // Remove playing class after animation
    setTimeout(() => {
        elements.playBtn.classList.remove('playing');
        elements.audioHint.textContent = 'Escucha la palabra';
    }, 500);
    
    // In production, you would use:
    // const audio = new Audio(`assets/audios/${state.currentWord.audio}`);
    // audio.play().catch(e => console.log('Audio playback failed:', e));
}

// ===== Stop Audio =====
function stopAudio() {
    if (audioSource) {
        audioSource.stop();
        audioSource = null;
    }
    
    elements.playBtn.classList.remove('playing');
    elements.audioHint.textContent = 'Escucha la palabra';
}

// ===== Practice Card Event Listeners =====
function initPracticeCard() {
    // Play button
    elements.playBtn.addEventListener('click', () => {
        playAudio();
    });
    
    // Word input
    elements.wordInput.addEventListener('input', () => {
        // Clear error state on input
        elements.wordInput.classList.remove('incorrect');
        elements.inputHint.textContent = '';
        elements.inputHint.classList.remove('error');
    });
    
    elements.wordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Submit button
    elements.submitBtn.addEventListener('click', () => {
        checkAnswer();
    });
    
    // Skip button
    elements.skipBtn.addEventListener('click', () => {
        skipWord();
    });
}

// ===== Check Answer =====
function checkAnswer() {
    const userAnswer = elements.wordInput.value.trim();
    
    if (!userAnswer) {
        elements.inputHint.textContent = 'Por favor, escribe una palabra';
        elements.inputHint.classList.add('error');
        elements.wordInput.classList.add('incorrect');
        elements.wordInput.classList.add('shake');
        setTimeout(() => elements.wordInput.classList.remove('shake'), 300);
        return;
    }
    
    // Check if answer is correct
    const isCorrect = state.settings.caseSensitive 
        ? state.currentWord.word === userAnswer
        : state.currentWord.word.toLowerCase() === userAnswer.toLowerCase();
    
    // Update state
    if (isCorrect) {
        state.correctCount++;
        state.streak++;
        state.maxStreak = Math.max(state.maxStreak, state.streak);
        state.completedWords.push(state.currentWord.id);
    } else {
        state.incorrectCount++;
        state.streak = 0;
    }
    
    // Show result
    showResult(isCorrect, userAnswer);
    
    // Save state
    saveState();
}

// ===== Skip Word =====
function skipWord() {
    // Mark as skipped (not counted in stats)
    state.currentWordIndex++;
    loadNextWord();
}

// ===== Show Result =====
function showResult(isCorrect, userAnswer) {
    // Hide practice card
    elements.practiceCard.classList.add('hidden');
    
    // Update result card
    if (isCorrect) {
        elements.resultIcon.textContent = '✅';
        elements.resultTitle.textContent = '¡Correcto!';
        elements.resultTitle.classList.remove('incorrect');
        elements.resultTitle.classList.add('correct');
    } else {
        elements.resultIcon.textContent = '❌';
        elements.resultTitle.textContent = 'Incorrecto';
        elements.resultTitle.classList.remove('correct');
        elements.resultTitle.classList.add('incorrect');
    }
    
    elements.resultWord.textContent = state.currentWord.word;
    
    // Show translation if setting is enabled
    if (state.settings.showTranslation) {
        elements.resultTranslation.textContent = `(${state.currentWord.translation})`;
    } else {
        elements.resultTranslation.textContent = '';
    }
    
    // Update user answer
    elements.userAnswer.textContent = userAnswer || '(No respondiste)';
    
    // Show result card
    elements.resultCard.classList.remove('hidden');
    
    // Update stats
    updateStats();
}

// ===== Result Card Event Listeners =====
function initResultCard() {
    elements.nextBtn.addEventListener('click', () => {
        state.currentWordIndex++;
        loadNextWord();
    });
}

// ===== Update Stats =====
function updateStats() {
    const totalAnswers = state.correctCount + state.incorrectCount;
    const accuracy = totalAnswers > 0 ? Math.round((state.correctCount / totalAnswers) * 100) : 0;
    
    // Update UI
    elements.correctCount.textContent = state.correctCount;
    elements.incorrectCount.textContent = state.incorrectCount;
    elements.accuracy.textContent = `${accuracy}%`;
    elements.streakCount.textContent = state.streak;
    
    // Update accuracy color
    if (accuracy >= 80) {
        elements.accuracy.style.color = 'var(--success-color)';
    } else if (accuracy >= 50) {
        elements.accuracy.style.color = 'var(--warning-color)';
    } else {
        elements.accuracy.style.color = 'var(--danger-color)';
    }
}

// ===== Update Progress =====
function updateProgress() {
    const progress = state.currentWordIndex > 0 
        ? Math.round(((state.currentWordIndex) / state.currentDeck.length) * 100)
        : 0;
    
    elements.progressFill.style.width = `${progress}%`;
    elements.progressText.textContent = `${progress}%`;
}

// ===== Show Completion Message =====
function showCompletionMessage() {
    // Hide practice card
    elements.practiceCard.classList.add('hidden');
    
    // Update result card for completion
    elements.resultIcon.textContent = '🎉';
    elements.resultTitle.textContent = '¡Deck Completado!';
    elements.resultTitle.classList.remove('incorrect');
    elements.resultTitle.classList.add('correct');
    elements.resultWord.textContent = '';
    elements.resultTranslation.textContent = `Has completado todas las palabras del nivel ${state.currentLevel.toUpperCase()}`;
    elements.resultDetails.innerHTML = `
        <p><strong>Correctas:</strong> ${state.correctCount}</p>
        <p><strong>Incorrectas:</strong> ${state.incorrectCount}</p>
        <p><strong>Precisión:</strong> ${elements.accuracy.textContent}</p>
        <p><strong>Mejor racha:</strong> ${state.maxStreak}</p>
    `;
    
    // Update next button text
    elements.nextBtn.textContent = 'Volver a Empezar';
    
    // Show result card
    elements.resultCard.classList.remove('hidden');
    
    // Reset next button click handler
    elements.nextBtn.onclick = () => {
        resetPractice();
        loadNextWord();
    };
}

// ===== Reset Practice =====
function resetPractice() {
    state.currentWordIndex = 0;
    state.correctCount = 0;
    state.incorrectCount = 0;
    state.streak = 0;
    state.completedWords = [];
    
    // Shuffle deck again
    shuffleDeck();
    
    // Update UI
    updateStats();
    updateProgress();
    elements.streakCount.textContent = '0';
    
    // Reset next button
    elements.nextBtn.textContent = 'Siguiente →';
    elements.nextBtn.onclick = () => {
        state.currentWordIndex++;
        loadNextWord();
    };
    
    // Save state
    saveState();
}

// ===== Modal =====
function initModal() {
    // Close modal
    elements.modalClose.addEventListener('click', () => {
        elements.deckModal.classList.add('hidden');
    });
    
    // Close on overlay click
    elements.deckModal.addEventListener('click', (e) => {
        if (e.target === elements.deckModal) {
            elements.deckModal.classList.add('hidden');
        }
    });
    
    // Load deck list
    loadDeckList();
}

// ===== Load Deck List =====
function loadDeckList() {
    const decks = JSON.parse(localStorage.getItem('bustabierenDecks')) || window.Bustabieren?.decksData;
    
    if (!decks) {
        elements.deckList.innerHTML = '<p>No hay decks disponibles</p>';
        return;
    }
    
    // Get all unique decks
    const allDecks = Object.keys(decks).flatMap(level => 
        decks[level].map(word => ({ ...word, level }))
    );
    
    // Group by level
    const decksByLevel = {};
    allDecks.forEach(deck => {
        if (!decksByLevel[deck.level]) {
            decksByLevel[deck.level] = [];
        }
        decksByLevel[deck.level].push(deck);
    });
    
    // Create deck list HTML
    let html = '';
    Object.keys(decksByLevel).forEach(level => {
        html += `
            <div class="deck-group">
                <h3 class="deck-group-title">Nivel ${level.toUpperCase()} (${decksByLevel[level].length} palabras)</h3>
                ${decksByLevel[level].map(deck => `
                    <div class="deck-item" data-level="${level}" data-word="${deck.word}">
                        <strong>${deck.word}</strong> - ${deck.translation}
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    elements.deckList.innerHTML = html;
    
    // Add click handlers to deck items
    document.querySelectorAll('.deck-item').forEach(item => {
        item.addEventListener('click', () => {
            const level = item.dataset.level;
            const word = item.dataset.word;
            
            // Find the word in the deck
            const deck = decks[level];
            const wordIndex = deck.findIndex(w => w.word === word);
            
            if (wordIndex !== -1) {
                // Set current level and word
                state.currentLevel = level;
                state.currentDeck = [...deck];
                state.currentWordIndex = wordIndex;
                
                // Update UI
                elements.levelButtons.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.level === level) {
                        btn.classList.add('active');
                    }
                });
                
                // Close modal and load word
                elements.deckModal.classList.add('hidden');
                updateCardUI();
                loadNextWord();
            }
        });
    });
}

// ===== Settings =====
function initSettings() {
    // Toggle settings panel
    elements.settingsBtn.addEventListener('click', () => {
        elements.settingsPanel.classList.toggle('hidden');
    });
    
    // Auto-play checkbox
    elements.autoPlayCheckbox.addEventListener('change', (e) => {
        state.settings.autoPlay = e.target.checked;
        saveState();
    });
    
    // Case-sensitive checkbox
    elements.caseSensitiveCheckbox.addEventListener('change', (e) => {
        state.settings.caseSensitive = e.target.checked;
        saveState();
    });
    
    // Show translation checkbox
    elements.showTranslationCheckbox.addEventListener('change', (e) => {
        state.settings.showTranslation = e.target.checked;
        saveState();
    });
}

// ===== Update Settings UI =====
function updateSettingsUI() {
    elements.autoPlayCheckbox.checked = state.settings.autoPlay;
    elements.caseSensitiveCheckbox.checked = state.settings.caseSensitive;
    elements.showTranslationCheckbox.checked = state.settings.showTranslation;
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Space bar to play audio
    if (e.code === 'Space' && e.target !== elements.wordInput) {
        e.preventDefault();
        playAudio();
    }
    
    // Escape to stop audio
    if (e.code === 'Escape') {
        stopAudio();
    }
});

// ===== Export for other scripts =====
window.BustabierenPractice = {
    state,
    loadDeck,
    loadNextWord,
    checkAnswer,
    playAudio,
    stopAudio,
    resetPractice,
    getCurrentWord: () => state.currentWord
};

// ===== Console Log =====
console.log(`
%c🎯 Bustabieren Practice Mode
%c========================================
%cNivel actual: ${state.currentLevel.toUpperCase()}
%cPalabras correctas: ${state.correctCount}
%cPalabras incorrectas: ${state.incorrectCount}
%cRacha: ${state.streak}
%cMejor racha: ${state.maxStreak}

%cControles:
%c- ESPACIO: Reproducir audio
%c- ENTER: Verificar respuesta
%c- ESC: Detener audio

`, 
'font-size: 18px; font-weight: bold; color: #4a6bff;',
'color: #2c3e50;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #2c3e50; font-weight: bold;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;'
);
