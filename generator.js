// The array of passwords that have been generated so far
var passwordArray = [];

// The URL of the JSON file of animals / adjectives
var url = "https://raw.githubusercontent.com/awhiskin/Password-Generator/master/animals.json";

// The response from the GET request
var response = Get(url);

// JSON object parsed from the response
var myObj = JSON.parse(response);

// Array of positive adjectives
var positives = myObj.positives;

// Array of animals
var animals = myObj.animals;

var defaultText = "<p>No passwords :(</p>";

// ------------------ CODE ----------------------------


document.addEventListener("DOMContentLoaded", function() {
	var listElement = document.getElementById("generated-passwords-list");
  listElement.innerHTML = defaultText;
});

document.addEventListener('click', function (event) {
	if (!event.target.matches('ul li')) return;

	// Copy selected password string to clipboard
	copyStringToClipboard(event.target.innerHTML);

}, false);

// ------------------ FUNCTIONS -----------------------

// Sends a GET request for a specified URL
function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest(); // a new request
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send(null);

  return Httpreq.responseText;
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

// Gets a random integer between min and max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Clears passwords from the array and from the page
function clearPasswords() {
	passwordArray = [];

  var listElement = document.getElementById("generated-passwords-list");
  listElement.innerHTML = defaultText;
}

// Copies the passed string to the clipboard
function copyStringToClipboard(str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}

// Generates a password using a random combination of positive adjectives and animals with numbers at the end
function generatePassword() {
  var positive = getRandomElementFromArray(positives);
  var animal = getRandomElementFromArray(animals);
  var password = positive + animal + getRandomInt(0, 9);
  
  if (password.length <= 8) {
	var remaining = 8 - password.length;
	for (i = 0; i < remaining; ++i) {
		password = password + getRandomInt();
	}
  }

  passwordArray.unshift(password);
  
  if (passwordArray.length > 10) {
	passwordArray.pop();
  }
  
  // Copy the current password to the clipboard for ease of use
  copyStringToClipboard(password);

  var listElement = document.getElementById("generated-passwords-list");
  listElement.innerHTML = "";

  for (i = 0; i < passwordArray.length; ++i) {
    // create an item for each one
    var listItem = document.createElement('li');

    // Add the item text
    listItem.innerHTML = passwordArray[i];


    // Add listItem to the listElement
    listElement.appendChild(listItem);
  }
}