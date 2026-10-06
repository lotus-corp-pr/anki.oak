// ===== Bustabieren - Import Page JavaScript =====

// State
let importState = {
    currentStep: 1,
    file: null,
    fileFormat: 'csv',
    delimiter: ',',
    columns: [],
    wordColumn: '',
    translationColumn: '',
    levelColumn: '',
    defaultLevel: 'medio',
    words: [],
    filteredWords: []
};

// DOM Elements
const importElements = {
    // Steps
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    step4: document.getElementById('step4'),
    
    // Upload
    uploadArea: document.getElementById('uploadArea'),
    fileInput: document.getElementById('fileInput'),
    selectFileBtn: document.getElementById('selectFileBtn'),
    fileInfo: document.getElementById('fileInfo'),
    fileName: document.getElementById('fileName'),
    fileSize: document.getElementById('fileSize'),
    removeFileBtn: document.getElementById('removeFileBtn'),
    
    // Format
    fileFormatRadios: document.querySelectorAll('input[name="fileFormat"]'),
    delimiterSelect: document.getElementById('delimiterSelect'),
    
    // Columns
    wordColumnSelect: document.getElementById('wordColumn'),
    translationColumnSelect: document.getElementById('translationColumn'),
    levelColumnSelect: document.getElementById('levelColumn'),
    defaultLevelSelect: document.getElementById('defaultLevel'),
    
    // Navigation
    backToStep1: document.getElementById('backToStep1'),
    continueToStep3: document.getElementById('continueToStep3'),
    backToStep2: document.getElementById('backToStep2'),
    confirmImport: document.getElementById('confirmImport'),
    importMore: document.getElementById('importMore'),
    downloadTemplate: document.getElementById('downloadTemplate'),
    
    // Preview
    previewCount: document.getElementById('previewCount'),
    previewTableBody: document.getElementById('previewTableBody'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    
    // Stats
    facilCount: document.getElementById('facilCount'),
    medioCount: document.getElementById('medioCount'),
    dificilCount: document.getElementById('dificilCount'),
    
    // Success
    importedCount: document.getElementById('importedCount'),
    successFacil: document.getElementById('successFacil'),
    successMedio: document.getElementById('successMedio'),
    successDificil: document.getElementById('successDificil'),
    
    // Progress
    progressSteps: document.querySelectorAll('.progress-step'),
    progressLines: document.querySelectorAll('.progress-line')
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('📥 Import page loaded!');
    
    // Load saved state if exists
    loadState();
    
    // Initialize event listeners
    initUpload();
    initFormat();
    initNavigation();
    initPreview();
    initSuccess();
    initTemplateDownload();
    
    // Update UI
    updateProgress();
});

// ===== Load State =====
function loadState() {
    const savedState = localStorage.getItem('bustabierenImportState');
    if (savedState) {
        importState = { ...importState, ...JSON.parse(savedState) };
    }
}

// ===== Save State =====
function saveState() {
    localStorage.setItem('bustabierenImportState', JSON.stringify(importState));
}

// ===== Update Progress =====
function updateProgress() {
    // Update step visibility
    document.querySelectorAll('.import-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum === importState.currentStep) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });
    
    // Update progress steps
    importElements.progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum < importState.currentStep) {
            step.classList.add('completed');
        } else if (stepNum === importState.currentStep) {
            step.classList.add('active');
        }
    });
    
    // Update progress lines
    importElements.progressLines.forEach(line => {
        const between = line.dataset.between;
        const [start, end] = between.split('-').map(Number);
        
        if (importState.currentStep > start) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
    
    saveState();
}

// ===== Upload =====
function initUpload() {
    // Select file button
    importElements.selectFileBtn.addEventListener('click', () => {
        importElements.fileInput.click();
    });
    
    // File input change
    importElements.fileInput.addEventListener('change', handleFileSelect);
    
    // Upload area drag and drop
    importElements.uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        importElements.uploadArea.classList.add('drag-over');
    });
    
    importElements.uploadArea.addEventListener('dragleave', () => {
        importElements.uploadArea.classList.remove('drag-over');
    });
    
    importElements.uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        importElements.uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            importElements.fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    
    // Upload area click
    importElements.uploadArea.addEventListener('click', () => {
        importElements.fileInput.click();
    });
    
    // Remove file button
    importElements.removeFileBtn.addEventListener('click', () => {
        importState.file = null;
        importState.columns = [];
        importElements.fileInfo.classList.add('hidden');
        importElements.uploadArea.classList.remove('hidden');
        importElements.fileInput.value = '';
        
        // Reset column selects
        resetColumnSelects();
    });
}

