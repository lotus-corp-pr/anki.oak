// ===== Bustabieren - Competition Page JavaScript =====

// Game State
let gameState = {
    currentView: 'menu', // menu, lobby, game, results, publicGames
    room: null,
    player: null,
    players: [],
    game: null,
    timer: null,
    timeLeft: 0,
    currentQuestion: null,
    currentAnswer: '',
    score: 0,
    correctCount: 0,
    incorrectCount: 0,
    results: []
};

// DOM Elements
const compElements = {
    // Views
    menuView: document.querySelector('.competition-options'),
    lobbySection: document.getElementById('lobbySection'),
    gameSection: document.getElementById('gameSection'),
    resultsSection: document.getElementById('resultsSection'),
    publicGamesSection: document.getElementById('publicGamesSection'),
    
    // Lobby
    lobbyTitle: document.getElementById('lobbyTitle'),
    lobbySubtitle: document.getElementById('lobbySubtitle'),
    roomId: document.getElementById('roomId'),
    roomLevel: document.getElementById('roomLevel'),
    roomTime: document.getElementById('roomTime'),
    copyRoomId: document.getElementById('copyRoomId'),
    playerCount: document.getElementById('playerCount'),
    playersGrid: document.getElementById('playersGrid'),
    changeSettingsBtn: document.getElementById('changeSettingsBtn'),
    startGameBtn: document.getElementById('startGameBtn'),
    leaveLobbyBtn: document.getElementById('leaveLobbyBtn'),
    
    // Game
    gameTimer: document.getElementById('gameTimer'),
    gameScore: document.getElementById('gameScore'),
    gamePlayBtn: document.getElementById('gamePlayBtn'),
    gameWordInput: document.getElementById('gameWordInput'),
    gameSubmitBtn: document.getElementById('gameSubmitBtn'),
    opponentsGrid: document.getElementById('opponentsGrid'),
    
    // Results
    resultsSubtitle: document.getElementById('resultsSubtitle'),
    podium: document.getElementById('podium'),
    resultsTableBody: document.getElementById('resultsTableBody'),
    finalScore: document.getElementById('finalScore'),
    finalCorrect: document.getElementById('finalCorrect'),
    finalIncorrect: document.getElementById('finalIncorrect'),
    finalAccuracy: document.getElementById('finalAccuracy'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    backToLobbyBtn: document.getElementById('backToLobbyBtn'),
    backToHomeBtn: document.getElementById('backToHomeBtn'),
    
    // Public Games
    refreshGamesBtn: document.getElementById('refreshGamesBtn'),
    gamesList: document.getElementById('gamesList'),
    createPublicBtn: document.getElementById('createPublicBtn'),
    
    // Buttons
    joinPublicBtn: document.getElementById('joinPublicBtn'),
    createPrivateBtn: document.getElementById('createPrivateBtn'),
    
    // Modals
    settingsModal: document.getElementById('settingsModal'),
    createPrivateModal: document.getElementById('createPrivateModal'),
    
    // Modal Close Buttons
    modalCloseSettings: document.getElementById('modalCloseSettings'),
    modalCloseCreate: document.getElementById('modalCloseCreate'),
    
    // Settings Form
    settingsForm: document.getElementById('settingsForm'),
    gameLevel: document.getElementById('gameLevel'),
    timePerWord: document.getElementById('timePerWord'),
    maxPlayers: document.getElementById('maxPlayers'),
    numQuestions: document.getElementById('numQuestions'),
    allowSpectators: document.getElementById('allowSpectators'),
    
    // Create Private Form
    createPrivateForm: document.getElementById('createPrivateForm'),
    privateRoomName: document.getElementById('privateRoomName'),
    privateRoomLevel: document.getElementById('privateRoomLevel'),
    privateTimePerWord: document.getElementById('privateTimePerWord'),
    
    // Modal Buttons
    cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    cancelCreateBtn: document.getElementById('cancelCreateBtn'),
    createPrivateRoomBtn: document.getElementById('createPrivateRoomBtn')
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏆 Competition page loaded!');
    
    // Load saved settings
    loadSettings();
    
    // Initialize event listeners
    initMenu();
    initLobby();
    initGame();
    initResults();
    initPublicGames();
    initModals();
    
    // Generate player name if not exists
    if (!localStorage.getItem('bustabierenPlayerName')) {
        const names = ['Jugador', 'Ana', 'Carlos', 'Maria', 'Juan', 'Laura', 'Pedro', 'Sofia'];
        const randomName = names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000);
        localStorage.setItem('bustabierenPlayerName', randomName);
    }
    
    // Create sample public games for demo
    createSamplePublicGames();
});

