var readerHeightPercentOfScreen = 0.53;
var readerWidthPercentOfScreen = 0.70;

// Object representing an open reader window
var readerWindow;

function openReaderWindowFromContext(context) {
	if (context.selectionText) {
		// Save the selected text to local storage
		var selectedText = context.selectionText;
		var selectedTextEncoded = htmlEntitiesEncode(selectedText);

		saveSelectedTextToResource(selectedTextEncoded);
		localStorage.setItem("selectedText", selectedTextEncoded);
		localStorage.setItem("haveSelection", true);
		localStorage.setItem("selectedTextIsRTL", dirRTL);
	}

	openReaderWindow();
}

function openReaderWindowFromShortcut(selectedText, haveSelection, dirRTL) {
	// var selectedTextEncoded = htmlEntitiesEncode(selectedText);
	const selectedTextEncoded = selectedText;
	try {
		console.log(saveSelectedTextToResource);
	} catch (e) {
		saveSelectedTextToResource = require('./utility').saveSelectedTextToResource;
	}

	saveSelectedTextToResource(selectedTextEncoded);
	localStorage.setItem("selectedText", selectedTextEncoded);
	localStorage.setItem("haveSelection", haveSelection);
	localStorage.setItem("selectedTextIsRTL", dirRTL);
	openReaderWindow();
}

function openReaderWindow() {
	// Obtain the location of the screen, firstly calculate the location
	// and then check to see if values have been stored for the session
	// If values are found, use them.
	var percentOfScreenWidth = screen.width * 0.05;
	
	// WIDTH	
	var readerWidth = 880;
	// var readerWidth = screen.width * readerWidthPercentOfScreen;
	// var width = 500;
	var width = getFromLocalGreaterThanZero("readerWidth", readerWidth);

	// HEIGHT
	var readerHeight = 550;
	// var readerHeight = screen.height * readerHeightPercentOfScreen;
	// var height = 500;
	var height = getFromLocalGreaterThanZero("readerHeight", readerHeight);
	
	// The minimum height and width of the window is 880x550 which
	// ensures the window maintains the correct ratio width to height
	if (width < 880) width = 880;
	if (height < 550) height = 550;
	
	// TOP & LEFT
	var top = (screen.height - (screen.height * readerHeightPercentOfScreen)) - percentOfScreenWidth;
	var left = (screen.width - (screen.width * readerWidthPercentOfScreen)) - percentOfScreenWidth;

	width = parseInt(width);
    height = parseInt(height);

  	// openReader("reader.html", "", width, height, top, left);
}

function openReader(url, title, w, h, t, l) {
	// Only open a new window if one does not already exist
	if (readerWindow == null) {
		// Open a new reader
		readerWindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+t+', left='+l);
	}
	else {
		// Refresh the existing reader window
		readerWindow.refreshReader();
		readerWindow.focus();
	}

	return readerWindow;
} 

// -------------------------------------------------------------
var dirRTL;

module.exports = {
	openReaderWindowFromShortcut,
}