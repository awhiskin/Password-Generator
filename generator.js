// -------- HELPER FUNCTIONS --------

// Sends a GET request for a specified URL and returns the response
function get(yourUrl) {
    'use strict';
    
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", yourUrl, false);
    Httpreq.send(null);

    return Httpreq.responseText;
}

// Copies the passed string to the clipboard
function copyStringToClipboard(str) {
    'use strict';

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
    'use strict';
    
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Returns a random element from the passed array or returns null if no array is passed
function getRandomElementFromArray(array) {
    'use strict';
    
    if (array === null || array === undefined) {
        return null;
    } else {
        var randomNumber = getRandomInt(0, array.length);
        return array[randomNumber];
    }
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

var defaultText = "<p>No passwords yet :(</p>";

// -------- CODE --------

// Wait document to finish loading before running code to replace default text
document.addEventListener("DOMContentLoaded", function () {
    'use strict';
    
	var listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = defaultText;
});

// Add listener to the list elements for when they're clicked;
// when clicked, copy password to clipboard
document.addEventListener('click', function (event) {
    'use strict';
    
	if (!event.target.matches('ul li')) { return; }

	// Copy selected password string to clipboard
	copyStringToClipboard(event.target.innerHTML);

}, false);

// -------- PASSWORD FUNCTIONS --------

// Clears passwords from the passwords array and from the list on the page
function clearPasswords() {
    'use strict';

    passwordArray = [];

    var listElement = document.getElementById("generated-passwords-list");
    listElement.innerHTML = defaultText;
}

// Generates a password using a random combination of positive adjectives and animals, with numbers at the end
function generatePassword() {
    'use strict';

    var positive, animal, password, remaining, i, listElement, listItem;

    positive = getRandomElementFromArray(positives);
    animal = getRandomElementFromArray(animals);

    password = positive + animal + getRandomInt(0, 9);

    if (password.length <= 8) {
        remaining = 8 - password.length;
        for (i = 0; i < remaining; i += 1) {
            password += getRandomInt(0, 9);
        }
    }

    passwordArray.unshift(password);

    if (passwordArray.length > 10) {
        passwordArray.pop();
    }

    // Copy the current password to the clipboard for ease of use
    copyStringToClipboard(password);

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