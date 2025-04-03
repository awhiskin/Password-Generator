// Password Generator App

// Store generated passwords
let passwordList = [];
let passwordSettings = {
    type: 'strong',
    category: 'nature',
    length: 16,
    uppercase: true,
    numbers: false,
    symbols: false
};

// DOM Elements
let elements;

// Words data for password generation
let wordData;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    elements = {
        typeSelect: document.getElementById('password-type'),
        categorySelect: document.getElementById('word-category'),
        lengthInput: document.getElementById('password-length'),
        lengthValue: document.getElementById('length-value'),
        uppercaseCheckbox: document.getElementById('include-uppercase'),
        numbersCheckbox: document.getElementById('include-numbers'),
        symbolsCheckbox: document.getElementById('include-symbols'),
        generateBtn: document.getElementById('generate-btn'),
        clearBtn: document.getElementById('clear-btn'),
        exportBtn: document.getElementById('export-btn'),
        resetBtn: document.getElementById('reset-btn'),
        passwordList: document.getElementById('password-list'),
        typeDescription: document.getElementById('type-description'),
        dropdownToggle: document.querySelector('.dropdown-toggle'),
        dropdownMenu: document.querySelector('.dropdown-menu')
    };

    // Setup event listeners
    setupEventListeners();
    
    // Load word data
    loadWordData();
    
    // Load settings from localStorage
    loadSettings();
    
    // Update UI to match settings
    updateUI();
});

// Load word data from GitHub repository
function loadWordData() {
    const url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/words.json";
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            wordData = data;
            console.log("Word data loaded successfully from GitHub");
        })
        .catch(error => {
            console.error('Error loading word data:', error);
        });
}

// Setup all event listeners
function setupEventListeners() {
    // Password type change
    elements.typeSelect.addEventListener('change', function() {
        passwordSettings.type = this.value;
        saveSettings();
        handleTypeChange();
    });
    
    // Category change
    elements.categorySelect.addEventListener('change', function() {
        passwordSettings.category = this.value;
        saveSettings();
    });
    
    // Length slider
    elements.lengthInput.addEventListener('input', function() {
        passwordSettings.length = parseInt(this.value);
        elements.lengthValue.textContent = this.value;
        saveSettings();
    });
    
    // Checkboxes
    elements.uppercaseCheckbox.addEventListener('change', function() {
        passwordSettings.uppercase = this.checked;
        saveSettings();
    });
    
    elements.numbersCheckbox.addEventListener('change', function() {
        passwordSettings.numbers = this.checked;
        saveSettings();
    });
    
    elements.symbolsCheckbox.addEventListener('change', function() {
        passwordSettings.symbols = this.checked;
        saveSettings();
    });
    
    // Generate button
    elements.generateBtn.addEventListener('click', function() {
        generatePassword();
    });
    
    // Dropdown toggle
    elements.dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        elements.dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-container')) {
            elements.dropdownMenu.classList.remove('show');
        }
    });
    
    // Dropdown menu items
    document.querySelectorAll('.dropdown-menu a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const count = parseInt(this.getAttribute('data-count'));
            generateMultiplePasswords(count);
            elements.dropdownMenu.classList.remove('show');
        });
    });
    
    // Clear button
    elements.clearBtn.addEventListener('click', function() {
        clearPasswords();
    });
    
    // Export button
    elements.exportBtn.addEventListener('click', function() {
        exportPasswordsToCSV();
    });
    
    // Reset button
    elements.resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all settings?')) {
            resetAllSettings();
        }
    });
    
    // Password list click handler for copying
    elements.passwordList.addEventListener('click', function(event) {
        const listItem = event.target.closest('li');
        if (listItem && !listItem.classList.contains('empty-message')) {
            copyToClipboard(listItem.textContent);
            showToast('Password copied to clipboard!');
        }
    });
}

// Handle password type change
function handleTypeChange() {
    const type = passwordSettings.type;
    
    // Update description text
    switch(type) {
        case 'memorable':
            elements.typeDescription.textContent = 'Easy to remember word combinations';
            break;
        case 'strong':
            elements.typeDescription.textContent = 'Strong passwords with words and numbers';
            break;
        case 'complex':
            elements.typeDescription.textContent = 'Complex mixed character passwords';
            break;
        case 'random':
            elements.typeDescription.textContent = 'Completely random character sequences';
            break;
    }
    
    // Enable/disable controls based on type
    if (type === 'random') {
        elements.categorySelect.disabled = true;
    } else {
        elements.categorySelect.disabled = false;
    }
}

// Generate a password based on current settings
function generatePassword() {
    if (!wordData) {
        alert('Word data is still loading. Please try again in a moment.');
        return;
    }
    
    let password = '';
    
    switch(passwordSettings.type) {
        case 'memorable':
            password = generateMemorablePassword();
            break;
        case 'strong':
            password = generateStrongPassword();
            break;
        case 'complex':
            password = generateComplexPassword();
            break;
        case 'random':
            password = generateRandomPassword();
            break;
    }
    
    // Ensure minimum length
    while (password.length < passwordSettings.length) {
        if (passwordSettings.numbers)
            password += getRandomDigit();
        else if (passwordSettings.symbols)
            password += getRandomSymbol();
        else
            password += getRandomItem(wordData[passwordSettings.category]);
    }
    
    // Add the password to the list
    addPasswordToList(password);
    
    return password;
}

