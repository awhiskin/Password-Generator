// -------- HELPER FUNCTIONS --------

// Copies the passed string to the clipboard
function copyStringToClipboard(str) {
    // Create new element
    var element = document.createElement('textarea');
    // Set value (string to be copied)
    element.value = str;
    // Set non-editable to avoid focus and move outside of view
    element.setAttribute('readonly', '');
    element.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(element);
    // Select text inside element
    element.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(element);
}

// Gets a random integer between min and max
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Returns a random element from the passed array or returns null if no array is passed
function getRandomElementFromArray(array) {
    if (array === null || array === undefined) {
        return null;
    } else {
        var randomNumber = getRandomInt(0, array.length);
        return array[randomNumber];
    }
}

// Helper function to generate random string of defined length from a series of characters
function makeID(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getRandomSymbol() {
	var characters = '!@#$%^&*?';
	return characters.charAt(Math.floor(Math.random() * characters.length));
}

// Export array as a CSV
function exportArrayToCSV() {
    if (passwordArray.length == 0) {
        alert("No passwords to export.")
        return;
    }
    
    let prefix = "data:text/csv;charset=utf-8,";
    let header = "Password Value";
    let csv = header + "\r\n";

    var rows = []
    passwordArray.forEach(element => {
        rows.push([element])
    });

    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csv += row + "\r\n";
    });

    var encodedUri = prefix + encodeURIComponent(csv);
	var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "passwords" + Date.now() + ".csv")
    link.setAttribute("target", "_blank");
    link.click();
}

// -------- VARIABLES --------

// The array of passwords that have been generated so far
var passwordArray = [];

// The URL of the JSON file of animals / adjectives
var url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/words.json";

// Get URL and read into response variable
var httpRequest = new XMLHttpRequest();
httpRequest.open("GET", url, false);
httpRequest.send(null);

var response = httpRequest.responseText;

// JSON object parsed from the response
var myObj = JSON.parse(response);

var positives = myObj.positives;                        // Array of positive adjectives
var animals = myObj.animals;                            // Array of animals
var positives_object = myObj.positives_object;          // Array of positive adjectives, pertaining only to objects
var geographical_objects = myObj.geographical_objects;  // Array of geographical features
var simple_colours = myObj.simple_colours;              // Array of simple colours
var simple_words = myObj.simple_words;                  // Array of simple words

const defaultText = "<p>No passwords yet :(</p>";
const defaultLength = 16;
const defaultType = "complex";
const defaultObjectType = "geographical";

// -------- CODE --------

// Wait document to finish loading before running code to replace default text
document.addEventListener("DOMContentLoaded", function () {    
	var listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = defaultText;

    // Retain last selected type across sessions
    let typeElement = document.getElementById("generated-complexity");
    // Set event listener whenever selection is changed
    typeElement.addEventListener("change", function() {
        localStorage.setItem("generated-complexity", typeElement.value);
    });
    // Retrieve stored value from localStorage
    let storedType = localStorage.getItem("generated-complexity");
    if (storedType != null) { typeElement.value = storedType; }
    else { typeElement.value = defaultType; }
	
	// Retain last selected object type across sessions
    let objectTypeElement = document.getElementById("generated-object");
    // Set event listener whenever selection is changed
    objectTypeElement.addEventListener("change", function() {
        localStorage.setItem("generated-object", objectTypeElement.value);
    });
    // Retrieve stored value from localStorage
    let storedObjectType = localStorage.getItem("generated-object");
    if (storedObjectType != null) { objectTypeElement.value = storedObjectType; }
    else { objectTypeElement.value = defaultObjectType; }
    
    // Retain password size across sessions
    let lengthElement = document.getElementById("generated-length");
    // Set event listener whenever selection is changed
    lengthElement.addEventListener("change", function() {
        localStorage.setItem("generated-length", lengthElement.value);
    });
    // Retrieve stored value from localStorage
    let storedLength = localStorage.getItem("generated-length");
    if (storedLength != null) { lengthElement.value = storedLength; }
    else { lengthElement.value = defaultLength; }
	
	// verySimpleHandler();
	typeHandler();
});

