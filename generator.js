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
var url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/animals.json";

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

var defaultText = "<p>No passwords yet :(</p>";
var defaultLength = 12;
var defaultType = "complex";

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

// Generates a password using a random combination of positive adjectives and animals, with numbers at the end
function generatePassword() {
    var positive, animal, positive_object, geographical, password, remaining, i, listElement, listItem;
    
    var passwordLength = document.getElementById("generated-length").value;
    if (passwordLength == null) { passwordLength = 8; }

    positive = getRandomElementFromArray(positives);
    animal = getRandomElementFromArray(animals);
    positive_object = getRandomElementFromArray(positives_object);
    geographical = getRandomElementFromArray(geographical_objects);
	
	if (animal.length <= 4) {
		animal = getRandomElementFromArray(animals);
    }

// TODO: environment words

    var object_word = "";
    let object_type = document.getElementById("generated-object");
    if (object_type.value == "animal") {
        object_word = animal;
    } else {
        object_word = geographical;
    }

    type = document.getElementById("generated-type");
    
    switch(type.value) {
        case "simple":
            password = object_word + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
          break;
        case "complex":
            var adjective = positive;
            if (object_type.value != "animal") {
                adjective = positive_object;
            }
            password = adjective + object_word + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9) + getRandomInt(0, 9);
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
        for (i = 0; i < remaining; i += 1) {
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