// ===== Handle File Select =====
function handleFileSelect() {
    const file = importElements.fileInput.files[0];
    
    if (!file) {
        return;
    }
    
    // Check file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const validExtensions = ['csv', 'xlsx', 'xls'];
    
    if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
        alert('Por favor, selecciona un archivo CSV o Excel (.xlsx, .xls)');
        importElements.fileInput.value = '';
        return;
    }
    
    // Store file
    importState.file = file;
    importState.fileFormat = validExtensions.includes(fileExtension) ? 
        (fileExtension === 'csv' ? 'csv' : 'excel') : 'csv';
    
    // Update UI
    importElements.fileName.textContent = file.name;
    importElements.fileSize.textContent = formatFileSize(file.size);
    importElements.uploadArea.classList.add('hidden');
    importElements.fileInfo.classList.remove('hidden');
    
    // Set default delimiter based on file type
    if (importState.fileFormat === 'csv') {
        importElements.delimiterSelect.value = ',';
        importState.delimiter = ',';
    }
    
    // Read file
    readFile(file);
}

// ===== Read File =====
function readFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const content = e.target.result;
        
        if (importState.fileFormat === 'csv') {
            parseCSV(content);
        } else {
            // For Excel files, we'll use a simple approach
            // In production, you would use a library like SheetJS
            alert('Para archivos Excel, por favor usa la versión de producción con una librería como SheetJS.\n\nPuedes usar el formato CSV que es completamente compatible.');
            importElements.fileInput.value = '';
            importState.file = null;
            importElements.uploadArea.classList.remove('hidden');
            importElements.fileInfo.classList.add('hidden');
        }
    };
    
    reader.onerror = () => {
        alert('Error al leer el archivo. Por favor, intenta de nuevo.');
    };
    
    if (importState.fileFormat === 'csv') {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

// ===== Parse CSV =====
function parseCSV(content) {
    const lines = content.split('\n');
    
    // Get headers
    const headers = lines[0].split(importState.delimiter).map(h => h.trim());
    importState.columns = headers;
    
    // Update column selects
    updateColumnSelects();
    
    // Parse words
    const words = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(importState.delimiter);
        
        // Skip empty lines
        if (values.length === 0 || values.every(v => v.trim() === '')) continue;
        
        // Create word object
        const word = {
            id: Date.now() + i,
            word: '',
            translation: '',
            level: importState.defaultLevel,
            audio: null
        };
        
        // Map columns
        for (let j = 0; j < values.length && j < headers.length; j++) {
            const value = values[j].trim();
            const header = headers[j].trim();
            
            // Check if this column is mapped to word
            if (importState.wordColumn && headers[j] === importState.wordColumn) {
                word.word = value;
            }
            
            // Check if this column is mapped to translation
            if (importState.translationColumn && headers[j] === importState.translationColumn) {
                word.translation = value;
            }
            
            // Check if this column is mapped to level
            if (importState.levelColumn && headers[j] === importState.levelColumn) {
                word.level = mapLevelValue(value);
            }
        }
        
        // Only add if word is not empty
        if (word.word) {
            words.push(word);
        }
    }
    
    importState.words = words;
    importState.filteredWords = [...words];
    
    console.log('📊 Parsed words:', words.length);
}

// ===== Map Level Value =====
function mapLevelValue(value) {
    const levelMap = {
        'facil': 'facil',
        'fácil': 'facil',
        'easy': 'facil',
        '1': 'facil',
        'medio': 'medio',
        'medium': 'medio',
        '2': 'medio',
        'dificil': 'dificil',
        'difícil': 'dificil',
        'hard': 'dificil',
        '3': 'dificil'
    };
    
    return levelMap[value.toLowerCase().trim()] || importState.defaultLevel;
}

// ===== Update Column Selects =====
function updateColumnSelects() {
    // Reset selects
    resetColumnSelects();
    
    // Add options
    importState.columns.forEach(column => {
        const option1 = document.createElement('option');
        option1.value = column;
        option1.textContent = column;
        importElements.wordColumnSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = column;
        option2.textContent = column;
        importElements.translationColumnSelect.appendChild(option2);
        
        const option3 = document.createElement('option');
        option3.value = column;
        option3.textContent = column;
        importElements.levelColumnSelect.appendChild(option3);
    });
    
    // Set default selections if possible
    const defaultWordColumn = importState.columns.find(col => 
        col.toLowerCase().includes('palabra') || 
        col.toLowerCase().includes('word') ||
        col.toLowerCase().includes('alemán') ||
        col.toLowerCase().includes('german')
    );
    
    const defaultTranslationColumn = importState.columns.find(col => 
        col.toLowerCase().includes('traducción') || 
        col.toLowerCase().includes('translation') ||
        col.toLowerCase().includes('español') ||
        col.toLowerCase().includes('spanish')
    );
    
    const defaultLevelColumn = importState.columns.find(col => 
        col.toLowerCase().includes('nivel') || 
        col.toLowerCase().includes('level') ||
        col.toLowerCase().includes('dificultad') ||
        col.toLowerCase().includes('difficulty')
    );
    
    if (defaultWordColumn) {
        importState.wordColumn = defaultWordColumn;
        importElements.wordColumnSelect.value = defaultWordColumn;
    }
    
    if (defaultTranslationColumn) {
        importState.translationColumn = defaultTranslationColumn;
        importElements.translationColumnSelect.value = defaultTranslationColumn;
    }
    
    if (defaultLevelColumn) {
        importState.levelColumn = defaultLevelColumn;
        importElements.levelColumnSelect.value = defaultLevelColumn;
    }
}

