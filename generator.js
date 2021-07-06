// -------- HELPER FUNCTIONS --------

// const { type } = require("os");

// Sends a GET request for a specified URL and returns the response
function get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);

    return Httpreq.responseText;
}

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
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*?';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Export array as a CSV
function exportArrayToCSV() {
    if (passwordArray.length == 0) {
        alert("No passwords to export.")
        return;
    }
    
    let csv = "data:text/csv;charset=utf-8,";
    csv += "Password Value\r\n";

    var rows = []
    passwordArray.forEach(element => {
        rows.push([element])
    });

    rows.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csv += row + "\r\n";
    });

	var hiddenElement = document.createElement('a');
    hiddenElement.href = encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'passwords' + Date.now() + '.csv';
    hiddenElement.click();
}

// -------- VARIABLES --------

// The array of passwords that have been generated so far
var passwordArray = [];

// The URL of the JSON file of animals / adjectives
// var url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/animals.json";
var url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/words.json";


// The response from the GET request
var response = get(url);

// JSON object parsed from the response
var myObj = JSON.parse(response);

// Array of positive adjectives
var positives = myObj.positives;

// Array of animals
var animals = myObj.animals;

// Array of positive adjectives, pertaining only to objects
var positives_object = myObj.positives_object;

// Array of geographical features
var geographical_objects = myObj.geographical_objects;

// Array of simple colours
var simple_colours = myObj.simple_colours;

// Array of simple words
var simple_words = myObj.simple_words;

const defaultText = "<p>No passwords yet :(</p>";
const defaultLength = 12;
const defaultType = "complex";
const defaultObjectType = "geographical";

// -------- CODE --------

// Wait document to finish loading before running code to replace default text
document.addEventListener("DOMContentLoaded", function () {    
	var listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = defaultText;

    // Retain last selected type across sessions
    let typeElement = document.getElementById("generated-type");
    // Set event listener whenever selection is changed
    typeElement.addEventListener("change", function() {
        localStorage.setItem("generated-type", typeElement.value);
    });
    // Retrieve stored value from localStorage
    let storedType = localStorage.getItem("generated-type");
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
	
	verySimpleHandler();
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

    // positive = getRandomElementFromArray(positives);
    // animal = getRandomElementFromArray(animals);
	
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
		case "colour":
			word = getRandomElementFromArray(simple_words);
			adjective = getRandomElementFromArray(simple_colours);
			break;
		default:
			break;
	}

    type = document.getElementById("generated-type");
    
    switch(type.value) {
		case "very_simple":
			password = adjective + word + getRandomInt(0, 9);
			break;
        case "simple":
            password = word + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
          break;
        case "complex":
            password = adjective + word + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
          break;
        case "random":
            password = makeid(passwordLength);
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

    passwordArray.unshift(password);

    // Copy the current password to the clipboard for ease of use
    // copyStringToClipboard(password);

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
	
function verySimpleHandler() {
    var type = document.getElementById("generated-type");
	var object_type = document.getElementById("generated-object");
	if (type.value == "very_simple")
	{
		localStorage.setItem("generated-object", object_type.value);
		object_type.value = "colour";
		object_type.disabled = true;
	} else {
		let storedObjectType = localStorage.getItem("generated-object");
		if (storedObjectType != null) { object_type.value = storedObjectType; }
		else { object_type.value = defaultObjectType; }
		object_type.disabled = false;
	}
}

function resetPage() {
	localStorage.clear();
	location.reload();
}