const Store = require('electron-store');

function getSettingsDefault() {
	// Default values for user settings
	WPM = 400;
	chunkSize = 1;
	fontSize = 85;
	colorScheme = 0;
	font = "Lucida Console";
	colorSchemeName = "white";
	autoStart = 'true';
	autoStartSeconds = 1;
	autoCloseReader = 'true';
	textOrientationIsRightToLeft = 'false';
	textOrientationAutoDetect = 'true';
	showRemainingTime = 'false';
}


function getAdvancedSettingsDefault() {
	// Advanced settings
	selectedAlgorithm = 0;
	pauseAfterComma = 'true';
	pauseAfterPeriod = 'true';
	pauseAfterParagraph = 'true';
	wordFlicker = 'false';
	pauseAfterCommaDelay = 250;
	pauseAfterPeriodDelay = 450;
	pauseAfterParagraphDelay = 700;
	wordFlickerPercent = 10;

	highlightOptimalLetter = 'true';
	highlightOptimalLetterColour = '#FF0000';
	textPosition = 2; // Optimal positioning
}

function getMoreAdvancedSettingsDefaults() {
	madvStaticFocalUnicodeCharacter = "";
	madvEnableSpaceInsertion = 'true';
	madvRemoveLastSlideNullOrEmpty = 'true';
	madvEnableHyphenatedWordSplit = 'true';
	madvConsolidateHyphenatedWord = 'true';
	madvEnableLongWordHyphenation = 'true';
	madvLongWordTriggerCharacterCount = 13;
	madvLongWordMinCharacterPerSlidePostSplit = 6;
	madvLongWordCharacterTriggerDoNotJoin = 4;
	madvEnableAcronymDetection = 'true';
	madvEnableNumberDecimalDetection = 'true';
	
	madvWordFreqMinimumSlideDuration = 40;
	madvWordFreqHighestFreqSlideDuration = 40;
	madvWordFreqLowestFreqSlideDuration = 300;
	
	madvWordLengthMinimumSlideDuration = 0;
	madvBasicMinimumSlideDuration = 0;
	madvDeleteEmptySlides = 'true';
	madvWPMAdjustmentStep = 25;
	madvAlwaysHideFocalGuide = 'false';
	madvOptimisedPositionLeftMarginPercent = 30;
	madvDisplaySentenceWhenPaused = 'true';
	madvAutoHideSentence = 'false';
	madvAutoHideSentenceSeconds = 5;
	madvDisplaySentenceTopBorder = 'true';
	madvDisplaySentenceAtReaderOpen = 'true';
	madvSentenceBackwardWordCount = 20;
	madvSentencePositionPercentOffset = 50;
	madvLargeStepNumberOfSlides = 10;
	madvHotkeySelectionEnabled = 'false';
	madvSaveSlidePosition = 'true';
	madvDisplayWPMSummary = 'true';
	madvDisplaySocial = 'true';
	madvDisplayProgress = 'true';
}

let _store;

const store = _store || new Store({
  defaults: {
    ...getSettingsDefault(),
    ...getAdvancedSettingsDefault(),
    ...getMoreAdvancedSettingsDefaults(),
  }
});

// Get an item from local storage, ensure the item is greater then zero
// Only assign to variable if the item passes the test
function getFromStoreGreaterThanZero(key, variable) {
	if (store.get(key) > 0) {
		variable = store.get(key);
		variable = parseInt(variable);
	}
	return variable;
}

// Get an item from Store storage, ensure the item is not empty
// Only assign to variable if the item passes the test
function getFromStoreNotEmpty(key, variable) {
	if (!isEmpty(store.get(key))) {
		variable = store.get(key);
	}
	return variable;
}

// Get an item from Store storage, ensure the item is a number
// Only assign to variable if the item passes the test
function getFromStoreIsNumber(key, variable) {
	if (!isEmpty(store.get(key)) && !isNaN(store.get(key))) {
		variable = store.get(key);
		variable = parseInt(variable);
	}
	return variable;
}

console.log("Store loaded");