// ===== Reset Column Selects =====
function resetColumnSelects() {
    // Clear all options except the first one
    [importElements.wordColumnSelect, importElements.translationColumnSelect, importElements.levelColumnSelect].forEach(select => {
        const firstOption = select.querySelector('option');
        select.innerHTML = '';
        if (firstOption) {
            select.appendChild(firstOption.cloneNode(true));
        }
    });
    
    // Reset state
    importState.wordColumn = '';
    importState.translationColumn = '';
    importState.levelColumn = '';
}

// ===== Format =====
function initFormat() {
    // File format radios
    importElements.fileFormatRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            importState.fileFormat = e.target.value;
        });
    });
    
    // Delimiter select
    importElements.delimiterSelect.addEventListener('change', (e) => {
        importState.delimiter = e.target.value;
        
        // Re-parse file with new delimiter
        if (importState.file) {
            readFile(importState.file);
        }
    });
    
    // Column selects
    importElements.wordColumnSelect.addEventListener('change', (e) => {
        importState.wordColumn = e.target.value;
        
        // Re-parse file with new column mapping
        if (importState.file) {
            readFile(importState.file);
        }
    });
    
    importElements.translationColumnSelect.addEventListener('change', (e) => {
        importState.translationColumn = e.target.value;
        
        // Re-parse file with new column mapping
        if (importState.file) {
            readFile(importState.file);
        }
    });
    
    importElements.levelColumnSelect.addEventListener('change', (e) => {
        importState.levelColumn = e.target.value;
        
        // Re-parse file with new column mapping
        if (importState.file) {
            readFile(importState.file);
        }
    });
    
    // Default level select
    importElements.defaultLevelSelect.addEventListener('change', (e) => {
        importState.defaultLevel = e.target.value;
    });
}

// ===== Navigation =====
function initNavigation() {
    // Back to step 1
    importElements.backToStep1.addEventListener('click', () => {
        importState.currentStep = 1;
        updateProgress();
    });
    
    // Continue to step 3
    importElements.continueToStep3.addEventListener('click', () => {
        // Validate
        if (!importState.file) {
            alert('Por favor, selecciona un archivo primero.');
            return;
        }
        
        if (!importState.wordColumn) {
            alert('Por favor, selecciona la columna que contiene las palabras en alemán.');
            return;
        }
        
        // Check if we have words
        if (importState.words.length === 0) {
            alert('No se encontraron palabras en el archivo. Por favor, verifica el formato.');
            return;
        }
        
        importState.currentStep = 3;
        updateProgress();
        updatePreview();
    });
    
    // Back to step 2
    importElements.backToStep2.addEventListener('click', () => {
        importState.currentStep = 2;
        updateProgress();
    });
    
    // Confirm import
    importElements.confirmImport.addEventListener('click', () => {
        // Save words to localStorage
        saveWords();
        
        // Move to success step
        importState.currentStep = 4;
        updateProgress();
        showSuccess();
    });
    
    // Import more
    importElements.importMore.addEventListener('click', () => {
        // Reset and start over
        resetImport();
    });
}

// ===== Save Words =====
function saveWords() {
    // Get existing words
    const existingWords = JSON.parse(localStorage.getItem('bustabierenWords')) || [];
    
    // Merge with new words
    const allWords = [...existingWords, ...importState.words];
    
    // Save to localStorage
    localStorage.setItem('bustabierenWords', JSON.stringify(allWords));
    
    // Also save by level
    const wordsByLevel = {
        facil: allWords.filter(w => w.level === 'facil'),
        medio: allWords.filter(w => w.level === 'medio'),
        dificil: allWords.filter(w => w.level === 'dificil')
    };
    
    localStorage.setItem('bustabierenWordsByLevel', JSON.stringify(wordsByLevel));
    
    console.log('💾 Saved words:', allWords.length);
}

// ===== Preview =====
function initPreview() {
    // Filter buttons
    importElements.filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            importElements.filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const level = btn.dataset.level;
            filterWords(level);
        });
    });
}

