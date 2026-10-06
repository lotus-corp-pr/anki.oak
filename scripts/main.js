// ===== Bustabieren - Main JavaScript =====

// DOM Content Loaded
 document.addEventListener('DOMContentLoaded', () => {
    console.log('🐝 Bustabieren loaded!');
    
    // Initialize components
    initSmoothScroll();
    initActiveNavLink();
    initMobileMenu();
    initLevelColors();
    loadDecksData();
});

// ===== Smooth Scroll =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Active Navigation Link =====
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    // Create mobile menu button if not exists
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    if (!header || !nav) return;
    
    // Check if mobile menu button already exists
    if (!document.querySelector('.mobile-menu-btn')) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-color);
        `;
        
        header.querySelector('.container').prepend(mobileMenuBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Show mobile menu button on small screens
    function handleResize() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            nav.style.display = 'none';
        } else {
            mobileMenuBtn.style.display = 'none';
            nav.style.display = 'flex';
        }
    }
    
    window.addEventListener('resize', handleResize);
    handleResize();
}

// ===== Level Colors =====
function initLevelColors() {
    const levelCards = document.querySelectorAll('.level-card');
    
    const levelColors = {
        'a1': '#4CAF50',
        'a2': '#2196F3',
        'b1': '#FF9800',
        'b2': '#E91E63',
        'c1': '#9C27B0'
    };
    
    levelCards.forEach(card => {
        const level = card.querySelector('.level-badge')?.textContent.toLowerCase();
        if (level && levelColors[level]) {
            card.style.setProperty('--level-color', levelColors[level]);
        }
    });
}

// ===== Decks Data =====
// Sample decks data for Bustabieren
const decksData = {
    a1: [
        { id: 1, word: "Apfel", translation: "Manzana", audio: "apfel.mp3", level: "A1" },
        { id: 2, word: "Buch", translation: "Libro", audio: "buch.mp3", level: "A1" },
        { id: 3, word: "Haus", translation: "Casa", audio: "haus.mp3", level: "A1" },
        { id: 4, word: "Katze", translation: "Gato", audio: "katze.mp3", level: "A1" },
        { id: 5, word: "Hund", translation: "Perro", audio: "hund.mp3", level: "A1" },
        { id: 6, word: "Wasser", translation: "Agua", audio: "wasser.mp3", level: "A1" },
        { id: 7, word: "Brot", translation: "Pan", audio: "brot.mp3", level: "A1" },
        { id: 8, word: "Milch", translation: "Leche", audio: "milch.mp3", level: "A1" },
        { id: 9, word: "Ei", translation: "Huevo", audio: "ei.mp3", level: "A1" },
        { id: 10, word: "Tisch", translation: "Mesa", audio: "tisch.mp3", level: "A1" }
    ],
    a2: [
        { id: 11, word: "Schule", translation: "Escuela", audio: "schule.mp3", level: "A2" },
        { id: 12, word: "Arbeit", translation: "Trabajo", audio: "arbeit.mp3", level: "A2" },
        { id: 13, word: "Zeit", translation: "Tiempo", audio: "zeit.mp3", level: "A2" },
        { id: 14, word: "Geld", translation: "Dinero", audio: "geld.mp3", level: "A2" },
        { id: 15, word: "Freund", translation: "Amigo", audio: "freund.mp3", level: "A2" },
        { id: 16, word: "Familie", translation: "Familia", audio: "familie.mp3", level: "A2" },
        { id: 17, word: "Stadt", translation: "Ciudad", audio: "stadt.mp3", level: "A2" },
        { id: 18, word: "Land", translation: "País", audio: "land.mp3", level: "A2" },
        { id: 19, word: "Sprache", translation: "Idioma", audio: "sprache.mp3", level: "A2" },
        { id: 20, word: "Reise", translation: "Viaje", audio: "reise.mp3", level: "A2" }
    ],
    b1: [
        { id: 21, word: "Erfahrung", translation: "Experiencia", audio: "erfahrung.mp3", level: "B1" },
        { id: 22, word: "Meinung", translation: "Opinión", audio: "meinung.mp3", level: "B1" },
        { id: 23, word: "Zukunft", translation: "Futuro", audio: "zukunft.mp3", level: "B1" },
        { id: 24, word: "Vergangenheit", translation: "Pasado", audio: "vergangenheit.mp3", level: "B1" },
        { id: 25, word: "Entscheidung", translation: "Decisión", audio: "entscheidung.mp3", level: "B1" },
        { id: 26, word: "Möglichkeit", translation: "Posibilidad", audio: "möglichkeit.mp3", level: "B1" },
        { id: 27, word: "Wissenschaft", translation: "Ciencia", audio: "wissenschaft.mp3", level: "B1" },
        { id: 28, word: "Technologie", translation: "Tecnología", audio: "technologie.mp3", level: "B1" },
        { id: 29, word: "Kultur", translation: "Cultura", audio: "kultur.mp3", level: "B1" },
        { id: 30, word: "Natur", translation: "Naturaleza", audio: "natur.mp3", level: "B1" }
    ],
    b2: [
        { id: 31, word: "Demokratie", translation: "Democracia", audio: "demokratie.mp3", level: "B2" },
        { id: 32, word: "Philosophie", translation: "Filosofía", audio: "philosophie.mp3", level: "B2" },
        { id: 33, word: "Literatur", translation: "Literatura", audio: "literatur.mp3", level: "B2" },
        { id: 34, word: "Politik", translation: "Política", audio: "politik.mp3", level: "B2" },
        { id: 35, word: "Wirtschaft", translation: "Economía", audio: "wirtschaft.mp3", level: "B2" },
        { id: 36, word: "Umwelt", translation: "Medio ambiente", audio: "umwelt.mp3", level: "B2" },
        { id: 37, word: "Gesundheit", translation: "Salud", audio: "gesundheit.mp3", level: "B2" },
        { id: 38, word: "Bildung", translation: "Educación", audio: "bildung.mp3", level: "B2" },
        { id: 39, word: "Geschichte", translation: "Historia", audio: "geschichte.mp3", level: "B2" },
        { id: 40, word: "Zivilisation", translation: "Civilización", audio: "zivilisation.mp3", level: "B2" }
    ],
    c1: [
        { id: 41, word: "Selbstbewusstsein", translation: "Autoconfianza", audio: "selbstbewusstsein.mp3", level: "C1" },
        { id: 42, word: "Weltanschauung", translation: "Cosmovisión", audio: "weltanschauung.mp3", level: "C1" },
        { id: 43, word: "Missverständnis", translation: "Malentendido", audio: "missverständnis.mp3", level: "C1" },
        { id: 44, word: "Zusammenhang", translation: "Conexión", audio: "zusammenhang.mp3", level: "C1" },
        { id: 45, word: "Entwicklung", translation: "Desarrollo", audio: "entwicklung.mp3", level: "C1" },
        { id: 46, word: "Beziehung", translation: "Relación", audio: "beziehung.mp3", level: "C1" },
        { id: 47, word: "Verantwortung", translation: "Responsabilidad", audio: "verantwortung.mp3", level: "C1" },
        { id: 48, word: "Freiheit", translation: "Libertad", audio: "freiheit.mp3", level: "C1" },
        { id: 49, word: "Gerechtigkeit", translation: "Justicia", audio: "gerechtigkeit.mp3", level: "C1" },
        { id: 50, word: "Glück", translation: "Felicidad", audio: "glück.mp3", level: "C1" }
    ]
};

// Load decks data (for future use in practice page)
function loadDecksData() {
    // Store decks data in localStorage for practice page
    localStorage.setItem('bustabierenDecks', JSON.stringify(decksData));
    console.log('✅ Decks data loaded!');
}

// ===== Practice Page Functions =====
// These functions will be used in practice.html

// Get deck by level
function getDeckByLevel(level) {
    const decks = JSON.parse(localStorage.getItem('bustabierenDecks')) || decksData;
    return decks[level.toLowerCase()] || [];
}

// Get random word from deck
function getRandomWord(deck) {
    if (!deck || deck.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
}

// Check if word is correct (case-insensitive, but exact for spelling)
function checkWordAnswer(word, userAnswer) {
    return word.toLowerCase() === userAnswer.toLowerCase();
}

// ===== Competition Page Functions =====
// These functions will be used in competition.html

// Generate a unique room ID
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ===== Utility Functions =====

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format time (for competition timer)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== Export for other pages =====
// These will be available in practice.html and competition.html
window.Bustabieren = {
    decksData,
    getDeckByLevel,
    getRandomWord,
    checkWordAnswer,
    generateRoomId,
    formatTime,
    debounce
};

// ===== Console Styles =====
console.log(`
%c🐝 Bustabieren %c- El Spelling Bee para Alemán
%c========================================
%cVersión: 1.0.0
%cAutor: Bustabieren Team
%c========================================
%c¡Bienvenido! Usa las funciones de Bustabieren
%cpara practicar la ortografía alemana.

%cFunciones disponibles:
%c- Bustabieren.getDeckByLevel(level)
%c- Bustabieren.getRandomWord(deck)
%c- Bustabieren.checkWordAnswer(word, answer)
%c- Bustabieren.generateRoomId()
%c- Bustabieren.formatTime(seconds)

`, 
'font-size: 24px; font-weight: bold; color: #4a6bff;',
'font-size: 24px; font-weight: bold; color: #ff6b6b;',
'color: #2c3e50;',
'color: #7f8c8d; font-size: 14px;',
'color: #7f8c8d; font-size: 14px;',
'color: #2c3e50;',
'color: #4a6bff; font-weight: bold;',
'color: #2c3e50;',
'color: #4a6bff;',
'color: #4a6bff;',
'color: #4a6bff;',
'color: #4a6bff;',
'color: #4a6bff;'
);