// ===== Load Settings =====
function loadSettings() {
    const savedSettings = localStorage.getItem('bustabierenCompetitionSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        Object.assign(gameState, settings);
        updateSettingsUI();
    }
}

// ===== Save Settings =====
function saveSettings() {
    const settings = {
        gameLevel: compElements.gameLevel.value,
        timePerWord: compElements.timePerWord.value,
        maxPlayers: compElements.maxPlayers.value,
        numQuestions: compElements.numQuestions.value,
        allowSpectators: compElements.allowSpectators.checked
    };
    localStorage.setItem('bustabierenCompetitionSettings', JSON.stringify(settings));
}

// ===== Update Settings UI =====
function updateSettingsUI() {
    if (gameState.gameLevel) compElements.gameLevel.value = gameState.gameLevel;
    if (gameState.timePerWord) compElements.timePerWord.value = gameState.timePerWord;
    if (gameState.maxPlayers) compElements.maxPlayers.value = gameState.maxPlayers;
    if (gameState.numQuestions) compElements.numQuestions.value = gameState.numQuestions;
    if (gameState.allowSpectators !== undefined) compElements.allowSpectators.checked = gameState.allowSpectators;
}

// ===== Menu =====
function initMenu() {
    compElements.joinPublicBtn.addEventListener('click', () => {
        showPublicGames();
    });
    
    compElements.createPrivateBtn.addEventListener('click', () => {
        showCreatePrivateModal();
    });
}

// ===== Show Public Games =====
function showPublicGames() {
    gameState.currentView = 'publicGames';
    updateViewVisibility();
    refreshPublicGames();
}

// ===== Create Sample Public Games =====
function createSamplePublicGames() {
    const sampleGames = [
        { id: 'PUB-001', name: 'Partida Rápida A1', level: 'A1', players: 2, maxPlayers: 4, status: 'waiting', time: '15' },
        { id: 'PUB-002', name: 'Mixto Intermedio', level: 'mixed', players: 3, maxPlayers: 4, status: 'waiting', time: '20' },
        { id: 'PUB-003', name: 'Desafío B2', level: 'B2', players: 1, maxPlayers: 4, status: 'waiting', time: '15' },
        { id: 'PUB-004', name: 'Pros en Acción', level: 'C1', players: 4, maxPlayers: 4, status: 'playing', time: '10' }
    ];
    
    localStorage.setItem('bustabierenPublicGames', JSON.stringify(sampleGames));
}