// ===== Update Preview =====
function updatePreview() {
    importState.filteredWords = [...importState.words];
    filterWords('todos');
    
    // Update count
    importElements.previewCount.textContent = `${importState.words.length} palabras importadas`;
    
    // Update stats
    updatePreviewStats();
}

// ===== Filter Words =====
function filterWords(level) {
    if (level === 'todos') {
        importState.filteredWords = [...importState.words];
    } else {
        importState.filteredWords = importState.words.filter(w => w.level === level);
    }
    
    renderPreviewTable();
    updatePreviewStats();
}

// ===== Render Preview Table =====
function renderPreviewTable() {
    const tbody = importElements.previewTableBody;
    tbody.innerHTML = '';
    
    importState.filteredWords.forEach((word, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${word.word}</strong></td>
            <td>${word.translation || '-'}</td>
            <td><span class="level-badge ${word.level}">${formatLevel(word.level)}</span></td>
            <td><button class="delete-btn" data-index="${index}">×</button></td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            removeWord(index);
        });
    });
}

// ===== Remove Word =====
function removeWord(index) {
    importState.filteredWords.splice(index, 1);
    
    // Also remove from main words array
    const wordToRemove = importState.filteredWords[index];
    const mainIndex = importState.words.findIndex(w => w.id === wordToRemove.id);
    if (mainIndex !== -1) {
        importState.words.splice(mainIndex, 1);
    }
    
    renderPreviewTable();
    updatePreviewStats();
    importElements.previewCount.textContent = `${importState.words.length} palabras importadas`;
}

// ===== Update Preview Stats =====
function updatePreviewStats() {
    const facil = importState.words.filter(w => w.level === 'facil').length;
    const medio = importState.words.filter(w => w.level === 'medio').length;
    const dificil = importState.words.filter(w => w.level === 'dificil').length;
    
    importElements.facilCount.textContent = facil;
    importElements.medioCount.textContent = medio;
    importElements.dificilCount.textContent = dificil;
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

// ===== Success =====
function initSuccess() {
    // Nothing to initialize here
}

// ===== Show Success =====
function showSuccess() {
    const facil = importState.words.filter(w => w.level === 'facil').length;
    const medio = importState.words.filter(w => w.level === 'medio').length;
    const dificil = importState.words.filter(w => w.level === 'dificil').length;
    
    importElements.importedCount.textContent = importState.words.length;
    importElements.successFacil.textContent = facil;
    importElements.successMedio.textContent = medio;
    importElements.successDificil.textContent = dificil;
}

// ===== Reset Import =====
function resetImport() {
    importState.currentStep = 1;
    importState.file = null;
    importState.columns = [];
    importState.words = [];
    importState.filteredWords = [];
    
    // Reset UI
    importElements.fileInput.value = '';
    importElements.uploadArea.classList.remove('hidden');
    importElements.fileInfo.classList.add('hidden');
    importElements.previewTableBody.innerHTML = '';
    
    // Reset column selects
    resetColumnSelects();
    
    // Update progress
    updateProgress();
}

// ===== Template Download =====
function initTemplateDownload() {
    importElements.downloadTemplate.addEventListener('click', downloadTemplate);
}

// ===== Download Template =====
function downloadTemplate() {
    const csvContent = `Palabra en Alemán,Traducción,Nivel
Apfel,Manzana,facil
Buch,Libro,facil
Haus,Casa,facil
Schule,Escuela,medio
Arbeit,Trabajo,medio
Zeit,Tiempo,medio
Geld,Dinero,dificil
Sprache,Idioma,dificil
Reise,Viaje,dificil`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantilla_bustabieren.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== Format File Size =====
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} bytes`;
    } else if (bytes < 1048576) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
        return `${(bytes / 1048576).toFixed(2)} MB`;
    }
}

// ===== Export for other scripts =====
window.BustabierenImport = {
    importState,
    parseCSV,
    saveWords,
    formatLevel
};

// ===== Console Log =====
console.log(`
%c📥 Bustabieren Import Mode
%c========================================
%cPaso actual: ${importState.currentStep} de 4

%cInstrucciones:
%c1. Sube un archivo CSV o Excel
%c2. Configura el formato de columnas
%c3. Revisa la vista previa
%c4. ¡Listo! Las palabras estarán disponibles

%cFormato CSV recomendado:
%cPalabra en Alemán,Traducción,Nivel
%cApfel,Manzana,facil
%cHaus,Casa,facil

`, 
'font-size: 18px; font-weight: bold; color: #4a6bff;',
'color: #2c3e50;',
'color: #7f8c8d;',
'color: #2c3e50; font-weight: bold;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #7f8c8d;',
'color: #2c3e50; font-weight: bold;',
'color: #7f8c8d; font-size: 12px;',
'color: #7f8c8d; font-size: 12px;'
);
