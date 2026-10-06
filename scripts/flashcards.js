// ===== Bustabieren - Flashcards Page JavaScript =====

// State
let flashcardState = {
    words: [],
    filteredWords: [],
    currentIndex: 0,
    currentWord: null,
    isFlipped: false,
    currentLevel: 'todos',
    sortBy: 'random',
    settings: {
        autoSpeak: true,
        autoFlip: false,
        showTranslationFirst: false,
        voice: null
    },
    autoFlipTimer: null
};

// DOM Elements
const flashcardElements = {
    // Display
    flashcardDisplay: document.getElementById('flashcardDisplay'),
    flashcard: document.getElementById('flashcard'),
    flashcardInner: document.getElementById('flashcardInner'),
    flashcardFront: document.getElementById('flashcardFront'),
    flashcardBack: document.getElementById('flashcardBack'),
    
    // Content
    cardLevelBadge: document.getElementById('cardLevelBadge'),
    cardLevelBadgeBack: document.getElementById('cardLevelBadgeBack'),
    cardWord: document.getElementById('cardWord'),
    cardWordBack: document.getElementById('cardWordBack'),
    cardHint: document.querySelector('.card-hint'),
    cardTranslation: document.getElementById('cardTranslation'),
    
    // Actions
    speakBtn: document.getElementById('speakBtn'),
    speakBtnBack: document.getElementById('speakBtnBack'),
    shuffleBtn: document.getElementById('shuffleBtn'),
    nextBtn: document.getElementById('nextBtn'),
    nextBtnNav: document.getElementById('nextBtnNav'),
    prevBtn: document.getElementById('prevBtn'),
    
    // Empty State
    emptyState: document.getElementById('emptyState'),
    
    // Word List
    wordListContainer: document.getElementById('wordListContainer'),
    wordList: document.getElementById('wordList'),
    toggleListBtn: document.getElementById('toggleListBtn'),
    
    // Stats
    totalWords: document.getElementById('totalWords'),
    currentIndex: document.getElementById('currentIndex'),
    totalIndex: document.getElementById('totalIndex'),
    
    // Filters
    filterButtons: document.querySelectorAll('.filter-btn'),
    sortSelect: document.getElementById('sortSelect'),
    
    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    modalCloseSettings: document.getElementById('modalCloseSettings'),
    cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    
    // Settings
    autoSpeak: document.getElementById('autoSpeak'),
    autoFlip: document.getElementById('autoFlip'),
    showTranslationFirst: document.getElementById('showTranslationFirst'),
    voiceSelect: document.getElementById('voiceSelect')
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🃏 Flashcards page loaded!');
    
    // Load words from localStorage
    loadWords();
    
    // Load settings
    loadSettings();
    
    // Initialize event listeners
    initFilters();
    initSort();
    initNavigation();
    initActions();
    initWordList();
    initSettings();
    
    // Load voices
    loadVoices();
    
    // Update UI
    updateUI();
});

// ===== Load Words =====
function loadWords() {
    const words = JSON.parse(localStorage.getItem('bustabierenWords')) || [];
    
    if (words.length === 0) {
        // Show empty state
        flashcardElements.flashcardDisplay.classList.add('hidden');
        flashcardElements.emptyState.classList.remove('hidden');
        flashcardElements.wordListContainer.classList.add('hidden');
        return;
    }
    
    flashcardState.words = words;
    flashcardState.filteredWords = [...words];
    
    // Sort initially
    sortWords();
    
    // Set first word
    setCurrentWord(0);
    
    // Update UI
    updateWordList();
    updateStats();
}

// ===== Load Settings =====
function loadSettings() {
    const savedSettings = localStorage.getItem('bustabierenFlashcardSettings');
    if (savedSettings) {
        flashcardState.settings = { ...flashcardState.settings, ...JSON.parse(savedSettings) };
    }
    
    // Update UI
    updateSettingsUI();
}

// ===== Save Settings =====
function saveSettings() {
    localStorage.setItem('bustabierenFlashcardSettings', JSON.stringify(flashcardState.settings));
}