// ===== Refresh Public Games =====
function refreshPublicGames() {
    const publicGames = JSON.parse(localStorage.getItem('bustabierenPublicGames')) || [];
    
    if (publicGames.length === 0) {
        compElements.gamesList.innerHTML = `
            <div class="no-games">
                <p>No hay partidas públicas disponibles</p>
                <p>Crea una sala privada o espera a que alguien cree una</p>
            </div>
        `;
        return;
    }
    
    compElements.gamesList.innerHTML = publicGames.map(game => `
        <div class="game-item" data-game-id="${game.id}">
            <div class="game-status ${game.status}">${game.status === 'waiting' ? '⏳' : '🎮'}</div>
            <div class="game-info">
                <div class="game-name">${game.name}</div>
                <div class="game-details">Nivel: ${formatLevel(game.level)} • ${game.time}s por palabra</div>
            </div>
            <div class="game-players">${game.players}/${game.maxPlayers} jugadores</div>
            <div class="game-actions">
                <button class="btn btn-primary join-game-btn" data-game-id="${game.id}">Unirse</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners to join buttons
    document.querySelectorAll('.join-game-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.gameId;
            joinPublicGame(gameId);
        });
    });
}

// ===== Join Public Game =====
function joinPublicGame(gameId) {
    const publicGames = JSON.parse(localStorage.getItem('bustabierenPublicGames')) || [];
    const game = publicGames.find(g => g.id === gameId);
    
    if (!game) {
        alert('Partida no encontrada');
        return;
    }
    
    if (game.status === 'playing') {
        alert('Esta partida ya ha comenzado. Por favor, elige otra.');
        return;
    }
    
    if (game.players >= game.maxPlayers) {
        alert('Esta partida está llena. Por favor, elige otra.');
        return;
    }
    
    // Create room
    createRoom({
        id: game.id,
        name: game.name,
        level: game.level,
        timePerWord: parseInt(game.time),
        maxPlayers: game.maxPlayers,
        isPublic: true
    });
    
    // Update game players count
    game.players++;
    localStorage.setItem('bustabierenPublicGames', JSON.stringify(publicGames));
    
    // Join room
    joinRoom(game.id, localStorage.getItem('bustabierenPlayerName'));
}

// ===== Public Games =====
function initPublicGames() {
    compElements.refreshGamesBtn.addEventListener('click', () => {
        refreshPublicGames();
    });
    
    compElements.createPublicBtn.addEventListener('click', () => {
        createPublicGame();
    });
}

// ===== Create Public Game =====
function createPublicGame() {
    const playerName = localStorage.getItem('bustabierenPlayerName') || 'Jugador';
    const roomId = generateRoomId();
    
    const game = {
        id: roomId,
        name: `${playerName}'s Public Game`,
        level: 'mixed',
        players: 1,
        maxPlayers: 4,
        status: 'waiting',
        time: '15'
    };
    
    // Add to public games
    const publicGames = JSON.parse(localStorage.getItem('bustabierenPublicGames')) || [];
    publicGames.push(game);
    localStorage.setItem('bustabierenPublicGames', JSON.stringify(publicGames));
    
    // Create room
    createRoom({
        id: roomId,
        name: game.name,
        level: game.level,
        timePerWord: 15,
        maxPlayers: 4,
        isPublic: true
    });
    
    // Join room
    joinRoom(roomId, playerName);
}