// Generate multiple passwords
function generateMultiplePasswords(count) {
    // clearPasswords();
    for (let i = 0; i < count; i++) {
        generatePassword();
    }
}

// Generate a memorable password (words + numbers)
function generateMemorablePassword() {
    const adjectives = wordData.adjectives;
    const nouns = wordData[passwordSettings.category];
    
    let adjective = getRandomItem(adjectives);
    let noun = getRandomItem(nouns);
    
    // Convert to lowercase
    adjective = adjective.toLowerCase();
    noun = noun.toLowerCase();
    
    // Capitalize if uppercase option is enabled
    if (passwordSettings.uppercase) {
        adjective = capitalizeFirstLetter(adjective);
        noun = capitalizeFirstLetter(noun);
    }
    
    let password = adjective + noun;
    
    // Add numbers if option is enabled
    if (passwordSettings.numbers) {
        password += getRandomDigit() + getRandomDigit();
    }
    
    // Add a symbol if option is enabled
    if (passwordSettings.symbols) {
        password += getRandomSymbol();
    }
    
    return password;
}

// Generate a strong password (words + numbers + symbols)
function generateStrongPassword() {
    const wordList = wordData[passwordSettings.category];
    
    let word1 = getRandomItem(wordList);
    let word2 = getRandomItem(wordList);
    
    // Ensure words are different
    while (word1 === word2) {
        word2 = getRandomItem(wordList);
    }
    
    // Apply case settings
    if (passwordSettings.uppercase) {
        word1 = capitalizeFirstLetter(word1.toLowerCase());
        word2 = capitalizeFirstLetter(word2.toLowerCase());
    } else {
        word1 = word1.toLowerCase();
        word2 = word2.toLowerCase();
    }
    
    let password = word1 + word2;
    
    // Add numbers if option is enabled
    if (passwordSettings.numbers) {
        password += getRandomDigit() + getRandomDigit() + getRandomDigit();
    }
    
    // Add symbols if option is enabled
    if (passwordSettings.symbols) {
        password = getRandomSymbol() + password + getRandomSymbol();
    }
    
    return password;
}

// Generate a complex password (mixed characters)
function generateComplexPassword() {
    let chars = 'abcdefghijklmnopqrstuvwxyz';
    
    if (passwordSettings.uppercase) {
        chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    if (passwordSettings.numbers) {
        chars += '0123456789';
    }
    
    if (passwordSettings.symbols) {
        chars += '!@#$%^&*_-+=';
    }
    
    let password = '';
    for (let i = 0; i < passwordSettings.length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
}

// Generate a completely random password
function generateRandomPassword() {
    const length = passwordSettings.length;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=';
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
}

// Add a password to the displayed list
function addPasswordToList(password) {
    // Store password
    passwordList.unshift(password);
    
    // Update the UI
    updatePasswordList();
}

// Update the password list in the UI
function updatePasswordList() {
    // Clear current list
    elements.passwordList.innerHTML = '';
    
    // Show message if no passwords
    if (passwordList.length === 0) {
        const emptyItem = document.createElement('li');
        emptyItem.className = 'empty-message';
        emptyItem.textContent = 'No passwords generated yet';
        elements.passwordList.appendChild(emptyItem);
        return;
    }
    
    // Add passwords to list
    passwordList.forEach(password => {
        const listItem = document.createElement('li');
        listItem.textContent = password;
        elements.passwordList.appendChild(listItem);
    });
}

// Clear all passwords
function clearPasswords() {
    passwordList = [];
    updatePasswordList();
}

// Export passwords to CSV file
function exportPasswordsToCSV() {
    if (passwordList.length === 0) {
        // alert('No passwords to export.');
        return;
    }
    
    // Create CSV content
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Password\r\n';
    
    passwordList.forEach(password => {
        csvContent += `"${password}"\r\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `passwords-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
}

// Reset all settings to defaults
function resetAllSettings() {
    passwordSettings = {
        type: 'strong',
        category: 'nature',
        length: 16,
        uppercase: true,
        numbers: false,
        symbols: false
    };
    
    // clearPasswords();
    saveSettings();
    updateUI();
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('passwordSettings', JSON.stringify(passwordSettings));
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('passwordSettings');
    if (savedSettings) {
        passwordSettings = JSON.parse(savedSettings);
    }
}

// Update UI to match current settings
function updateUI() {
    elements.typeSelect.value = passwordSettings.type;
    elements.categorySelect.value = passwordSettings.category;
    elements.lengthInput.value = passwordSettings.length;
    elements.lengthValue.textContent = passwordSettings.length;
    elements.uppercaseCheckbox.checked = passwordSettings.uppercase;
    elements.numbersCheckbox.checked = passwordSettings.numbers;
    elements.symbolsCheckbox.checked = passwordSettings.symbols;
    
    handleTypeChange();
}

// Helper function: Get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Helper function: Get random digit
function getRandomDigit() {
    return Math.floor(Math.random() * 10).toString();
}

// Helper function: Get random symbol
function getRandomSymbol() {
    const symbols = '!@#$%^&*_-+=';
    return symbols.charAt(Math.floor(Math.random() * symbols.length));
}

// Helper function: Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function: Copy text to clipboard
function copyToClipboard(text) {
    // Create temporary element
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    
    // Select and copy
    el.select();
    document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(el);
}

// Helper function: Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 1000);
}