// ===== Update Settings UI =====
function updateSettingsUI() {
    flashcardElements.autoSpeak.checked = flashcardState.settings.autoSpeak;
    flashcardElements.autoFlip.checked = flashcardState.settings.autoFlip;
    flashcardElements.showTranslationFirst.checked = flashcardState.settings.showTranslationFirst;
}

// ===== Load Voices =====
function loadVoices() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported in this browser');
        return;
    }
    
    // Load voices
    const voices = window.speechSynthesis.getVoices();
    
    // Clear existing options
    flashcardElements.voiceSelect.innerHTML = '<option value="">Voz por defecto (Alemán)</option>';
    
    // Add German voices
    const germanVoices = voices.filter(voice => voice.lang.includes('de'));
    
    if (germanVoices.length > 0) {
        germanVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${voice.lang})`;
            flashcardElements.voiceSelect.appendChild(option);
        });
    } else {
        // Add fallback option
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No se encontraron voces en alemán';
        option.disabled = true;
        flashcardElements.voiceSelect.appendChild(option);
    }
    
    // Chrome loads voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
}

// ===== Filters =====
function initFilters() {
    flashcardElements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            flashcardElements.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const level = btn.dataset.level;
            flashcardState.currentLevel = level;
            
            filterWords();
            
            // Reset to first word
            setCurrentWord(0);
        });
    });
}

// ===== Filter Words =====
function filterWords() {
    if (flashcardState.currentLevel === 'todos') {
        flashcardState.filteredWords = [...flashcardState.words];
    } else {
        flashcardState.filteredWords = flashcardState.words.filter(
            w => w.level === flashcardState.currentLevel
        );
    }
    
    // Re-sort
    sortWords();
    
    // Update UI
    updateWordList();
    updateStats();
}

// ===== Sort =====
function initSort() {
    flashcardElements.sortSelect.addEventListener('change', (e) => {
        flashcardState.sortBy = e.target.value;
        sortWords();
        
        // Reset to first word
        setCurrentWord(0);
    });
}

// ===== Sort Words =====
function sortWords() {
    switch (flashcardState.sortBy) {
        case 'abc':
            flashcardState.filteredWords.sort((a, b) => 
                a.word.localeCompare(b.word, 'de')
            );
            break;
        case 'level':
            const levelOrder = { facil: 1, medio: 2, dificil: 3 };
            flashcardState.filteredWords.sort((a, b) => 
                levelOrder[a.level] - levelOrder[b.level] || a.word.localeCompare(b.word, 'de')
            );
            break;
        case 'random':
        default:
            // Shuffle
            for (let i = flashcardState.filteredWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [flashcardState.filteredWords[i], flashcardState.filteredWords[j]] = 
                    [flashcardState.filteredWords[j], flashcardState.filteredWords[i]];
            }
            break;
    }
    
    // Update UI
    updateWordList();
}

// ===== Navigation =====
function initNavigation() {
    // Previous button
    flashcardElements.prevBtn.addEventListener('click', () => {
        clearAutoFlipTimer();
        if (flashcardState.isFlipped) {
            flipCard();
        }
        goToWord(-1);
    });
    
    // Next button (in card)
    flashcardElements.nextBtn.addEventListener('click', () => {
        clearAutoFlipTimer();
        goToWord(1);
    });
    
    // Next button (navigation)
    flashcardElements.nextBtnNav.addEventListener('click', () => {
        clearAutoFlipTimer();
        if (flashcardState.isFlipped) {
            flipCard();
        }
        goToWord(1);
    });
    
    // Shuffle button
    flashcardElements.shuffleBtn.addEventListener('click', () => {
        clearAutoFlipTimer();
        flashcardState.sortBy = 'random';
        flashcardElements.sortSelect.value = 'random';
        sortWords();
        setCurrentWord(0);
    });
    
    // Toggle word list
    flashcardElements.toggleListBtn.addEventListener('click', () => {
        flashcardElements.wordList.classList.toggle('hidden');
        const isHidden = flashcardElements.wordList.classList.contains('hidden');
        flashcardElements.toggleListBtn.textContent = isHidden ? '↑ Ocultar' : '↓ Mostrar';
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            clearAutoFlipTimer();
            if (flashcardState.isFlipped) {
                flipCard();
            }
            goToWord(-1);
        } else if (e.key === 'ArrowRight') {
            clearAutoFlipTimer();
            goToWord(1);
        } else if (e.key === 'ArrowUp' || e.key === ' ') {
            e.preventDefault();
            flipCard();
        }
    });
}

// ===== Go To Word =====
function goToWord(direction) {
    const newIndex = flashcardState.currentIndex + direction;
    
    if (newIndex >= 0 && newIndex < flashcardState.filteredWords.length) {
        setCurrentWord(newIndex);
    }
}

// ===== Set Current Word =====
function setCurrentWord(index) {
    // Clear auto flip timer
    clearAutoFlipTimer();
    
    // Update state
    flashcardState.currentIndex = index;
    flashcardState.currentWord = flashcardState.filteredWords[index];
    flashcardState.isFlipped = false;
    
    // Reset flip
    flashcardElements.flashcardInner.classList.remove('flipped');
    
    // Update UI
    updateFlashcard();
    updateWordList();
    updateStats();
    
    // Start auto flip timer if enabled
    startAutoFlipTimer();
}

// ===== Update Flashcard =====
function updateFlashcard() {
    if (!flashcardState.currentWord) return;
    
    const word = flashcardState.currentWord;
    
    // Update front
    flashcardElements.cardWord.textContent = word.word;
    flashcardElements.cardLevelBadge.textContent = `Nivel: ${formatLevel(word.level)}`;
    
    // Update back
    flashcardElements.cardWordBack.textContent = word.word;
    flashcardElements.cardTranslation.textContent = word.translation || 'Sin traducción';
    flashcardElements.cardLevelBadgeBack.textContent = `Nivel: ${formatLevel(word.level)}`;
    
    // Reset flip
    flashcardElements.flashcardInner.classList.remove('flipped');
    flashcardState.isFlipped = false;
}

// ===== Flip Card =====
function flipCard() {
    // Clear auto flip timer
    clearAutoFlipTimer();
    
    // Toggle flip
    flashcardState.isFlipped = !flashcardState.isFlipped;
    
    if (flashcardState.isFlipped) {
        flashcardElements.flashcardInner.classList.add('flipped');
        
        // Speak word if auto-speak is enabled
        if (flashcardState.settings.autoSpeak) {
            speakWord(flashcardState.currentWord.word);
        }
        
        // Start auto flip back timer if enabled
        if (flashcardState.settings.autoFlip) {
            startAutoFlipTimer();
        }
    } else {
        flashcardElements.flashcardInner.classList.remove('flipped');
    }
}

// ===== Speak Word =====
function speakWord(text) {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.warn('Web Speech API not supported in this browser');
        alert('La síntesis de voz no está soportada en tu navegador. Prueba con Chrome o Edge.');
        return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language to German
    utterance.lang = 'de-DE';
    
    // Set voice if selected
    if (flashcardState.settings.voice) {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === flashcardState.settings.voice);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
    }
    
    // Speak
    window.speechSynthesis.speak(utterance);
}

// ===== Start Auto Flip Timer =====
function startAutoFlipTimer() {
    // Clear existing timer
    clearAutoFlipTimer();
    
    // Only start if auto-flip is enabled
    if (flashcardState.settings.autoFlip && flashcardState.isFlipped) {
        flashcardState.autoFlipTimer = setTimeout(() => {
            flipCard();
        }, 5000); // 5 seconds
    }
}

// ===== Clear Auto Flip Timer =====
function clearAutoFlipTimer() {
    if (flashcardState.autoFlipTimer) {
        clearTimeout(flashcardState.autoFlipTimer);
        flashcardState.autoFlipTimer = null;
    }
}

// ===== Actions =====
function initActions() {
    // Speak button (front)
    flashcardElements.speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakWord(flashcardState.currentWord.word);
    });
    
    // Speak button (back)
    flashcardElements.speakBtnBack.addEventListener('click', (e) => {
        e.stopPropagation();
        speakWord(flashcardState.currentWord.word);
    });
    
    // Card click
    flashcardElements.flashcard.addEventListener('click', () => {
        flipCard();
    });
}

// ===== Word List =====
function initWordList() {
    // Nothing to initialize here
}

// ===== Update Word List =====
function updateWordList() {
    const wordList = flashcardElements.wordList;
    wordList.innerHTML = '';
    
    flashcardState.filteredWords.forEach((word, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = `word-item ${index === flashcardState.currentIndex ? 'active' : ''}`;
        wordItem.onclick = () => setCurrentWord(index);
        
        wordItem.innerHTML = `
            <div class="word-text">${word.word}</div>
            <div class="word-translation">${word.translation || '-'}</div>
            <span class="word-level ${word.level}">${formatLevel(word.level)}</span>
        `;
        
        wordList.appendChild(wordItem);
    });
}

// ===== Update Stats =====
function updateStats() {
    flashcardElements.totalWords.textContent = flashcardState.words.length;
    flashcardElements.currentIndex.textContent = flashcardState.currentIndex + 1;
    flashcardElements.totalIndex.textContent = flashcardState.filteredWords.length;
}

// ===== Settings =====
function initSettings() {
    // Open modal
    // Settings button would be added to header in future
    
    // Close modal
    flashcardElements.modalCloseSettings.addEventListener('click', () => {
        flashcardElements.settingsModal.classList.add('hidden');
    });
    
    // Close on overlay click
    flashcardElements.settingsModal.addEventListener('click', (e) => {
        if (e.target === flashcardElements.settingsModal) {
            flashcardElements.settingsModal.classList.add('hidden');
        }
    });
    
    // Cancel button
    flashcardElements.cancelSettingsBtn.addEventListener('click', () => {
        flashcardElements.settingsModal.classList.add('hidden');
    });
    
    // Save button
    flashcardElements.saveSettingsBtn.addEventListener('click', () => {
        flashcardState.settings.autoSpeak = flashcardElements.autoSpeak.checked;
        flashcardState.settings.autoFlip = flashcardElements.autoFlip.checked;
        flashcardState.settings.showTranslationFirst = flashcardElements.showTranslationFirst.checked;
        flashcardState.settings.voice = flashcardElements.voiceSelect.value;
        
        saveSettings();
        flashcardElements.settingsModal.classList.add('hidden');
    });
    
    // Voice select
    flashcardElements.voiceSelect.addEventListener('change', (e) => {
        flashcardState.settings.voice = e.target.value;
    });
}

// ===== Format Level =====
function formatLevel(level) {
    const levels = {
        'facil': 'Fácil',
        'medio': 'Media',
        'dificil': 'Difícil'
    };
    return levels[level] || level;
}

// ===== Update UI =====
function updateUI() {
    // Check if we have words
    if (flashcardState.words.length === 0) {
        flashcardElements.flashcardDisplay.classList.add('hidden');
        flashcardElements.emptyState.classList.remove('hidden');
        flashcardElements.wordListContainer.classList.add('hidden');
    } else {
        flashcardElements.flashcardDisplay.classList.remove('hidden');
        flashcardElements.emptyState.classList.add('hidden');
        flashcardElements.wordListContainer.classList.remove('hidden');
    }
}

// ===== Export for other scripts =====
window.BustabierenFlashcards = {
    flashcardState,
    setCurrentWord,
    flipCard,
    speakWord,
    formatLevel,
    loadWords
};

// ===== Console Log =====
console.log(`
%c🃏 Bustabieren Flashcards Mode
%c========================================
%cTotal palabras: ${flashcardState.words.length}
%cPalabra actual: ${flashcardState.currentWord ? flashcardState.currentWord.word : 'Ninguna'}
%cNivel: ${flashcardState.currentLevel}
%cOrden: ${flashcardState.sortBy}

%cControles:
%c- ← →: Navegar entre palabras
%c- ↑ o ESPACIO: Voltear tarjeta
%c- 🔊: Escuchar pronunciación
%c- 🔀: Barajar tarjetas

`, 
'font-size: 18px; font-weight: bold; color: #ff6b6b;',
'color: #2c3e50;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #2c3e50; font-weight: bold;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;'
);