// Add listener to the list elements for when they're clicked;
// when clicked, copy password to clipboard
document.addEventListener('click', function (event) {
    if (!event.target.matches('ul li')) { return; }

	// Copy selected password string to clipboard
	copyStringToClipboard(event.target.innerHTML);

}, false);

// -------- PASSWORD FUNCTIONS --------

// Clears passwords from the passwords array and from the list on the page
function clearPasswords() {
    passwordArray = [];

    var listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = defaultText;
}

function generatePasswords(num, clearAll) {
    if (clearAll) { clearPasswords(); }
    
    var t0 = performance.now()
	for (i = 0; i < num; i += 1) {
		generatePassword();
	}
    var t1 = performance.now()
    console.log("Call to generatePasswords(" + num + ") took " + (t1 - t0) + " milliseconds.")
}

// Generates a password using a random combination of adjectives and words, with numbers at the end
function generatePassword() {
    var word, adjective, password, remaining, listElement, listItem;
    
    var passwordLength = document.getElementById("generated-length").value;
    if (passwordLength == null) { passwordLength = 8; }
	
    let object_type = document.getElementById("generated-object");
	switch(object_type.value) {
		case "animal":
			word = getRandomElementFromArray(animals);
			adjective = getRandomElementFromArray(positives);
			break;
		case "geographical":
			word = getRandomElementFromArray(geographical_objects);
			adjective = getRandomElementFromArray(positives_object);
			break;
		case "simple_mix":
			word = getRandomElementFromArray(simple_words);
			adjective = getRandomElementFromArray(simple_colours);
			break;
		default:
			break;
	}

    type = document.getElementById("generated-complexity");
	symbol_bool = document.getElementById("generated-symbol");
    
    switch(type.value) {
		case "very_simple":
			password = adjective + word + getRandomInt(0, 9);
			break;
        case "simple":
            password = word + getRandomInt(0, 9);
          break;
        case "complex":
            password = adjective + word + (symbol_bool.checked ? getRandomSymbol() : "") + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
          break;
        case "random":
            password = makeID(passwordLength);
            break;
        default:
            password = "Tara123";
            break
      }

	// Pad the password out with numbers to ensure minimum length
    if (password.length < passwordLength) {
        remaining = passwordLength - password.length;
        for (var i = 0; i < remaining; i += 1) {
            password += getRandomInt(0, 9);
        }
    }

    if (passwordArray.includes(password)) {
        generatePassword();
        return false;
    }

    passwordArray.unshift(password);

    listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = "";

    for (i = 0; i < passwordArray.length; i += 1) {
        // create an item for each one
        listItem = document.createElement('li');

        // Add the item text
        listItem.innerHTML = passwordArray[i];

        // Add listItem to the listElement
        listElement.appendChild(listItem);
    }
}

function typeHandler() {
	var type = document.getElementById("generated-complexity");
	var object_type = document.getElementById("generated-object");
	let storedObjectType = localStorage.getItem("generated-object");
	
	switch(type.value) {
		case "simple":
			storedObjectType = localStorage.getItem("generated-object");
			if (storedObjectType != null) { object_type.value = storedObjectType; }
			else { object_type.value = defaultObjectType; }
			object_type.disabled = false;
			
			symbol_bool = document.getElementById("generated-symbol");
			symbol_bool.disabled = true;
			symbol_bool.checked = false;
			break;
		case "very_simple":
			localStorage.setItem("generated-object", object_type.value);
			object_type.value = "simple_mix";
			object_type.disabled = true;
			symbol_bool = document.getElementById("generated-symbol");
			symbol_bool.disabled = true;
			symbol_bool.checked = false;
			break;
		case "random":
			localStorage.setItem("generated-object", object_type.value);
			object_type.value = "random";
			object_type.disabled = true;
			symbol_bool = document.getElementById("generated-symbol");
			symbol_bool.disabled = true;
			symbol_bool.checked = false;
			break;
		default:
			storedObjectType = localStorage.getItem("generated-object");
			if (storedObjectType != null) { object_type.value = storedObjectType; }
			else { object_type.value = defaultObjectType; }
			object_type.disabled = false;
			
			symbol_bool = document.getElementById("generated-symbol");
			symbol_bool.disabled = false;
			symbol_bool.checked = true;
			break;
	}
}

function resetPage() {
	localStorage.clear();
	location.reload();
}