// ===== Modals =====
function initModals() {
    // Close modals
    compElements.modalCloseSettings.addEventListener('click', () => {
        compElements.settingsModal.classList.add('hidden');
    });
    
    compElements.modalCloseCreate.addEventListener('click', () => {
        compElements.createPrivateModal.classList.add('hidden');
    });
    
    // Close on overlay click
    [compElements.settingsModal, compElements.createPrivateModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Settings modal
    compElements.changeSettingsBtn.addEventListener('click', () => {
        showSettingsModal();
    });
    
    compElements.cancelSettingsBtn.addEventListener('click', () => {
        compElements.settingsModal.classList.add('hidden');
    });
    
    compElements.saveSettingsBtn.addEventListener('click', () => {
        saveSettings();
        compElements.settingsModal.classList.add('hidden');
        updateRoomInfo();
    });
    
    // Create private modal
    compElements.cancelCreateBtn.addEventListener('click', () => {
        compElements.createPrivateModal.classList.add('hidden');
    });
    
    compElements.createPrivateRoomBtn.addEventListener('click', () => {
        createPrivateRoom();
    });
}

// ===== Show Settings Modal =====
function showSettingsModal() {
    updateSettingsUI();
    compElements.settingsModal.classList.remove('hidden');
}

// ===== Show Create Private Modal =====
function showCreatePrivateModal() {
    compElements.createPrivateModal.classList.remove('hidden');
}

// ===== Create Private Room =====
function createPrivateRoom() {
    const roomName = compElements.privateRoomName.value.trim() || 'Mi Sala Privada';
    const playerName = localStorage.getItem('bustabierenPlayerName') || 'Jugador';
    const roomId = generateRoomId();
    
    // Create room
    createRoom({
        id: roomId,
        name: roomName,
        level: compElements.privateRoomLevel.value,
        timePerWord: parseInt(compElements.privateTimePerWord.value),
        maxPlayers: 4,
        isPublic: false
    });
    
    // Join room
    joinRoom(roomId, playerName);
    
    // Close modal
    compElements.createPrivateModal.classList.add('hidden');
}

// ===== Create Room =====
function createRoom(settings) {
    gameState.room = {
        id: settings.id,
        name: settings.name,
        level: settings.level,
        timePerWord: settings.timePerWord,
        maxPlayers: settings.maxPlayers,
        isPublic: settings.isPublic || false,
        status: 'waiting',
        createdAt: new Date().toISOString()
    };
    
    // Save room
    localStorage.setItem(`bustabierenRoom_${settings.id}`, JSON.stringify(gameState.room));
    
    console.log('📦 Room created:', gameState.room);
}

// ===== Join Room =====
function joinRoom(roomId, playerName) {
    gameState.player = {
        id: generatePlayerId(),
        name: playerName,
        score: 0,
        correct: 0,
        incorrect: 0,
        isHost: true, // First player is host
        isReady: false
    };
    
    gameState.players = [gameState.player];
    gameState.currentView = 'lobby';
    
    updateViewVisibility();
    updateLobby();
    
    console.log('👤 Player joined:', gameState.player);
}

// ===== Generate Player ID =====
function generatePlayerId() {
    return 'PLR-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ===== Update View Visibility =====
function updateViewVisibility() {
    // Hide all views
    compElements.menuView.style.display = 'none';
    compElements.lobbySection.classList.add('hidden');
    compElements.gameSection.classList.add('hidden');
    compElements.resultsSection.classList.add('hidden');
    compElements.publicGamesSection.classList.add('hidden');
    
    // Show current view
    switch (gameState.currentView) {
        case 'menu':
            compElements.menuView.style.display = 'flex';
            break;
        case 'lobby':
            compElements.lobbySection.classList.remove('hidden');
            break;
        case 'game':
            compElements.gameSection.classList.remove('hidden');
            break;
        case 'results':
            compElements.resultsSection.classList.remove('hidden');
            break;
        case 'publicGames':
            compElements.publicGamesSection.classList.remove('hidden');
            break;
    }
}

// ===== Lobby =====
function initLobby() {
    compElements.copyRoomId.addEventListener('click', () => {
        copyRoomId();
    });
    
    compElements.startGameBtn.addEventListener('click', () => {
        startGame();
    });
    
    compElements.leaveLobbyBtn.addEventListener('click', () => {
        leaveLobby();
    });
}

// ===== Update Lobby =====
function updateLobby() {
    if (!gameState.room) return;
    
    // Update room info
    updateRoomInfo();
    
    // Update players list
    updatePlayersList();
}

// ===== Update Room Info =====
function updateRoomInfo() {
    if (!gameState.room) return;
    
    compElements.roomId.textContent = gameState.room.id;
    compElements.roomLevel.textContent = formatLevel(gameState.room.level);
    compElements.roomTime.textContent = `${gameState.room.timePerWord} segundos`;
    compElements.playerCount.textContent = `${gameState.players.length}/${gameState.room.maxPlayers}`;
    
    // Update lobby title
    if (gameState.player.isHost) {
        compElements.lobbyTitle.textContent = 'Sala de Espera (Anfitrión)';
    } else {
        compElements.lobbyTitle.textContent = 'Sala de Espera';
    }
}

// ===== Format Level =====
function formatLevel(level) {
    const levels = {
        'a1': 'A1 - Principiante',
        'a2': 'A2 - Básico',
        'b1': 'B1 - Intermedio',
        'b2': 'B2 - Intermedio Alto',
        'c1': 'C1 - Avanzado',
        'mixed': 'Mixto (A1 - B2)'
    };
    return levels[level] || level;
}

// ===== Update Players List =====
function updatePlayersList() {
    compElements.playersGrid.innerHTML = gameState.players.map(player => `
        <div class="player-card ${player.isHost ? 'host' : ''}">
            <div class="player-avatar">👤</div>
            <div class="player-name">${player.name}</div>
            <div class="player-status ${player.isReady ? 'ready' : ''}">
                ${player.isReady ? 'Listo' : 'En espera'}
            </div>
        </div>
    `).join('');
}

// ===== Copy Room ID =====
function copyRoomId() {
    if (!gameState.room) return;
    
    navigator.clipboard.writeText(gameState.room.id).then(() => {
        compElements.copyRoomId.textContent = '✓';
        compElements.copyRoomId.classList.add('copied');
        
        setTimeout(() => {
            compElements.copyRoomId.textContent = '📋';
            compElements.copyRoomId.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('No se pudo copiar el ID de la sala');
    });
}

// ===== Start Game =====
function startGame() {
    if (!gameState.player.isHost) {
        alert('Solo el anfitrión puede iniciar la partida');
        return;
    }
    
    if (gameState.players.length < 2) {
        alert('Se necesitan al menos 2 jugadores para iniciar la partida');
        return;
    }
    
    // Create game
    gameState.game = {
        questions: generateQuestions(gameState.room.level, 10),
        currentQuestionIndex: 0,
        status: 'playing',
        startedAt: new Date().toISOString()
    };
    
    gameState.currentView = 'game';
    gameState.currentQuestion = gameState.game.questions[0];
    gameState.timeLeft = gameState.room.timePerWord;
    gameState.score = 0;
    gameState.correctCount = 0;
    gameState.incorrectCount = 0;
    
    updateViewVisibility();
    startGameTimer();
    loadQuestion();
    updateGameUI();
    updateOpponents();
    
    console.log('🎮 Game started:', gameState.game);
}

// ===== Generate Questions =====
function generateQuestions(level, count) {
    const decks = JSON.parse(localStorage.getItem('bustabierenDecks')) || window.Bustabieren?.decksData;
    
    let words = [];
    
    if (level === 'mixed') {
        // Get words from all levels
        Object.keys(decks).forEach(lvl => {
            words = words.concat(decks[lvl]);
        });
    } else {
        words = decks[level] || [];
    }
    
    // Shuffle and select
    words = [...words].sort(() => Math.random() - 0.5).slice(0, count);
    
    return words.map(word => ({
        id: word.id,
        word: word.word,
        translation: word.translation,
        audio: word.audio
    }));
}

// ===== Start Game Timer =====
function startGameTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        compElements.gameTimer.textContent = formatTime(gameState.timeLeft);
        
        // Add warning class when time is low
        if (gameState.timeLeft <= 5) {
            compElements.gameTimer.classList.add('warning');
        } else {
            compElements.gameTimer.classList.remove('warning');
        }
        
        if (gameState.timeLeft <= 0) {
            // Time's up!
            clearInterval(gameState.timer);
            submitAnswer();
        }
    }, 1000);
}

// ===== Load Question =====
function loadQuestion() {
    if (!gameState.currentQuestion) return;
    
    // Play audio automatically
    setTimeout(() => playAudio(gameState.currentQuestion.audio), 500);
    
    // Focus input
    setTimeout(() => compElements.gameWordInput.focus(), 100);
}

// ===== Play Audio =====
function playAudio(audioFile) {
    // In production, use actual audio files
    // For demo, we'll use the Web Audio API to create a simple tone
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Visual feedback
    compElements.gamePlayBtn.classList.add('playing');
    setTimeout(() => {
        compElements.gamePlayBtn.classList.remove('playing');
    }, 300);
}

// ===== Game =====
function initGame() {
    compElements.gamePlayBtn.addEventListener('click', () => {
        if (gameState.currentQuestion) {
            playAudio(gameState.currentQuestion.audio);
        }
    });
    
    compElements.gameWordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    
    compElements.gameSubmitBtn.addEventListener('click', () => {
        submitAnswer();
    });
}

// ===== Submit Answer =====
function submitAnswer() {
    const userAnswer = compElements.gameWordInput.value.trim();
    
    if (!userAnswer) {
        compElements.gameWordInput.classList.add('shake');
        setTimeout(() => compElements.gameWordInput.classList.remove('shake'), 300);
        return;
    }
    
    // Clear timer
    clearInterval(gameState.timer);
    
    // Check answer
    const isCorrect = gameState.currentQuestion.word.toLowerCase() === userAnswer.toLowerCase();
    
    // Update state
    if (isCorrect) {
        gameState.score += 10;
        gameState.correctCount++;
    } else {
        gameState.incorrectCount++;
    }
    
    // Update UI
    updateGameUI();
    
    // Show feedback
    showAnswerFeedback(isCorrect, userAnswer);
    
    // Move to next question
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

// ===== Show Answer Feedback =====
function showAnswerFeedback(isCorrect, userAnswer) {
    // Update opponents (simulate their answers)
    updateOpponentsWithAnswer(isCorrect);
    
    // Visual feedback on input
    if (isCorrect) {
        compElements.gameWordInput.classList.add('correct');
    } else {
        compElements.gameWordInput.classList.add('incorrect');
    }
    
    setTimeout(() => {
        compElements.gameWordInput.classList.remove('correct', 'incorrect');
    }, 1000);
}

// ===== Next Question =====
function nextQuestion() {
    gameState.currentQuestionIndex++;
    
    if (gameState.currentQuestionIndex >= gameState.game.questions.length) {
        // Game over
        endGame();
        return;
    }
    
    gameState.currentQuestion = gameState.game.questions[gameState.currentQuestionIndex];
    gameState.timeLeft = gameState.room.timePerWord;
    gameState.currentAnswer = '';
    
    // Clear input
    compElements.gameWordInput.value = '';
    
    // Start timer
    startGameTimer();
    
    // Load question
    loadQuestion();
    updateGameUI();
    updateOpponents();
}

// ===== Update Game UI =====
function updateGameUI() {
    if (!gameState.currentQuestion) return;
    
    compElements.gameScore.textContent = gameState.score;
    compElements.gameTimer.textContent = formatTime(gameState.timeLeft);
}

// ===== Update Opponents =====
function updateOpponents() {
    // For demo purposes, we'll create some fake opponents
    const opponents = [
        { name: 'Ana', score: gameState.score - 5, status: 'waiting', avatar: '👩🏻‍🎓' },
        { name: 'Carlos', score: gameState.score + 3, status: 'waiting', avatar: '👨🏻‍💼' },
        { name: 'Maria', score: gameState.score - 2, status: 'waiting', avatar: '👩🏽‍🏫' }
    ];
    
    compElements.opponentsGrid.innerHTML = opponents.map(opponent => `
        <div class="opponent-card" data-status="${opponent.status}">
            <div class="opponent-avatar">${opponent.avatar}</div>
            <div class="opponent-name">${opponent.name}</div>
            <div class="opponent-score">${opponent.score} pts</div>
        </div>
    `).join('');
}

// ===== Update Opponents With Answer =====
function updateOpponentsWithAnswer(isCorrect) {
    // For demo purposes, update opponents' status
    const opponentCards = document.querySelectorAll('.opponent-card');
    
    opponentCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add(isCorrect ? 'correct' : 'incorrect');
            
            setTimeout(() => {
                card.classList.remove('correct', 'incorrect');
            }, 1000);
        }, index * 200);
    });
}

// ===== End Game =====
function endGame() {
    clearInterval(gameState.timer);
    
    // Calculate accuracy
    const totalAnswers = gameState.correctCount + gameState.incorrectCount;
    const accuracy = totalAnswers > 0 ? Math.round((gameState.correctCount / totalAnswers) * 100) : 0;
    
    // Prepare results
    gameState.results = [
        { name: gameState.player.name, score: gameState.score, correct: gameState.correctCount, incorrect: gameState.incorrectCount, accuracy },
        { name: 'Ana', score: gameState.score + 5, correct: gameState.correctCount + 2, incorrect: gameState.incorrectCount - 1, accuracy: 85 },
        { name: 'Carlos', score: gameState.score - 3, correct: gameState.correctCount - 1, incorrect: gameState.incorrectCount + 1, accuracy: 75 },
        { name: 'Maria', score: gameState.score + 1, correct: gameState.correctCount, incorrect: gameState.incorrectCount + 2, accuracy: 65 }
    ].sort((a, b) => b.score - a.score);
    
    gameState.currentView = 'results';
    updateViewVisibility();
    showResults();
    
    console.log('🏁 Game ended. Results:', gameState.results);
}

// ===== Results =====
function initResults() {
    compElements.playAgainBtn.addEventListener('click', () => {
        // Reset game and start again
        gameState.currentView = 'lobby';
        updateViewVisibility();
        updateLobby();
    });
    
    compElements.backToLobbyBtn.addEventListener('click', () => {
        gameState.currentView = 'lobby';
        updateViewVisibility();
        updateLobby();
    });
    
    compElements.backToHomeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// ===== Show Results =====
function showResults() {
    // Sort results by score
    gameState.results.sort((a, b) => b.score - a.score);
    
    // Update subtitle
    const playerRank = gameState.results.findIndex(r => r.name === gameState.player.name) + 1;
    const rankText = getRankText(playerRank);
    compElements.resultsSubtitle.textContent = `Terminaste en ${rankText} lugar`;
    
    // Show podium
    showPodium();
    
    // Show results table
    showResultsTable();
    
    // Show player stats
    const totalAnswers = gameState.correctCount + gameState.incorrectCount;
    const accuracy = totalAnswers > 0 ? Math.round((gameState.correctCount / totalAnswers) * 100) : 0;
    
    compElements.finalScore.textContent = gameState.score;
    compElements.finalCorrect.textContent = gameState.correctCount;
    compElements.finalIncorrect.textContent = gameState.incorrectCount;
    compElements.finalAccuracy.textContent = `${accuracy}%`;
}

// ===== Get Rank Text =====
function getRankText(rank) {
    const rankTexts = {
        1: '🥇 1er',
        2: '🥈 2do',
        3: '🥉 3er',
        4: '4to'
    };
    return rankTexts[rank] || `${rank}º`;
}

// ===== Show Podium =====
function showPodium() {
    const topThree = gameState.results.slice(0, 3);
    
    compElements.podium.innerHTML = topThree.map((result, index) => `
        <div class="podium-place">
            <div class="podium-crown">${getCrown(index + 1)}</div>
            <div class="podium-avatar">${getAvatar(index + 1)}</div>
            <div class="podium-name">${result.name}</div>
            <div class="podium-score">${result.score} pts</div>
        </div>
    `).join('');
}

// ===== Get Crown =====
function getCrown(rank) {
    const crowns = {
        1: '👑',
        2: '🥈',
        3: '🥉'
    };
    return crowns[rank] || '';
}

// ===== Get Avatar =====
function getAvatar(rank) {
    const avatars = {
        1: '👤',
        2: '👥',
        3: '👦'
    };
    return avatars[rank] || '👤';
}

// ===== Show Results Table =====
function showResultsTable() {
    compElements.resultsTableBody.innerHTML = gameState.results.map((result, index) => `
        <tr>
            <td class="rank">${index + 1}</td>
            <td class="player-name">${result.name}</td>
            <td>${result.score}</td>
            <td>${result.accuracy}%</td>
        </tr>
    `).join('');
}

// ===== Leave Lobby =====
function leaveLobby() {
    gameState.currentView = 'menu';
    gameState.room = null;
    gameState.player = null;
    gameState.players = [];
    
    updateViewVisibility();
}

// ===== Format Time =====
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== Export for other scripts =====
window.BustabierenCompetition = {
    gameState,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    leaveLobby,
    formatTime
};

// ===== Console Log =====
console.log(`
%c🏆 Bustabieren Competition Mode
%c========================================
%cModo: ${gameState.currentView}
%cJugador: ${localStorage.getItem('bustabierenPlayerName') || 'Desconocido'}

%cControles:
%c- ENTER: Enviar respuesta
%c- ESPACIO: Reproducir audio

`, 
'font-size: 18px; font-weight: bold; color: #ff6b6b;',
'color: #2c3e50;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #2c3e50; font-weight: bold;',
'color: #7f8c8d;',
'color: #7f8c8d;'
);
